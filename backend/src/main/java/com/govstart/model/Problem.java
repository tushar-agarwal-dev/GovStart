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
