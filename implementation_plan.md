# Implementation Plan: Phase 3 Integration & Vetting

This plan details the technical changes required to implement **Phase 3 (Integration & Security Vetting)** of the GovStart procurement mechanism.

---

## 1. Goal Description
Phase 3 expands the sandbox pathway with integrations and security safeguards:
1.  **DPIIT & GeM Marketplace Simulator**: Simulated API lookup connections to verify DPIIT startup registers and publish completed pilots directly as GeM purchase catalogs.
2.  **IP File Vault Simulator**: AES-256/SHA-256 file encryption tracking for startup milestone attachments (protecting intellectual property in sandbox workspaces).
3.  **Tamper-Evident Cryptographic Audit Ledger**: An immutable database ledger where each log entry contains a SHA-256 checksum chained to the previous entry, establishing a tamper-proof audit trail for government purchases.

---

## 2. Proposed Changes

### Backend Component

#### [NEW] [AuditLog.java](file:///Users/tusharagarwal/.gemini/antigravity/scratch/govstart/backend/src/main/java/com/govstart/model/AuditLog.java)
*   Create a JPA entity with properties: `id` (Long), `timestamp` (LocalDateTime), `actor` (String), `action` (String), `details` (String), and `checksum` (String).

#### [NEW] [AuditLogRepository.java](file:///Users/tusharagarwal/.gemini/antigravity/scratch/govstart/backend/src/main/java/com/govstart/repository/AuditLogRepository.java)
*   Standard JpaRepository interface with custom query `findTopByOrderByIdDesc()` to fetch the last log for chaining hashes.

#### [NEW] [AuditLogService.java](file:///Users/tusharagarwal/.gemini/antigravity/scratch/govstart/backend/src/main/java/com/govstart/service/AuditLogService.java)
*   Implement `logAction(String actor, String action, String details)`:
    *   Find the previous log.
    *   Compute SHA-256 checksum: `SHA256(prevChecksum + currentTimestamp + actor + action + details)`.
    *   Save new log.
*   Implement `verifyLedgerIntegrity()`:
    *   Read all logs and recalculate the chain checksums. Return a map showing status (`VERIFIED` or `TAMPERED`) and index of any corrupted log.

#### [MODIFY] [PilotUpdate.java](file:///Users/tusharagarwal/.gemini/antigravity/scratch/govstart/backend/src/main/java/com/govstart/model/PilotUpdate.java)
*   Add `attachmentName` (`String`) and `attachmentHash` (`String`) properties to store metadata of encrypted files.

#### [NEW] [IntegrationController.java](file:///Users/tusharagarwal/.gemini/antigravity/scratch/govstart/backend/src/main/java/com/govstart/controller/IntegrationController.java)
*   Add endpoint `GET /api/integration/dpiit/{number}` to return mock verified startup details.
*   Add endpoint `POST /api/integration/gem/publish` to publish a completed pilot as a GeM product catalog.
*   Add endpoints `GET /api/admin/audit-logs` and `POST /api/admin/audit-logs/verify` for audit trail monitoring.

---

### Frontend Component

#### [MODIFY] [App.tsx](file:///Users/tusharagarwal/.gemini/antigravity/scratch/govstart/frontend/src/App.tsx)
*   **Startup DPIIT Verifier**: Add a button next to DPIIT numbers to execute a live lookup, displaying verified directors, registered address, and business categories in a popover.
*   **GeM Marketplace Cataloging**: In the final Decision page for the Nodal Officer, add a toggle `"Publish Catalog to GeM Portal"`. When submitted, displays a GeM badge and listing link.
*   **Milestone IP File Upload**: Add a simulated file upload dropzone in the startup milestone form. Displays a green shield `"IP Shield Active: AES-256 Encrypted"` and renders the SHA-256 checksum.
*   **Tamper-Evident Audit Ledger Tab**: In the Admin Dashboard, add an **"Audit Trail Ledger"** tab.
    *   Renders a ledger showing actors, timestamps, actions, and hashes.
    *   Adds a **"Verify Ledger Integrity"** button displaying cryptographic check status.

---

## 3. Verification Plan

### Automated Tests
1.  **Chained Checksum Validation Test**:
    *   JUnit test validating that modifying any row details breaks the SHA-256 checksum chain and is detected by `verifyLedgerIntegrity()`.
2.  **API Simulator Test**:
    *   Test validating that invalid DPIIT registration numbers fail the verification lookup.

### Manual Verification
1.  Log in as **Startup**, upload a milestone with an attachment, and check the SHA-256 hash value.
2.  Log in as **Admin**, open the **Audit Trail Ledger** tab, and click **Verify Ledger Integrity** to verify that all blocks check out.
