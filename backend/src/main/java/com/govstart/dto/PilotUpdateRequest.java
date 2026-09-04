package com.govstart.dto;

public class PilotUpdateRequest {
    private Integer progressPercent;
    private String notes;
    private String milestoneName;
    private String attachmentName;
    private String attachmentHash;

    public PilotUpdateRequest() {}

    public Integer getProgressPercent() { return progressPercent; }
    public void setProgressPercent(Integer progressPercent) { this.progressPercent = progressPercent; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getMilestoneName() { return milestoneName; }
    public void setMilestoneName(String milestoneName) { this.milestoneName = milestoneName; }
    public String getAttachmentName() { return attachmentName; }
    public void setAttachmentName(String attachmentName) { this.attachmentName = attachmentName; }
    public String getAttachmentHash() { return attachmentHash; }
    public void setAttachmentHash(String attachmentHash) { this.attachmentHash = attachmentHash; }
}
