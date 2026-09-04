package com.govstart.controller;

import com.govstart.model.AuditLog;
import com.govstart.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/integration")
public class IntegrationController {

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private com.govstart.repository.AuditLogRepository auditLogRepository;

    @GetMapping("/dpiit/{number}")
    public ResponseEntity<?> verifyDpiit(@PathVariable String number) {
        // Return simulated DPIIT verification registry payload
        Map<String, Object> data = new HashMap<>();
        data.put("dpiitNumber", number);
        data.put("verified", true);
        data.put("incorporationDate", "2023-04-12");
        data.put("category", "Technology / Software Development");
        data.put("registeredAddress", "Vantage Point, Phase 2, Hinjewadi IT Park, Pune, Maharashtra 411057");
        data.put("directors", Arrays.asList("Dr. Amit Deshpande", "Rajesh Patwardhan"));
        data.put("status", "ACTIVE");
        return ResponseEntity.ok(data);
    }

    @PostMapping("/gem/publish")
    public ResponseEntity<?> publishToGem(@RequestBody Map<String, Object> payload) {
        Long pilotId = Long.valueOf(payload.get("pilotId").toString());
        String catalogTitle = payload.get("catalogTitle").toString();

        Map<String, Object> response = new HashMap<>();
        response.put("status", "PUBLISHED");
        response.put("gemCatalogId", "GeM-26136-" + pilotId + "-" + (1000 + new Random().nextInt(9000)));
        response.put("catalogTitle", catalogTitle);
        response.put("publishedAt", LocalDateTime.now());

        // Log the integration action in our ledger
        auditLogService.logAction("dept@govstart.gov.in", "PUBLISHED_GEM_CATALOG", "Published Pilot ID " + pilotId + " to GeM Portal Marketplace under catalog name: " + catalogTitle);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAuditLogs() {
        List<AuditLog> logs = auditLogRepository.findAll();
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/audit-logs/verify")
    public ResponseEntity<?> verifyLedger() {
        Map<String, Object> integrity = auditLogService.verifyLedgerIntegrity();
        return ResponseEntity.ok(integrity);
    }
}
