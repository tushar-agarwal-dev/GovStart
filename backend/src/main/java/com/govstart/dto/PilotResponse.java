package com.govstart.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PilotResponse {
    private Long id;
    private Long problemId;
    private String problemTitle;
    private Long startupId;
    private String startupName;
    private Long departmentId;
    private String departmentName;
    private String scope;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double budget;
    private Double releasedAmount;
    private Double escrowBalance;
    private String status;
    private Integer currentProgress;
    private LocalDateTime createdAt;

    private Boolean deptSigned;
    private Boolean startupSigned;
    private LocalDateTime signedAt;
    private String contractTermsJson;
    private String validatorName;
    private String validationStatus;
    private String kpiCurrentValuesJson;

    public PilotResponse() {}

    public PilotResponse(Long id, Long problemId, String problemTitle, Long startupId, String startupName,
                          Long departmentId, String departmentName, String scope, LocalDate startDate,
                          LocalDate endDate, Double budget, Double releasedAmount, Double escrowBalance,
                          String status, Integer currentProgress, LocalDateTime createdAt) {
        this.id = id;
        this.problemId = problemId;
        this.problemTitle = problemTitle;
        this.startupId = startupId;
        this.startupName = startupName;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.scope = scope;
        this.startDate = startDate;
        this.endDate = endDate;
        this.budget = budget;
        this.releasedAmount = releasedAmount;
        this.escrowBalance = escrowBalance;
        this.status = status;
        this.currentProgress = currentProgress;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProblemId() { return problemId; }
    public void setProblemId(Long problemId) { this.problemId = problemId; }
    public String getProblemTitle() { return problemTitle; }
    public void setProblemTitle(String problemTitle) { this.problemTitle = problemTitle; }
    public Long getStartupId() { return startupId; }
    public void setStartupId(Long startupId) { this.startupId = startupId; }
    public String getStartupName() { return startupName; }
    public void setStartupName(String startupName) { this.startupName = startupName; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public String getScope() { return scope; }
    public void setScope(String scope) { this.scope = scope; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public Double getBudget() { return budget; }
    public void setBudget(Double budget) { this.budget = budget; }
    public Double getReleasedAmount() { return releasedAmount; }
    public void setReleasedAmount(Double releasedAmount) { this.releasedAmount = releasedAmount; }
    public Double getEscrowBalance() { return escrowBalance; }
    public void setEscrowBalance(Double escrowBalance) { this.escrowBalance = escrowBalance; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getCurrentProgress() { return currentProgress; }
    public void setCurrentProgress(Integer currentProgress) { this.currentProgress = currentProgress; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Boolean getDeptSigned() { return deptSigned; }
    public void setDeptSigned(Boolean deptSigned) { this.deptSigned = deptSigned; }
    public Boolean getStartupSigned() { return startupSigned; }
    public void setStartupSigned(Boolean startupSigned) { this.startupSigned = startupSigned; }
    public LocalDateTime getSignedAt() { return signedAt; }
    public void setSignedAt(LocalDateTime signedAt) { this.signedAt = signedAt; }
    public String getContractTermsJson() { return contractTermsJson; }
    public void setContractTermsJson(String contractTermsJson) { this.contractTermsJson = contractTermsJson; }
    public String getValidatorName() { return validatorName; }
    public void setValidatorName(String validatorName) { this.validatorName = validatorName; }
    public String getValidationStatus() { return validationStatus; }
    public void setValidationStatus(String validationStatus) { this.validationStatus = validationStatus; }
    public String getKpiCurrentValuesJson() { return kpiCurrentValuesJson; }
    public void setKpiCurrentValuesJson(String kpiCurrentValuesJson) { this.kpiCurrentValuesJson = kpiCurrentValuesJson; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long problemId;
        private String problemTitle;
        private Long startupId;
        private String startupName;
        private Long departmentId;
        private String departmentName;
        private String scope;
        private LocalDate startDate;
        private LocalDate endDate;
        private Double budget;
        private Double releasedAmount;
        private Double escrowBalance;
        private String status;
        private Integer currentProgress;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder problemId(Long problemId) { this.problemId = problemId; return this; }
        public Builder problemTitle(String problemTitle) { this.problemTitle = problemTitle; return this; }
        public Builder startupId(Long startupId) { this.startupId = startupId; return this; }
        public Builder startupName(String startupName) { this.startupName = startupName; return this; }
        public Builder departmentId(Long departmentId) { this.departmentId = departmentId; return this; }
        public Builder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public Builder scope(String scope) { this.scope = scope; return this; }
        public Builder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public Builder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public Builder budget(Double budget) { this.budget = budget; return this; }
        public Builder releasedAmount(Double releasedAmount) { this.releasedAmount = releasedAmount; return this; }
        public Builder escrowBalance(Double escrowBalance) { this.escrowBalance = escrowBalance; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder currentProgress(Integer currentProgress) { this.currentProgress = currentProgress; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public PilotResponse build() {
            return new PilotResponse(id, problemId, problemTitle, startupId, startupName, departmentId, departmentName, scope, startDate, endDate, budget, releasedAmount, escrowBalance, status, currentProgress, createdAt);
        }
    }
}
