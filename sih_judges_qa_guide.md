# SIH Judges Q&A Guide (Document 3)

This Q&A guide prepares you for the critical questions hackathon judges, state procurement auditors, and senior government officers will ask during your presentation.

---

## 1. Legal & Regulatory Compliance (GFR Rules)

### Q1: How does this bypass standard General Financial Rules (GFR) requiring L1 public bidding?
**A**:
> *"We do not bypass GFR; we leverage the **State Sandbox and Innovative Procurement Exemption Rules** (such as the Maharashtra State Innovative Startup Procurement rules). These guidelines authorize government departments to procure solutions up to specific financial limits (e.g. ₹15–₹20 Lakhs) directly from startups without public tenders, provided the solution has been successfully tested in a vetted sandbox pilot. The academic expert's scorecard serves as the legal audit justification for this exemption."*

### Q2: How does the platform justify "Proprietary Article Certificate" (PAC) direct buying?
**A**:
> *"Once a startup successfully finishes a sandbox pilot and receives high expert validation scores, the department documents that the startup's technology is a unique, proprietary solution suited for their specific municipal bottleneck. This allows the department to legally register the product on the GeM portal under the PAC category for direct procurement."*

---

## 2. Platform Fraud & Security Vetting

### Q3: What prevents a startup from uploading fake milestone reports to siphon off escrow money?
**A**:
> *"Escrow disbursements are not completely automated without human verification. Payouts require either the **Nodal Officer's manual approval** or the expiry of the **7-day SLA window**. Nodal officers can check the uploaded files, inspect cryptographic hashes, or demand physical audit proof before releasing a tranche. The SLA auto-approval is an administrative guardrail, not a bypass of officer authority."*

### Q4: How is startup intellectual property (IP) protected when government departments review their files?
**A**:
> *"All milestone attachments uploaded by the startup are hashed (SHA-256) and stored securely in an encrypted IP vault. Government departments only have access to review files for testing verification under the signed, pre-populated Mutual Non-Disclosure Agreement (NDA) generated on stamp paper at pilot launch, ensuring complete legal protection for the startup."*

---

## 5. Audit & Platform Tampering

### Q5: How do you prevent corruption where a nodal officer alters scores in the database to favor a startup?
**A**:
> *"All platform actions—problem creations, expert scores, pilot launches, and disbursements—are written to our **Chained Cryptographic Audit Ledger**. Each block contains a SHA-256 hash linked directly to the previous block's hash. If an officer edits a cell directly in the database to forge values, the hash chain breaks. Clicking 'Verify Ledger Integrity' immediately flags the corrupted record in red, making the system completely tamper-evident for CAG auditors."*

### Q6: Can the Admin delete audit logs to hide corruption?
**A**:
> *"No. Because each log contains the checksum of the previous entry, deleting a row would orphan the next block's checksum reference. The validation engine will immediately flag the entire ledger chain as corrupted starting from the missing block index, notifying state auditors of database manipulation."*
