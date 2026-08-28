# Technical Architecture Reference (Document 1)

This reference contains the complete engineering blueprints, data schemas, API mappings, and algorithm details of the **GovStart** platform.

---

## 1. System Topology
GovStart uses a standard decoupled client-server architecture:
*   **Client**: React 18, Vite, TypeScript, Tailwind CSS v4, Lucide React icons.
*   **Server**: Java 17, Spring Boot 3.1.5, Spring Security, Hibernate ORM, Spring Data JPA.
*   **Database**: PostgreSQL 15+ (local/cloud).
*   **External Service**: Google Gemini API (REST Endpoint `gemini-1.5-flash`).

---

## 2. Database Schema (PostgreSQL Entity Mappings)

```
   ┌─────────────┐       ┌──────────────┐       ┌──────────────┐
   │    Users    ├──────►│ DeptProfiles │       │StartupProfiles│
   └──────┬──────┘       └──────┬───────┘       └──────┬───────┘
          │                     │                      │
          │                     ▼                      ▼
          │              ┌──────────────┐       ┌──────────────┐
          ├─────────────►│   Problems   │◄──────┤Recommendations
          │              └──────┬───────┘       └──────────────┘
          ▼                     ▼
   ┌─────────────┐       ┌──────────────┐
   │  AuditLogs  │       │  Evaluations │
   └─────────────┘       └──────────────┘
```

### Table: `users`
*   `id` (BigInt, PK, Serial)
*   `name` (Varchar, Name of the entity/individual)
*   `email` (Varchar, Unique, login credential)
*   `password_hash` (Varchar, BCrypt encrypted)
*   `role` (Varchar, Enum: `ADMIN`, `DEPARTMENT`, `STARTUP`, `EXPERT`)
*   `status` (Varchar, `ACTIVE` or `INACTIVE`)
*   `created_at` (Timestamp)

### Table: `problems` (Posted Challenges)
*   `id` (BigInt, PK)
*   `department_id` (BigInt, FK references `department_profiles`)
*   `title` (Varchar, Challenge title)
*   `description` (Text, Challenge details)
*   `budget_min` (Double, Minimum budget threshold)
*   `budget_max` (Double, Maximum budget threshold)
*   `timeline_days` (Integer)
*   `status` (Varchar, Enum: `POSTED`, `UNDER_EVALUATION`, `PILOT_ACTIVE`, `DECIDED`)
*   `created_at` (Timestamp)

### Table: `pilots` (Active Sandboxes)
*   `id` (BigInt, PK)
*   `problem_id` (BigInt, FK references `problems`)
*   `startup_id` (BigInt, FK references `startup_profiles`)
*   `department_id` (BigInt, FK references `department_profiles`)
*   `scope` (Text, Pilot deliverables and terms)
*   `start_date` (Date)
*   `end_date` (Date)
*   `budget` (Double, Total allocated budget)
*   `released_amount` (Double, Funds disbursed to startup)
*   `escrow_balance` (Double, Locked escrow balance)
*   `status` (Varchar, Enum: `PILOT_ACTIVE`, `PILOT_COMPLETE`, `DECIDED_SCALE`, `DECIDED_PROCURE`, `DECIDED_REJECT`)

### Table: `pilot_updates` (Milestone Logs)
*   `id` (BigInt, PK)
*   `pilot_id` (BigInt, FK references `pilots`)
*   `progress_percent` (Integer, Incremental completeness percentage)
*   `notes` (Text, Deliverable notes)
*   `milestone_name` (Varchar, E.g. "Calibration")
*   `status` (Varchar, `PENDING` or `APPROVED`)
*   `attachment_name` (Varchar, Nullable, file name)
*   `attachment_hash` (Varchar, Nullable, SHA-256 IP file hash)
*   `submitted_at` (Timestamp)

### Table: `audit_logs` (Tamper-Evident Ledger)
*   `id` (BigInt, PK)
*   `timestamp` (Timestamp)
*   `actor` (Varchar, Action executor)
*   `action` (Varchar, Action code)
*   `details` (Text, JSON or plain text data)
*   `checksum` (Varchar, Chained SHA-256 hash value)

---

## 3. Core Algorithms

### A. Semantic Matchmaking Algorithm (`com.govstart.service.MatchingService`)
1.  **Syntactic Match (Jaccard Tag Intersection)**:
    $$\text{Jaccard Score} = \frac{|T_{\text{problem}} \cap T_{\text{startup}}|}{|T_{\text{problem}} \cup T_{\text{startup}}|} \times 100$$
2.  **Semantic Match (Gemini 1.5 Flash)**:
    *   Constructs a REST payload sending the startup description and challenge outcome.
    *   Instructs Gemini via System Prompts to return a matching score (0 to 100) and a single-sentence justification.
3.  **DPIIT Verification Boost**:
    *   If `isDpiitVerified == true`, adds a $+15$ bonus points modifier to the score (capped at 100).
4.  **Final Weighting**:
    $$\text{Final Score} = (0.4 \times \text{Jaccard Score}) + (0.6 \times \text{Gemini Score})$$
5.  **Sorting**: Startups are fed into a **Max-Heap (Priority Queue)** to retrieve the top matches.

### B. Cryptographic Blockchain Chaining (`com.govstart.service.AuditLogService`)
When `logAction(actor, action, details)` is triggered:
1.  Fetch previous log row (`lastLog`) ordered by ID descending.
2.  Get `prevHash = lastLog.getChecksum()`. (If first log, uses constant `"GENESIS_BLOCK_HASH"`).
3.  Compute current hash:
    $$\text{Checksum} = \text{SHA-256}(\text{prevHash} + \text{actor} + \text{action} + \text{details})$$
4.  Save log row.

---

## 4. REST API Endpoint Catalog

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | POST | Public | Authenticates credentials, returns JWT. |
| `/api/problems` | POST | `DEPARTMENT` | Creates a new outcome challenge. |
| `/api/problems/{id}/recommendations`| GET | `DEPARTMENT` | Runs Gemini matchmaking engine. |
| `/api/evaluations` | POST | `EXPERT` | Submits scoring scorecard. |
| `/api/pilots` | POST | `DEPARTMENT` | Launches sandbox, locks escrow. |
| `/api/pilots/updates/{id}/approve` | POST | `DEPARTMENT` | Manually disburses escrow tranches. |
| `/api/pilots/updates/{id}/sla-trigger`| POST | Public | Simulates 7-day auto-approval trigger. |
| `/api/integration/dpiit/{number}` | GET | Public | Queries simulated DPIIT registration registry. |
| `/api/integration/gem/publish` | POST | `DEPARTMENT` | Registers sandbox winner to GeM marketplace. |
| `/api/integration/audit-logs` | GET | `ADMIN` | Fetches audit trail transaction logs. |
| `/api/integration/audit-logs/verify` | POST | `ADMIN` | Runs SHA-256 chain validation on ledger. |
