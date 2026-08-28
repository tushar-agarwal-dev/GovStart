package com.govstart.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "decisions")
public class Decision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pilot_id", nullable = false)
    private Pilot pilot;

    @Column(name = "decision_type", nullable = false)
    private String decisionType; // SCALE, PROCURE, REJECTED

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "decided_by", nullable = false)
    private User decidedBy;

    @Column(name = "decided_at", nullable = false)
    private LocalDateTime decidedAt;

    public Decision() {}

    public Decision(Pilot pilot, String decisionType, String remarks, User decidedBy) {
        this.pilot = pilot;
        this.decisionType = decisionType;
        this.remarks = remarks;
        this.decidedBy = decidedBy;
    }

    @PrePersist
    protected void onCreate() {
        this.decidedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Pilot getPilot() { return pilot; }
    public void setPilot(Pilot pilot) { this.pilot = pilot; }
    public String getDecisionType() { return decisionType; }
    public void setDecisionType(String decisionType) { this.decisionType = decisionType; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public User getDecidedBy() { return decidedBy; }
    public void setDecidedBy(User decidedBy) { this.decidedBy = decidedBy; }
    public LocalDateTime getDecidedAt() { return decidedAt; }
    public void setDecidedAt(LocalDateTime decidedAt) { this.decidedAt = decidedAt; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Pilot pilot;
        private String decisionType;
        private String remarks;
        private User decidedBy;

        public Builder pilot(Pilot pilot) { this.pilot = pilot; return this; }
        public Builder decisionType(String decisionType) { this.decisionType = decisionType; return this; }
        public Builder remarks(String remarks) { this.remarks = remarks; return this; }
        public Builder decidedBy(User decidedBy) { this.decidedBy = decidedBy; return this; }

        public Decision build() {
            return new Decision(pilot, decisionType, remarks, decidedBy);
        }
    }
}
