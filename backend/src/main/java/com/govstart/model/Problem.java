package com.govstart.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "problems")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private DepartmentProfile department;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "problem_tags", joinColumns = @JoinColumn(name = "problem_id"))
    @Column(name = "tag")
    private List<String> tags;

    @Column(name = "budget_min")
    private Double budgetMin;

    @Column(name = "budget_max")
    private Double budgetMax;

    @Column(name = "timeline_days")
    private Integer timelineDays;

    @Column(nullable = false)
    private String status; // POSTED, RECOMMENDED, UNDER_EVALUATION, EVALUATED, PILOT_ACTIVE, PILOT_COMPLETE, DECIDED

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Multi-step challenge extension fields
    private String category;
    private String location;
    @Column(name = "contact_person")
    private String contactPerson;
    @Column(name = "current_problem", columnDefinition = "TEXT")
    private String currentProblem;
    @Column(name = "existing_process", columnDefinition = "TEXT")
    private String existingProcess;
    @Column(name = "target_beneficiaries")
    private String targetBeneficiaries;
    @Column(name = "desired_outcome", columnDefinition = "TEXT")
    private String desiredOutcome;
    @Column(name = "baseline_performance")
    private String baselinePerformance;
    @Column(name = "target_performance")
    private String targetPerformance;
    @Column(name = "expected_impact", columnDefinition = "TEXT")
    private String expectedImpact;
    @Column(name = "geographic_scope")
    private String geographicScope;
    @Column(name = "dpiit_required")
    private Boolean dpiitRequired;
    @Column(name = "tech_requirements", columnDefinition = "TEXT")
    private String techRequirements;
    @Column(name = "min_criteria", columnDefinition = "TEXT")
    private String minCriteria;
    @Column(name = "evaluation_weights_json", columnDefinition = "TEXT")
    private String evaluationWeightsJson;
    @Column(name = "kpis_json", columnDefinition = "TEXT")
    private String kpisJson;
    @Column(name = "milestones_json", columnDefinition = "TEXT")
    private String milestonesJson;
    @Column(name = "eligibility_requirements", columnDefinition = "TEXT")
    private String eligibilityRequirements;

    public Problem() {}

    public Problem(DepartmentProfile department, String title, String description, List<String> tags,
                   Double budgetMin, Double budgetMax, Integer timelineDays, String status) {
        this.department = department;
        this.title = title;
        this.description = description;
        this.tags = tags;
        this.budgetMin = budgetMin;
        this.budgetMax = budgetMax;
        this.timelineDays = timelineDays;
        this.status = status;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "POSTED";
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public DepartmentProfile getDepartment() { return department; }
    public void setDepartment(DepartmentProfile department) { this.department = department; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public Double getBudgetMin() { return budgetMin; }
    public void setBudgetMin(Double budgetMin) { this.budgetMin = budgetMin; }
    public Double getBudgetMax() { return budgetMax; }
    public void setBudgetMax(Double budgetMax) { this.budgetMax = budgetMax; }
    public Integer getTimelineDays() { return timelineDays; }
    public void setTimelineDays(Integer timelineDays) { this.timelineDays = timelineDays; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }
    public String getCurrentProblem() { return currentProblem; }
    public void setCurrentProblem(String currentProblem) { this.currentProblem = currentProblem; }
    public String getExistingProcess() { return existingProcess; }
    public void setExistingProcess(String existingProcess) { this.existingProcess = existingProcess; }
    public String getTargetBeneficiaries() { return targetBeneficiaries; }
    public void setTargetBeneficiaries(String targetBeneficiaries) { this.targetBeneficiaries = targetBeneficiaries; }
    public String getDesiredOutcome() { return desiredOutcome; }
    public void setDesiredOutcome(String desiredOutcome) { this.desiredOutcome = desiredOutcome; }
    public String getBaselinePerformance() { return baselinePerformance; }
    public void setBaselinePerformance(String baselinePerformance) { this.baselinePerformance = baselinePerformance; }
    public String getTargetPerformance() { return targetPerformance; }
    public void setTargetPerformance(String targetPerformance) { this.targetPerformance = targetPerformance; }
    public String getExpectedImpact() { return expectedImpact; }
    public void setExpectedImpact(String expectedImpact) { this.expectedImpact = expectedImpact; }
    public String getGeographicScope() { return geographicScope; }
    public void setGeographicScope(String geographicScope) { this.geographicScope = geographicScope; }
    public Boolean getDpiitRequired() { return dpiitRequired; }
    public void setDpiitRequired(Boolean dpiitRequired) { this.dpiitRequired = dpiitRequired; }
    public String getTechRequirements() { return techRequirements; }
    public void setTechRequirements(String techRequirements) { this.techRequirements = techRequirements; }
    public String getMinCriteria() { return minCriteria; }
    public void setMinCriteria(String minCriteria) { this.minCriteria = minCriteria; }
    public String getEvaluationWeightsJson() { return evaluationWeightsJson; }
    public void setEvaluationWeightsJson(String evaluationWeightsJson) { this.evaluationWeightsJson = evaluationWeightsJson; }
    public String getKpisJson() { return kpisJson; }
    public void setKpisJson(String kpisJson) { this.kpisJson = kpisJson; }
    public String getMilestonesJson() { return milestonesJson; }
    public void setMilestonesJson(String milestonesJson) { this.milestonesJson = milestonesJson; }
    public String getEligibilityRequirements() { return eligibilityRequirements; }
    public void setEligibilityRequirements(String eligibilityRequirements) { this.eligibilityRequirements = eligibilityRequirements; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private DepartmentProfile department;
        private String title;
        private String description;
        private List<String> tags;
        private Double budgetMin;
        private Double budgetMax;
        private Integer timelineDays;
        private String status;

        public Builder department(DepartmentProfile department) { this.department = department; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder tags(List<String> tags) { this.tags = tags; return this; }
        public Builder budgetMin(Double budgetMin) { this.budgetMin = budgetMin; return this; }
        public Builder budgetMax(Double budgetMax) { this.budgetMax = budgetMax; return this; }
        public Builder timelineDays(Integer timelineDays) { this.timelineDays = timelineDays; return this; }
        public Builder status(String status) { this.status = status; return this; }

        public Problem build() {
            return new Problem(department, title, description, tags, budgetMin, budgetMax, timelineDays, status);
        }
    }
}
