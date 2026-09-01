package com.govstart.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pilots")
public class Pilot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "startup_id", nullable = false)
    private StartupProfile startup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private DepartmentProfile department;

    @Column(columnDefinition = "TEXT")
    private String scope;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(nullable = false)
    private Double budget;

    @Column(name = "released_amount", nullable = false)
    private Double releasedAmount;

    @Column(name = "escrow_balance", nullable = false)
    private Double escrowBalance;

    @Column(nullable = false)
    private String status; // PILOT_ACTIVE, PILOT_COMPLETE

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Extended Contract, Validation, and KPI fields
    @Column(name = "dept_signed")
    private Boolean deptSigned;
    @Column(name = "startup_signed")
    private Boolean startupSigned;
    @Column(name = "signed_at")
    private LocalDateTime signedAt;
    @Column(name = "contract_terms_json", columnDefinition = "TEXT")
    private String contractTermsJson;
    @Column(name = "validator_name")
    private String validatorName;
    @Column(name = "validation_status")
    private String validationStatus; // PENDING, UNDER_REVIEW, VALIDATED, REJECTED
    @Column(name = "kpi_current_values_json", columnDefinition = "TEXT")
    private String kpiCurrentValuesJson;

    public Pilot() {}

    public Pilot(Problem problem, StartupProfile startup, DepartmentProfile department, String scope,
                 LocalDate startDate, LocalDate endDate, Double budget, String status) {
        this.problem = problem;
        this.startup = startup;
        this.department = department;
        this.scope = scope;
        this.startDate = startDate;
        this.endDate = endDate;
        this.budget = budget;
        this.status = status;
        this.releasedAmount = 0.0;
        this.escrowBalance = budget;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PILOT_ACTIVE";
        }
        if (this.releasedAmount == null) {
            this.releasedAmount = 0.0;
        }
        if (this.escrowBalance == null) {
            this.escrowBalance = this.budget;
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }
    public StartupProfile getStartup() { return startup; }
    public void setStartup(StartupProfile startup) { this.startup = startup; }
    public DepartmentProfile getDepartment() { return department; }
    public void setDepartment(DepartmentProfile department) { this.department = department; }
    public String getScope() { return scope; }
    public void setScope(String scope) { this.scope = scope; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public Double getBudget() { return budget; }
    public void setBudget(Double budget) { this.budget = budget; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Double getReleasedAmount() { return releasedAmount; }
    public void setReleasedAmount(Double releasedAmount) { this.releasedAmount = releasedAmount; }
    public Double getEscrowBalance() { return escrowBalance; }
    public void setEscrowBalance(Double escrowBalance) { this.escrowBalance = escrowBalance; }

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
        private Problem problem;
        private StartupProfile startup;
        private DepartmentProfile department;
        private String scope;
        private LocalDate startDate;
        private LocalDate endDate;
        private Double budget;
        private Double releasedAmount;
        private Double escrowBalance;
        private String status;

        public Builder problem(Problem problem) { this.problem = problem; return this; }
        public Builder startup(StartupProfile startup) { this.startup = startup; return this; }
        public Builder department(DepartmentProfile department) { this.department = department; return this; }
        public Builder scope(String scope) { this.scope = scope; return this; }
        public Builder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public Builder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public Builder budget(Double budget) { this.budget = budget; return this; }
        public Builder releasedAmount(Double releasedAmount) { this.releasedAmount = releasedAmount; return this; }
        public Builder escrowBalance(Double escrowBalance) { this.escrowBalance = escrowBalance; return this; }
        public Builder status(String status) { this.status = status; return this; }

        public Pilot build() {
            Pilot pilot = new Pilot(problem, startup, department, scope, startDate, endDate, budget, status);
            if (this.releasedAmount != null) {
                pilot.setReleasedAmount(this.releasedAmount);
            }
            if (this.escrowBalance != null) {
                pilot.setEscrowBalance(this.escrowBalance);
            }
            return pilot;
        }
    }
}
