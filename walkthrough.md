# GovStart - Implementation Walkthrough

We have successfully implemented and validated the build of **GovStart (Phase 1)**, a startup-friendly public procurement prototype for the Government of Maharashtra (SIH Problem Statement ID 26136).

---

## 1. Directory Structure

The project has been initialized in `/Users/tusharagarwal/.gemini/antigravity/scratch/govstart`:

*   **`/backend`**: Spring Boot 3.1.5 (Java 17) web service, JPA, Postgres integration, JWT security.
*   **`/frontend`**: React + Vite + TypeScript frontend styled with Tailwind CSS v4.

---

## 2. Technical Deliverables Completed

### A. Spring Boot Backend Services
*   **Domain Entities (`com.govstart.model`)**: Mapping `User`, `DepartmentProfile`, `StartupProfile`, `ExpertProfile`, `Problem`, `Recommendation`, `Evaluation`, `Pilot`, `PilotUpdate`, and `Decision` tables.
*   **Repositories (`com.govstart.repository`)**: Spring Data JPA repositories with custom order queries.
*   **Security & JWT Auth (`com.govstart.config`)**: Spring Security filtering, JWT generation/validation, CORS mapping.
*   **Tag Overlap & Weighted Scoring (`com.govstart.service.MatchingService`)**: Calculates tag intersection similarity, checks DPIIT registration boosts, and utilizes a **Max-Heap (Priority Queue)** to rank top startups.
*   **Gemini API Service (`com.govstart.service.MatchingService`)**: Integrates the generative API for semantic capability evaluation and outputs structured JSON justifications, falling back gracefully to mock heuristics.
*   **Jaccard Expert Matching (`com.govstart.service.ExpertService`)**: Matches experts to posted challenges using a Jaccard index on expertise areas.
*   **Database Seeder (`com.govstart.config.DatabaseSeeder`)**: Auto-seeds Super Admin, Department, three distinct Startups (EcoTech, HealthSetu, KrishiDron), and two Experts (COEP professor, VJTI professor) on startup.

### B. React Frontend App (`com.govstart.frontend`)
*   **Vite + TypeScript Setup**: Configured with Tailwind CSS v4 `@tailwindcss/vite` plugin and a proxy rule forwarding `/api` calls to the Spring Boot server (`http://localhost:8080`).
*   **Polymorphic Dashboard (`src/App.tsx`)**: Integrates separate views dynamically based on logged-in user tokens:
    *   **Quick Demo Panel**: Lets developers click a button to immediately fill and login as any pre-seeded demo user.
    *   **Department**: Form to post challenges; detail view to run matching, see AI justifications, view Jaccard expert suggestions, assign expert, inspect rating cards, and configure pilot launch metrics.
    *   **Startup**: Dashboard displaying DPIIT verification badge, matched problems list, and pilot milestone updates workspace.
    *   **Expert**: Lists a queue of challenges matching expert tags; interactive scoring form (1-5 sliders for Feasibility, Innovation, Team, Cost) and remarks section.
    *   **Admin**: Visualizes a global metrics summary (Total budget locked in escrow, problem counts) and a pipeline funnel chart.

---

## 3. Build Verification

We validated the React TypeScript client by building it for production:
```bash
npm run build
```
The build succeeded with **0 errors**:
*   `dist/index.html` (0.45 kB)
*   `dist/assets/index.css` (33.58 kB)
*   `dist/assets/index.js` (262.00 kB)

---

## 4. How to Run the Application

### Step 1: Start PostgreSQL
Create a database named `govstart` on your local PostgreSQL server on port `5432` with username `postgres` and password `postgres`.

### Step 2: Run the Backend
Set your `GEMINI_API_KEY` environment variable and run the Spring Boot service:
```bash
cd backend
mvn spring-boot:run
```
*(The seeder will automatically insert all demo users, startups, and experts on startup).*

### Step 3: Run the Frontend
Launch the React development server:
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 5. Walkthrough Demo Script (Phase 1 & Phase 2)

