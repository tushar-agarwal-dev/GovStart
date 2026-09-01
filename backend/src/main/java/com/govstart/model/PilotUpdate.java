package com.govstart.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pilot_updates")
public class PilotUpdate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pilot_id", nullable = false)
    private Pilot pilot;

    @Column(name = "progress_percent", nullable = false)
    private Integer progressPercent;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "milestone_name")
    private String milestoneName;

    @Column(nullable = false)
    private String status; // PENDING, APPROVED, REJECTED

    @Column(name = "attachment_name")
    private String attachmentName;

    @Column(name = "attachment_hash")
    private String attachmentHash;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    // Extended KPI measurements & Independent Validation fields
    @Column(name = "kpi_measurements_json", columnDefinition = "TEXT")
    private String kpiMeasurementsJson;
    @Column(name = "evidence_ref")
    private String evidenceRef;
    @Column(name = "validation_status")
    private String validationStatus; // PENDING, UNDER_REVIEW, VALIDATED, REJECTED
    @Column(name = "validator_comments", columnDefinition = "TEXT")
    private String validatorComments;
    @Column(name = "validated_at")
    private LocalDateTime validatedAt;

    public PilotUpdate() {}

    public PilotUpdate(Pilot pilot, Integer progressPercent, String notes, String milestoneName, String status, String attachmentName, String attachmentHash) {
        this.pilot = pilot;
        this.progressPercent = progressPercent;
        this.notes = notes;
        this.milestoneName = milestoneName;
        this.status = status;
        this.attachmentName = attachmentName;
        this.attachmentHash = attachmentHash;
    }

    @PrePersist
    protected void onCreate() {
        this.submittedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDING";
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Pilot getPilot() { return pilot; }
    public void setPilot(Pilot pilot) { this.pilot = pilot; }
    public Integer getProgressPercent() { return progressPercent; }
    public void setProgressPercent(Integer progressPercent) { this.progressPercent = progressPercent; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getMilestoneName() { return milestoneName; }
    public void setMilestoneName(String milestoneName) { this.milestoneName = milestoneName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getAttachmentName() { return attachmentName; }
    public void setAttachmentName(String attachmentName) { this.attachmentName = attachmentName; }
    public String getAttachmentHash() { return attachmentHash; }
    public void setAttachmentHash(String attachmentHash) { this.attachmentHash = attachmentHash; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public String getKpiMeasurementsJson() { return kpiMeasurementsJson; }
    public void setKpiMeasurementsJson(String kpiMeasurementsJson) { this.kpiMeasurementsJson = kpiMeasurementsJson; }
    public String getEvidenceRef() { return evidenceRef; }
    public void setEvidenceRef(String evidenceRef) { this.evidenceRef = evidenceRef; }
    public String getValidationStatus() { return validationStatus; }
    public void setValidationStatus(String validationStatus) { this.validationStatus = validationStatus; }
    public String getValidatorComments() { return validatorComments; }
    public void setValidatorComments(String validatorComments) { this.validatorComments = validatorComments; }
    public LocalDateTime getValidatedAt() { return validatedAt; }
    public void setValidatedAt(LocalDateTime validatedAt) { this.validatedAt = validatedAt; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Pilot pilot;
        private Integer progressPercent;
        private String notes;
        private String milestoneName;
        private String status;
        private String attachmentName;
        private String attachmentHash;

        public Builder pilot(Pilot pilot) { this.pilot = pilot; return this; }
        public Builder progressPercent(Integer progressPercent) { this.progressPercent = progressPercent; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder milestoneName(String milestoneName) { this.milestoneName = milestoneName; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder attachmentName(String attachmentName) { this.attachmentName = attachmentName; return this; }
        public Builder attachmentHash(String attachmentHash) { this.attachmentHash = attachmentHash; return this; }

        public PilotUpdate build() {
            return new PilotUpdate(pilot, progressPercent, notes, milestoneName, status, attachmentName, attachmentHash);
        }
    }
}
