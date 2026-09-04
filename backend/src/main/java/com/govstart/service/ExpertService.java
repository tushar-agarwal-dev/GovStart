package com.govstart.service;

import com.govstart.model.*;
import com.govstart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExpertService {

    @Autowired
    private ExpertProfileRepository expertProfileRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private StartupProfileRepository startupProfileRepository;

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private StatusTransitionLogRepository statusTransitionLogRepository;

    public List<ExpertMatch> getSuggestedExperts(Long problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("Problem not found"));

        List<ExpertProfile> experts = expertProfileRepository.findAll();
        List<ExpertMatch> recommendedExperts = new ArrayList<>();

        List<String> problemTags = problem.getTags() != null ? problem.getTags() : Collections.emptyList();
        if (problemTags.isEmpty()) {
            return experts.stream()
                    .map(e -> new ExpertMatch(e, 0.0))
                    .collect(Collectors.toList());
        }

        Set<String> pTagSet = problemTags.stream().map(String::toLowerCase).collect(Collectors.toSet());

        for (ExpertProfile expert : experts) {
            List<String> expertTags = expert.getExpertTags() != null ? expert.getExpertTags() : Collections.emptyList();
            if (expertTags.isEmpty()) {
                recommendedExperts.add(new ExpertMatch(expert, 0.0));
                continue;
            }

            Set<String> eTagSet = expertTags.stream().map(String::toLowerCase).collect(Collectors.toSet());

            Set<String> intersection = new HashSet<>(pTagSet);
            intersection.retainAll(eTagSet);

            Set<String> union = new HashSet<>(pTagSet);
            union.addAll(eTagSet);

            double score = (double) intersection.size() / union.size();
            recommendedExperts.add(new ExpertMatch(expert, score));
        }

        recommendedExperts.sort((a, b) -> Double.compare(b.getMatchingScore(), a.getMatchingScore()));
        return recommendedExperts;
    }

    @Transactional
    public Evaluation submitEvaluation(Long expertUserId, Long problemId, Long startupId,
                                      Integer feasibility, Integer innovation, Integer team, Integer cost,
                                      String comments) {
        
        ExpertProfile expert = expertProfileRepository.findByUserId(expertUserId)
                .orElseThrow(() -> new IllegalArgumentException("Expert profile not found"));

        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("Problem not found"));

        StartupProfile startup = startupProfileRepository.findById(startupId)
                .orElseThrow(() -> new IllegalArgumentException("Startup profile not found"));

        // Check if already evaluated by this expert
        Optional<Evaluation> existing = evaluationRepository.findByProblemIdAndStartupIdAndExpertId(
                problemId, startupId, expert.getId()
        );

        Evaluation evaluation;
        if (existing.isPresent()) {
            evaluation = existing.get();
            evaluation.setFeasibilityScore(feasibility);
            evaluation.setInnovationScore(innovation);
            evaluation.setTeamScore(team);
            evaluation.setCostScore(cost);
            evaluation.setComments(comments);
            // JPA @PrePersist won't trigger automatically on direct updates unless recalculation is triggered:
            evaluation.setAvgScore((feasibility + innovation + team + cost) / 4.0);
        } else {
            evaluation = Evaluation.builder()
                    .expert(expert)
                    .problem(problem)
                    .startup(startup)
                    .feasibilityScore(feasibility)
                    .innovationScore(innovation)
                    .teamScore(team)
                    .costScore(cost)
                    .comments(comments)
                    .build();
        }

        evaluation = evaluationRepository.save(evaluation);

        // Update problem status to UNDER_EVALUATION if it was RECOMMENDED
        if ("RECOMMENDED".equals(problem.getStatus())) {
            String oldStatus = problem.getStatus();
            problem.setStatus("UNDER_EVALUATION");
            problemRepository.save(problem);

            statusTransitionLogRepository.save(StatusTransitionLog.builder()
                    .problem(problem)
                    .previousStatus(oldStatus)
                    .newStatus("UNDER_EVALUATION")
                    .build());
        }

        return evaluation;
    }

    public static class ExpertMatch {
        private final ExpertProfile expert;
        private final double matchingScore;

        public ExpertMatch(ExpertProfile expert, double matchingScore) {
            this.expert = expert;
            this.matchingScore = matchingScore;
        }

        public ExpertProfile getExpert() { return expert; }
        public double getMatchingScore() { return matchingScore; }
    }
}
