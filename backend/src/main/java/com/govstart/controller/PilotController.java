package com.govstart.controller;

import com.govstart.dto.*;
import com.govstart.model.*;
import com.govstart.repository.PilotRepository;
import com.govstart.repository.PilotUpdateRepository;
import com.govstart.repository.UserRepository;
import com.govstart.service.PilotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pilots")
public class PilotController {

    @Autowired
    private PilotService pilotService;

    @Autowired
    private PilotRepository pilotRepository;

    @Autowired
    private PilotUpdateRepository pilotUpdateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.govstart.service.AuditLogService auditLogService;

    @PostMapping
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<?> createPilot(@RequestBody PilotRequest request, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        try {
            Pilot pilot = pilotService.createPilot(user.getId(), request);
            auditLogService.logAction(user.getEmail(), "LAUNCHED_PILOT", "Launched sandbox pilot for Startup ID " + request.getStartupId() + " on Challenge ID " + request.getProblemId() + " with Budget ₹" + request.getBudget());
            return ResponseEntity.ok(convertToResponse(pilot));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/updates")
    @PreAuthorize("hasRole('STARTUP')")
    public ResponseEntity<?> submitUpdate(@PathVariable Long id, @RequestBody PilotUpdateRequest request, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        try {
            PilotUpdate update = pilotService.addProgressUpdate(user.getId(), id, request);
            auditLogService.logAction(user.getEmail(), "SUBMITTED_MILESTONE", "Submitted milestone progress update: " + request.getMilestoneName() + " (Progress: " + request.getProgressPercent() + "%) for Pilot ID " + id);
            return ResponseEntity.ok(update);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}/updates")
    public ResponseEntity<?> getUpdates(@PathVariable Long id) {
        List<PilotUpdate> updates = pilotUpdateRepository.findByPilotIdOrderBySubmittedAtDesc(id);
        return ResponseEntity.ok(updates);
    }

    @PostMapping("/decision")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<?> makeDecision(@RequestBody DecisionRequest request, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        try {
            Decision decision = pilotService.makeFinalDecision(
                    user.getId(),
                    request.getPilotId(),
                    request.getDecisionType(),
                    request.getRemarks()
            );
            auditLogService.logAction(user.getEmail(), "FINAL_DECISION", "Approved final procurement pathway (" + request.getDecisionType() + ") for Pilot ID " + request.getPilotId() + ". Remarks: " + request.getRemarks());
            return ResponseEntity.ok(decision);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/updates/{updateId}/approve")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<?> approveMilestone(@PathVariable Long updateId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        try {
            PilotUpdate update = pilotService.approveMilestone(user.getId(), updateId);
            auditLogService.logAction(user.getEmail(), "APPROVED_MILESTONE", "Nodal Officer manually approved milestone update ID " + updateId + " (Progress: " + update.getProgressPercent() + "%) and released escrow payment portion.");
            return ResponseEntity.ok(update);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/updates/{updateId}/sla-trigger")
    public ResponseEntity<?> triggerSlaAutoApproval(@PathVariable Long updateId) {
        try {
            PilotUpdate update = pilotService.triggerSlaAutoApproval(updateId);
            auditLogService.logAction("system-sla-scheduler", "SLA_AUTO_APPROVED", "System SLA 7-day timer expired. Automatically approved milestone update ID " + updateId + " (Progress: " + update.getProgressPercent() + "%) and released escrow payment portion.");
            return ResponseEntity.ok(update);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getPilots(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Pilot> pilots;
        switch (user.getRole()) {
            case DEPARTMENT:
                pilots = pilotService.getPilotsByDepartment(user.getId());
                break;
            case STARTUP:
                pilots = pilotService.getPilotsByStartup(user.getId());
                break;
            default:
                pilots = pilotRepository.findAll();
                break;
        }

        List<PilotResponse> responses = pilots.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPilotById(@PathVariable Long id) {
        return pilotRepository.findById(id)
                .map(p -> ResponseEntity.ok(convertToResponse(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    private PilotResponse convertToResponse(Pilot pilot) {
        List<PilotUpdate> updates = pilotUpdateRepository.findByPilotIdOrderBySubmittedAtDesc(pilot.getId());
        int progress = updates.isEmpty() ? 0 : updates.get(0).getProgressPercent();

        PilotResponse response = PilotResponse.builder()
                .id(pilot.getId())
                .problemId(pilot.getProblem().getId())
                .problemTitle(pilot.getProblem().getTitle())
                .startupId(pilot.getStartup().getId())
                .startupName(pilot.getStartup().getCompanyName())
                .departmentId(pilot.getDepartment().getId())
                .departmentName(pilot.getDepartment().getDeptName())
                .scope(pilot.getScope())
                .startDate(pilot.getStartDate())
                .endDate(pilot.getEndDate())
                .budget(pilot.getBudget())
                .releasedAmount(pilot.getReleasedAmount())
                .escrowBalance(pilot.getEscrowBalance())
                .status(pilot.getStatus())
                .currentProgress(progress)
                .createdAt(pilot.getCreatedAt())
                .build();

        response.setDeptSigned(pilot.getDeptSigned());
        response.setStartupSigned(pilot.getStartupSigned());
        response.setSignedAt(pilot.getSignedAt());
        response.setContractTermsJson(pilot.getContractTermsJson());
        response.setValidatorName(pilot.getValidatorName());
        response.setValidationStatus(pilot.getValidationStatus());
        response.setKpiCurrentValuesJson(pilot.getKpiCurrentValuesJson());

        return response;
    }

    @PostMapping("/{id}/sign-contract")
    public ResponseEntity<?> signContract(@PathVariable Long id, @RequestParam String role, @RequestBody(required = false) String contractTermsJson, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        try {
            Pilot pilot = pilotService.signContract(user.getId(), id, role, contractTermsJson);
            auditLogService.logAction(user.getEmail(), "CONTRACT_SIGNED", "Digitally signed pilot contract as " + role + " for Pilot ID " + id);
            return ResponseEntity.ok(convertToResponse(pilot));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/updates/{updateId}/validate")
    public ResponseEntity<?> validateMilestone(@PathVariable Long updateId, @RequestParam String validatorName, @RequestParam String status, @RequestBody(required = false) String comments, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        try {
            PilotUpdate update = pilotService.validateMilestone(updateId, validatorName, status, comments);
            auditLogService.logAction(user.getEmail(), "MILESTONE_VALIDATED", "Independent Technical Expert (" + validatorName + ") validated milestone update ID " + updateId + " with status: " + status);
            return ResponseEntity.ok(update);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
