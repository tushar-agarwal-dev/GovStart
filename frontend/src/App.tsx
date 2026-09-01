import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  LogOut, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  BarChart3, 
  Clock, 
  Award, 
  ChevronRight, 
  Cpu, 
  Lock, 
  FileCode
} from 'lucide-react';

// Types
interface AuthState {
  token: string;
  email: string;
  role: 'DEPARTMENT' | 'STARTUP' | 'EXPERT' | 'ADMIN';
  userId: number;
  name: string;
}

interface KPIItem {
  id?: string;
  name: string;
  description: string;
  baseline: string;
  target: string;
  current?: string;
  unit: string;
  method: string;
  frequency: string;
  weight: number;
  status?: 'ACHIEVED' | 'IN_PROGRESS' | 'PENDING';
}

interface MilestoneItem {
  name: string;
  target: string;
  criteria: string;
  paymentPercentage: number;
  status?: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
}

interface Problem {
  id: number;
  departmentId: number;
  departmentName: string;
  title: string;
  description: string;
  tags: string[];
  budgetMin: number;
  budgetMax: number;
  timelineDays: number;
  status: string;
  createdAt: string;

  // Extended fields
  category?: string;
  location?: string;
  contactPerson?: string;
  currentProblem?: string;
  existingProcess?: string;
  targetBeneficiaries?: string;
  desiredOutcome?: string;
  baselinePerformance?: string;
  targetPerformance?: string;
  expectedImpact?: string;
  geographicScope?: string;
  dpiitRequired?: boolean;
  techRequirements?: string;
  minCriteria?: string;
  evaluationWeightsJson?: string;
  kpisJson?: string;
  milestonesJson?: string;
  eligibilityRequirements?: string;
}

interface Recommendation {
  id: number;
  problem: { id: number; title: string };
  startup: { id: number; companyName: string; description: string; domain?: string; tags: string[]; isDpiitVerified: boolean; dpiitNumber: string };
  ruleScore: number;
  llmScore: number;
  finalWeightedScore: number;
  llmJustification: string;
  rankPosition: number;
}


interface Pilot {
  id: number;
  problemId: number;
  problemTitle: string;
  startupId: number;
  startupName: string;
  departmentId: number;
  departmentName: string;
  scope: string;
  startDate: string;
  endDate: string;
  budget: number;
  releasedAmount?: number;
  escrowBalance?: number;
  status: string;
  currentProgress: number;
  createdAt: string;

  // Extended contract & validation fields
  deptSigned?: boolean;
  startupSigned?: boolean;
  signedAt?: string;
  contractTermsJson?: string;
  validatorName?: string;
  validationStatus?: string;
  kpiCurrentValuesJson?: string;
}

interface PilotUpdate {
  id: number;
  progressPercent: number;
  notes: string;
  milestoneName: string;
  status: string;
  attachmentName?: string;
  attachmentHash?: string;
  submittedAt: string;

  // Extended validation fields
  kpiMeasurementsJson?: string;
  evidenceRef?: string;
  validationStatus?: string;
  validatorComments?: string;
  validatedAt?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface Analytics {
  problemStatuses: { [key: string]: number };
  totalProblems: number;
  totalPilots: number;
  totalBudgetLocked: number;
}

interface AuditLog {
  id: number;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  checksum: string;
}

export default function App() {
  // Navigation & Auth
  const [auth, setAuth] = useState<AuthState | null>(() => {
    const saved = localStorage.getItem('govstart_auth');
    return saved ? JSON.parse(saved) : null;
  });
  const [view, setView] = useState<string>('landing');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Forms
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerForm, setRegisterForm] = useState({
    name: '', email: '', password: '', role: 'STARTUP' as any,
    deptName: '', deptAddress: '', deptContactPerson: '',
    companyName: '', startupDescription: '', startupDomain: '', startupTagsString: '', teamSize: 5, foundedYear: 2024, dpiitNumber: '',
    expertDomain: '', expertDesignation: '', expertTagsString: ''
  });

  // Entities state
  const [problems, setProblems] = useState<Problem[]>([]);
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [activePilot, setActivePilot] = useState<Pilot | null>(null);
  const [pilotUpdates, setPilotUpdates] = useState<PilotUpdate[]>([]);
  const [expertQueue, setExpertQueue] = useState<Problem[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [adminAnalytics, setAdminAnalytics] = useState<Analytics | null>(null);

  // FEATURE 1: 6-Step Challenge Creation Wizard State
  const [createStep, setCreateStep] = useState<number>(1);
  const [wizardForm, setWizardForm] = useState({
    title: 'AI-Based Smart Landfill & Organics Waste Sorter',
    department: 'Urban Development & Municipal Cleanliness Department',
    contactPerson: 'Shri Ramesh Patil (Nodal Officer)',
    category: 'Waste Management & CleanTech',
    location: 'Shivaji Nagar Landfill, District Nanded',
    description: 'Deploys an automated multispectral vision & robotic sorting system to separate municipal solid waste into organic and recyclable streams at the dumping site.',
    currentProblem: 'Manual sorting at municipal dumping sites is unsafe, slow, and achieves less than 35% segregation efficiency, causing landfill fires and environmental contamination.',
    existingProcess: 'Manual labor teams sorting mixed waste using basic conveyors without automated detection or sensor analytics.',
    targetBeneficiaries: '350,000 citizens of Nanded Municipality and local sanitation worker teams.',
    desiredOutcome: 'Automated 90%+ segregation accuracy of organic waste at landfill entry within 48 hours of dumping.',
    baselinePerformance: '35% manual segregation accuracy, 15-day processing lag per batch.',
    targetPerformance: '90%+ automated segregation accuracy, under 48-hour batch processing.',
    expectedImpact: 'Elimination of landfill methane fires, 60% reduction in landfill volume, and high-purity organic compost generation.',
    timelineDays: 120,
    geographicScope: 'Shivaji Nagar Landfill & Ward 12 Transfer Station',
    dpiitRequired: true,
    techRequirements: 'Edge AI computer vision cameras, robotic pneumatics, IP65 ruggedized enclosures, cloud dashboard integration.',
    minCriteria: 'Startup must possess working functional prototype, minimum 1 deployment, and valid DPIIT registration.',
    budgetMin: 800000,
    budgetMax: 1500000,
    evalWeights: { feasibility: 30, innovation: 20, scalability: 20, impact: 20, risk: 10 }
  });

  const [kpiList, setKpiList] = useState<KPIItem[]>([
    { name: 'Segregation Accuracy', description: 'Purity % of separated organic stream', baseline: '35%', target: '90%', unit: '%', method: 'Lab Sampling', frequency: 'Daily', weight: 40 },
    { name: 'Processing Time per Ton', description: 'Minutes to sort 1 metric ton of mixed waste', baseline: '120 min', target: '25 min', unit: 'min', method: 'Sensor Logs', frequency: 'Continuous', weight: 30 },
    { name: 'Landfill Diverted Volume', description: 'Volume % diverted away from main dump slope', baseline: '10%', target: '60%', unit: '%', method: 'Weighbridge Metrics', frequency: 'Weekly', weight: 30 }
  ]);

  const [milestoneList] = useState<MilestoneItem[]>([
    { name: 'Milestone 1: Site Setup & Equipment Erection', target: 'Day 30', criteria: 'Enclosure setup & vision sensor installation', paymentPercentage: 25 },
    { name: 'Milestone 2: Calibration & Initial Sorting Runs', target: 'Day 60', criteria: '50 tons sorted with >75% accuracy', paymentPercentage: 35 },
    { name: 'Milestone 3: Full Capacity Operation & Independent Validation', target: 'Day 120', criteria: 'Continuous 90%+ sorting accuracy & independent expert sign-off', paymentPercentage: 40 }
  ]);

  // FEATURE 2: Explainable AI Match & Scorecard State
  const [activeMatchingStep, setActiveMatchingStep] = useState<number>(6);
  const [selectedMatchStartup, setSelectedMatchStartup] = useState<Recommendation | null>(null);

  // FEATURE 3: E-Signature Contract State
  const [contractTab, setContractTab] = useState<'nda' | 'pilot-agreement' | 'privacy' | 'ip' | 'cybersecurity'>('pilot-agreement');
  const [contractSignedDept, setContractSignedDept] = useState(false);
  const [contractSignedStartup, setContractSignedStartup] = useState(false);
  const [selectedContractRec, setSelectedContractRec] = useState<Recommendation | null>(null);

  // FEATURE 4: Active Pilot KPI Tracker & Independent Validation State
  const [kpiUpdateValues, setKpiUpdateValues] = useState<{ [key: string]: string }>({});
  const [evidenceRefInput, setEvidenceRefInput] = useState('');
  const [validatorNameInput] = useState('Prof. Ravindra Kulkarni (COEP Tech)');
  const [validatorCommentsInput, setValidatorCommentsInput] = useState('');

  // Modals & Misc
  const [adminTab, setAdminTab] = useState<'overview' | 'audit'>('overview');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [ledgerIntegrity, setLedgerIntegrity] = useState<{ verified: boolean; corruptedLogId: number | null; totalChecked: number } | null>(null);
  const [selectedDpiitData, setSelectedDpiitData] = useState<{ dpiitNumber: string; incorporationDate: string; category: string; registeredAddress: string; directors: string[]; status: string } | null>(null);
  const [publishToGem, setPublishToGem] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; hash: string } | null>(null);
  const [showDpiitModal, setShowDpiitModal] = useState(false);

