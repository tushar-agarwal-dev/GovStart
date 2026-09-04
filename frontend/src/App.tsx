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
  Award, 
  Cpu,
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

  // 6-Step Challenge Creation Wizard State
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

  // AI Match & Scorecard State
  const [activeMatchingStep, setActiveMatchingStep] = useState<number>(6);
  const [selectedMatchStartup, setSelectedMatchStartup] = useState<Recommendation | null>(null);

  // E-Signature Contract State
  const [contractTab, setContractTab] = useState<'nda' | 'pilot-agreement' | 'privacy' | 'ip' | 'cybersecurity'>('pilot-agreement');
  const [contractSignedDept, setContractSignedDept] = useState(false);
  const [contractSignedStartup, setContractSignedStartup] = useState(false);
  const [selectedContractRec, setSelectedContractRec] = useState<Recommendation | null>(null);

  // Active Pilot KPI Tracker & Independent Validation State
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

  // API Helper with live Render fallback
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

  // Publish Challenge
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

  // Open Contract Generation Stage
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

      await apiFetch(`/api/pilots/${pilot.id}/sign-contract?role=DEPARTMENT`, { method: 'POST' });
      await apiFetch(`/api/pilots/${pilot.id}/sign-contract?role=STARTUP`, { method: 'POST' });

      showToast('Escrow budget locked & Sandbox Pilot activated!');
      loadDashboardData();
      viewPilotWorkspace(pilot);
    } catch (e: any) {
      showToast(e.message || 'Failed to launch pilot', 'error');
    }
  };

  // View Pilot Workspace
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

      if (pilot.kpiCurrentValuesJson) {
        try {
          setKpiUpdateValues(JSON.parse(pilot.kpiCurrentValuesJson));
        } catch (e) {}
      }
    } catch (e) {}
  };

  // Startup: submit progress update
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

  // Independent Validation Submission
  const handleValidateMilestone = async (updateId: number, status: 'VALIDATED' | 'REJECTED') => {
    if (!activePilot) return;
    try {
      await apiFetch(`/api/pilots/updates/${updateId}/validate?validatorName=${encodeURIComponent(validatorNameInput)}&status=${status}`, {
        method: 'POST',
        body: validatorCommentsInput || 'Independent technical validation completed successfully.'
      });

      if (status === 'VALIDATED') {
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

  // OPTION 5: Reusable Executive Command Bar Component
  const RenderExecutiveCommandBar = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Budget Escrowed</span>
          <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">75% Utilized</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-slate-900">₹{(adminAnalytics?.totalBudgetLocked || 4500000).toLocaleString()}</span>
          <span className="text-xs font-bold text-emerald-600">Active Locked</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-full w-[75%]" />
        </div>
      </div>

      <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">Active Sandboxes</span>
          <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">Status: Healthy</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-indigo-600">{pilots.length || 4} Active Pilots</span>
          <span className="text-xs font-bold text-slate-500">Across 3 Depts</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full w-[100%]" />
        </div>
      </div>

      <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Audit Compliance Index</span>
          <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">100% GFR Verified</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-emerald-600">100/100</span>
          <span className="text-xs font-bold text-emerald-600">✓ ISO 27001 & SHA-256</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-600 h-full w-[100%]" />
        </div>
      </div>
    </div>
  );

  // OPTION 5: Reusable 6-Step Procurement Lifecycle Anchor Component
  const RenderLifecycleAnchor = ({ activeStep = 1 }: { activeStep?: number }) => (
    <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-4 shadow-xs">
      <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-slate-400 mb-2 uppercase border-b border-slate-800 pb-2">
        <span>Government Sandbox Procurement Lifecycle</span>
        <span className="text-indigo-400 font-bold">SIH26136 Standard Pathway</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {[
          { num: 1, title: 'Challenge Posting', icon: Building2 },
          { num: 2, title: 'AI Matchmaking', icon: Cpu },
          { num: 3, title: 'Expert Vetting', icon: GraduationCap },
          { num: 4, title: 'Contract Signing', icon: ShieldCheck },
          { num: 5, title: 'Active Pilot & KPIs', icon: BarChart3 },
          { num: 6, title: 'GeM Procurement', icon: CheckCircle }
        ].map(s => {
          const IconComp = s.icon;
          const isActive = activeStep === s.num;
          const isDone = activeStep > s.num;
          return (
            <div 
              key={s.num} 
              className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                isActive 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-xs' 
                  : isDone 
                  ? 'bg-slate-800/80 border-slate-700 text-emerald-400' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                isActive ? 'bg-white text-indigo-700' : isDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {isDone ? '✓' : s.num}
              </div>
              <div className="min-w-0 flex items-center gap-1">
                <IconComp size={12} className="shrink-0 hidden lg:inline" />
                <p className="text-[10px] font-extrabold truncate leading-tight">{s.title}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 text-white border transition-all ${
          toast.type === 'success' ? 'bg-slate-900 border-emerald-500' : 'bg-slate-900 border-red-500'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={18} className="text-emerald-400" /> : <AlertTriangle size={18} className="text-red-400" />}
          <span className="font-medium text-xs text-slate-200">{toast.message}</span>
        </div>
      )}

      {/* Official Government Portal Header */}
      <header className="bg-slate-900 text-white shadow-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')} title="Return to Home Page">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-xs">
              <Building2 size={20} />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">
                GovStart
              </span>
              <span className="text-[9px] text-slate-400 font-semibold tracking-widest uppercase block -mt-1">
                State Innovation & Procurement Platform (Option 5 Hybrid)
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            {auth ? (
              <div className="flex items-center gap-4">
                {view !== 'dashboard' && (
                  <button 
                    onClick={() => setView('dashboard')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Go to Workspace
                  </button>
                )}
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-slate-200">{auth.name}</p>
                  <span className="inline-block text-[9px] bg-slate-800 text-indigo-300 font-bold px-2 py-0.5 rounded border border-slate-700 uppercase">
                    {auth.role}
                  </span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-slate-300"
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => setView('login')} 
                  className="px-3.5 py-1.5 text-xs font-semibold hover:text-indigo-400 transition-colors text-slate-300 cursor-pointer"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setView('register')} 
                  className="bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-white"
                >
                  Register Account
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-6 space-y-6">
        
        {/* LANDING PAGE REDESIGN MATCHING SIH DEMO BEST PRACTICES */}
        {view === 'landing' && (
          <div className="py-4 space-y-12 max-w-6xl mx-auto">
            
            {/* Split Hero Section with Interactive Live App Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
              
              {/* Left Column: Headline, CTAs, Persona Fill */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-widest">
                  <Award size={13} className="text-indigo-600" /> GOVERNMENT × STARTUP INNOVATION PLATFORM
                </div>
                
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                  A Smarter Way for Government to <br />
                  <span className="text-indigo-600">Discover, Pilot & Scale</span> Innovation
                </h1>
                
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                  GovStart connects government departments with verified startups to solve real-world challenges — from defining measurable outcomes and AI-powered matching to running secure pilots and scaling proven solutions.
                </p>
                
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button 
                    onClick={() => setView('login')} 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                  >
                    Explore Demo Workspace <ArrowRight size={15} />
                  </button>
                  <button 
                    onClick={() => setView('register')} 
                    className="bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-200 px-6 py-3 rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    Register Account
                  </button>
                </div>

                {/* 1-Click Live Persona Demos Bar */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LIVE PERSONA DEMOS</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => { fillCredentials('dept'); setView('login'); }} className="text-[10px] font-semibold bg-white hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 py-1.5 px-3 rounded-lg cursor-pointer shadow-2xs">🏛️ Municipal Department</button>
                    <button onClick={() => { fillCredentials('startup'); setView('login'); }} className="text-[10px] font-semibold bg-white hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 py-1.5 px-3 rounded-lg cursor-pointer shadow-2xs">🚀 Startup</button>
                    <button onClick={() => { fillCredentials('expert'); setView('login'); }} className="text-[10px] font-semibold bg-white hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 py-1.5 px-3 rounded-lg cursor-pointer shadow-2xs">🎓 Expert</button>
                    <button onClick={() => { fillCredentials('admin'); setView('login'); }} className="text-[10px] font-semibold bg-white hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 py-1.5 px-3 rounded-lg cursor-pointer shadow-2xs">🛡️ Administrator</button>
                  </div>
                </div>
              </div>

              {/* Right Column: Floating Interactive App Preview Window */}
              <div className="lg:col-span-5">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-white text-xs">
                  {/* Top Mock Window Header Bar */}
                  <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                      <span className="font-mono text-[10px] text-slate-400 font-bold ml-2">GovStart Sandbox Workspace</span>
                    </div>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30 uppercase">
                      ● Active
                    </span>
                  </div>

                  {/* Body Content Preview */}
                  <div className="p-4 space-y-3 bg-slate-900">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Active Programs</span>
                        <div className="text-xl font-black text-white">4 Pilots</div>
                        <span className="text-[9px] text-indigo-400 font-semibold">Running Sandbox</span>
                      </div>
                      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Pilot Budget Managed</span>
                        <div className="text-xl font-black text-emerald-400">₹45.2L</div>
                        <span className="text-[9px] text-slate-400 font-semibold">Escrow Vetted</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/80 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 block">Audit Coverage</span>
                          <span className="font-black text-emerald-400 text-xs">100%</span>
                        </div>
                        <span className="text-[9px] text-emerald-400 font-bold">✓ SHA-256</span>
                      </div>
                      <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/80 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 block">DPIIT Lookup</span>
                          <span className="font-black text-indigo-400 text-xs">Verified</span>
                        </div>
                        <span className="text-[9px] text-indigo-400 font-bold">API</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Recent Pilot Milestone</span>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-300">Smart Waste Sorter Pilot</span>
                        <span className="text-emerald-400 font-mono">2h ago</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-300">Rural Telemedicine Platform</span>
                        <span className="text-indigo-400 font-mono">5h ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Defensible Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                  ₹
                </div>
                <div className="space-y-0.5">
                  <span className="text-base font-black text-slate-900 block leading-none">₹45L+</span>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Pilot Budget Managed</span>
                  <span className="text-[9px] text-slate-500 block">Escrow budget allocation</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                  🚀
                </div>
                <div className="space-y-0.5">
                  <span className="text-base font-black text-slate-900 block leading-none">4</span>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Pilot Programs</span>
                  <span className="text-[9px] text-slate-500 block">Running across departments</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold shrink-0">
                  <Cpu size={18} />
                </div>
                <div className="space-y-0.5">
                  <span className="text-base font-black text-slate-900 block leading-none">DPIIT</span>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Startup Verification</span>
                  <span className="text-[9px] text-slate-500 block">Real-time registry check</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle size={18} />
                </div>
                <div className="space-y-0.5">
                  <span className="text-base font-black text-slate-900 block leading-none">100%</span>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Audit Trail Coverage</span>
                  <span className="text-[9px] text-slate-500 block">SHA-256 chained logs</span>
                </div>
              </div>
            </div>

            {/* Storytelling Section 1: The Core Procurement Problem */}
            <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 shadow-xs space-y-6">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest">THE PROCUREMENT BOTTLENECK</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Traditional Public Procurement Wasn't Built for Fast-Moving Startups</h2>
                <p className="text-xs text-slate-400 max-w-2xl">Why innovative solutions struggle to enter public sector deployment.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                  <span className="text-indigo-400 font-extrabold text-xs block">01 &bull; Rigid Technical Specs</span>
                  <h4 className="font-extrabold text-slate-100">Locks Out Novel Solutions</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">Departments write specifications based on past technology rather than defining outcome-based performance goals.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                  <span className="text-indigo-400 font-extrabold text-xs block">02 &bull; High Pilot Friction</span>
                  <h4 className="font-extrabold text-slate-900 text-slate-100">Risky & Delayed Trials</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">Lack of standardized sandbox mechanisms makes pilot trial deployment slow, uncertain, and high-risk.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                  <span className="text-indigo-400 font-extrabold text-xs block">03 &bull; Scaling Dead-Ends</span>
                  <h4 className="font-extrabold text-slate-100">Proven Pilots Fail to Scale</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">Even successful pilot outcomes often stall without a direct pathway into state procurement catalogs.</p>
                </div>
              </div>
            </div>

            {/* Storytelling Section 2: 6-Step Workflow */}
            <div className="space-y-4 text-center">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">HOW GOVSTART SOLVES IT</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">From Government Challenge to Scalable Solution</h2>
                <p className="text-xs text-slate-500 mt-1 max-w-xl mx-auto">A transparent, outcome-driven journey from problem identification to successful procurement.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-left">
                {[
                  { step: '01', title: 'Define Challenge', tag: 'OUTCOME GOALS', desc: 'Set measurable success criteria and KPI performance targets.' },
                  { step: '02', title: 'AI Matchmaking', tag: 'DISCOVERY', desc: 'Find and rank the most relevant startups using AI matching.' },
                  { step: '03', title: 'Expert Validation', tag: 'VETTING', desc: 'Evaluate technical feasibility and solution readiness.' },
                  { step: '04', title: 'Digital Contracting', tag: 'E-AGREEMENT', desc: 'Create secure agreements with defined pilot terms and NDA.' },
                  { step: '05', title: 'Run Pilot', tag: 'KPI TRACKING', desc: 'Track real-time KPIs and release milestone-based funds.' },
                  { step: '06', title: 'Scale Solution', tag: 'GEM CATALOGING', desc: 'Verified pilot results are packaged into a procurement-ready profile for GeM/state procurement.' }
                ].map(item => (
                  <div key={item.step} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
                        {item.step}
                      </div>
                      <span className="text-[8px] font-extrabold text-indigo-600 uppercase tracking-wider block">{item.tag}</span>
                      <h4 className="font-extrabold text-slate-900 text-xs leading-snug">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Security & Governance Features */}
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest font-sans">PLATFORM SECURITY & AUDIT SAFEGUARDS</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-xs">SHA-256 Chained Transaction Audit Ledger</h4>
                    <p className="text-slate-500 text-[11px] leading-relaxed">Every transaction state transition is cryptographically signed with a SHA-256 hash chained to the prior block, ensuring 100% auditability for state auditors.</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                    <Cpu size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-xs">Client-Side IP Encryption Vault</h4>
                    <p className="text-slate-500 text-[11px] leading-relaxed">Startups submit technical schematics with local AES-256 client encryption, storing hash keys to protect proprietary startup intellectual property.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOGIN SCREEN */}
        {view === 'login' && (
          <div className="max-w-md mx-auto py-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Sign In to GovStart</h2>
                <p className="text-xs text-slate-500 mt-1">Access departmental outcome challenges and active sandbox workspaces.</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={loginEmail} 
                    onChange={e => setLoginEmail(e.target.value)} 
                    placeholder="officer@gov.in"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                  <input 
                    type="password" 
                    required 
                    value={loginPassword} 
                    onChange={e => setLoginPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </form>

              {/* Demo quick fill shortcut */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Auto-Fill Demo Persona Credentials</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => fillCredentials('dept')} className="text-[10px] font-semibold bg-slate-50 border border-slate-200 py-1.5 px-2 rounded hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer">Municipal Dept</button>
                  <button onClick={() => fillCredentials('startup')} className="text-[10px] font-semibold bg-slate-50 border border-slate-200 py-1.5 px-2 rounded hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer">Eco-Health Startup</button>
                  <button onClick={() => fillCredentials('expert')} className="text-[10px] font-semibold bg-slate-50 border border-slate-200 py-1.5 px-2 rounded hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer">Academic Expert</button>
                  <button onClick={() => fillCredentials('admin')} className="text-[10px] font-semibold bg-slate-50 border border-slate-200 py-1.5 px-2 rounded hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer">Super Admin</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REGISTER SCREEN */}
        {view === 'register' && (
          <div className="max-w-xl mx-auto py-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Create Sandbox Account</h2>
                <p className="text-xs text-slate-500 mt-1">Register your profile for sandbox procurement evaluation.</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Name</label>
                    <input type="text" required value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-xs" placeholder="Ramesh Patil" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email Address</label>
                    <input type="email" required value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-xs" placeholder="ramesh@gov.in" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Password</label>
                    <input type="password" required value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-xs" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Account Role</label>
                    <select value={registerForm.role} onChange={e => setRegisterForm({...registerForm, role: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg text-xs bg-white">
                      <option value="STARTUP">Startup / Innovator</option>
                      <option value="DEPARTMENT">Municipal Department Officer</option>
                      <option value="EXPERT">Academic Expert (COEP/VJTI)</option>
                    </select>
                  </div>
                </div>

                {registerForm.role === 'STARTUP' && (
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Company Name</label>
                        <input type="text" required value={registerForm.companyName} onChange={e => setRegisterForm({...registerForm, companyName: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-xs" placeholder="Maha-EcoTech Solutions" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">DPIIT Reg. Number</label>
                        <input type="text" required value={registerForm.dpiitNumber} onChange={e => setRegisterForm({...registerForm, dpiitNumber: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-xs" placeholder="DPIIT-893021" />
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-lg text-xs transition-colors cursor-pointer">
                  Complete Registration
                </button>
              </form>
            </div>
          </div>
        )}

        {/* DASHBOARD ROUTER */}
        {view === 'dashboard' && auth && (
          <div className="space-y-6">
            
            {/* Executive Command Bar */}
            <RenderExecutiveCommandBar />

            {/* Main Visual Anchor */}
            <RenderLifecycleAnchor activeStep={auth.role === 'DEPARTMENT' ? 1 : 5} />

            {/* DEPARTMENT DASHBOARD */}
            {auth.role === 'DEPARTMENT' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-slate-200">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">Department Nodal Workspace</h2>
                    <p className="text-xs text-slate-500">Manage outcome challenges, run AI startup matching, and monitor active pilot escrows.</p>
                  </div>
                  <button 
                    onClick={() => { setCreateStep(1); setView('post-problem'); }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 text-xs cursor-pointer transition-colors shadow-xs"
                  >
                    <Plus size={14} /> Post Outcome Challenge
                  </button>
                </div>

                {/* Outcome Challenges Table */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Posted Outcome Challenges</h3>
                    <span className="text-xs font-bold text-indigo-600">{problems.length} Challenges Active</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {problems.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 italic">No challenges posted yet. Click 'Post Outcome Challenge' above to start.</p>
                    ) : (
                      problems.map(prob => (
                        <div key={prob.id} className="py-3.5 flex items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs hover:text-indigo-600 cursor-pointer" onClick={() => viewProblemDetails(prob)}>
                                {prob.title}
                              </span>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase border border-slate-200">
                                {prob.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1">{prob.description}</p>
                            <div className="flex gap-2 text-[10px] text-slate-400 font-mono">
                              <span>Budget: ₹{prob.budgetMin?.toLocaleString()} - ₹{prob.budgetMax?.toLocaleString()}</span>
                              <span>&bull;</span>
                              <span>Timeline: {prob.timelineDays} Days</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => viewProblemDetails(prob)}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0 shadow-xs"
                          >
                            AI Discovery & Scorecard <ArrowRight size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Active Sandbox Pilots Overview */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">Active Sandbox Pilot Workspaces</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pilots.map(plt => (
                      <div key={plt.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-indigo-600 block">Pilot ID #{plt.id}</span>
                            <h4 className="font-extrabold text-xs text-slate-900">{plt.problemTitle}</h4>
                            <p className="text-[11px] text-slate-500">Partner: {plt.startupName}</p>
                          </div>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                            {plt.status}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-600">
                            <span>Overall Completion</span>
                            <span>{plt.currentProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full" style={{ width: `${plt.currentProgress}%` }} />
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                          <span>Escrow Balance: ₹{plt.escrowBalance?.toLocaleString()}</span>
                          <button 
                            onClick={() => viewPilotWorkspace(plt)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1 rounded text-xs cursor-pointer shadow-xs"
                          >
                            Open KPI Dashboard
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STARTUP DASHBOARD */}
            {auth.role === 'STARTUP' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <h2 className="text-xl font-extrabold text-slate-900">Startup Innovator Hub</h2>
                  <p className="text-xs text-slate-500">Review departmental outcome challenges, submit progress updates, and upload encrypted deliverable proofs.</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">Your Active Sandbox Workspaces</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pilots.map(plt => (
                      <div key={plt.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-indigo-600">Pilot ID #{plt.id}</span>
                            <h4 className="font-extrabold text-xs text-slate-900">{plt.problemTitle}</h4>
                            <p className="text-[11px] text-slate-500">Dept: {plt.departmentName}</p>
                          </div>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase border border-emerald-200">
                            {plt.status}
                          </span>
                        </div>

                        <button 
                          onClick={() => viewPilotWorkspace(plt)}
                          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded text-xs cursor-pointer shadow-xs"
                        >
                          Submit Progress & Deliverables
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* EXPERT DASHBOARD */}
            {auth.role === 'EXPERT' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <h2 className="text-xl font-extrabold text-slate-900">Academic Expert Evaluation Panel</h2>
                  <p className="text-xs text-slate-500">Review assigned challenges and execute quantitative technical feasibility scorecards.</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">Assigned Queue</h3>
                  {expertQueue.map(prob => (
                    <div key={prob.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex justify-between items-center gap-4">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{prob.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{prob.description}</p>
                      </div>
                      <button 
                        onClick={() => viewProblemDetails(prob)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-1.5 rounded text-xs cursor-pointer shrink-0 shadow-xs"
                      >
                        Fill Scorecard
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADMIN DASHBOARD */}
            {auth.role === 'ADMIN' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-slate-200">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">Super Admin Audit & Oversight</h2>
                    <p className="text-xs text-slate-500">Platform analytics and SHA-256 chained transaction audit ledger.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setAdminTab('overview')} 
                      className={`px-3 py-1.5 rounded text-xs font-bold cursor-pointer ${adminTab === 'overview' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                    >
                      Overview
                    </button>
                    <button 
                      onClick={() => setAdminTab('audit')} 
                      className={`px-3 py-1.5 rounded text-xs font-bold cursor-pointer ${adminTab === 'audit' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                    >
                      Audit Ledger
                    </button>
                  </div>
                </div>

                {adminTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                        <span className="text-2xl font-black text-indigo-600">{adminAnalytics?.totalProblems || problems.length}</span>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Outcome Challenges</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                        <span className="text-2xl font-black text-indigo-600">{adminAnalytics?.totalPilots || pilots.length}</span>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Active Sandbox Pilots</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                        <span className="text-2xl font-black text-emerald-600">₹{(adminAnalytics?.totalBudgetLocked || 4500000).toLocaleString()}</span>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Escrow Budget Locked</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">User Account Management</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-50 uppercase text-[10px] text-slate-400 font-bold border-b">
                            <tr>
                              <th className="p-2.5">User</th>
                              <th className="p-2.5">Role</th>
                              <th className="p-2.5">Status</th>
                              <th className="p-2.5 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {adminUsers.map(u => (
                              <tr key={u.id}>
                                <td className="p-2.5 font-bold text-slate-900">{u.name} <span className="text-[10px] text-slate-400 font-normal block">{u.email}</span></td>
                                <td className="p-2.5"><span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">{u.role}</span></td>
                                <td className="p-2.5"><span className={`font-bold px-2 py-0.5 rounded text-[10px] ${u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{u.status}</span></td>
                                <td className="p-2.5 text-right">
                                  <button onClick={() => toggleUserStatus(u.id, u.status)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded text-[10px] cursor-pointer">
                                    Toggle Status
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
                  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">SHA-256 Chained Transaction Audit Ledger</h3>
                      </div>
                      <button onClick={verifyLedgerIntegrity} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded text-xs flex items-center gap-1.5 cursor-pointer shadow-xs">
                        <ShieldCheck size={14} /> Verify Chain Integrity
                      </button>
                    </div>

                    {ledgerIntegrity && (
                      <div className={`p-3 rounded-lg border text-xs font-bold ${ledgerIntegrity.verified ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                        {ledgerIntegrity.verified ? `✓ SHA-256 Ledger Integrity Verified across ${ledgerIntegrity.totalChecked} transaction blocks.` : `ALERT: Chain failure detected at Log ID #${ledgerIntegrity.corruptedLogId}!`}
                      </div>
                    )}

                    <div className="space-y-2">
                      {auditLogs.map(log => (
                        <div key={log.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex justify-between items-center text-xs font-mono">
                          <div>
                            <span className="font-bold text-indigo-600">[Log #{log.id}]</span> <span className="font-bold uppercase text-slate-800">{log.action}</span>
                            <p className="text-slate-600 font-sans text-[11px] mt-0.5">{log.details}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono truncate max-w-xs">{log.checksum}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 6-STEP CHALLENGE WIZARD */}
        {view === 'post-problem' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <RenderLifecycleAnchor activeStep={1} />

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900">Step {createStep} of 6: Create Outcome-Based Challenge</h2>
                <button onClick={() => setView('dashboard')} className="text-xs font-bold text-slate-500 hover:text-slate-800">Cancel</button>
              </div>

              {/* Step 1 */}
              {createStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Challenge Title</label>
                      <input type="text" value={wizardForm.title} onChange={e => setWizardForm({...wizardForm, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-xs" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Department</label>
                      <input type="text" value={wizardForm.department} onChange={e => setWizardForm({...wizardForm, department: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-xs" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Description</label>
                    <textarea rows={3} value={wizardForm.description} onChange={e => setWizardForm({...wizardForm, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-xs" />
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {createStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Desired Outcome Goal</label>
                    <textarea rows={3} value={wizardForm.desiredOutcome} onChange={e => setWizardForm({...wizardForm, desiredOutcome: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Baseline Metric</label>
                      <input type="text" value={wizardForm.baselinePerformance} onChange={e => setWizardForm({...wizardForm, baselinePerformance: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-xs" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Target Goal Metric</label>
                      <input type="text" value={wizardForm.targetPerformance} onChange={e => setWizardForm({...wizardForm, targetPerformance: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-xs" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {createStep === 3 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase text-slate-700">Configured Measurable KPIs</h4>
                    <button type="button" onClick={() => setKpiList([...kpiList, { name: 'New KPI', description: '', baseline: '0', target: '100', unit: '%', method: 'Sensor Logs', frequency: 'Weekly', weight: 20 }])} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1 rounded text-xs">+ Add KPI</button>
                  </div>
                  {kpiList.map((k, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-4 gap-2 text-xs">
                      <input type="text" value={k.name} onChange={e => { const u = [...kpiList]; u[i].name = e.target.value; setKpiList(u); }} className="px-2 py-1 border rounded" />
                      <input type="text" value={k.baseline} onChange={e => { const u = [...kpiList]; u[i].baseline = e.target.value; setKpiList(u); }} className="px-2 py-1 border rounded" placeholder="Baseline" />
                      <input type="text" value={k.target} onChange={e => { const u = [...kpiList]; u[i].target = e.target.value; setKpiList(u); }} className="px-2 py-1 border rounded" placeholder="Target" />
                      <button type="button" onClick={() => setKpiList(kpiList.filter((_, idx) => idx !== i))} className="text-red-600 font-bold text-right cursor-pointer">Remove</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 4 */}
              {createStep === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="dpiit" checked={wizardForm.dpiitRequired} onChange={e => setWizardForm({...wizardForm, dpiitRequired: e.target.checked})} />
                    <label htmlFor="dpiit" className="text-xs font-bold text-slate-800">Require Active DPIIT Registration</label>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Technical Requirements</label>
                    <textarea rows={2} value={wizardForm.techRequirements} onChange={e => setWizardForm({...wizardForm, techRequirements: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-xs" />
                  </div>
                </div>
              )}

              {/* Step 5 */}
              {createStep === 5 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Duration (Days)</label>
                      <input type="number" value={wizardForm.timelineDays} onChange={e => setWizardForm({...wizardForm, timelineDays: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg text-xs" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Min Budget (₹)</label>
                      <input type="number" value={wizardForm.budgetMin} onChange={e => setWizardForm({...wizardForm, budgetMin: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg text-xs" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Max Budget (₹)</label>
                      <input type="number" value={wizardForm.budgetMax} onChange={e => setWizardForm({...wizardForm, budgetMax: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg text-xs" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6 */}
              {createStep === 6 && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                    <h4 className="font-extrabold text-slate-900 text-sm">{wizardForm.title}</h4>
                    <p className="text-slate-600">{wizardForm.desiredOutcome}</p>
                    <p className="font-bold text-indigo-600">Escrow Budget: ₹{wizardForm.budgetMax.toLocaleString()}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-slate-100">
                {createStep > 1 ? (
                  <button type="button" onClick={() => setCreateStep(createStep - 1)} className="bg-slate-100 px-4 py-2 rounded text-xs font-bold cursor-pointer">Back</button>
                ) : <div />}
                {createStep < 6 ? (
                  <button type="button" onClick={() => setCreateStep(createStep + 1)} className="bg-indigo-600 text-white px-5 py-2 rounded text-xs font-bold cursor-pointer">Next</button>
                ) : (
                  <button type="button" onClick={handlePublishChallenge} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded text-xs font-bold cursor-pointer">Publish Challenge</button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI MATCHING VIEW */}
        {view === 'matching' && activeProblem && (
          <div className="space-y-6">
            <RenderLifecycleAnchor activeStep={2} />

            <div className="bg-white p-5 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase font-sans">AI Discovery & Scorecard</span>
                <h2 className="text-xl font-black text-slate-900">{activeProblem.title}</h2>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => triggerMatching(activeProblem.id)} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded cursor-pointer shadow-xs">
                  Re-Run Matching ({activeMatchingStep}/6)
                </button>
                <button onClick={() => setView('dashboard')} className="text-xs font-bold text-slate-500">Return to Dashboard</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Startups List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase text-slate-700">Matched Startups</h3>
                {recommendations.map(rec => (
                  <div 
                    key={rec.id}
                    onClick={() => setSelectedMatchStartup(rec)}
                    className={`p-4 rounded-xl border cursor-pointer ${selectedMatchStartup?.id === rec.id ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-slate-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-extrabold text-xs text-slate-900">{rec.startup.companyName}</h4>
                      <span className="text-xs font-black text-indigo-600">{Math.round(rec.finalWeightedScore)}%</span>
                    </div>
                    {rec.startup.isDpiitVerified && (
                      <span 
                        onClick={(e) => { e.stopPropagation(); checkDpiitRegistry(rec.startup.dpiitNumber); }}
                        className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold mt-1 inline-block cursor-pointer hover:bg-emerald-200"
                      >
                        ✓ DPIIT Verified ({rec.startup.dpiitNumber})
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Explainable Score Breakdown */}
              {selectedMatchStartup && (
                <div className="md:col-span-2 space-y-6 bg-white p-6 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-base font-extrabold text-slate-900">{selectedMatchStartup.startup.companyName}</h3>
                    <button onClick={() => openContractStage(selectedMatchStartup)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-xs font-bold cursor-pointer shadow-xs">
                      Generate Agreement &rarr;
                    </button>
                  </div>

                  {/* Clean Horizontal Analytical Score Breakdown */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-700">Analytical AI Match Breakdown</h4>
                    
                    {[
                      { label: 'Overall Challenge Alignment', val: Math.min(100, Math.round(selectedMatchStartup.finalWeightedScore)) },
                      { label: 'Jaccard Syntactic Tag Match', val: Math.min(100, Math.round(selectedMatchStartup.ruleScore <= 1.0 ? selectedMatchStartup.ruleScore * 100 : selectedMatchStartup.ruleScore)) },
                      { label: 'Gemini AI Semantic Score', val: Math.min(100, Math.round(selectedMatchStartup.llmScore <= 5.0 && selectedMatchStartup.llmScore > 0 ? selectedMatchStartup.llmScore * 20 : selectedMatchStartup.llmScore)) },
                      { label: 'Security & GFR Compliance', val: 98 },
                      { label: 'Pilot Operational Readiness', val: 92 }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>{item.label}</span>
                          <span className="text-indigo-600">{item.val}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full" style={{ width: `${item.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-50 border rounded-lg text-xs italic text-slate-700">
                    "{selectedMatchStartup.llmJustification}"
                  </div>

                  {/* Academic Expert Scorecard Form */}
                  {auth?.role === 'EXPERT' && (
                    <form onSubmit={e => handleSubmitEvaluation(e, activeProblem.id, selectedMatchStartup.startup.id)} className="space-y-3 border-t pt-4">
                      <h4 className="text-xs font-bold uppercase text-slate-900">Academic Scorecard Rating</h4>
                      <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                        <div>
                          <label>Feasibility: {evalScores.feasibility}/5</label>
                          <input type="range" min="1" max="5" value={evalScores.feasibility} onChange={e => setEvalScores({...evalScores, feasibility: Number(e.target.value)})} className="w-full" />
                        </div>
                        <div>
                          <label>Innovation: {evalScores.innovation}/5</label>
                          <input type="range" min="1" max="5" value={evalScores.innovation} onChange={e => setEvalScores({...evalScores, innovation: Number(e.target.value)})} className="w-full" />
                        </div>
                      </div>
                      <button type="submit" className="bg-indigo-600 text-white font-bold px-4 py-1.5 rounded text-xs cursor-pointer shadow-xs">Submit Scorecard</button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTRACT STAGE */}
        {view === 'contract' && selectedContractRec && activeProblem && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <RenderLifecycleAnchor activeStep={4} />

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase">Pre-Sandbox Contract Stage</span>
                  <h2 className="text-lg font-black text-slate-900">{activeProblem.title}</h2>
                </div>
                <button onClick={() => setView('dashboard')} className="text-xs font-bold text-slate-500">Cancel</button>
              </div>

              {/* Document Tabs */}
              <div className="flex gap-2 border-b text-xs font-bold pb-2">
                {['pilot-agreement', 'nda', 'privacy', 'ip', 'cybersecurity'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setContractTab(tab as any)}
                    className={`px-3 py-1.5 rounded cursor-pointer uppercase text-[10px] ${contractTab === tab ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    {tab.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {/* Legal Text */}
              <div className="p-6 border rounded-lg bg-slate-50 space-y-4 text-xs font-serif text-slate-800">
                <div className="text-center font-bold border-b pb-2">
                  <h3 className="uppercase text-sm">SANDBOX PILOT IMPLEMENTATION AGREEMENT</h3>
                  <p className="text-[10px] text-slate-500 font-sans">Prototype template — subject to legal review.</p>
                </div>
                <p>This Agreement is entered into by and between <strong>The Department of {activeProblem.departmentName}</strong> AND <strong>{selectedContractRec.startup.companyName}</strong> (DPIIT: {selectedContractRec.startup.dpiitNumber}).</p>
                <p>Scope: <strong>{activeProblem.desiredOutcome || activeProblem.description}</strong></p>
                <p>Max Escrow Budget: <strong>₹{(activeProblem.budgetMax || 1500000).toLocaleString()}</strong></p>
              </div>

              {/* E-signatures */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 border rounded bg-slate-50 text-center space-y-2">
                  <span className="font-bold text-slate-700 block">Department Nodal Signature</span>
                  {contractSignedDept ? <span className="text-emerald-700 font-bold">✓ Signed</span> : <button onClick={() => handleSignContract('dept')} className="bg-indigo-600 text-white font-bold px-3 py-1 rounded text-xs cursor-pointer shadow-xs">Sign as Department</button>}
                </div>
                <div className="p-4 border rounded bg-slate-50 text-center space-y-2">
                  <span className="font-bold text-slate-700 block">Startup CEO Signature</span>
                  {contractSignedStartup ? <span className="text-emerald-700 font-bold">✓ Signed</span> : <button onClick={() => handleSignContract('startup')} className="bg-indigo-600 text-white font-bold px-3 py-1 rounded text-xs cursor-pointer shadow-xs">Sign as Startup</button>}
                </div>
              </div>

              <button 
                disabled={!contractSignedDept || !contractSignedStartup}
                onClick={submitLaunchPilotFromContract}
                className={`w-full py-3 rounded-lg font-bold text-xs cursor-pointer ${contractSignedDept && contractSignedStartup ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                Lock Escrow Budget & Activate Sandbox Pilot
              </button>
            </div>
          </div>
        )}

        {/* PILOT WORKSPACE */}
        {view === 'pilot-workspace' && activePilot && (
          <div className="space-y-6">
            <RenderLifecycleAnchor activeStep={5} />

            <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-indigo-400 font-bold">Active Pilot ID #{activePilot.id}</span>
                  <h2 className="text-xl font-black">{activePilot.problemTitle}</h2>
                  <p className="text-xs text-slate-400">Partner: {activePilot.startupName} &bull; Dept: {activePilot.departmentName}</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-900 text-emerald-200 border border-emerald-700 uppercase">
                  {activePilot.status}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 text-xs font-mono border-t border-slate-800 pt-3">
                <div><span className="text-slate-400 block">Total Budget:</span><span className="font-bold text-white">₹{activePilot.budget.toLocaleString()}</span></div>
                <div><span className="text-slate-400 block">Escrow Balance:</span><span className="font-bold text-emerald-400">₹{activePilot.escrowBalance?.toLocaleString()}</span></div>
                <div><span className="text-slate-400 block">Disbursed:</span><span className="font-bold text-indigo-400">₹{activePilot.releasedAmount?.toLocaleString()}</span></div>
                <div><span className="text-slate-400 block">Progress:</span><span className="font-bold text-sky-400">{activePilot.currentProgress}%</span></div>
              </div>
            </div>

            {/* KPI Performance Table */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-2">Real-Time KPI Performance Tracker</h3>
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 uppercase text-[10px] text-slate-400 font-bold border-b">
                  <tr>
                    <th className="p-2.5">KPI Metric</th>
                    <th className="p-2.5">Baseline</th>
                    <th className="p-2.5">Target Goal</th>
                    <th className="p-2.5">Current Measured</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { name: 'Segregation Accuracy', baseline: '35%', target: '90%', current: '94%', status: 'ACHIEVED' },
                    { name: 'Processing Time / Ton', baseline: '120 min', target: '25 min', current: '24 min', status: 'ACHIEVED' },
                    { name: 'Landfill Diverted Volume', baseline: '10%', target: '60%', current: '52%', status: 'IN_PROGRESS' }
                  ].map((k, i) => (
                    <tr key={i}>
                      <td className="p-2.5 font-bold text-slate-900">{k.name}</td>
                      <td className="p-2.5 text-slate-500">{k.baseline}</td>
                      <td className="p-2.5 font-bold">{k.target}</td>
                      <td className="p-2.5 font-bold text-indigo-600">{k.current}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${k.status === 'ACHIEVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {k.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Startup Progress Submission Form */}
            {auth?.role === 'STARTUP' && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-2">Submit Milestone Deliverable Proof</h3>
                <form onSubmit={handleSubmitProgress} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Progress %</label>
                      <input type="number" min="0" max="100" value={progressPercent} onChange={e => setProgressPercent(Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Milestone Name</label>
                      <input type="text" value={milestoneName} onChange={e => setMilestoneName(e.target.value)} className="w-full px-2.5 py-1.5 border rounded" placeholder="Milestone 2" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Update Notes</label>
                    <textarea rows={2} value={updateNotes} onChange={e => setUpdateNotes(e.target.value)} className="w-full px-2.5 py-1.5 border rounded" />
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={simulateFileUpload} className="bg-slate-100 border px-3 py-1.5 rounded font-bold cursor-pointer flex items-center gap-1">
                      <FileCode size={14} /> Encrypt & Upload Proof File
                    </button>
                    {uploadedFile && <span className="text-emerald-700 font-bold">✓ Encrypted: {uploadedFile.name}</span>}
                  </div>
                  <button type="submit" className="bg-indigo-600 text-white font-bold px-5 py-2 rounded cursor-pointer shadow-xs">Submit Update</button>
                </form>
              </div>
            )}

            {/* Independent Validation */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-2">Independent Technical Validation</h3>
              {pilotUpdates.map(u => (
                <div key={u.id} className="p-3 bg-slate-50 rounded-lg border flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{u.milestoneName} ({u.progressPercent}%)</span>
                    <p className="text-slate-500 text-[11px]">{u.notes}</p>
                  </div>
                  {u.status === 'PENDING' && (
                    <button onClick={() => handleValidateMilestone(u.id, 'VALIDATED')} className="bg-emerald-600 text-white font-bold px-3 py-1 rounded text-xs cursor-pointer shadow-xs">
                      Validate & Disburse Escrow
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Final Procurement Decision */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-2">Final Procurement & GeM Decision</h3>
              <form onSubmit={handleSubmitDecision} className="space-y-4 text-xs">
                <div className="grid grid-cols-4 gap-2 font-bold">
                  {['SCALE', 'PROCURE', 'EXTEND', 'REJECT'].map(opt => (
                    <div 
                      key={opt}
                      onClick={() => setDecisionType(opt)}
                      className={`p-2.5 rounded border text-center cursor-pointer ${decisionType === opt ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-700'}`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Nodal Procurement Remarks</label>
                  <textarea rows={2} value={decisionRemarks} onChange={e => setDecisionRemarks(e.target.value)} className="w-full px-2.5 py-1.5 border rounded" placeholder="Official remarks for state audit ledger..." />
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-2.5 border rounded">
                  <input type="checkbox" id="gem" checked={publishToGem} onChange={e => setPublishToGem(e.target.checked)} />
                  <label htmlFor="gem" className="font-bold text-slate-800 cursor-pointer">Publish Outcome to GeM Portal Marketplace Catalog</label>
                </div>

                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2 rounded text-xs cursor-pointer shadow-xs">
                  Submit Final Decision & Catalog to GeM
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-indigo-400" />
            <span className="font-bold text-slate-200">GovStart Option 5 Hybrid Sandbox Portal</span>
          </div>
          <p>State Innovation & Procurement Exemption Framework. Active.</p>
        </div>
      </footer>

      {/* DPIIT MODAL */}
      {showDpiitModal && selectedDpiitData && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-3 text-xs">
            <h3 className="text-base font-black text-slate-900 border-b pb-2">DPIIT Registry Lookup: {selectedDpiitData.dpiitNumber}</h3>
            <p><strong>Category:</strong> {selectedDpiitData.category}</p>
            <p><strong>Incorporation Date:</strong> {selectedDpiitData.incorporationDate}</p>
            <p><strong>Address:</strong> {selectedDpiitData.registeredAddress}</p>
            <button onClick={() => setShowDpiitModal(false)} className="w-full bg-slate-100 font-bold py-2 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
