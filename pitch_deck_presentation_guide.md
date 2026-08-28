# GovStart: SIH Presentation Guide & Deployment Manual

This guide contains everything you need to deploy the platform, structure your presentation slides, answer tough judge questions, and run a high-impact live demo.

> [!TIP]
> You can print or save this document as a PDF in your browser or Markdown editor to use as a printout during your presentation.

---

## 1. Deployment & Configuration Checklist
Before presenting, ensure these parameters are configured correctly:

### Backend Configuration (`backend/src/main/resources/application.properties`)
*   **Database Credentials**:
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/govstart
    spring.datasource.username=postgres
    spring.datasource.password=postgres
    spring.jpa.hibernate.ddl-auto=update
    ```
*   **Gemini API Key**: Ensure you have exported the key in your terminal before starting the backend:
    ```bash
    export GEMINI_API_KEY="your-actual-api-key-here"
    ```
*   **JWT Secret Key**: Modify the JWT secret signature in the application configs if deploying to a cloud server to secure the tokens.

### Frontend Configuration (`frontend/vite.config.ts`)
*   **Port Mapping**: The React Vite application runs on port `5173`.
*   **Proxy Configuration**: Ensure Vite proxy is enabled to forward `/api` calls to `http://localhost:8080` (Spring Boot).

---

## 2. Key Innovation & Technical Value Points
Make sure to emphasize these **4 unique technical pillars** in your slides to differentiate your project from basic CRUD portals:

1.  **GFR Legal Exemption Framework**: Bypasses GFR "L1 (Lowest Bidder)" bidding wars by routing purchases through Maharashtra State Startup Sandbox Exemption rules.
2.  **Semantic Matchmaking**: Uses Jaccard tag intersection ratios paired with Google Gemini AI to analyze startup capability statement texts rather than just matching simple keywords.
3.  **Simulated Escrow Milestones**: Prevents payment delays by locking the pilot budget in escrow and releasing payments proportionally: `payout = (progress_delta * budget) / 100`.
4.  **Tamper-Evident SHA-256 Audit Trail**: Chains all transaction block checksums together in a database ledger. Modifying any cell directly in the DB breaks the cryptographic chain, making the ledger tamper-evident.

---

## 3. High-Impact Live Demo Script
Assign roles to your team members and follow this script during the live presentation:

### Part A: The Department Role (Goal Definition & Selection)
*   **What to Show**:
    1.  Log in as **Department** ( Shivaji Nagar Urban Nodal Officer).
    2.  Click **Post Outcome Challenge**.
    3.  Enter a real outcome need: *"Smart AI Landfill Waste Sorter"* with tags: *"AI, Waste Management, Recycling"*.
    4.  Open the challenge and click **Run Re-matching**.
    5.  Show the ranked startups and the **AI Assessment** box justifying why *Maha-EcoTech Solutions* was ranked first.
*   **What to Say**:
    > *"Traditional tenders require specific brand names and turnover criteria, which locks out startups. In GovStart, the officer describes the outcome challenge. Our platform automatically queries our startup registry and uses Jaccard tags and Gemini AI to semantically match the best startups, ranking them by actual technical capability instead of company size."*

---

### Part B: Nodal Expert Vetting & Verification
*   **What to Show**:
    1.  In the recommendation list, click the **DPIIT Registration Number** link (e.g. `DPIIT-893021`) next to the startup's name.
    2.  Show the verified popup displaying incorporation dates, official addresses, and active directors fetched from the simulated registry API.
    3.  Assign **Prof. Ravindra Kulkarni** (COEP) as the evaluator.
    4.  Log out, log in as **Expert Panel**.
    5.  Open the challenge, adjust the evaluation sliders (Feasibility, Innovation, Team, Cost), write technical remarks, and submit.
*   **What to Say**:
    > *"To prevent corruption and protect government officers from procurement audit blame, we crowdsource technical vetting to independent academic experts from premium institutes like COEP and VJTI. The expert submits an objective, multi-dimensional scorecard validating the startup's technical readiness."*

---

