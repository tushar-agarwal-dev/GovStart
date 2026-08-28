package com.govstart.controller;

import com.govstart.model.*;
import com.govstart.repository.PilotRepository;
import com.govstart.repository.ProblemRepository;
import com.govstart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private PilotRepository pilotRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestParam String status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setStatus(status);
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {
        List<Problem> problems = problemRepository.findAll();
        List<Pilot> pilots = pilotRepository.findAll();

        Map<String, Long> statusCounts = new HashMap<>();
        statusCounts.put("POSTED", 0L);
        statusCounts.put("RECOMMENDED", 0L);
        statusCounts.put("UNDER_EVALUATION", 0L);
        statusCounts.put("PILOT_ACTIVE", 0L);
        statusCounts.put("PILOT_COMPLETE", 0L);
        statusCounts.put("DECIDED", 0L);

        for (Problem p : problems) {
            String s = p.getStatus();
            statusCounts.put(s, statusCounts.getOrDefault(s, 0L) + 1);
        }

        double totalBudget = pilots.stream()
                .mapToDouble(Pilot::getBudget)
                .sum();

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("problemStatuses", statusCounts);
        analytics.put("totalProblems", (long) problems.size());
        analytics.put("totalPilots", (long) pilots.size());
        analytics.put("totalBudgetLocked", totalBudget);

        return ResponseEntity.ok(analytics);
    }
}
