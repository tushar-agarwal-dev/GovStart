package com.govstart.service;

import com.govstart.model.Problem;
import com.govstart.model.Recommendation;
import com.govstart.model.StartupProfile;
import com.govstart.model.StatusTransitionLog;
import com.govstart.repository.ProblemRepository;
import com.govstart.repository.RecommendationRepository;
import com.govstart.repository.StartupProfileRepository;
import com.govstart.repository.StatusTransitionLogRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    private static final Logger log = LoggerFactory.getLogger(MatchingService.class);
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private StartupProfileRepository startupProfileRepository;

    @Autowired
    private RecommendationRepository recommendationRepository;

    @Autowired
    private StatusTransitionLogRepository statusTransitionLogRepository;

    @Value("${govstart.gemini.api-key}")
    private String geminiApiKey;

    @Value("${govstart.gemini.api-url}")
    private String geminiApiUrl;

    @Transactional
    public List<Recommendation> generateRecommendations(Long problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("Problem not found"));

        // Clear previous recommendations
        recommendationRepository.deleteByProblemId(problemId);

        List<StartupProfile> startups = startupProfileRepository.findAll();
        PriorityQueue<Recommendation> maxHeap = new PriorityQueue<>(
                (a, b) -> Double.compare(b.getFinalWeightedScore(), a.getFinalWeightedScore())
        );

        for (StartupProfile startup : startups) {
            double ruleScore = calculateRuleScore(problem, startup);
            
            // Call Gemini API for top candidates or positive Jaccard scores
            double geminiScore = 50.0; // default middle ground
            String justification = "Calculated using rule-based tags correlation.";

            if (ruleScore > 0) {
                try {
                    LlmResult llmResult = callGeminiApi(problem, startup);
                    geminiScore = llmResult.getScore();
                    justification = llmResult.getJustification();
                } catch (Exception e) {
                    log.warn("Gemini API call failed for problem {} and startup {}, falling back to mock scoring: {}", 
                            problemId, startup.getId(), e.getMessage());
                    // Fallback heuristics: mock scoring if API fails/not set
                    geminiScore = ruleScore + (startup.isDpiitVerified() ? 15 : 0);
                    if (geminiScore > 100) geminiScore = 100;
                    justification = String.format("Auto-recommended based on matching tags: %s. Prior experience includes %d pilots.", 
                            intersectTags(problem.getTags(), startup.getTags()), startup.getPastPilotsCount());
                }
            } else {
                justification = "Low tag correlation. Recommended based on general domain matching.";
            }

            double finalScore = (0.4 * ruleScore) + (0.6 * geminiScore);

            Recommendation rec = Recommendation.builder()
                    .problem(problem)
                    .startup(startup)
                    .ruleScore(ruleScore)
                    .llmScore(geminiScore)
                    .finalWeightedScore(finalScore)
                    .llmJustification(justification)
                    .build();

            maxHeap.offer(rec);
        }

        // Extract Top-K (5) recommended startups
        List<Recommendation> topRecommendations = new ArrayList<>();
        int rank = 1;
        while (!maxHeap.isEmpty() && topRecommendations.size() < 5) {
            Recommendation rec = maxHeap.poll();
            rec.setRankPosition(rank++);
            topRecommendations.add(recommendationRepository.save(rec));
        }

        // Transition status to RECOMMENDED
        String oldStatus = problem.getStatus();
        problem.setStatus("RECOMMENDED");
        problemRepository.save(problem);

        // Audit Log
        statusTransitionLogRepository.save(StatusTransitionLog.builder()
                .problem(problem)
                .previousStatus(oldStatus)
                .newStatus("RECOMMENDED")
                .build());

        return topRecommendations;
    }

    private double calculateRuleScore(Problem problem, StartupProfile startup) {
        List<String> pTags = problem.getTags() != null ? problem.getTags() : Collections.emptyList();
        List<String> sTags = startup.getTags() != null ? startup.getTags() : Collections.emptyList();

        if (pTags.isEmpty() || sTags.isEmpty()) {
            return 0.0;
        }

        // Tag intersection
        Set<String> set1 = pTags.stream().map(String::toLowerCase).collect(Collectors.toSet());
        Set<String> set2 = sTags.stream().map(String::toLowerCase).collect(Collectors.toSet());

        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);

        double jaccard = (double) intersection.size() / union.size();
        double score = jaccard * 70.0; // Max 70 points for direct tag similarity

        // DPIIT verification boost
        if (startup.isDpiitVerified()) {
            score += 15.0;
        }

        // Past pilot experience boost
        int count = startup.getPastPilotsCount() != null ? startup.getPastPilotsCount() : 0;
        score += Math.min(count * 5.0, 15.0); // max 15 points boost for past experience

        return Math.min(score, 100.0);
    }

    private Set<String> intersectTags(List<String> list1, List<String> list2) {
        if (list1 == null || list2 == null) return Collections.emptySet();
        Set<String> s1 = list1.stream().map(String::toLowerCase).collect(Collectors.toSet());
        Set<String> s2 = new HashSet<>(list2.stream().map(String::toLowerCase).collect(Collectors.toList()));
        s1.retainAll(s2);
        return s1;
    }

    private LlmResult callGeminiApi(Problem problem, StartupProfile startup) throws Exception {
        if (geminiApiKey == null || geminiApiKey.isBlank() || geminiApiKey.equals("${GEMINI_API_KEY}")) {
            throw new IllegalStateException("Gemini API key is not configured.");
        }

        String url = geminiApiUrl + "?key=" + geminiApiKey;

        String prompt = String.format(
                "Evaluate the alignment between this government challenge and this startup.\\n" +
                "Challenge Title: %s\\n" +
                "Challenge Description: %s\\n" +
                "Challenge Tags: %s\\n\\n" +
                "Startup Name: %s\\n" +
                "Startup Description: %s\\n" +
                "Startup Tags: %s\\n\\n" +
                "Evaluate and return a JSON object with 'score' (number between 0 and 100 representing technical/operational fit) " +
                "and 'justification' (max 3 sentences explaining the fit). Do not return any other text, markdown formatting, or wrappers. " +
                "The response must be raw JSON like: {\\\"score\\\": 85, \\\"justification\\\": \\\"The startup specializes in waste management...\\\"}",
                escapeJson(problem.getTitle()),
                escapeJson(problem.getDescription()),
                problem.getTags() != null ? problem.getTags().toString() : "[]",
                escapeJson(startup.getCompanyName()),
                escapeJson(startup.getDescription()),
                startup.getTags() != null ? startup.getTags().toString() : "[]"
        );

        String jsonPayload = String.format(
                "{\"contents\": [{\"parts\": [{\"text\": \"%s\"}]}], \"generationConfig\": {\"responseMimeType\": \"application/json\"}}",
                prompt
        );

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .build();

        HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("HTTP Status " + response.statusCode() + " received from Gemini API. Body: " + response.body());
        }

        JsonNode root = objectMapper.readTree(response.body());
        String rawText = root.path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText()
                .trim();

        JsonNode innerJson = objectMapper.readTree(rawText);
        double score = innerJson.path("score").asDouble();
        String justification = innerJson.path("justification").asText();

        return new LlmResult(score, justification);
    }

    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }

    private static class LlmResult {
        private final double score;
        private final String justification;

        public LlmResult(double score, String justification) {
            this.score = score;
            this.justification = justification;
        }

        public double getScore() { return score; }
        public String getJustification() { return justification; }
    }
}
