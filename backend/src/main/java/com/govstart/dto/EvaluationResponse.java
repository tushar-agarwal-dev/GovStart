package com.govstart.dto;

import java.time.LocalDateTime;

public class EvaluationResponse {
    private Long id;
    private Long problemId;
    private String problemTitle;
    private Long startupId;
    private String startupName;
    private String expertName;
    private Integer feasibilityScore;
    private Integer innovationScore;
    private Integer teamScore;
    private Integer costScore;
    private Double avgScore;
    private String comments;
    private LocalDateTime createdAt;

    public EvaluationResponse() {}

    public EvaluationResponse(Long id, Long problemId, String problemTitle, Long startupId, String startupName,
                              String expertName, Integer feasibilityScore, Integer innovationScore,
                              Integer teamScore, Integer costScore, Double avgScore, String comments,
                              LocalDateTime createdAt) {
        this.id = id;
        this.problemId = problemId;
        this.problemTitle = problemTitle;
        this.startupId = startupId;
        this.startupName = startupName;
        this.expertName = expertName;
        this.feasibilityScore = feasibilityScore;
        this.innovationScore = innovationScore;
        this.teamScore = teamScore;
        this.costScore = costScore;
        this.avgScore = avgScore;
        this.comments = comments;
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
    public String getExpertName() { return expertName; }
    public void setExpertName(String expertName) { this.expertName = expertName; }
    public Integer getFeasibilityScore() { return feasibilityScore; }
    public void setFeasibilityScore(Integer feasibilityScore) { this.feasibilityScore = feasibilityScore; }
    public Integer getInnovationScore() { return innovationScore; }
    public void setInnovationScore(Integer innovationScore) { this.innovationScore = innovationScore; }
    public Integer getTeamScore() { return teamScore; }
    public void setTeamScore(Integer teamScore) { this.teamScore = teamScore; }
    public Integer getCostScore() { return costScore; }
    public void setCostScore(Integer costScore) { this.costScore = costScore; }
    public Double getAvgScore() { return avgScore; }
    public void setAvgScore(Double avgScore) { this.avgScore = avgScore; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long problemId;
        private String problemTitle;
        private Long startupId;
        private String startupName;
        private String expertName;
        private Integer feasibilityScore;
        private Integer innovationScore;
        private Integer teamScore;
        private Integer costScore;
        private Double avgScore;
        private String comments;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder problemId(Long problemId) { this.problemId = problemId; return this; }
        public Builder problemTitle(String problemTitle) { this.problemTitle = problemTitle; return this; }
        public Builder startupId(Long startupId) { this.startupId = startupId; return this; }
        public Builder startupName(String startupName) { this.startupName = startupName; return this; }
        public Builder expertName(String expertName) { this.expertName = expertName; return this; }
        public Builder feasibilityScore(Integer feasibilityScore) { this.feasibilityScore = feasibilityScore; return this; }
        public Builder innovationScore(Integer innovationScore) { this.innovationScore = innovationScore; return this; }
        public Builder teamScore(Integer teamScore) { this.teamScore = teamScore; return this; }
        public Builder costScore(Integer costScore) { this.costScore = costScore; return this; }
        public Builder avgScore(Double avgScore) { this.avgScore = avgScore; return this; }
        public Builder comments(String comments) { this.comments = comments; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public EvaluationResponse build() {
            return new EvaluationResponse(id, problemId, problemTitle, startupId, startupName, expertName, feasibilityScore, innovationScore, teamScore, costScore, avgScore, comments, createdAt);
        }
    }
}
