package com.govstart.controller;

import com.govstart.dto.ProblemResponse;
import com.govstart.dto.EvaluationRequest;
import com.govstart.dto.EvaluationResponse;
import com.govstart.model.*;
import com.govstart.repository.EvaluationRepository;
import com.govstart.repository.ExpertProfileRepository;
import com.govstart.repository.ProblemRepository;
import com.govstart.repository.UserRepository;
import com.govstart.service.ExpertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/evaluations")
public class ExpertController {

    @Autowired
    private ExpertService expertService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpertProfileRepository expertProfileRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private com.govstart.service.AuditLogService auditLogService;

    @GetMapping("/queue")
    @PreAuthorize("hasRole('EXPERT')")
    public ResponseEntity<?> getEvaluationQueue(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ExpertProfile expert = expertProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Expert profile not found"));

        // Match open problems by tag alignment (matching score > 0)
        List<Problem> allProblems = problemRepository.findByStatus("RECOMMENDED");
        allProblems.addAll(problemRepository.findByStatus("UNDER_EVALUATION"));
        
        List<Problem> queue = new ArrayList<>();
        List<String> expertTags = expert.getExpertTags() != null ? expert.getExpertTags() : new ArrayList<>();
        
        for (Problem p : allProblems) {
            boolean hasOverlap = p.getTags().stream()
                    .map(String::toLowerCase)
                    .anyMatch(tag -> expertTags.stream().map(String::toLowerCase).anyMatch(tag::equals));
            if (hasOverlap) {
                queue.add(p);
            }
        }
        
        List<ProblemResponse> responses = queue.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    private ProblemResponse convertToResponse(Problem problem) {
        return ProblemResponse.builder()
                .id(problem.getId())
                .departmentId(problem.getDepartment().getId())
                .departmentName(problem.getDepartment().getDeptName())
                .title(problem.getTitle())
                .description(problem.getDescription())
                .tags(problem.getTags())
                .budgetMin(problem.getBudgetMin())
                .budgetMax(problem.getBudgetMax())
                .timelineDays(problem.getTimelineDays())
                .status(problem.getStatus())
                .createdAt(problem.getCreatedAt())
                .build();
    }

    @GetMapping("/problem/{problemId}/experts/suggested")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<?> getSuggestedExperts(@PathVariable Long problemId) {
        try {
            List<ExpertService.ExpertMatch> suggested = expertService.getSuggestedExperts(problemId);
            return ResponseEntity.ok(suggested);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('EXPERT')")
    public ResponseEntity<?> submitEvaluation(@RequestBody EvaluationRequest request, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        try {
            Evaluation evaluation = expertService.submitEvaluation(
                    user.getId(),
                    request.getProblemId(),
                    request.getStartupId(),
                    request.getFeasibilityScore(),
                    request.getInnovationScore(),
                    request.getTeamScore(),
                    request.getCostScore(),
                    request.getComments()
            );
            auditLogService.logAction(user.getEmail(), "SUBMITTED_SCORECARD", "Submitted scorecard rating for Startup ID " + request.getStartupId() + " on Challenge ID " + request.getProblemId() + " (Avg Score: " + evaluation.getAvgScore() + ")");
            return ResponseEntity.ok(convertToResponse(evaluation));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/problem/{problemId}")
    public ResponseEntity<?> getEvaluationsForProblem(@PathVariable Long problemId) {
        List<Evaluation> evals = evaluationRepository.findByProblemId(problemId);
        List<EvaluationResponse> responses = evals.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    private EvaluationResponse convertToResponse(Evaluation evaluation) {
        return EvaluationResponse.builder()
                .id(evaluation.getId())
                .problemId(evaluation.getProblem().getId())
                .problemTitle(evaluation.getProblem().getTitle())
                .startupId(evaluation.getStartup().getId())
                .startupName(evaluation.getStartup().getCompanyName())
                .expertName(evaluation.getExpert().getUser().getName())
                .feasibilityScore(evaluation.getFeasibilityScore())
                .innovationScore(evaluation.getInnovationScore())
                .teamScore(evaluation.getTeamScore())
                .costScore(evaluation.getCostScore())
                .avgScore(evaluation.getAvgScore())
                .comments(evaluation.getComments())
                .createdAt(evaluation.getCreatedAt())
                .build();
    }
}
