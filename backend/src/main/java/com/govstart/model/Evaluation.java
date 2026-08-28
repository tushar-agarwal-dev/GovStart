package com.govstart.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evaluations")
public class Evaluation {

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
    @JoinColumn(name = "expert_id", nullable = false)
    private ExpertProfile expert;

    @Column(name = "feasibility_score", nullable = false)
    private Integer feasibilityScore; // 1-5

    @Column(name = "innovation_score", nullable = false)
    private Integer innovationScore; // 1-5

    @Column(name = "team_score", nullable = false)
    private Integer teamScore; // 1-5

    @Column(name = "cost_score", nullable = false)
    private Integer costScore; // 1-5

    @Column(name = "avg_score")
    private Double avgScore;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public Evaluation() {}

    public Evaluation(Problem problem, StartupProfile startup, ExpertProfile expert, Integer feasibilityScore,
                      Integer innovationScore, Integer teamScore, Integer costScore, String comments) {
        this.problem = problem;
        this.startup = startup;
        this.expert = expert;
        this.feasibilityScore = feasibilityScore;
        this.innovationScore = innovationScore;
        this.teamScore = teamScore;
        this.costScore = costScore;
        this.comments = comments;
        this.avgScore = (feasibilityScore + innovationScore + teamScore + costScore) / 4.0;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.avgScore = (feasibilityScore + innovationScore + teamScore + costScore) / 4.0;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }
    public StartupProfile getStartup() { return startup; }
    public void setStartup(StartupProfile startup) { this.startup = startup; }
    public ExpertProfile getExpert() { return expert; }
    public void setExpert(ExpertProfile expert) { this.expert = expert; }
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
        private Problem problem;
        private StartupProfile startup;
        private ExpertProfile expert;
        private Integer feasibilityScore;
        private Integer innovationScore;
        private Integer teamScore;
        private Integer costScore;
        private String comments;

        public Builder problem(Problem problem) { this.problem = problem; return this; }
        public Builder startup(StartupProfile startup) { this.startup = startup; return this; }
        public Builder expert(ExpertProfile expert) { this.expert = expert; return this; }
        public Builder feasibilityScore(Integer feasibilityScore) { this.feasibilityScore = feasibilityScore; return this; }
        public Builder innovationScore(Integer innovationScore) { this.innovationScore = innovationScore; return this; }
        public Builder teamScore(Integer teamScore) { this.teamScore = teamScore; return this; }
        public Builder costScore(Integer costScore) { this.costScore = costScore; return this; }
        public Builder comments(String comments) { this.comments = comments; return this; }

        public Evaluation build() {
            return new Evaluation(problem, startup, expert, feasibilityScore, innovationScore, teamScore, costScore, comments);
        }
    }
}
