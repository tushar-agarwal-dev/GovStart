# Product Walkthrough & Live Presentation Script (Document 2)

This document contains step-by-step click-by-click instructions, script transcripts, and product value flows to present GovStart to SIH judges.

---

## 1. Problem Solver Mapping: How GovStart Solves SIH 26136

| Current Procurement Bottleneck | How GovStart Solves It |
| :--- | :--- |
| **GFR L1 Rule Traps Startups** | routes purchases through **Maharashtra State Sandbox Exemption Rules**, bypassing open price tenders for tested solutions. |
| **Rigid Spec-Writing Filters Innovation** | Replaced by **Outcome Challenge Forms** where officers describe *what* goals they need, not *which* model to buy. |
| **Lack of Technical Expertise in Dept** | Vetted through **Academic Expert scorecards** (COEP/VJTI) using quantitative technical readiness criteria. |
| **Contract Delays and Delayed Payments** | Handled through **Escrow accounts** locking pilot funds and **7-day SLA auto-approvals** to release tranches. |

---

## 2. Step-by-Step Click Guide & Live Script

### Step 1: Login & Challenge Posting
*   **Action**:
    1.  Go to `http://localhost:5173`.
    2.  In the **Instant Guest Login** panel, click **Department**.
    3.  Click **Post Outcome Challenge** in the sidebar.
    4.  Fill the form:
        *   Title: `Smart AI Landfill Waste Sorter`
        *   Description: `Automated waste sorting and organic decomposition sandbox at Shivaji Nagar community landfill.`
        *   Budget: Min `800000`, Max `2000000`
        *   Timeline: `120` days
        *   Tags: Enter `Waste Management, AI` (comma separated)
    5.  Click **Submit Challenge**.
*   **What to Say**:
    > *"We begin by logging in as the Department Nodal Officer. Instead of drafting a rigid 50-page tender specification that would automatically disqualify startups, the officer posts a simple 'Outcome Challenge'. We specify the goal: automated waste sorting, our budget, and tags. This immediately publishes the challenge to the startup matching queue."*

---

### Step 2: Running AI Matchmaking & DPIIT Verification
*   **Action**:
    1.  Select the newly created challenge `Smart AI Landfill Waste Sorter` from the list.
    2.  Click **Run Re-matching**.
    3.  Click the blue **DPIIT Registration Number** link (e.g. `DPIIT-893021` or similar) next to *Maha-EcoTech Solutions*.
    4.  Show the verified popover displaying active directors, incorporate date, and address. Click **Close Verification**.
*   **What to Say**:
    > *"Now we run our dual-engine matching algorithm. The system computes a tag intersection score and makes a semantic REST API call to Google Gemini 1.5 Flash. Gemini evaluates the startup's capabilities and returns an AI assessment justifying the matching ranking. Next, the officer can verify the startup's credentials instantly by clicking their DPIIT registration number, which queries the state's startup registry database in real-time."*

---

### Step 3: Crowdsourced Expert Vetting
*   **Action**:
    1.  Click **Assign Expert** next to *Prof. Ravindra Kulkarni (COEP)*.
    2.  Log out by clicking **Log Out** in the top navbar.
    3.  Click **Expert Panel** in the Instant Guest Login panel.
    4.  Select the challenge `Smart AI Landfill Waste Sorter` from the pending queue.
    5.  Adjust the score sliders: *Feasibility = 5*, *Innovation = 5*, *Team = 4*, *Cost = 4*.
    6.  Enter Comments: *"Vetted technology. Extremely viable for landfill deployment."* and click **Submit Scorecard**.
*   **What to Say**:
    > *"To eliminate administrative bias and ensure technical validation, we assign an independent academic expert—in this case, Prof. Kulkarni from COEP. The professor logs in, accesses his pending queue, and submits a quantitative scorecard rating the startup's feasibility and cost metrics. This scorecard serves as the legal audit justification for the department."*

---

### Step 4: Sandbox Escrow Lock & Stamp Paper NDA
*   **Action**:
    1.  Log out, log back in as **Department**.
    2.  Select the challenge, review the expert scorecard, and click **Launch Pilot Sandbox**.
    3.  In the modal, enter scope: *"Deploy 2 waste sorter units at Shivaji Nagar landfill."*, budget: `1500000`, dates, and click **Approve & Launch**.
    4.  In the active pilot workspace, show the **Escrow Tracker** block on the header.
    5.  Click the **Legal Agreements** tab. Scroll through the generated non-judicial stamp paper contract. Click **Print / Save as PDF**.
*   **What to Say**:
    > *"Once the scorecard is approved, we launch the Pilot Sandbox. At launch, the ₹15 Lakhs budget is locked in our secure simulated escrow account. We also dynamically generate a secure Mutual NDA and Sandbox Pilot Contract on a ₹500 Government of Maharashtra non-judicial stamp paper layout, which can be printed or saved directly as a PDF."*

---

### Step 5: Startup Milestone Upload & SLA Auto-Approval
*   **Action**:
    1.  Log out, log in as **Startup** (Maha-EcoTech Solutions).
    2.  Click the active pilot under **Active Sandbox Workspace**.
    3.  Enter: milestone name: *"Landfill Commissioning"*, progress: `40%`, notes: *"Initial structures erected."*
    4.  Click **Encrypt & Upload Milestone Proof**. Point to the green shield and SHA-256 hash. Click **Submit Update**.
    5.  Log out, log in as **Department**. Open the active pilot workspace.
    6.  Point to the pending milestone showing the `SLA Timer: 7 Days` warning.
    7.  Click **Simulate SLA Expiry**. Point to the updated Escrow Tracker showing `Locked: ₹900,000` and `Disbursed: ₹600,000`.
*   **What to Say**:
    > *"The startup logs progress inside the workspace. To protect intellectual property, they encrypt milestone documents on upload, generating a SHA-256 hash. To bypass government red tape, we built an SLA auto-approval trigger. If the department fails to review a milestone within 7 days, the system automatically approves it and releases the proportional fund tranche from escrow."*

---

### Step 6: Final Decision & GeM Cataloging
*   **Action**:
    1.  In the active pilot workspace sidebar, select **Procure (Compliant Procurement)** as the decision.
    2.  Enter remarks: *"Successful sandbox completion. SLA met."*
    3.  Check the box **Publish Certified Pilot Catalog to GeM Portal**.
    4.  Click **Submit Decision**.
*   **What to Say**:
    > *"Once the pilot hits 100% completion, the Nodal Officer makes the final decision to procure. By checking this box, the platform automatically publishes the successful sandbox solution directly to the Government e-Marketplace (GeM) portal as a certified vendor catalog, concluding a seamless innovation-to-procurement journey."*
