package com.govstart.controller;

import com.govstart.dto.ProblemRequest;
import com.govstart.dto.ProblemResponse;
import com.govstart.model.*;
import com.govstart.repository.DepartmentProfileRepository;
import com.govstart.repository.ProblemRepository;
import com.govstart.repository.UserRepository;
import com.govstart.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentProfileRepository departmentProfileRepository;

    @Autowired
    private com.govstart.service.AuditLogService auditLogService;

    @Autowired
    private MatchingService matchingService;

    @PostMapping
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<?> createProblem(@RequestBody ProblemRequest request, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        DepartmentProfile department = departmentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Department profile not found"));

        Problem problem = Problem.builder()
                .department(department)
                .title(request.getTitle())
                .description(request.getDescription())
                .tags(request.getTags())
                .budgetMin(request.getBudgetMin())
                .budgetMax(request.getBudgetMax())
                .timelineDays(request.getTimelineDays())
                .build();

        problem.setCategory(request.getCategory());
        problem.setLocation(request.getLocation());
        problem.setContactPerson(request.getContactPerson());
        problem.setCurrentProblem(request.getCurrentProblem());
        problem.setExistingProcess(request.getExistingProcess());
        problem.setTargetBeneficiaries(request.getTargetBeneficiaries());
        problem.setDesiredOutcome(request.getDesiredOutcome());
        problem.setBaselinePerformance(request.getBaselinePerformance());
        problem.setTargetPerformance(request.getTargetPerformance());
        problem.setExpectedImpact(request.getExpectedImpact());
        problem.setGeographicScope(request.getGeographicScope());
        problem.setDpiitRequired(request.getDpiitRequired());
        problem.setTechRequirements(request.getTechRequirements());
        problem.setMinCriteria(request.getMinCriteria());
        problem.setEvaluationWeightsJson(request.getEvaluationWeightsJson());
        problem.setKpisJson(request.getKpisJson());
        problem.setMilestonesJson(request.getMilestonesJson());
        problem.setEligibilityRequirements(request.getEligibilityRequirements());

        problem = problemRepository.save(problem);
        auditLogService.logAction(user.getEmail(), "CHALLENGE_PUBLISHED", "Published outcome-based challenge: " + problem.getTitle() + " (ID: " + problem.getId() + ")");
        return ResponseEntity.ok(convertToResponse(problem));
    }

    @GetMapping
    public ResponseEntity<List<ProblemResponse>> getAllProblems() {
        List<Problem> problems = problemRepository.findAll();
        List<ProblemResponse> responses = problems.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProblemById(@PathVariable Long id) {
        return problemRepository.findById(id)
                .map(p -> ResponseEntity.ok(convertToResponse(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/recommendations")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<?> triggerRecommendations(@PathVariable Long id) {
        try {
            List<Recommendation> recommendations = matchingService.generateRecommendations(id);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to match: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/recommendations")
    public ResponseEntity<?> getRecommendations(@PathVariable Long id) {
        return ResponseEntity.ok(matchingService.generateRecommendations(id));
    }

    private ProblemResponse convertToResponse(Problem problem) {
        ProblemResponse response = ProblemResponse.builder()
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

        response.setCategory(problem.getCategory());
        response.setLocation(problem.getLocation());
        response.setContactPerson(problem.getContactPerson());
        response.setCurrentProblem(problem.getCurrentProblem());
        response.setExistingProcess(problem.getExistingProcess());
        response.setTargetBeneficiaries(problem.getTargetBeneficiaries());
        response.setDesiredOutcome(problem.getDesiredOutcome());
        response.setBaselinePerformance(problem.getBaselinePerformance());
        response.setTargetPerformance(problem.getTargetPerformance());
        response.setExpectedImpact(problem.getExpectedImpact());
        response.setGeographicScope(problem.getGeographicScope());
        response.setDpiitRequired(problem.getDpiitRequired());
        response.setTechRequirements(problem.getTechRequirements());
        response.setMinCriteria(problem.getMinCriteria());
        response.setEvaluationWeightsJson(problem.getEvaluationWeightsJson());
        response.setKpisJson(problem.getKpisJson());
        response.setMilestonesJson(problem.getMilestonesJson());
        response.setEligibilityRequirements(problem.getEligibilityRequirements());

        return response;
    }
}
