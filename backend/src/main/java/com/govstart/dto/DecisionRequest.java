package com.govstart.dto;

public class DecisionRequest {
    private Long pilotId;
    private String decisionType; // SCALE, PROCURE, REJECTED
    private String remarks;

    public DecisionRequest() {}

    public Long getPilotId() { return pilotId; }
    public void setPilotId(Long pilotId) { this.pilotId = pilotId; }
    public String getDecisionType() { return decisionType; }
    public void setDecisionType(String decisionType) { this.decisionType = decisionType; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