1.  **Open Landing Page**: Click **Department** in the **Instant Guest Login** panel to sign in instantly.
2.  **Post Challenge & Run Match**: Post a new challenge (e.g. `"Smart AI Landfill Waste Sorter"` with tags `"Waste Management, AI"`). Click **Run Re-matching** to see Jaccard + Gemini AI rankings.
3.  **Assign Expert & Submit Review**: Assign **Prof. Ravindra Kulkarni** to the challenge. Log out, sign in as **Expert Panel**, select the challenge, and submit a scorecard rating.
4.  **Launch Sandbox (Escrow Locked)**: Log back in as **Department**, view the scorecard, and click **Launch Pilot Sandbox** next to Maha-EcoTech Solutions. Enter a budget of ₹1,500,000 and click **Approve & Launch**. The Escrow Tracker will show:
    *   `Locked Escrow: ₹1,500,000`
    *   `Disbursed: ₹0`
5.  **View Legal Stamp Paper Contract**: In the pilot workspace, click the **Legal Agreements** tab. It will render a pre-populated ₹500 non-judicial stamp paper implementation contract and mutual NDA. Click **Print / Save as PDF** to open the print interface.
6.  **Log Milestones & Trigger SLA Expiry (Startup / Department)**: 
    *   Log out, log in as **Startup**. Click the active pilot and submit a milestone: `"Prototype Calibration"`, progress `40%`, and submit.
    *   Log out, log in as **Department**. In the active pilot workspace, see the pending update with the badge `SLA Timer: 7 Days Remaining`.
    *   Click **Simulate SLA Expiry**. The system automatically triggers the SLA auto-approval, releasing ₹600,000 (40% of budget) from escrow:
        *   `Locked Escrow: ₹900,000`
        *   `Disbursed: ₹600,000`
7.  **Manual Approval (Nodal Officer)**:
    *   Log out, log in as **Startup**. Submit another update: `"Full Commissioning"`, progress `100%`, and submit.
    *   Log out, log in as **Department**. Open the pilot workspace, click **Approve & Release Funds**.
    *   The remaining ₹900,000 is released, making `Disbursed = ₹1,500,000` and `Locked = ₹0`. The pilot status transitions to `PILOT_COMPLETE`.
8.  **DPIIT Startup Verification Lookup**: During startup evaluations, click on the DPIIT number link next to the startup's name in the matching list. It queries the simulated registry API to show registration, incorporation, office address, and active directors.
9.  **Milestone IP Protection Upload**: When submitting progress updates as a Startup, click **Encrypt & Upload Milestone Proof**. It simulates client-side encryption, displays the SHA-256 checksum, and saves the details to the database to preserve Intellectual Property.
10. **GeM Portal Marketplace Publishing**: In the Department Decision Form, check the box **Publish Certified Pilot Catalog to GeM Portal**. Upon submission, the platform forwards the catalog details and generates a unique GeM ID.
11. **Tamper-Evident Ledger Integrity Audit**: Log out, log in as **Admin**, and open the **Tamper-Evident Audit Ledger** tab. View the block-chained ledger, and click **Verify Ledger Integrity** to run the chained SHA-256 hash checks.

---

## 6. Phase 2 Features Added
*   **Escrow Tracker UI Component**: High-fidelity React tracker showing locked, disbursed, and total budgets in real-time.
*   **Non-Judicial Stamp Paper Agreement View**: Renders dynamic, print-ready legal templates (Maharashtra Pilot Sandbox Contract, NDA) in ₹500 stamp paper styling with `window.print()` wrappers.
*   **Milestone Escrow Payout Formula**: Automated backend calculator releasing proportional payouts: `((newProgress - oldProgress) * totalBudget) / 100`.
*   **SLA Auto-Approval Simulation Engine**: REST endpoint `/api/pilots/updates/{updateId}/sla-trigger` bypassing manual approval timelines.

---

## 7. Phase 3 Features Added
*   **Tamper-Evident Blockchain Ledger**: Built `AuditLog` tables and cryptographic checkers, chaining SHA-256 hashes: `SHA256(prevChecksum + actor + action + details)`.
*   **DPIIT Startup Registry API Simulators**: Created endpoints to query verified company records, corporate addresses, and active board directors.
*   **GeM Catalog Publishing Engine**: Hooked up department decisions to publish certified pilot solutions as GeM catalog entries.
*   **AES IP-Vault Attachment Simulator**: Tracks milestone file uploads with SHA-256 document hashing to verify file integrity.