### Part C: The Sandbox Workspace & Legal Agreements
*   **What to Show**:
    1.  Log back in as **Department**. Open the challenge, review the expert scorecard, and click **Launch Pilot Sandbox**.
    2.  Define the budget as ₹1,500,000, set dates, and click **Approve & Launch**.
    3.  Open the **Pilot Sandbox Workspace** and show the **Escrow Tracker** displaying:
        *   `Locked Escrow: ₹1,500,000` | `Disbursed: ₹0`
    4.  Click the **Legal Agreements** tab to display the dynamically generated contract on a ₹500 non-judicial stamp paper layout. Click **Print / Save as PDF**.
*   **What to Say**:
    > *"At pilot launch, the sandbox budget is locked in our platform's secure simulated escrow account. This guarantees the startup they will get paid immediately upon completing milestones. We also auto-generate standardized legal NDAs and Sandbox agreements on official stamp paper, cutting down contract negotiation times from months to seconds."*

---

### Part D: Milestone Submissions & SLA Auto-Approvals
*   **What to Show**:
    1.  Log out, log in as **Startup**. Click the active pilot sandbox.
    2.  Enter milestone: *"Prototype Assembly"*, progress: `40%`.
    3.  Click **Encrypt & Upload Milestone Proof**. Show the green shield indicating encryption and the generated SHA-256 document hash. Submit the update.
    4.  Log out, log back in as **Department**. In the workspace, point to the pending milestone showing the badge: `SLA Timer: 7 Days Remaining`.
    5.  Click **Simulate SLA Expiry**. Point to the updated Escrow Tracker showing:
        *   `Locked Escrow: ₹900,000` | `Disbursed: ₹600,000`
*   **What to Say**:
    > *"Startups submit milestone deliverables inside their secure workspace. To protect their intellectual property, attachments are encrypted and tracked via SHA-256 document hashes. To prevent red tape, we implement SLA Auto-Approvals: if a nodal officer leaves a milestone unreviewed for 7 days, the system auto-approves it and releases the corresponding payment portion from escrow."*

---

### Part E: Audit Trail & Integrity Check (The Climax)
*   **What to Show**:
    1.  Log out, log in as **Admin**.
    2.  Open the **Tamper-Evident Audit Ledger** tab.
    3.  Click **Verify Ledger Integrity** to show the green "Ledger Verified" banner.
    4.  *Optional Live Tampering*: Run the SQL update query in your terminal, refresh, and click verification again to show the red tampering corruption alert.
*   **What to Say**:
    > *"Finally, all platform actions—posted challenges, expert scorecards, escrow releases, and GeM market listings—are written to a cryptographically chained ledger. Each block contains a SHA-256 hash linked to the previous transaction. If an intruder attempts to modify the database records directly, our verification engine detects the broken chain instantly. This ensures 100% auditability for state audit teams."*

---

## 4. How to Handle Tough Judge Questions

| Tough Judge Question | Your Winning Answer |
| :--- | :--- |
| **"How is this legally compliant under GFR (General Financial Rules)?"** | *"Under the Maharashtra State Startup Policy and Sandbox Framework, departments are authorized to allocate sandbox budgets up to ₹15 Lakhs for pilot testing. The academic scorecard serves as the legal justification to bypass standard GFR L1 bidding and issue a proprietary purchase catalog."* |
| **"Startups can upload dummy files. How do you verify progress?"** | *"Milestone approvals are vetted by the Nodal Officer. The file attachment system serves to secure IP and verify that file contents have not been altered (by comparing the stored SHA-256 hash). Phase 2 can integrate IoT telemetry or academic expert site audits."* |
| **"What if the department objects to the SLA auto-approval?"** | *"The 7-day SLA is configurable by the admin. Nodal officers receive automated notifications daily. Auto-approval ensures that startups do not suffer cash flow issues due to administrative delays."* |
| **"How does the AI matching prevent bias?"** | *"Gemini AI does not select the final startup; it only provides semantic matching scores and technical justifications based on capabilities. The final pilot selection requires independent academic expert scoring and nodal officer approval."* |