  // Forms
  const [progressPercent, setProgressPercent] = useState(0);
  const [milestoneName, setMilestoneName] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');
  const [decisionType, setDecisionType] = useState('SCALE');
  const [decisionRemarks, setDecisionRemarks] = useState('');
  const [evalScores, setEvalScores] = useState({ feasibility: 4, innovation: 4, team: 4, cost: 4, comments: '' });

  // API Helper
  const API_BASE = import.meta.env.VITE_API_BASE || 'https://govstart-backend.onrender.com';

  const apiFetch = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    if (auth?.token) {
      headers.set('Authorization', `Bearer ${auth.token}`);
    }
    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const config = { ...options, headers };
    try {
      const response = await fetch(`${API_BASE}${url}`, config);
      if (response.status === 401 || response.status === 403) {
        handleLogout();
        showToast('Session expired. Please log in again.', 'error');
        throw new Error('Unauthorized');
      }
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Network request failed');
      }
      return await response.json();
    } catch (e: any) {
      throw e;
    }
  };

  // Toast utility
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // On Auth Change / App Load
  useEffect(() => {
    if (auth) {
      localStorage.setItem('govstart_auth', JSON.stringify(auth));
      loadDashboardData();
    } else {
      localStorage.removeItem('govstart_auth');
    }
  }, [auth]);

  const loadDashboardData = async () => {
    try {
      if (!auth) return;
      if (auth.role === 'DEPARTMENT' || auth.role === 'STARTUP') {
        const list = await apiFetch('/api/problems');
        setProblems(list);
        const pilotList = await apiFetch('/api/pilots');
        setPilots(pilotList);
      } else if (auth.role === 'EXPERT') {
        const queue = await apiFetch('/api/evaluations/queue');
        setExpertQueue(queue);
      } else if (auth.role === 'ADMIN') {
        const users = await apiFetch('/api/admin/users');
        setAdminUsers(users);
        const stats = await apiFetch('/api/admin/analytics');
        setAdminAnalytics(stats);
        const logs = await apiFetch('/api/integration/audit-logs');
        setAuditLogs(logs);
      }
    } catch (e) {}
  };

  const handleLogout = () => {
    setAuth(null);
    setView('landing');
    showToast('Logged out successfully.');
  };

  // Auto-fill credential helper
  const fillCredentials = (roleKey: 'dept' | 'startup' | 'expert' | 'admin') => {
    if (roleKey === 'admin') {
      setLoginEmail('admin@govstart.gov.in');
      setLoginPassword('AdminPass_GovStart_2026!');
    } else if (roleKey === 'dept') {
      setLoginEmail('dept@govstart.gov.in');
      setLoginPassword('DeptPass_GovStart_2026!');
    } else if (roleKey === 'startup') {
      setLoginEmail('ecotech@startups.in');
      setLoginPassword('StartupPass_GovStart_2026!');
    } else if (roleKey === 'expert') {
      setLoginEmail('kulkarni@coep.ac.in');
      setLoginPassword('ExpertPass_GovStart_2026!');
    }
  };

  // Auth: Submit Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      setAuth(result);
      setView('dashboard');
      showToast(`Welcome back, ${result.name}!`);
    } catch (err: any) {
      showToast('Invalid credentials. Please try again.', 'error');
    }
  };

  // Auth: Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let tagsArray: string[] = [];
      if (registerForm.role === 'STARTUP' && registerForm.startupTagsString) {
        tagsArray = registerForm.startupTagsString.split(',').map(t => t.trim()).filter(Boolean);
      } else if (registerForm.role === 'EXPERT' && registerForm.expertTagsString) {
        tagsArray = registerForm.expertTagsString.split(',').map(t => t.trim()).filter(Boolean);
      }

      await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: registerForm.name,
          email: registerForm.email,
          password: registerForm.password,
          role: registerForm.role,
          deptName: registerForm.deptName,
          deptAddress: registerForm.deptAddress,
          deptContactPerson: registerForm.deptContactPerson,
          companyName: registerForm.companyName,
          startupDescription: registerForm.startupDescription,
          startupDomain: registerForm.startupDomain,
          startupTags: tagsArray,
          teamSize: registerForm.teamSize,
          foundedYear: registerForm.foundedYear,
          dpiitNumber: registerForm.dpiitNumber,
          expertDomain: registerForm.expertDomain,
          expertDesignation: registerForm.expertDesignation,
          expertTags: tagsArray
        })
      });

      showToast('Account created successfully! Please log in.');
      setView('login');
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
    }
  };

  // FEATURE 1: 6-Step Challenge Creation Submit
  const handlePublishChallenge = async () => {
    try {
      const payload = {
        title: wizardForm.title,
        description: wizardForm.description,
        tags: [wizardForm.category, 'Waste Management', 'AI', 'Recycling'],
        budgetMin: wizardForm.budgetMin,
        budgetMax: wizardForm.budgetMax,
        timelineDays: wizardForm.timelineDays,
        category: wizardForm.category,
        location: wizardForm.location,
        contactPerson: wizardForm.contactPerson,
        currentProblem: wizardForm.currentProblem,
        existingProcess: wizardForm.existingProcess,
        targetBeneficiaries: wizardForm.targetBeneficiaries,
        desiredOutcome: wizardForm.desiredOutcome,
        baselinePerformance: wizardForm.baselinePerformance,
        targetPerformance: wizardForm.targetPerformance,
        expectedImpact: wizardForm.expectedImpact,
        geographicScope: wizardForm.geographicScope,
        dpiitRequired: wizardForm.dpiitRequired,
        techRequirements: wizardForm.techRequirements,
        minCriteria: wizardForm.minCriteria,
        evaluationWeightsJson: JSON.stringify(wizardForm.evalWeights),
        kpisJson: JSON.stringify(kpiList),
        milestonesJson: JSON.stringify(milestoneList),
        eligibilityRequirements: wizardForm.minCriteria
      };

      const created = await apiFetch('/api/problems', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      showToast(`Challenge ID #${created.id} published successfully to matching engine!`);
      loadDashboardData();
      setView('dashboard');
    } catch (e: any) {
      showToast(e.message || 'Failed to publish challenge', 'error');
    }
  };

  // View Problem Details / AI Discovery
  const viewProblemDetails = async (problem: Problem) => {
    setActiveProblem(problem);
    setView('matching');
    setActiveMatchingStep(1);

    // Sequence active processing steps for UI feedback
    setTimeout(() => setActiveMatchingStep(2), 400);
    setTimeout(() => setActiveMatchingStep(3), 800);
    setTimeout(() => setActiveMatchingStep(4), 1200);
    setTimeout(() => setActiveMatchingStep(5), 1600);
    setTimeout(() => setActiveMatchingStep(6), 2000);

    try {
      const recs = await apiFetch(`/api/problems/${problem.id}/recommendations`);
      setRecommendations(recs);
      if (recs.length > 0) setSelectedMatchStartup(recs[0]);
    } catch (e) {}
  };

  // Trigger matching manually
  const triggerMatching = async (problemId: number) => {
    try {
      showToast('Running algorithms & Gemini semantic evaluation...');
      const recs = await apiFetch(`/api/problems/${problemId}/recommendations`, { method: 'POST' });
      setRecommendations(recs);
      if (recs.length > 0) setSelectedMatchStartup(recs[0]);
      showToast('Recommendations matching completed!');
    } catch (e) {}
  };

  // FEATURE 3: Open Contract Generation Stage
  const openContractStage = (rec: Recommendation) => {
    setSelectedContractRec(rec);
    setContractSignedDept(false);
    setContractSignedStartup(false);
    setContractTab('pilot-agreement');
    setView('contract');
  };

  // Sign Contract (Dept / Startup)
  const handleSignContract = (party: 'dept' | 'startup') => {
    if (party === 'dept') {
      setContractSignedDept(true);
      showToast('Department Nodal Representative signature applied!');
    } else {
      setContractSignedStartup(true);
      showToast('Startup CEO / Authorized Officer signature applied!');
    }
  };

  // Launch Pilot Sandbox after Contract Signature
  const submitLaunchPilotFromContract = async () => {
    if (!selectedContractRec || !activeProblem) return;
    try {
      const payload = {
        problemId: activeProblem.id,
        startupId: selectedContractRec.startup.id,
        scope: activeProblem.desiredOutcome || `Deployment of sandbox pilot for: ${activeProblem.title}`,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + (activeProblem.timelineDays || 120) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        budget: activeProblem.budgetMax || 1500000
      };
      const pilot = await apiFetch('/api/pilots', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      // Sign contract on backend
      await apiFetch(`/api/pilots/${pilot.id}/sign-contract?role=DEPARTMENT`, { method: 'POST' });
      await apiFetch(`/api/pilots/${pilot.id}/sign-contract?role=STARTUP`, { method: 'POST' });

      showToast('Escrow budget locked & Sandbox Pilot activated!');
      loadDashboardData();
      viewPilotWorkspace(pilot);
    } catch (e: any) {
      showToast(e.message || 'Failed to launch pilot', 'error');
    }
  };

  // View Pilot Workspace (FEATURE 4: KPI Dashboard & Validation)
  const viewPilotWorkspace = async (pilot: Pilot) => {
    setActivePilot(pilot);
    setView('pilot-workspace');
    setProgressPercent(pilot.currentProgress);
    setMilestoneName('');
    setUpdateNotes('');
    setEvidenceRefInput('');
    setValidatorCommentsInput('');

    try {
      const updates = await apiFetch(`/api/pilots/${pilot.id}/updates`);
      setPilotUpdates(updates);

      // Parse KPI values if present
      if (pilot.kpiCurrentValuesJson) {
        try {
          setKpiUpdateValues(JSON.parse(pilot.kpiCurrentValuesJson));
        } catch (e) {}
      }
    } catch (e) {}
  };

  // Startup: submit progress update with KPI measurements
  const handleSubmitProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePilot) return;
    try {
      const payload = {
        progressPercent: Number(progressPercent),
        notes: updateNotes,
        milestoneName: milestoneName || `Milestone ${pilotUpdates.length + 1}`,
        attachmentName: uploadedFile?.name || 'Milestone_Deliverable_Proof.pdf',
        attachmentHash: uploadedFile?.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        kpiMeasurementsJson: JSON.stringify(kpiUpdateValues),
        evidenceRef: evidenceRefInput || 'REF-DOC-98231'
      };

      await apiFetch(`/api/pilots/${activePilot.id}/updates`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      showToast('Milestone proof & KPI measurements submitted for validation!');
      setUploadedFile(null);
      const updatedPilot = await apiFetch(`/api/pilots/${activePilot.id}`);
      setActivePilot(updatedPilot);
      const updates = await apiFetch(`/api/pilots/${activePilot.id}/updates`);
      setPilotUpdates(updates);
    } catch (e: any) {
      showToast(e.message || 'Failed to submit milestone update', 'error');
    }
  };

  // FEATURE 4: Independent Validation Submission
  const handleValidateMilestone = async (updateId: number, status: 'VALIDATED' | 'REJECTED') => {
    if (!activePilot) return;
    try {
      await apiFetch(`/api/pilots/updates/${updateId}/validate?validatorName=${encodeURIComponent(validatorNameInput)}&status=${status}`, {
        method: 'POST',
        body: validatorCommentsInput || 'Independent technical validation completed successfully.'
      });

      if (status === 'VALIDATED') {
        // Automatically disburse escrow tranche upon validation
        await apiFetch(`/api/pilots/updates/${updateId}/approve`, { method: 'POST' });
        showToast('Milestone validated by Independent Expert & Escrow tranche released!');
      } else {
        showToast('Milestone validation rejected.', 'error');
      }

      const updatedPilot = await apiFetch(`/api/pilots/${activePilot.id}`);
      setActivePilot(updatedPilot);
      const updates = await apiFetch(`/api/pilots/${activePilot.id}/updates`);
      setPilotUpdates(updates);
    } catch (e: any) {
      showToast(e.message || 'Failed to validate milestone', 'error');
    }
  };

  // DPIIT Verification Popup
  const checkDpiitRegistry = async (number: string) => {
    try {
      const data = await apiFetch(`/api/integration/dpiit/${number}`);
      setSelectedDpiitData(data);
      setShowDpiitModal(true);
    } catch (e) {}
  };

  // Audit Ledger Integrity Check
  const verifyLedgerIntegrity = async () => {
    try {
      const data = await apiFetch('/api/integration/audit-logs/verify', { method: 'POST' });
      setLedgerIntegrity(data);
      if (data.verified) {
        showToast('Ledger Integrity Verified! All SHA-256 block hashes are intact.');
      } else {
        showToast(`ALERT: Corruption detected at Audit Log ID #${data.corruptedLogId}!`, 'error');
      }
      const logs = await apiFetch('/api/integration/audit-logs');
      setAuditLogs(logs);
    } catch (e) {}
  };

  // GeM Catalog Publish
  const handleGeMPublish = async (pilotId: number) => {
    try {
      const response = await apiFetch('/api/integration/gem/publish', {
        method: 'POST',
        body: JSON.stringify({ pilotId, catalogTitle: activePilot?.problemTitle })
      });
      showToast(`Published to GeM Portal! Catalog ID: ${response.gemCatalogId}`);
    } catch (e) {}
  };

  // Decision submit
  const handleSubmitDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePilot) return;
    try {
      await apiFetch('/api/pilots/decision', {
        method: 'POST',
        body: JSON.stringify({
          pilotId: activePilot.id,
          decisionType,
          remarks: decisionRemarks
        })
      });

      if (publishToGem) {
        await handleGeMPublish(activePilot.id);
      }

      showToast(`Final decision (${decisionType}) submitted successfully!`);
      loadDashboardData();
      setView('dashboard');
    } catch (e: any) {
      showToast(e.message || 'Failed to submit decision', 'error');
    }
  };

  // Expert: Submit Scorecard
  const handleSubmitEvaluation = async (e: React.FormEvent, problemId: number, startupId: number) => {
    e.preventDefault();
    try {
      await apiFetch('/api/evaluations', {
        method: 'POST',
        body: JSON.stringify({
          problemId,
          startupId,
          feasibilityScore: evalScores.feasibility,
          innovationScore: evalScores.innovation,
          teamScore: evalScores.team,
          costScore: evalScores.cost,
          comments: evalScores.comments
        })
      });
      showToast('Expert evaluation scorecard submitted!');
      loadDashboardData();
      setView('dashboard');
    } catch (e: any) {
      showToast(e.message || 'Failed to submit evaluation', 'error');
    }
  };

  // Admin: User Activation Toggle
  const toggleUserStatus = async (userId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await apiFetch(`/api/admin/users/${userId}/status?status=${nextStatus}`, { method: 'POST' });
      showToast(`User status changed to ${nextStatus}`);
      const users = await apiFetch('/api/admin/users');
      setAdminUsers(users);
    } catch (e) {}
  };

  // File Upload Simulator
  const simulateFileUpload = () => {
    const sampleFiles = [
      { name: 'Milestone1_Architecture_Schematics_V1.pdf', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      { name: 'Multispectral_Drone_Flight_Telemetry_Log.json', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4' },
      { name: 'Landfill_Organic_Sorting_Accuracy_Test.csv', hash: 'a1293294c7b209a89c440a7a3748201b2c45187e1a3848123049182390142839' }
    ];
    const picked = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
    setUploadedFile(picked);
    showToast(`File "${picked.name}" encrypted locally (AES-256/SHA-256).`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-white border transition-all transform animate-bounce ${
          toast.type === 'success' ? 'bg-emerald-700 border-emerald-600' : 'bg-red-700 border-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      {/* Header / Navbar */}
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')} title="Return to Home Page">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Building2 size={24} className="animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
                GovStart
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            {auth ? (
              <div className="flex items-center gap-4">
                {view !== 'dashboard' && (
                  <button 
                    onClick={() => setView('dashboard')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition-colors"
                  >
                    Go to Dashboard
                  </button>
                )}
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-200">{auth.name}</p>
                  <span className="inline-block text-[10px] bg-indigo-900/60 text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-700/50 uppercase">
                    {auth.role}
                  </span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700/60 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-slate-300"
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => setView('login')} 
                  className="px-4 py-2 text-sm font-medium hover:text-indigo-400 transition-colors text-slate-300 cursor-pointer"
                >
                  Log In
                </button>
                <button 
                  onClick={() => setView('register')} 
                  className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                  Register Account
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-6">
        
        {/* LANDING PAGE */}
        {view === 'landing' && (
          <div className="py-12 space-y-16">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Award size={12} className="text-indigo-600" /> Innovation & Sandbox Framework
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none sm:text-6xl">
                Bypassing Procurement Barriers for <span className="text-indigo-600">Startups</span>
              </h1>
              <p className="text-lg text-slate-600">
                A legally compliant sandbox framework connecting government departments with vetted tech startups. Standardizing outcomes, automated eligibility checks, AI scoring, and milestone-based secure contract payments.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <button 
                  onClick={() => setView('login')} 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5"
                >
                  Start Prototyping Demo <ArrowRight size={18} />
                </button>
                <button 
                  onClick={() => setView('register')} 
                  className="bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-200 px-8 py-3.5 rounded-xl cursor-pointer shadow-sm transition-transform hover:-translate-y-0.5"
                >
                  Register
                </button>
              </div>
            </div>

            {/* Core Statistics Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto pt-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center space-y-1">
                <span className="text-2xl font-black text-indigo-600">₹45 Lakhs+</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Escrow Budget Vetted</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center space-y-1">
                <span className="text-2xl font-black text-slate-800">4 Active</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sandbox Pilots Running</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center space-y-1">
                <span className="text-2xl font-black text-slate-800">DPIIT Integration</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">1-Click Startup Verification</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center space-y-1">
                <span className="text-2xl font-black text-indigo-600">100% GFR</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Audit Exemption Compliance</p>
              </div>
            </div>

            {/* Complete Platform Workflow Diagram */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm max-w-5xl mx-auto space-y-8">
              <div className="text-center max-w-md mx-auto space-y-1.5">
                <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest block">System Flowchart</span>
                <h3 className="text-2xl font-black text-slate-900 leading-none">End-to-End Procurement Pathway</h3>
                <p className="text-slate-500 text-xs leading-normal">How GovStart bypasses standard bidding rules and manages active sandbox pilots.</p>
              </div>

              {/* Graphical Workflow Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative pt-4">
                
                {/* Step 1 */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 relative group hover:border-indigo-200 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">1</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      <Building2 size={16} className="text-indigo-600" /> Department Outcome Posting
                    </h4>
                    <p className="text-slate-500 text-[11px] leading-normal">Officers list outcome goals (e.g. "Smart Sorter") rather than drafting narrow specifications, opening doors for innovative startups.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 relative group hover:border-indigo-200 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">2</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      <Cpu size={16} className="text-indigo-600" /> Jaccard + AI Matching
                    </h4>
                    <p className="text-slate-500 text-[11px] leading-normal">System validates DPIIT numbers and uses Gemini 1.5 Flash to compute matching scores based on real capabilities and tags.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 relative group hover:border-indigo-200 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">3</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      <GraduationCap size={16} className="text-indigo-600" /> Academic Scorecard Vetting
                    </h4>
                    <p className="text-slate-500 text-[11px] leading-normal">Professors (COEP/VJTI) rate submissions on feasibility and cost sliders, providing legal audit justification for GFR exemption.</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 relative group hover:border-indigo-200 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">4</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck size={16} className="text-indigo-600" /> Stamp NDA & Escrow Lock
                    </h4>
                    <p className="text-slate-500 text-[11px] leading-normal">Standardized legal contracts are generated on ₹500 non-judicial stamp paper while pilot budgets are securely locked in escrow.</p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 relative group hover:border-indigo-200 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">5</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      <Clock size={16} className="text-indigo-600" /> Milestone SLA payouts
                    </h4>
                    <p className="text-slate-500 text-[11px] leading-normal">Startups submit files in an encrypted IP vault. 7-day SLA timers auto-approve tranches to ensure prompt payouts.</p>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 relative group hover:border-indigo-200 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">6</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      <BarChart3 size={16} className="text-indigo-600" /> Direct GeM Cataloging
                    </h4>
                    <p className="text-slate-500 text-[11px] leading-normal">Vetted sandbox outcomes bypass L1 tenders and are published directly to the Government e-Marketplace (GeM) catalog.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Core Innovation Safeguards Section */}
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="text-center space-y-1.5">
                <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest block">Product Capabilities</span>
                <h3 className="text-2xl font-black text-slate-900">Advanced Procurement Safeguards</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-indigo-200 transition-colors">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Cpu size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-sm">Chained Tamper-Evident Ledger</h4>
                    <p className="text-slate-500 text-[11px] leading-relaxed">Every database record is cryptographically signed with a SHA-256 hash linked to the prior block. Database edits instantly break the chain and raise alarms for audit officers.</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-indigo-200 transition-colors">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-sm">Client-Side IP Encryption Vault</h4>
                    <p className="text-slate-500 text-[11px] leading-relaxed">Startups upload schematics and codes with local client-side document encryption hashing. Protects sensitive designs while giving departments verifiable progress keys.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOGIN SCREEN */}
        {view === 'login' && (
          <div className="max-w-md mx-auto py-12">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-sm text-slate-500 mb-6">Enter your credential details to log in to GovStart.</p>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={loginEmail} 
                    onChange={e => setLoginEmail(e.target.value)} 
                    placeholder="officer@gov.in"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
                  <input 
                    type="password" 
                    required 
                    value={loginPassword} 
                    onChange={e => setLoginPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg text-sm shadow-md transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                <span className="text-xs text-slate-500">Need a sandbox account? </span>
                <button onClick={() => setView('register')} className="text-xs font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer">Register here</button>
              </div>

              {/* Demo quick fill shortcut */}
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">Auto-fill Credentials (Demo Seeder)</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => fillCredentials('dept')} className="text-[10px] font-semibold bg-white border border-slate-200 py-1.5 px-2 rounded-md hover:bg-indigo-50 hover:border-indigo-200">Municipal Dept</button>
                  <button onClick={() => fillCredentials('startup')} className="text-[10px] font-semibold bg-white border border-slate-200 py-1.5 px-2 rounded-md hover:bg-indigo-50 hover:border-indigo-200">Eco-Health Startup</button>
                  <button onClick={() => fillCredentials('expert')} className="text-[10px] font-semibold bg-white border border-slate-200 py-1.5 px-2 rounded-md hover:bg-indigo-50 hover:border-indigo-200">Academic Expert</button>
                  <button onClick={() => fillCredentials('admin')} className="text-[10px] font-semibold bg-white border border-slate-200 py-1.5 px-2 rounded-md hover:bg-indigo-50 hover:border-indigo-200">Super Admin</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REGISTER SCREEN */}
        {view === 'register' && (
          <div className="max-w-2xl mx-auto py-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Create Sandbox Account</h2>
              <p className="text-sm text-slate-500 mb-6">Register to access matching algorithms and simulation sandboxes.</p>

              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input type="text" required value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Ramesh Patil" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input type="email" required value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="ramesh@gov.in" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
                    <input type="password" required value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Account Role</label>
                    <select value={registerForm.role} onChange={e => setRegisterForm({...registerForm, role: e.target.value as any})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                      <option value="STARTUP">Startup / Innovator</option>
                      <option value="DEPARTMENT">Municipal Department Officer</option>
                      <option value="EXPERT">Academic Expert (COEP/VJTI)</option>
                    </select>
                  </div>
                </div>

                {registerForm.role === 'DEPARTMENT' && (
                  <div className="space-y-4 border-t pt-4 border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Department Profile</h4>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department Name</label>
                      <input type="text" required value={registerForm.deptName} onChange={e => setRegisterForm({...registerForm, deptName: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Smart Infrastructure Dept" />
                    </div>
                  </div>
                )}

                {registerForm.role === 'STARTUP' && (
                  <div className="space-y-4 border-t pt-4 border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Startup Verification Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company Name</label>
                        <input type="text" required value={registerForm.companyName} onChange={e => setRegisterForm({...registerForm, companyName: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Maha-EcoTech Solutions" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">DPIIT Reg. Number</label>
                        <input type="text" required value={registerForm.dpiitNumber} onChange={e => setRegisterForm({...registerForm, dpiitNumber: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="DPIIT-893021" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Capability Tags (Comma Separated)</label>
                      <input type="text" value={registerForm.startupTagsString} onChange={e => setRegisterForm({...registerForm, startupTagsString: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Waste Management, AI, Recycling, AgriTech" />
                    </div>
                  </div>
                )}

                {registerForm.role === 'EXPERT' && (
                  <div className="space-y-4 border-t pt-4 border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Academic Affiliation Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Expertise Domain</label>
                        <input type="text" required value={registerForm.expertDomain} onChange={e => setRegisterForm({...registerForm, expertDomain: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Environmental Science & AI" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Designation & Institution</label>
                        <input type="text" required value={registerForm.expertDesignation} onChange={e => setRegisterForm({...registerForm, expertDesignation: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Professor, COEP Tech University" />
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg text-sm shadow-md transition-colors cursor-pointer">
                  Complete Registration
                </button>
              </form>
            </div>
          </div>
        )}

        {/* DASHBOARD ROUTER */}
        {view === 'dashboard' && auth && (
          <div className="space-y-8">
            
            {/* DEPARTMENT DASHBOARD */}
            {auth.role === 'DEPARTMENT' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Department Nodal Workspace</h2>
                    <p className="text-xs text-slate-500 mt-1">Manage outcome challenges, run AI startup matching, and monitor active pilot escrows.</p>
                  </div>
                  <button 
                    onClick={() => { setCreateStep(1); setView('post-problem'); }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 text-sm cursor-pointer transition-transform hover:-translate-y-0.5"
                  >
                    <Plus size={16} /> Post Outcome Challenge
                  </button>
                </div>

                {/* Outcome Challenges Table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">Posted Outcome Challenges</h3>
                  <div className="divide-y divide-slate-100">
                    {problems.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 italic">No challenges posted yet. Click 'Post Outcome Challenge' above to start.</p>
                    ) : (
                      problems.map(prob => (
                        <div key={prob.id} className="py-4 flex items-center justify-between gap-4">
                          <div className="space-y-1 max-w-xl">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm hover:text-indigo-600 cursor-pointer" onClick={() => viewProblemDetails(prob)}>
                                {prob.title}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase border border-indigo-100">
                                {prob.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1">{prob.description}</p>
                            <div className="flex gap-2 text-[10px] text-slate-400">
                              <span>Budget: ₹{prob.budgetMin?.toLocaleString()} - ₹{prob.budgetMax?.toLocaleString()}</span>
                              <span>&bull;</span>
                              <span>Timeline: {prob.timelineDays} Days</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => viewProblemDetails(prob)}
                              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              AI Discovery & Scorecard <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Active Sandbox Pilots Overview */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">Active Sandbox Pilot Workspaces</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pilots.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 italic col-span-2">No sandbox pilots launched yet.</p>
                    ) : (
                      pilots.map(plt => (
                        <div key={plt.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-xs font-bold text-indigo-600 block">Pilot ID #{plt.id}</span>
                              <h4 className="font-extrabold text-sm text-slate-900">{plt.problemTitle}</h4>
                              <p className="text-[11px] text-slate-500">Partner: {plt.startupName}</p>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                              {plt.status}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                              <span>Overall Completion</span>
                              <span>{plt.currentProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-indigo-600 h-full transition-all" style={{ width: `${plt.currentProgress}%` }} />
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                            <span>Escrow Locked: ₹{plt.escrowBalance?.toLocaleString()}</span>
                            <button 
                              onClick={() => viewPilotWorkspace(plt)}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1 rounded-md text-xs cursor-pointer"
                            >
                              Open KPI Dashboard
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STARTUP DASHBOARD */}
            {auth.role === 'STARTUP' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h2 className="text-2xl font-black text-slate-900">Startup Innovator Hub</h2>
                  <p className="text-xs text-slate-500 mt-1">Review departmental outcome challenges, view AI recommendations, and upload milestone deliverables.</p>
                </div>

                {/* Active Pilot Workspaces */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">Your Active Sandbox Workspaces</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pilots.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 italic col-span-2">No active sandbox pilots assigned yet.</p>
                    ) : (
                      pilots.map(plt => (
                        <div key={plt.id} className="p-5 rounded-xl border border-indigo-100 bg-indigo-50/30 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-xs font-bold text-indigo-600">Sandbox Pilot #{plt.id}</span>
                              <h4 className="font-extrabold text-sm text-slate-900">{plt.problemTitle}</h4>
                              <p className="text-[11px] text-slate-500">Dept: {plt.departmentName}</p>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase border border-emerald-200">
                              {plt.status}
                            </span>
                          </div>

                          <div className="flex justify-between text-[11px] text-slate-600 font-semibold">
                            <span>Escrow Balance: ₹{plt.escrowBalance?.toLocaleString()}</span>
                            <span>Progress: {plt.currentProgress}%</span>
                          </div>

                          <button 
                            onClick={() => viewPilotWorkspace(plt)}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg text-xs cursor-pointer transition-colors shadow-sm"
                          >
                            Submit Progress & Deliverables
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Available Challenges Board */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">Department Outcome Challenges</h3>
                  <div className="divide-y divide-slate-100">
                    {problems.map(prob => (
                      <div key={prob.id} className="py-4 flex justify-between items-center gap-4">
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900 text-sm">{prob.title}</h4>
                          <p className="text-xs text-slate-500">{prob.description}</p>
                          <div className="flex gap-2">
                            {prob.tags.map((t, idx) => (
                              <span key={idx} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{t}</span>
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 uppercase">
                          Budget: ₹{prob.budgetMax?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* EXPERT DASHBOARD */}
            {auth.role === 'EXPERT' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h2 className="text-2xl font-black text-slate-900">Academic Expert Evaluation Panel</h2>
                  <p className="text-xs text-slate-500 mt-1">Review assigned startup submissions, execute feasibility scorecards, and provide legal audit justifications.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">Assigned Challenges Pending Scorecard</h3>
                  {expertQueue.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 italic">No challenges currently assigned to your evaluation queue.</p>
                  ) : (
                    expertQueue.map(prob => (
                      <div key={prob.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center gap-4">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{prob.title}</h4>
                          <p className="text-xs text-slate-500 line-clamp-1">{prob.description}</p>
                        </div>
                        <button 
                          onClick={() => viewProblemDetails(prob)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer shrink-0"
                        >
                          Fill Evaluation Scorecard
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ADMIN DASHBOARD */}
            {auth.role === 'ADMIN' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Super Admin Audit & Oversight</h2>
                    <p className="text-xs text-slate-500 mt-1">Monitor platform analytics, toggle user permissions, and verify the SHA-256 chained transaction audit ledger.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setAdminTab('overview')} 
                      className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${adminTab === 'overview' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                    >
                      System Overview
                    </button>
                    <button 
                      onClick={() => setAdminTab('audit')} 
                      className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${adminTab === 'audit' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                    >
                      Tamper-Evident Audit Ledger
                    </button>
                  </div>
                </div>

                {adminTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Analytics Grid */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                        <span className="text-3xl font-black text-indigo-600">{adminAnalytics?.totalProblems || 0}</span>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Outcome Challenges</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                        <span className="text-3xl font-black text-indigo-600">{adminAnalytics?.totalPilots || 0}</span>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Active Sandbox Pilots</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                        <span className="text-3xl font-black text-emerald-600">₹{(adminAnalytics?.totalBudgetLocked || 0).toLocaleString()}</span>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Escrow Budget Locked</p>
                      </div>
                    </div>

                    {/* User Management Table */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                      <h3 className="text-lg font-bold text-slate-800">User Account Management</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-50 uppercase text-[10px] text-slate-400 font-bold">
                            <tr>
                              <th className="p-3">User</th>
                              <th className="p-3">Role</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {adminUsers.map(u => (
                              <tr key={u.id}>
                                <td className="p-3 font-bold text-slate-900">{u.name} <span className="text-[10px] text-slate-400 font-normal block">{u.email}</span></td>
                                <td className="p-3"><span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded text-[10px]">{u.role}</span></td>
                                <td className="p-3"><span className={`font-bold px-2 py-0.5 rounded text-[10px] ${u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{u.status}</span></td>
                                <td className="p-3 text-right">
                                  <button 
                                    onClick={() => toggleUserStatus(u.id, u.status)}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded text-[10px] cursor-pointer"
                                  >
                                    {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {adminTab === 'audit' && (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Cryptographic Chained Audit Ledger</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Every event is hashed (SHA-256) and chained to the prior checksum to guarantee tamper-evident government auditing.</p>
                      </div>
                      <button 
                        onClick={verifyLedgerIntegrity}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-md text-xs flex items-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5"
                      >
                        <ShieldCheck size={16} /> Verify Ledger Integrity
                      </button>
                    </div>

                    {ledgerIntegrity && (
                      <div className={`p-4 rounded-xl border flex items-center gap-3 ${ledgerIntegrity.verified ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                        <ShieldCheck size={20} />
                        <div className="text-xs font-bold">
                          {ledgerIntegrity.verified ? `Ledger Integrity Verified! Clean cryptographic chain across ${ledgerIntegrity.totalChecked} records.` : `ALERT: Chain validation failed at Log ID #${ledgerIntegrity.corruptedLogId}! Tampered row detected.`}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {auditLogs.map(log => (
                        <div key={log.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-start text-xs font-mono">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-indigo-600">[Log #{log.id}]</span>
                              <span className="font-bold text-slate-800 uppercase">{log.action}</span>
                              <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-slate-600 font-sans">{log.details}</p>
                            <p className="text-[10px] text-slate-400 font-mono">Actor: {log.actor}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-mono text-slate-400 block">SHA-256 Hash:</span>
                            <span className="text-[10px] font-mono text-indigo-700 font-bold block max-w-xs truncate">{log.checksum}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* FEATURE 1: 6-STEP CHALLENGE CREATION WIZARD */}
        {view === 'post-problem' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Post Outcome-Based Challenge</h2>
                <p className="text-xs text-slate-500 mt-1">Multi-step wizard defining target outcomes, measurable KPIs, eligibility criteria, and sandbox milestones.</p>
              </div>
              <button onClick={() => setView('dashboard')} className="text-xs font-bold text-slate-500 hover:text-slate-800">
                Cancel & Return
              </button>
            </div>

            {/* 6-Step Progress Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between text-xs font-bold text-slate-400 border-b">
              {[
                { num: 1, label: 'Basics' },
                { num: 2, label: 'Outcome' },
                { num: 3, label: 'KPIs' },
                { num: 4, label: 'Eligibility' },
                { num: 5, label: 'Pilot Config' },
                { num: 6, label: 'Review & Publish' }
              ].map(s => (
                <div 
                  key={s.num} 
                  onClick={() => setCreateStep(s.num)}
                  className={`flex items-center gap-1.5 cursor-pointer ${createStep === s.num ? 'text-indigo-600 font-black' : createStep > s.num ? 'text-emerald-600' : ''}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${createStep === s.num ? 'bg-indigo-600 text-white' : createStep > s.num ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {s.num}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl space-y-6">
              
              {/* STEP 1: BASICS */}
              {createStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Step 1: Challenge Basics & Problem Scope</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Challenge Title</label>
                      <input type="text" value={wizardForm.title} onChange={e => setWizardForm({...wizardForm, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="AI Landfill Waste Sorter" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Government Department</label>
                      <input type="text" value={wizardForm.department} onChange={e => setWizardForm({...wizardForm, department: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category / Sector</label>
                      <select value={wizardForm.category} onChange={e => setWizardForm({...wizardForm, category: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm bg-white">
                        <option value="Waste Management & CleanTech">Waste Management & CleanTech</option>
                        <option value="Smart Infrastructure">Smart Infrastructure</option>
                        <option value="HealthTech & Telemedicine">HealthTech & Telemedicine</option>
                        <option value="AgriTech & Drone Services">AgriTech & Drone Services</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nodal Officer / Contact</label>
                      <input type="text" value={wizardForm.contactPerson} onChange={e => setWizardForm({...wizardForm, contactPerson: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location / District</label>
                      <input type="text" value={wizardForm.location} onChange={e => setWizardForm({...wizardForm, location: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Detailed Challenge Description</label>
                    <textarea rows={3} value={wizardForm.description} onChange={e => setWizardForm({...wizardForm, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Problem / Bottleneck</label>
                      <textarea rows={2} value={wizardForm.currentProblem} onChange={e => setWizardForm({...wizardForm, currentProblem: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Existing Process & Target Beneficiaries</label>
                      <textarea rows={2} value={wizardForm.targetBeneficiaries} onChange={e => setWizardForm({...wizardForm, targetBeneficiaries: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: DESIRED OUTCOME */}
              {createStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Step 2: Desired Measurable Outcome</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Desired Outcome Statement</label>
                    <textarea rows={3} value={wizardForm.desiredOutcome} onChange={e => setWizardForm({...wizardForm, desiredOutcome: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Define the end goal rather than specifying technical hardware details..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Baseline / Current Performance</label>
                      <input type="text" value={wizardForm.baselinePerformance} onChange={e => setWizardForm({...wizardForm, baselinePerformance: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Performance Goal</label>
                      <input type="text" value={wizardForm.targetPerformance} onChange={e => setWizardForm({...wizardForm, targetPerformance: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Expected Community Impact</label>
                      <textarea rows={2} value={wizardForm.expectedImpact} onChange={e => setWizardForm({...wizardForm, expectedImpact: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Geographic Deployment Scope</label>
                      <input type="text" value={wizardForm.geographicScope} onChange={e => setWizardForm({...wizardForm, geographicScope: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: SUCCESS CRITERIA / KPIS */}
              {createStep === 3 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-bold text-slate-800">Step 3: Measurable Success Criteria & KPIs</h3>
                    <button 
                      type="button" 
                      onClick={() => setKpiList([...kpiList, { name: 'New KPI', description: '', baseline: '0', target: '100', unit: '%', method: 'Sensor Logs', frequency: 'Weekly', weight: 20 }])}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={14} /> Add KPI Row
                    </button>
                  </div>

                  <div className="space-y-3">
                    {kpiList.map((kpi, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-indigo-600">KPI #{idx + 1}</span>
                          <button 
                            type="button" 
                            onClick={() => setKpiList(kpiList.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-500">KPI Name</label>
                            <input type="text" value={kpi.name} onChange={e => { const updated = [...kpiList]; updated[idx].name = e.target.value; setKpiList(updated); }} className="w-full px-2.5 py-1 border rounded text-xs" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-500">Baseline</label>
                            <input type="text" value={kpi.baseline} onChange={e => { const updated = [...kpiList]; updated[idx].baseline = e.target.value; setKpiList(updated); }} className="w-full px-2.5 py-1 border rounded text-xs" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-500">Target</label>
                            <input type="text" value={kpi.target} onChange={e => { const updated = [...kpiList]; updated[idx].target = e.target.value; setKpiList(updated); }} className="w-full px-2.5 py-1 border rounded text-xs" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-500">Weight (%)</label>
                            <input type="number" value={kpi.weight} onChange={e => { const updated = [...kpiList]; updated[idx].weight = Number(e.target.value); setKpiList(updated); }} className="w-full px-2.5 py-1 border rounded text-xs" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: ELIGIBILITY & EVALUATION */}
              {createStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Step 4: Startup Eligibility & Expert Evaluation Rubric</h3>
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <input type="checkbox" id="dpiitReq" checked={wizardForm.dpiitRequired} onChange={e => setWizardForm({...wizardForm, dpiitRequired: e.target.checked})} className="w-4 h-4 text-indigo-600 rounded" />
                    <label htmlFor="dpiitReq" className="text-xs font-bold text-slate-800 cursor-pointer">Require Active DPIIT Startup Recognition (Startup India Registry)</label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Required Technical Capabilities</label>
                      <textarea rows={3} value={wizardForm.techRequirements} onChange={e => setWizardForm({...wizardForm, techRequirements: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Minimum Eligibility Criteria</label>
                      <textarea rows={3} value={wizardForm.minCriteria} onChange={e => setWizardForm({...wizardForm, minCriteria: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Default Academic Expert Evaluation Rubric Weights</h4>
                    <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold text-slate-700">
                      <div className="bg-white p-2 border rounded">Feasibility: 30%</div>
                      <div className="bg-white p-2 border rounded">Innovation: 20%</div>
                      <div className="bg-white p-2 border rounded">Scalability: 20%</div>
                      <div className="bg-white p-2 border rounded">Impact: 20%</div>
                      <div className="bg-white p-2 border rounded">Risk: 10%</div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: PILOT CONFIGURATION */}
              {createStep === 5 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Step 5: Pilot Sandbox Structure & Budget</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pilot Duration (Days)</label>
                      <input type="number" value={wizardForm.timelineDays} onChange={e => setWizardForm({...wizardForm, timelineDays: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Min Budget (₹)</label>
                      <input type="number" value={wizardForm.budgetMin} onChange={e => setWizardForm({...wizardForm, budgetMin: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Max Escrow Budget (₹)</label>
                      <input type="number" value={wizardForm.budgetMax} onChange={e => setWizardForm({...wizardForm, budgetMax: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg text-sm" />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase">Default Pilot Milestones & Escrow Payment Schedule</h4>
                    <div className="space-y-2">
                      {milestoneList.map((m, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-slate-800">{m.name}</span>
                            <p className="text-[10px] text-slate-500">{m.criteria}</p>
                          </div>
                          <span className="font-black text-indigo-600 bg-white px-2.5 py-1 rounded border">{m.paymentPercentage}% Tranche</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: REVIEW & PUBLISH */}
              {createStep === 6 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Step 6: Challenge Summary Review & Publish</h3>
                  
                  <div className="p-6 rounded-2xl border border-indigo-100 bg-indigo-50/30 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-indigo-600 uppercase">{wizardForm.category} &bull; {wizardForm.location}</span>
                        <h2 className="text-xl font-black text-slate-900">{wizardForm.title}</h2>
                        <p className="text-xs text-slate-500 mt-1">Nodal Contact: {wizardForm.contactPerson}</p>
                      </div>
                      <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                        Max Escrow: ₹{wizardForm.budgetMax.toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-white p-3 rounded-lg border">
                        <span className="font-bold text-slate-700 block">Desired Outcome:</span>
                        <p className="text-slate-600 mt-0.5">{wizardForm.desiredOutcome}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border">
                        <span className="font-bold text-slate-700 block">Baseline vs Target Performance:</span>
                        <p className="text-slate-600 mt-0.5">Baseline: {wizardForm.baselinePerformance} &rarr; Target: {wizardForm.targetPerformance}</p>
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-800 text-xs block mb-1.5">Configured KPIs ({kpiList.length}):</span>
                      <div className="grid grid-cols-3 gap-2">
                        {kpiList.map((k, i) => (
                          <div key={i} className="bg-white p-2.5 rounded-lg border text-[11px]">
                            <span className="font-bold text-indigo-600 block">{k.name}</span>
                            <span className="text-slate-500">Target: {k.target} ({k.unit})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Navigation Footer Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                {createStep > 1 ? (
                  <button 
                    type="button" 
                    onClick={() => setCreateStep(createStep - 1)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Back
                  </button>
                ) : <div />}

                {createStep < 6 ? (
                  <button 
                    type="button" 
                    onClick={() => setCreateStep(createStep + 1)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                  >
                    Next Step <ChevronRight size={16} />
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => { showToast('Draft saved locally.'); setView('dashboard'); }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer"
                    >
                      Save Draft
                    </button>
                    <button 
                      type="button" 
                      onClick={handlePublishChallenge}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle size={16} /> Publish Challenge
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FEATURE 2: EXPLAINABLE AI MATCH & SCORECARD */}
        {view === 'matching' && activeProblem && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase">AI Startup Discovery & Evaluation Engine</span>
                <h2 className="text-2xl font-black text-slate-900">{activeProblem.title}</h2>
              </div>
              <button onClick={() => setView('dashboard')} className="text-xs font-bold text-slate-500 hover:text-slate-800">
                Return to Dashboard
              </button>
            </div>

            {/* SECTION A: ACTIVE MATCHING PROCESSING SEQUENCE */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-indigo-400 font-bold">AI Discovery Sequence (Jaccard + Gemini 1.5 Flash)</span>
                <button onClick={() => triggerMatching(activeProblem.id)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1 rounded text-xs cursor-pointer">Re-Run Engine</button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-[10px] font-mono">
                {[
                  { step: 1, label: 'Challenge Analyzed' },
                  { step: 2, label: 'Requirements Extracted' },
                  { step: 3, label: 'Startups Filtered' },
                  { step: 4, label: 'Capabilities Compared' },
                  { step: 5, label: 'Gemini AI Scored' },
                  { step: 6, label: 'Scorecard Generated' }
                ].map(s => (
                  <div key={s.step} className={`p-2 rounded border text-center transition-all ${activeMatchingStep >= s.step ? 'bg-indigo-900/60 border-indigo-500 text-indigo-200' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                    <span>{activeMatchingStep >= s.step ? '✓' : '○'} {s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* SECTION B: STARTUP MATCH RESULTS CARDS */}
              <div className="space-y-4">
                <h3 className="text-md font-bold text-slate-800">Discovered Startups ({recommendations.length})</h3>
                {recommendations.map(rec => (
                  <div 
                    key={rec.id} 
                    onClick={() => setSelectedMatchStartup(rec)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 ${selectedMatchStartup?.id === rec.id ? 'bg-indigo-50/60 border-indigo-500 shadow-md' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{rec.startup.companyName}</h4>
                        <span className="text-[10px] text-slate-400 block">{rec.startup.domain || 'Tech Innovator'}</span>
                      </div>
                      <span className="text-xs font-black bg-indigo-600 text-white px-2.5 py-1 rounded-full">
                        {Math.round(rec.finalWeightedScore)}% Match
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px]">
                      {rec.startup.isDpiitVerified ? (
                        <span 
                          onClick={(e) => { e.stopPropagation(); checkDpiitRegistry(rec.startup.dpiitNumber); }}
                          className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold cursor-pointer hover:bg-emerald-200"
                        >
                          ✓ DPIIT Verified ({rec.startup.dpiitNumber})
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Unverified</span>
                      )}
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">Low Risk</span>
                    </div>

                    <div className="flex gap-1.5 flex-wrap text-[10px]">
                      {rec.startup.tags.map((t, idx) => (
                        <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* SECTION C & D: EXPLAINABLE SCORE & ELIGIBILITY SCREENING */}
              {selectedMatchStartup && (
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <span className="text-xs font-bold text-indigo-600 uppercase">Selected Startup Evaluation</span>
                        <h3 className="text-xl font-black text-slate-900">{selectedMatchStartup.startup.companyName}</h3>
                      </div>
                      <button 
                        onClick={() => openContractStage(selectedMatchStartup)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        Generate Contract Agreement <ArrowRight size={14} />
                      </button>
                    </div>

                    {/* SECTION C: EXPLAINABLE MATCH SCORE BREAKDOWN */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Dimensional Match Score Breakdown</h4>
                      <div className="grid grid-cols-5 gap-3 text-center">
                        <div className="bg-slate-50 p-3 rounded-xl border">
                          <span className="text-lg font-black text-indigo-600">{Math.round(selectedMatchStartup.finalWeightedScore)}%</span>
                          <span className="text-[9px] font-bold text-slate-500 block">Challenge Alignment</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border">
                          <span className="text-lg font-black text-indigo-600">{Math.round(selectedMatchStartup.ruleScore * 100)}%</span>
                          <span className="text-[9px] font-bold text-slate-500 block">Jaccard Tag Match</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border">
                          <span className="text-lg font-black text-indigo-600">{Math.round(selectedMatchStartup.llmScore * 20)}%</span>
                          <span className="text-[9px] font-bold text-slate-500 block">AI Gemini Rating</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border">
                          <span className="text-lg font-black text-emerald-600">88%</span>
                          <span className="text-[9px] font-bold text-slate-500 block">Pilot Readiness</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border">
                          <span className="text-lg font-black text-emerald-600">95%</span>
                          <span className="text-[9px] font-bold text-slate-500 block">Scalability Score</span>
                        </div>
                      </div>

                      <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100 text-xs text-slate-700 italic">
                        <span className="font-bold text-indigo-900 not-italic block mb-0.5">Gemini 1.5 Flash Justification:</span>
                        "{selectedMatchStartup.llmJustification}"
                      </div>
                    </div>

                    {/* SECTION D: ELIGIBILITY SCREENING CHECKLIST */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Eligibility & Compliance Checklist</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 font-medium">
                          <CheckCircle size={14} /> DPIIT Registered Startup ({selectedMatchStartup.startup.dpiitNumber})
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 font-medium">
                          <CheckCircle size={14} /> Startup Active Status Verified
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 font-medium">
                          <CheckCircle size={14} /> Tech Capabilities Matched
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 font-medium">
                          <CheckCircle size={14} /> Sector Alignment Confirmed
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 font-medium">
                          <CheckCircle size={14} /> No Disqualifying Conditions
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 font-medium">
                          <CheckCircle size={14} /> GFR Exemption Eligible
                        </div>
                      </div>
                    </div>

                    {/* SECTION E: ACADEMIC EXPERT SCORECARD FORM */}
                    {auth?.role === 'EXPERT' && (
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h4 className="text-sm font-extrabold text-slate-900">Academic Expert Quantitative Scorecard</h4>
                        <form onSubmit={e => handleSubmitEvaluation(e, activeProblem.id, selectedMatchStartup.startup.id)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700">Technical Feasibility (30% Weight): {evalScores.feasibility}/5</label>
                              <input type="range" min="1" max="5" value={evalScores.feasibility} onChange={e => setEvalScores({...evalScores, feasibility: Number(e.target.value)})} className="w-full" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700">Innovation Score (20% Weight): {evalScores.innovation}/5</label>
                              <input type="range" min="1" max="5" value={evalScores.innovation} onChange={e => setEvalScores({...evalScores, innovation: Number(e.target.value)})} className="w-full" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700">Scalability Score (20% Weight): {evalScores.team}/5</label>
                              <input type="range" min="1" max="5" value={evalScores.team} onChange={e => setEvalScores({...evalScores, team: Number(e.target.value)})} className="w-full" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700">Cost Rationality (20% Weight): {evalScores.cost}/5</label>
                              <input type="range" min="1" max="5" value={evalScores.cost} onChange={e => setEvalScores({...evalScores, cost: Number(e.target.value)})} className="w-full" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Academic Evaluator Audit Comments</label>
                            <textarea rows={2} value={evalScores.comments} onChange={e => setEvalScores({...evalScores, comments: e.target.value})} className="w-full p-2.5 border rounded-lg text-xs" placeholder="Add technical rationale for state auditors..." />
                          </div>
                          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2 rounded-xl text-xs shadow-md cursor-pointer">
                            Submit Scorecard
                          </button>
                        </form>
                      </div>
                    )}

                    <p className="text-[10px] text-slate-400 italic text-center pt-2">
                      * AI-assisted recommendation — final evaluation remains with authorized evaluators.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FEATURE 3: CONTRACT GENERATION & E-SIGNING STAGE */}
        {view === 'contract' && selectedContractRec && activeProblem && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase">Contract Stage: Pre-Sandbox Legal Agreement</span>
                <h2 className="text-2xl font-black text-slate-900">{activeProblem.title}</h2>
                <p className="text-xs text-slate-500">Partner: {selectedContractRec.startup.companyName}</p>
              </div>
              <button onClick={() => setView('dashboard')} className="text-xs font-bold text-slate-500 hover:text-slate-800">
                Cancel
              </button>
            </div>

            {/* Document Tabs */}
            <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
              {[
                { id: 'pilot-agreement', label: 'Pilot Implementation Agreement' },
                { id: 'nda', label: 'Mutual NDA' },
                { id: 'privacy', label: 'Data & Privacy Terms' },
                { id: 'ip', label: 'IP Ownership & Usage' },
                { id: 'cybersecurity', label: 'Cybersecurity Clauses' }
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setContractTab(t.id as any)}
                  className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${contractTab === t.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Contract Document Canvas */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6 relative overflow-hidden">
              
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-amber-800 text-[11px] font-bold text-center">
                Prototype template — subject to legal review.
              </div>

              {/* Document Header */}
              <div className="text-center space-y-1 border-b pb-4">
                <h3 className="text-xl font-extrabold uppercase text-slate-900">
                  {contractTab === 'pilot-agreement' ? 'SANDBOX PILOT IMPLEMENTATION AGREEMENT' :
                   contractTab === 'nda' ? 'MUTUAL NON-DISCLOSURE AGREEMENT (NDA)' :
                   contractTab === 'privacy' ? 'DATA GOVERNANCE & CITIZEN PRIVACY TERMS' :
                   contractTab === 'ip' ? 'INTELLECTUAL PROPERTY & USAGE RIGHTS' : 'CYBERSECURITY & RISK MANAGEMENT CLAUSES'}
                </h3>
                <p className="text-xs text-slate-500">Executed under State Innovative Procurement Policy Rules</p>
              </div>

              {/* Document Body */}
              <div className="space-y-4 text-xs text-slate-700 leading-relaxed font-serif">
                <p>
                  This Agreement is entered into on this <strong>{new Date().toLocaleDateString()}</strong> by and between 
                  <strong> The Department of {activeProblem.departmentName}</strong> ("Disbursing Authority") AND 
                  <strong> {selectedContractRec.startup.companyName}</strong> ("Sandbox Partner", DPIIT: {selectedContractRec.startup.dpiitNumber}).
                </p>

                {contractTab === 'pilot-agreement' && (
                  <div className="space-y-3 font-sans">
                    <h4 className="font-bold text-slate-900 text-sm">1. OBJECTIVE & OUTCOME SCOPE</h4>
                    <p>The Sandbox Partner shall deploy a pilot sandbox for: <strong>"{activeProblem.desiredOutcome || activeProblem.description}"</strong>.</p>
                    <h4 className="font-bold text-slate-900 text-sm">2. BUDGET & ESCROW ALLOCATION</h4>
                    <p>Allocated Escrow Budget: <strong>₹{(activeProblem.budgetMax || 1500000).toLocaleString()}</strong>. Escrow payouts are unlocked automatically upon independent validation of quantifiable KPI milestones.</p>
                  </div>
                )}

                {contractTab === 'nda' && (
                  <div className="space-y-3 font-sans">
                    <h4 className="font-bold text-slate-900 text-sm">CONFIDENTIAL INFORMATION & DATA PROTECTION</h4>
                    <p>Both parties agree that all operational telemetry, citizen inputs, and proprietary algorithms disclosed during the sandbox duration shall remain strictly confidential.</p>
                  </div>
                )}

                {contractTab === 'ip' && (
                  <div className="space-y-3 font-sans">
                    <h4 className="font-bold text-slate-900 text-sm">BACKGROUND & FOREGROUND IP CLAUSES</h4>
                    <p>Background IP owned prior to the pilot remains 100% the property of the startup. Data collected during sandbox deployment belongs exclusively to the state department.</p>
                  </div>
                )}
              </div>

              {/* Dual E-Signature Section */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t font-sans">
                <div className="p-4 rounded-xl border bg-slate-50 text-center space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">Department Representative Signature</span>
                  {contractSignedDept ? (
                    <div className="text-emerald-600 font-bold text-xs flex items-center justify-center gap-1">
                      <CheckCircle size={16} /> Digitally Signed (Nodal Officer)
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleSignContract('dept')}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer"
                    >
                      Sign as Department
                    </button>
                  )}
                </div>

                <div className="p-4 rounded-xl border bg-slate-50 text-center space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">Startup Authorized Officer Signature</span>
                  {contractSignedStartup ? (
                    <div className="text-emerald-600 font-bold text-xs flex items-center justify-center gap-1">
                      <CheckCircle size={16} /> Digitally Signed (Startup CEO)
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleSignContract('startup')}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer"
                    >
                      Sign as Startup
                    </button>
                  )}
                </div>
              </div>

              {/* Activation Trigger */}
              <div className="pt-4 text-center">
                <button 
                  disabled={!contractSignedDept || !contractSignedStartup}
                  onClick={submitLaunchPilotFromContract}
                  className={`px-8 py-3.5 rounded-xl font-bold text-xs shadow-xl flex items-center justify-center gap-2 mx-auto cursor-pointer ${
                    contractSignedDept && contractSignedStartup ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Lock size={16} /> Lock Escrow Budget & Activate Sandbox Pilot
                </button>
                {(!contractSignedDept || !contractSignedStartup) && (
                  <p className="text-[10px] text-slate-400 mt-1">Both Department and Startup signatures are required to unlock escrow allocation.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FEATURE 4: ACTIVE PILOT KPI TRACKER & INDEPENDENT VALIDATION */}
        {view === 'pilot-workspace' && activePilot && (
          <div className="space-y-6">
            
            {/* Pilot Header Banner */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-indigo-400 font-bold">Active Pilot ID #{activePilot.id}</span>
                  <h2 className="text-2xl font-black">{activePilot.problemTitle}</h2>
                  <p className="text-xs text-slate-400">Partner: {activePilot.startupName} &bull; Dept: {activePilot.departmentName}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded bg-emerald-900 text-emerald-200 border border-emerald-700 uppercase">
                  {activePilot.status}
                </span>
              </div>

              {/* Real-time Escrow & Completion Tracker */}
              <div className="grid grid-cols-4 gap-4 text-xs font-mono pt-2 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 block">Total Budget:</span>
                  <span className="font-bold text-white text-sm">₹{activePilot.budget.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Locked in Escrow:</span>
                  <span className="font-bold text-emerald-400 text-sm">₹{activePilot.escrowBalance?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Disbursed Tranches:</span>
                  <span className="font-bold text-indigo-400 text-sm">₹{activePilot.releasedAmount?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Overall Progress:</span>
                  <span className="font-bold text-sky-400 text-sm">{activePilot.currentProgress}%</span>
                </div>
              </div>
            </div>

            {/* KPI Performance Dashboard Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Real-Time KPI Performance Tracker</h3>
                <span className="text-xs text-indigo-600 font-bold">4 KPIs Configured</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 uppercase text-[10px] text-slate-400 font-bold">
                    <tr>
                      <th className="p-3">KPI Name</th>
                      <th className="p-3">Baseline</th>
                      <th className="p-3">Target Goal</th>
                      <th className="p-3">Current Value</th>
                      <th className="p-3">Progress %</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: 'Segregation Accuracy', baseline: '35%', target: '90%', current: '94%', progress: 104, status: 'ACHIEVED' },
                      { name: 'Processing Time / Ton', baseline: '120 min', target: '25 min', current: '24 min', progress: 104, status: 'ACHIEVED' },
                      { name: 'Landfill Diverted Volume', baseline: '10%', target: '60%', current: '52%', progress: 86, status: 'IN_PROGRESS' },
                      { name: 'Operating Cost / Ton', baseline: '₹1200', target: '₹850', current: '₹890', progress: 73, status: 'IN_PROGRESS' }
                    ].map((kpi, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-bold text-slate-900">{kpi.name}</td>
                        <td className="p-3 text-slate-500">{kpi.baseline}</td>
                        <td className="p-3 font-bold text-slate-800">{kpi.target}</td>
                        <td className="p-3 font-bold text-indigo-600">{kpi.current}</td>
                        <td className="p-3 font-bold">{kpi.progress}%</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${kpi.status === 'ACHIEVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {kpi.status === 'ACHIEVED' ? '✓ Target Achieved' : '⚠ In Progress'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Milestone Engine & Escrow Payment Schedule */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Milestone Engine & Payment Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { num: 1, name: 'Milestone 1: Equipment Setup', pct: 25, amt: activePilot.budget * 0.25, status: 'APPROVED', text: 'Completed & Released' },
                  { num: 2, name: 'Milestone 2: Initial Sorting Runs', pct: 35, amt: activePilot.budget * 0.35, status: activePilot.currentProgress >= 60 ? 'APPROVED' : 'PENDING', text: activePilot.currentProgress >= 60 ? 'Validated & Released' : 'In Progress' },
                  { num: 3, name: 'Milestone 3: Full Capacity Validation', pct: 40, amt: activePilot.budget * 0.40, status: activePilot.currentProgress >= 100 ? 'APPROVED' : 'PENDING', text: activePilot.currentProgress >= 100 ? 'Validated & Released' : 'Pending Completion' }
                ].map(m => (
                  <div key={m.num} className="p-4 rounded-xl border bg-slate-50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-600">Milestone #{m.num}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${m.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>{m.text}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-800">{m.name}</h4>
                    <div className="flex justify-between items-center text-[11px] pt-1">
                      <span className="text-slate-500">Tranche: {m.pct}%</span>
                      <span className="font-bold text-slate-900">₹{m.amt.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Startup Progress Submission Form */}
            {auth?.role === 'STARTUP' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Submit Milestone Deliverables & KPI Measurements</h3>
                <form onSubmit={handleSubmitProgress} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Progress Percentage (%)</label>
                      <input type="number" min="0" max="100" value={progressPercent} onChange={e => setProgressPercent(Number(e.target.value))} className="w-full p-2 border rounded-lg text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Milestone Deliverable Name</label>
                      <input type="text" value={milestoneName} onChange={e => setMilestoneName(e.target.value)} className="w-full p-2 border rounded-lg text-xs" placeholder="e.g. Milestone 2: Sorting Calibration" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Technical Deliverable Notes</label>
                    <textarea rows={2} value={updateNotes} onChange={e => setUpdateNotes(e.target.value)} className="w-full p-2 border rounded-lg text-xs" placeholder="Detail trial runs, sensor data, and site achievements..." />
                  </div>
                  <div className="flex items-center gap-4">
                    <button type="button" onClick={simulateFileUpload} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer">
                      <FileCode size={14} /> Encrypt & Upload Proof PDF
                    </button>
                    {uploadedFile && (
                      <span className="text-xs font-bold text-emerald-600">✓ Encrypted: {uploadedFile.name}</span>
                    )}
                  </div>
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer shadow-md">
                    Submit Milestone Update for Independent Validation
                  </button>
                </form>
              </div>
            )}

            {/* INDEPENDENT VALIDATION STAGE */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Independent Technical Validation</h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                  Validator: {activePilot.validatorName || 'Prof. Ravindra Kulkarni (COEP Tech)'}
                </span>
              </div>

              <div className="space-y-3">
                {pilotUpdates.map(u => (
                  <div key={u.id} className="p-4 rounded-xl border bg-slate-50 flex justify-between items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{u.milestoneName} ({u.progressPercent}%)</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${u.validationStatus === 'VALIDATED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {u.validationStatus || u.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{u.notes}</p>
                      {u.validatorComments && (
                        <p className="text-[11px] text-indigo-700 italic">Validator Comments: "{u.validatorComments}"</p>
                      )}
                    </div>
                    {u.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleValidateMilestone(u.id, 'VALIDATED')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded text-xs cursor-pointer"
                        >
                          Validate & Disburse Escrow
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* FINAL PROCUREMENT & SCALE-UP DECISION */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Final Procurement & Scale-Up Decision</h3>
              
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-1 text-emerald-900 text-xs">
                <span className="font-bold block text-sm">Evidence-Based System Recommendation:</span>
                <p>"Sandbox pilot achieved 94% of weighted KPI targets and passed independent validation by COEP Tech. Recommended for full procurement & state-wide scaling under Innovative Procurement Exemption Rules."</p>
              </div>

              <form onSubmit={handleSubmitDecision} className="space-y-4">
                <div className="grid grid-cols-4 gap-3 text-xs font-bold">
                  {[
                    { id: 'PROCURE', label: 'Procure Solution' },
                    { id: 'SCALE', label: 'Scale Across Department' },
                    { id: 'EXTEND', label: 'Extend Pilot Sandbox' },
                    { id: 'REJECT', label: 'Reject Solution' }
                  ].map(opt => (
                    <div 
                      key={opt.id}
                      onClick={() => setDecisionType(opt.id)}
                      className={`p-3 rounded-xl border text-center cursor-pointer ${decisionType === opt.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nodal Procurement Remarks</label>
                  <textarea rows={2} value={decisionRemarks} onChange={e => setDecisionRemarks(e.target.value)} className="w-full p-2.5 border rounded-lg text-xs" placeholder="Official remarks for state audit log..." />
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border">
                  <input type="checkbox" id="gem" checked={publishToGem} onChange={e => setPublishToGem(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                  <label htmlFor="gem" className="text-xs font-bold text-slate-800 cursor-pointer">Publish Certified Sandbox Outcome to GeM Portal Marketplace</label>
                </div>

                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl text-xs shadow-lg cursor-pointer">
                  Submit Final Decision & Catalog to GeM
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-indigo-400" />
            <span className="font-bold text-slate-200">GovStart Pilot Platform</span>
          </div>
          <div>
            <p>State Innovation & Procurement Portal. Prototype active.</p>
          </div>
        </div>
      </footer>

      {/* DPIIT REGISTRY LOOKUP MODAL */}
      {showDpiitModal && selectedDpiitData && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">DPIIT Registry Lookup (Simulated API)</span>
                <h3 className="text-lg font-black text-slate-900">{selectedDpiitData.dpiitNumber}</h3>
              </div>
              <button onClick={() => setShowDpiitModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>
            <div className="space-y-2 text-xs">
              <p><strong>Category:</strong> {selectedDpiitData.category}</p>
              <p><strong>Incorporation Date:</strong> {selectedDpiitData.incorporationDate}</p>
              <p><strong>Registered Address:</strong> {selectedDpiitData.registeredAddress}</p>
              <div>
                <strong>Active Directors:</strong>
                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-slate-600">
                  {selectedDpiitData.directors.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            </div>
            <button onClick={() => setShowDpiitModal(false)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-xs cursor-pointer">
              Close Verification Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
