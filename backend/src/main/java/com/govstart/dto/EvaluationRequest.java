package com.govstart.dto;

public class EvaluationRequest {
    private Long problemId;
    private Long startupId;
    private Integer feasibilityScore;
    private Integer innovationScore;
    private Integer teamScore;
    private Integer costScore;
    private String comments;

    public EvaluationRequest() {}

    public Long getProblemId() { return problemId; }
    public void setProblemId(Long problemId) { this.problemId = problemId; }
    public Long getStartupId() { return startupId; }
    public void setStartupId(Long startupId) { this.startupId = startupId; }
    public Integer getFeasibilityScore() { return feasibilityScore; }
    public void setFeasibilityScore(Integer feasibilityScore) { this.feasibilityScore = feasibilityScore; }
    public Integer getInnovationScore() { return innovationScore; }
    public void setInnovationScore(Integer innovationScore) { this.innovationScore = innovationScore; }
    public Integer getTeamScore() { return teamScore; }
    public void setTeamScore(Integer teamScore) { this.teamScore = teamScore; }
    public Integer getCostScore() { return costScore; }
    public void setCostScore(Integer costScore) { this.costScore = costScore; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}
