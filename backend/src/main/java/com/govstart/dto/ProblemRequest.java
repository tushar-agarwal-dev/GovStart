package com.govstart.dto;

import java.util.List;

public class ProblemRequest {
    private String title;
    private String description;
    private List<String> tags;
    private Double budgetMin;
    private Double budgetMax;
    private Integer timelineDays;
    private String category;
    private String location;
    private String contactPerson;
    private String currentProblem;
    private String existingProcess;
    private String targetBeneficiaries;
    private String desiredOutcome;
    private String baselinePerformance;
    private String targetPerformance;
    private String expectedImpact;
    private String geographicScope;
    private Boolean dpiitRequired;
    private String techRequirements;
    private String minCriteria;
    private String evaluationWeightsJson;
    private String kpisJson;
    private String milestonesJson;
    private String eligibilityRequirements;

    public ProblemRequest() {}

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
}
