package com.govstart.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations")
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "startup_id", nullable = false)
    private StartupProfile startup;

    @Column(name = "rule_score")
    private Double ruleScore;

    @Column(name = "llm_score")
    private Double llmScore;

    @Column(name = "final_weighted_score")
    private Double finalWeightedScore;

    @Column(name = "llm_justification", columnDefinition = "TEXT")
    private String llmJustification;

    @Column(name = "rank_position")
    private Integer rankPosition;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public Recommendation() {}

    public Recommendation(Problem problem, StartupProfile startup, Double ruleScore, Double llmScore,
                          Double finalWeightedScore, String llmJustification, Integer rankPosition) {
        this.problem = problem;
        this.startup = startup;
        this.ruleScore = ruleScore;
        this.llmScore = llmScore;
        this.finalWeightedScore = finalWeightedScore;
        this.llmJustification = llmJustification;
        this.rankPosition = rankPosition;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }
    public StartupProfile getStartup() { return startup; }
    public void setStartup(StartupProfile startup) { this.startup = startup; }
    public Double getRuleScore() { return ruleScore; }
    public void setRuleScore(Double ruleScore) { this.ruleScore = ruleScore; }
    public Double getLlmScore() { return llmScore; }
    public void setLlmScore(Double llmScore) { this.llmScore = llmScore; }
    public Double getFinalWeightedScore() { return finalWeightedScore; }
    public void setFinalWeightedScore(Double finalWeightedScore) { this.finalWeightedScore = finalWeightedScore; }
    public String getLlmJustification() { return llmJustification; }
    public void setLlmJustification(String llmJustification) { this.llmJustification = llmJustification; }
    public Integer getRankPosition() { return rankPosition; }
    public void setRankPosition(Integer rankPosition) { this.rankPosition = rankPosition; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Problem problem;
        private StartupProfile startup;
        private Double ruleScore;
        private Double llmScore;
        private Double finalWeightedScore;
        private String llmJustification;
        private Integer rankPosition;

        public Builder problem(Problem problem) { this.problem = problem; return this; }
        public Builder startup(StartupProfile startup) { this.startup = startup; return this; }
        public Builder ruleScore(Double ruleScore) { this.ruleScore = ruleScore; return this; }
        public Builder llmScore(Double llmScore) { this.llmScore = llmScore; return this; }
        public Builder finalWeightedScore(Double finalWeightedScore) { this.finalWeightedScore = finalWeightedScore; return this; }
        public Builder llmJustification(String llmJustification) { this.llmJustification = llmJustification; return this; }
        public Builder rankPosition(Integer rankPosition) { this.rankPosition = rankPosition; return this; }

        public Recommendation build() {
            return new Recommendation(problem, startup, ruleScore, llmScore, finalWeightedScore, llmJustification, rankPosition);
        }
    }
}
