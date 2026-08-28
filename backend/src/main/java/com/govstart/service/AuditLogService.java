package com.govstart.service;

import com.govstart.model.AuditLog;
import com.govstart.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Transactional
    public AuditLog logAction(String actor, String action, String details) {
        String prevHash = "GENESIS_BLOCK_HASH";
        Optional<AuditLog> lastLog = auditLogRepository.findTopByOrderByIdDesc();
        if (lastLog.isPresent()) {
            prevHash = lastLog.get().getChecksum();
        }

        String currentHash = computeSha256(prevHash + actor + action + details);

        AuditLog log = AuditLog.builder()
                .actor(actor)
                .action(action)
                .details(details)
                .checksum(currentHash)
                .build();

        return auditLogRepository.save(log);
    }

    public Map<String, Object> verifyLedgerIntegrity() {
        List<AuditLog> logs = auditLogRepository.findAll();
        Map<String, Object> result = new HashMap<>();
        
        String prevHash = "GENESIS_BLOCK_HASH";
        boolean verified = true;
        Long corruptedId = null;

        for (AuditLog log : logs) {
            String calculated = computeSha256(prevHash + log.getActor() + log.getAction() + log.getDetails());
            if (!calculated.equals(log.getChecksum())) {
                verified = false;
                corruptedId = log.getId();
                break;
            }
            prevHash = log.getChecksum();
        }

        result.put("verified", verified);
        result.put("corruptedLogId", corruptedId);
        result.put("totalChecked", logs.size());
        return result;
    }

    private String computeSha256(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }
}
