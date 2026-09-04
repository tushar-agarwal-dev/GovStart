package com.govstart.service;

import com.govstart.dto.PilotRequest;
import com.govstart.dto.PilotUpdateRequest;
import com.govstart.model.*;
import com.govstart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PilotService {

    @Autowired
    private PilotRepository pilotRepository;

    @Autowired
    private PilotUpdateRepository pilotUpdateRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private StartupProfileRepository startupProfileRepository;

    @Autowired
    private DepartmentProfileRepository departmentProfileRepository;

    @Autowired
    private DecisionRepository decisionRepository;

    @Autowired
    private StatusTransitionLogRepository statusTransitionLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Pilot createPilot(Long departmentUserId, PilotRequest request) {
        DepartmentProfile department = departmentProfileRepository.findByUserId(departmentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Department profile not found"));

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new IllegalArgumentException("Problem not found"));

        StartupProfile startup = startupProfileRepository.findById(request.getStartupId())
                .orElseThrow(() -> new IllegalArgumentException("Startup profile not found"));

        Pilot pilot = Pilot.builder()
                .problem(problem)
                .startup(startup)
                .department(department)
                .scope(request.getScope())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .budget(request.getBudget())
                .releasedAmount(0.0)
                .escrowBalance(request.getBudget())
                .status("PILOT_ACTIVE")
                .build();

        pilot = pilotRepository.save(pilot);

        // Transition problem status to PILOT_ACTIVE
        String oldStatus = problem.getStatus();
        problem.setStatus("PILOT_ACTIVE");
        problemRepository.save(problem);

        statusTransitionLogRepository.save(StatusTransitionLog.builder()
                .problem(problem)
                .previousStatus(oldStatus)
                .newStatus("PILOT_ACTIVE")
                .build());

        return pilot;
    }

    @Transactional
    public PilotUpdate addProgressUpdate(Long startupUserId, Long pilotId, PilotUpdateRequest request) {
        StartupProfile startup = startupProfileRepository.findByUserId(startupUserId)
                .orElseThrow(() -> new IllegalArgumentException("Startup profile not found"));

        Pilot pilot = pilotRepository.findById(pilotId)
                .orElseThrow(() -> new IllegalArgumentException("Pilot not found"));

        if (!pilot.getStartup().getId().equals(startup.getId())) {
            throw new SecurityException("Unauthorized startup updating this pilot");
        }

        PilotUpdate update = PilotUpdate.builder()
                .pilot(pilot)
                .progressPercent(request.getProgressPercent())
                .notes(request.getNotes())
                .milestoneName(request.getMilestoneName())
                .attachmentName(request.getAttachmentName())
                .attachmentHash(request.getAttachmentHash())
                .status("PENDING")
                .build();

        update = pilotUpdateRepository.save(update);

        return update;
    }

    @Transactional
    public Decision makeFinalDecision(Long departmentUserId, Long pilotId, String decisionType, String remarks) {
        DepartmentProfile department = departmentProfileRepository.findByUserId(departmentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Department profile not found"));

        Pilot pilot = pilotRepository.findById(pilotId)
                .orElseThrow(() -> new IllegalArgumentException("Pilot not found"));

        if (!pilot.getDepartment().getId().equals(department.getId())) {
            throw new SecurityException("Unauthorized department finalizing this pilot");
        }

        User user = userRepository.findById(departmentUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Decision decision = Decision.builder()
                .pilot(pilot)
                .decisionType(decisionType)
                .remarks(remarks)
                .decidedBy(user)
                .build();

        decision = decisionRepository.save(decision);

        // Update pilot status
        pilot.setStatus("DECIDED_" + decisionType);
        pilotRepository.save(pilot);

        // Transition problem status to DECIDED
        Problem problem = pilot.getProblem();
        String oldStatus = problem.getStatus();
        problem.setStatus("DECIDED");
        problemRepository.save(problem);

        statusTransitionLogRepository.save(StatusTransitionLog.builder()
                .problem(problem)
                .previousStatus(oldStatus)
                .newStatus("DECIDED (" + decisionType + ")")
                .build());

        // Update startup metrics if successful
        if ("SCALE".equals(decisionType) || "PROCURE".equals(decisionType)) {
            StartupProfile startup = pilot.getStartup();
            int currentPilots = startup.getPastPilotsCount() != null ? startup.getPastPilotsCount() : 0;
            startup.setPastPilotsCount(currentPilots + 1);
            
            // Adjust success score
            double currentScore = startup.getSuccessScore() != null ? startup.getSuccessScore() : 0.0;
            double newScore = (currentScore * currentPilots + 100.0) / (currentPilots + 1);
            startup.setSuccessScore(newScore);
            startupProfileRepository.save(startup);
        }

        return decision;
    }

    @Transactional
    public PilotUpdate approveMilestone(Long departmentUserId, Long updateId) {
        PilotUpdate update = pilotUpdateRepository.findById(updateId)
                .orElseThrow(() -> new IllegalArgumentException("Milestone update not found"));

        Pilot pilot = update.getPilot();
        DepartmentProfile department = departmentProfileRepository.findByUserId(departmentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Department profile not found"));

        if (!pilot.getDepartment().getId().equals(department.getId())) {
            throw new SecurityException("Unauthorized department approving this milestone");
        }

        if (!"PENDING".equals(update.getStatus())) {
            throw new IllegalStateException("Milestone is already processed: " + update.getStatus());
        }

        // Find the previous highest approved progress percentage for this pilot
        List<PilotUpdate> approvedUpdates = pilotUpdateRepository.findByPilotIdOrderBySubmittedAtDesc(pilot.getId());
        int previousProgress = 0;
        for (PilotUpdate u : approvedUpdates) {
            if ("APPROVED".equals(u.getStatus()) && u.getProgressPercent() > previousProgress) {
                previousProgress = u.getProgressPercent();
            }
        }

        int newProgress = update.getProgressPercent();
        if (newProgress > previousProgress) {
            double payoutSlice = ((newProgress - previousProgress) * pilot.getBudget()) / 100.0;
            double released = pilot.getReleasedAmount() + payoutSlice;
            double balance = pilot.getEscrowBalance() - payoutSlice;
            
            // Protect against floating point precision errors exceeding budget
            if (balance < 0) {
                released += balance;
                balance = 0.0;
            }
            pilot.setReleasedAmount(released);
            pilot.setEscrowBalance(balance);
        }

        update.setStatus("APPROVED");
        pilotUpdateRepository.save(update);

        // If progress reaches 100%, set pilot status to PILOT_COMPLETE
        if (newProgress >= 100) {
            pilot.setStatus("PILOT_COMPLETE");
            
            Problem problem = pilot.getProblem();
            String oldStatus = problem.getStatus();
            problem.setStatus("PILOT_COMPLETE");
            problemRepository.save(problem);

            statusTransitionLogRepository.save(StatusTransitionLog.builder()
                    .problem(problem)
                    .previousStatus(oldStatus)
                    .newStatus("PILOT_COMPLETE")
                    .build());
        }

        pilotRepository.save(pilot);
        return update;
    }

    @Transactional
    public PilotUpdate triggerSlaAutoApproval(Long updateId) {
        PilotUpdate update = pilotUpdateRepository.findById(updateId)
                .orElseThrow(() -> new IllegalArgumentException("Milestone update not found"));

        if (!"PENDING".equals(update.getStatus())) {
            throw new IllegalStateException("Milestone is already processed: " + update.getStatus());
        }

        Pilot pilot = update.getPilot();

        // Calculate and release escrow payout exactly like manual approval
        List<PilotUpdate> approvedUpdates = pilotUpdateRepository.findByPilotIdOrderBySubmittedAtDesc(pilot.getId());
        int previousProgress = 0;
        for (PilotUpdate u : approvedUpdates) {
            if ("APPROVED".equals(u.getStatus()) && u.getProgressPercent() > previousProgress) {
                previousProgress = u.getProgressPercent();
            }
        }

        int newProgress = update.getProgressPercent();
        if (newProgress > previousProgress) {
            double payoutSlice = ((newProgress - previousProgress) * pilot.getBudget()) / 100.0;
            double released = pilot.getReleasedAmount() + payoutSlice;
            double balance = pilot.getEscrowBalance() - payoutSlice;
            
            if (balance < 0) {
                released += balance;
                balance = 0.0;
            }
            pilot.setReleasedAmount(released);
            pilot.setEscrowBalance(balance);
        }

        update.setStatus("APPROVED");
        pilotUpdateRepository.save(update);

        if (newProgress >= 100) {
            pilot.setStatus("PILOT_COMPLETE");
            
            Problem problem = pilot.getProblem();
            String oldStatus = problem.getStatus();
            problem.setStatus("PILOT_COMPLETE");
            problemRepository.save(problem);

            statusTransitionLogRepository.save(StatusTransitionLog.builder()
                    .problem(problem)
                    .previousStatus(oldStatus)
                    .newStatus("PILOT_COMPLETE")
                    .build());
        }

        pilotRepository.save(pilot);
        return update;
    }

    public List<Pilot> getPilotsByDepartment(Long userId) {
        DepartmentProfile department = departmentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Department profile not found"));
        return pilotRepository.findByDepartmentId(department.getId());
    }

    public List<Pilot> getPilotsByStartup(Long userId) {
        StartupProfile startup = startupProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Startup profile not found"));
        return pilotRepository.findByStartupId(startup.getId());
    }
}
