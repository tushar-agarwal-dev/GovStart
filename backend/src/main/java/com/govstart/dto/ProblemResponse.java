package com.govstart.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ProblemResponse {
    private Long id;
    private Long departmentId;
    private String departmentName;
    private String title;
    private String description;
    private List<String> tags;
    private Double budgetMin;
    private Double budgetMax;
    private Integer timelineDays;
    private String status;
    private LocalDateTime createdAt;

    public ProblemResponse() {}

    public ProblemResponse(Long id, Long departmentId, String departmentName, String title, String description,
                           List<String> tags, Double budgetMin, Double budgetMax, Integer timelineDays,
                           String status, LocalDateTime createdAt) {
        this.id = id;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.title = title;
        this.description = description;
        this.tags = tags;
        this.budgetMin = budgetMin;
        this.budgetMax = budgetMax;
        this.timelineDays = timelineDays;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
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
        private Long id;
        private Long departmentId;
        private String departmentName;
        private String title;
        private String description;
        private List<String> tags;
        private Double budgetMin;
        private Double budgetMax;
        private Integer timelineDays;
        private String status;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder departmentId(Long departmentId) { this.departmentId = departmentId; return this; }
        public Builder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder tags(List<String> tags) { this.tags = tags; return this; }
        public Builder budgetMin(Double budgetMin) { this.budgetMin = budgetMin; return this; }
        public Builder budgetMax(Double budgetMax) { this.budgetMax = budgetMax; return this; }
        public Builder timelineDays(Integer timelineDays) { this.timelineDays = timelineDays; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ProblemResponse build() {
            return new ProblemResponse(id, departmentId, departmentName, title, description, tags, budgetMin, budgetMax, timelineDays, status, createdAt);
        }
    }
}
