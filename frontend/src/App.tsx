import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Rocket, 
  GraduationCap, 
  ShieldCheck, 
  LogOut, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Users, 
  BarChart3, 
  Settings, 
  Clock, 
  Award, 
  ChevronRight, 
  UserCheck, 
  FileText, 
  Briefcase, 
  TrendingUp, 
  Cpu, 
  DollarSign
} from 'lucide-react';

// Types
interface AuthState {
  token: string;
  email: string;
  role: 'DEPARTMENT' | 'STARTUP' | 'EXPERT' | 'ADMIN';
  userId: number;
  name: string;
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
}

interface Recommendation {
  id: number;
  problem: { id: number; title: string };
  startup: { id: number; companyName: string; description: string; tags: string[]; isDpiitVerified: boolean; dpiitNumber: string };
  ruleScore: number;
  llmScore: number;
  finalWeightedScore: number;
  llmJustification: string;
  rankPosition: number;
}

interface ExpertMatch {
  expert: { id: number; user: { name: string }; expertiseDomain: string; designation: string; expertTags: string[] };
  matchingScore: number;
}

interface Evaluation {
  id: number;
  problemId: number;
  problemTitle: string;
  startupId: number;
  startupName: string;
  expertName: string;
  feasibilityScore: number;
  innovationScore: number;
  teamScore: number;
  costScore: number;
  avgScore: number;
  comments: string;
  createdAt: string;
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
  const [suggestedExperts, setSuggestedExperts] = useState<ExpertMatch[]>([]);
  const [problemEvaluations, setProblemEvaluations] = useState<Evaluation[]>([]);
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [activePilot, setActivePilot] = useState<Pilot | null>(null);
  const [pilotUpdates, setPilotUpdates] = useState<PilotUpdate[]>([]);
  const [expertQueue, setExpertQueue] = useState<Problem[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [adminAnalytics, setAdminAnalytics] = useState<Analytics | null>(null);

  // Pilot Modal
  const [showPilotModal, setShowPilotModal] = useState(false);
  const [pilotTab, setPilotTab] = useState<'milestones' | 'legal'>('milestones');
  const [adminTab, setAdminTab] = useState<'overview' | 'audit'>('overview');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [ledgerIntegrity, setLedgerIntegrity] = useState<{ verified: boolean; corruptedLogId: number | null; totalChecked: number } | null>(null);
  const [selectedDpiitData, setSelectedDpiitData] = useState<{ dpiitNumber: string; incorporationDate: string; category: string; registeredAddress: string; directors: string[]; status: string } | null>(null);
  const [publishToGem, setPublishToGem] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; hash: string } | null>(null);
  const [showDpiitModal, setShowDpiitModal] = useState(false);
  const [pilotForm, setPilotForm] = useState({ scope: '', budget: 1500000, startDate: '', endDate: '' });
  const [selectedStartupRec, setSelectedStartupRec] = useState<Recommendation | null>(null);

  // Pilot Update Form
  const [progressPercent, setProgressPercent] = useState(0);
  const [milestoneName, setMilestoneName] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');

  // Decision Form
  const [decisionType, setDecisionType] = useState('SCALE');
  const [decisionRemarks, setDecisionRemarks] = useState('');

  // Evaluation Score Form
  const [evalScores, setEvalScores] = useState({ feasibility: 4, innovation: 4, team: 4, cost: 4, comments: '' });

  // Problem creation form
  const [newProblem, setNewProblem] = useState({ title: '', description: '', tags: '', budgetMin: 500000, budgetMax: 2000000, timelineDays: 180 });

  // Toast utility
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Safe fetch helper
  const API_BASE = import.meta.env.VITE_API_BASE || '';

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
      if (e.message !== 'Unauthorized') {
        showToast(e.message || 'API request failed', 'error');
      }
      throw e;
    }
  };

  // Sync auth with storage & change default view
  useEffect(() => {
    if (auth) {
      localStorage.setItem('govstart_auth', JSON.stringify(auth));
      setView('dashboard');
      loadDashboardData();
    } else {
      localStorage.removeItem('govstart_auth');
      setView('landing');
    }
  }, [auth]);

  const loadDashboardData = async () => {
    if (!auth) return;
    try {
      if (auth.role === 'DEPARTMENT') {
        const list = await apiFetch('/api/problems');
        setProblems(list);
        const pilotList = await apiFetch('/api/pilots');
        setPilots(pilotList);
      } else if (auth.role === 'STARTUP') {
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
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      setAuth(result);
      showToast('Logged in successfully!');
    } catch (err) {}
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        role: registerForm.role
      };

      if (registerForm.role === 'DEPARTMENT') {
        payload.deptName = registerForm.deptName;
        payload.deptAddress = registerForm.deptAddress;
        payload.deptContactPerson = registerForm.deptContactPerson;
      } else if (registerForm.role === 'STARTUP') {
        payload.companyName = registerForm.companyName;
        payload.startupDescription = registerForm.startupDescription;
        payload.startupDomain = registerForm.startupDomain;
        payload.startupTags = registerForm.startupTagsString.split(',').map(t => t.trim()).filter(Boolean);
        payload.teamSize = registerForm.teamSize;
        payload.foundedYear = registerForm.foundedYear;
        payload.dpiitNumber = registerForm.dpiitNumber;
      } else if (registerForm.role === 'EXPERT') {
        payload.expertDomain = registerForm.expertDomain;
        payload.expertDesignation = registerForm.expertDesignation;
        payload.expertTags = registerForm.expertTagsString.split(',').map(t => t.trim()).filter(Boolean);
      }

      await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      showToast('Registration successful! Please log in.');
      setView('login');
      setLoginEmail(registerForm.email);
      setLoginPassword('');
    } catch (err) {}
  };

  const handleLogout = () => {
    setAuth(null);
    setView('landing');
  };

  // Quick helper to fill credentials for demo
  const fillCredentials = (role: string) => {
    if (role === 'admin') {
      setLoginEmail('admin@govstart.gov.in');
      setLoginPassword('AdminPass_GovStart_2026!');
    } else if (role === 'dept') {
      setLoginEmail('dept@govstart.gov.in');
      setLoginPassword('DeptPass_GovStart_2026!');
    } else if (role === 'startup') {
      setLoginEmail('ecotech@startups.in');
      setLoginPassword('StartupPass_GovStart_2026!');
    } else if (role === 'expert') {
      setLoginEmail('kulkarni@coep.ac.in');
      setLoginPassword('ExpertPass_GovStart_2026!');
    }
  };

  // Guest Demo Login which executes login automatically
  const handleGuestLogin = async (role: string) => {
    let email = '';
    let password = '';
    if (role === 'admin') {
      email = 'admin@govstart.gov.in';
      password = 'AdminPass_GovStart_2026!';
    } else if (role === 'dept') {
      email = 'dept@govstart.gov.in';
      password = 'DeptPass_GovStart_2026!';
    } else if (role === 'startup') {
      email = 'ecotech@startups.in';
      password = 'StartupPass_GovStart_2026!';
    } else if (role === 'expert') {
      email = 'kulkarni@coep.ac.in';
      password = 'ExpertPass_GovStart_2026!';
    }
    
    try {
      showToast(`Logging in as Guest ${role.toUpperCase()}...`);
      const result = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      setAuth(result);
      showToast('Logged in successfully as Guest!');
    } catch (err) {
      showToast('Failed to log in as Guest', 'error');
    }
  };

  // Department: Create problem
  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProblem,
        tags: newProblem.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      await apiFetch('/api/problems', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      showToast('Challenge posted successfully!');
      setNewProblem({ title: '', description: '', tags: '', budgetMin: 500000, budgetMax: 2000000, timelineDays: 180 });
      loadDashboardData();
      setView('dashboard');
    } catch (err) {}
  };

  // View Problem Details
  const viewProblemDetails = async (problem: Problem) => {
    setActiveProblem(problem);
    setView('problem-detail');
    try {
      // Fetch recommendations (which matches and saves them)
      const recs = await apiFetch(`/api/problems/${problem.id}/recommendations`);
      setRecommendations(recs);
      // Fetch suggested experts
      const exps = await apiFetch(`/api/evaluations/problem/${problem.id}/experts/suggested`);
      setSuggestedExperts(exps);
      // Fetch evaluations
      const evals = await apiFetch(`/api/evaluations/problem/${problem.id}`);
      setProblemEvaluations(evals);
    } catch (e) {}
  };

  // Trigger matching manually
  const triggerMatching = async (problemId: number) => {
    try {
      showToast('Running algorithms & Gemini semantic evaluation...');
      const recs = await apiFetch(`/api/problems/${problemId}/recommendations`, { method: 'POST' });
      setRecommendations(recs);
      showToast('Recommendations matching completed!');
    } catch (e) {}
  };

  // Assign expert
  const assignExpert = (expertName: string) => {
    showToast(`Expert ${expertName} assigned to evaluate proposals.`);
  };

  // Open Pilot Modal
  const openPilotCreation = (rec: Recommendation) => {
    setSelectedStartupRec(rec);
    setPilotForm({
      scope: `Deployment of pilot for: ${activeProblem?.title}`,
      budget: activeProblem?.budgetMax || 1500000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setShowPilotModal(true);
  };

  // Start pilot
  const submitLaunchPilot = async () => {
    if (!selectedStartupRec || !activeProblem) return;
    try {
      const payload = {
        problemId: activeProblem.id,
        startupId: selectedStartupRec.startup.id,
        scope: pilotForm.scope,
        startDate: pilotForm.startDate,
        endDate: pilotForm.endDate,
        budget: pilotForm.budget
      };
      await apiFetch('/api/pilots', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      showToast('Pilot sandbox launched successfully!');
      setShowPilotModal(false);
      loadDashboardData();
      setView('dashboard');
    } catch (e) {}
  };

  // View Pilot Workspace
  const viewPilotWorkspace = async (pilot: Pilot) => {
    setActivePilot(pilot);
    setView('pilot-workspace');
    setProgressPercent(pilot.currentProgress);
    setMilestoneName('');
    setUpdateNotes('');
    try {
      const updates = await apiFetch(`/api/pilots/${pilot.id}/updates`);
      setPilotUpdates(updates);
    } catch (e) {}
  };

  // Startup: submit progress
  const handleSubmitProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePilot) return;
    try {
      const payload = {
        progressPercent,
        notes: updateNotes,
        milestoneName,
        attachmentName: uploadedFile?.name || null,
        attachmentHash: uploadedFile?.hash || null
      };
      await apiFetch(`/api/pilots/${activePilot.id}/updates`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      showToast('Milestone progress uploaded!');
      // reload
      const updatedPilot = await apiFetch(`/api/pilots/${activePilot.id}`);
      setActivePilot(updatedPilot);
      const updates = await apiFetch(`/api/pilots/${activePilot.id}/updates`);
      setPilotUpdates(updates);
      setMilestoneName('');
      setUpdateNotes('');
      setUploadedFile(null);
    } catch (e) {}
  };

  // DPIIT registry verifier
  const handleVerifyDpiit = async (number: string) => {
    try {
      showToast('Connecting to DPIIT Startup Registry API...');
      const data = await apiFetch(`/api/integration/dpiit/${number}`);
      setSelectedDpiitData(data);
      setShowDpiitModal(true);
    } catch (e) {
      showToast('DPIIT registry lookup failed', 'error');
    }
  };

  // Verify Chained Ledger Integrity
  const handleVerifyLedger = async () => {
    try {
      showToast('Running SHA-256 cryptographic check on all audit blocks...');
      const data = await apiFetch('/api/integration/audit-logs/verify', { method: 'POST' });
      setLedgerIntegrity(data);
      if (data.verified) {
        showToast('Ledger Integrity Verified. 0 Tampered Blocks Detected.');
      } else {
        showToast(`Ledger Corruption Detected at Block ID: ${data.corruptedLogId}!`, 'error');
      }
      // reload logs
      const logs = await apiFetch('/api/integration/audit-logs');
      setAuditLogs(logs);
    } catch (e) {
      showToast('Ledger verification failed', 'error');
    }
  };

  // Publish Pilot to GeM
  const handlePublishToGem = async (pilotId: number, catalogTitle: string) => {
    try {
      showToast('Connecting to GeM Portal Marketplace APIs...');
      const response = await apiFetch('/api/integration/gem/publish', {
        method: 'POST',
        body: JSON.stringify({ pilotId, catalogTitle })
      });
      showToast(`Published successfully to GeM Portal! ID: ${response.gemCatalogId}`);
      loadDashboardData();
    } catch (e) {
      showToast('Failed to publish to GeM', 'error');
    }
  };

  // Simulate file upload with AES-256 local mock encryption
  const simulateFileUpload = () => {
    const mockFiles = [
      { name: "technical_schematic_v2.pdf", hash: "9a4f2c8d3e1b7f0a5c8d3e1b7f0a5c8d3e1b7f0a5c8d3e1b7f0a5c8d3e1b7f0a" },
      { name: "software_architecture_confidential.pdf", hash: "ecotech_a1f9e2b83c1827e8391782deac7728f3918a2cd89f2139bdeac2a89f92ce" },
      { name: "operational_sla_metrics.csv", hash: "f39b1a8d29837cd82c18d9f3a9a1029c8e82ef39cd28d7e7e8ab219d3cd2f2ef" }
    ];
    const file = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    setUploadedFile(file);
    showToast(`IP Protected Vault: Encrypted ${file.name} successfully!`);
  };

  // Department: approve milestone
  const handleApproveMilestone = async (updateId: number) => {
    if (!activePilot) return;
    try {
      showToast('Processing milestone approval & escrow release...');
      await apiFetch(`/api/pilots/updates/${updateId}/approve`, {
        method: 'POST'
      });
      showToast('Milestone approved! Funds released from escrow.');
      // reload
      const updatedPilot = await apiFetch(`/api/pilots/${activePilot.id}`);
      setActivePilot(updatedPilot);
      const updates = await apiFetch(`/api/pilots/${activePilot.id}/updates`);
      setPilotUpdates(updates);
    } catch (e) {}
  };

  // Simulate SLA Expiry Trigger
  const handleSlaTrigger = async (updateId: number) => {
    if (!activePilot) return;
    try {
      showToast('Simulating 7-day SLA expiry...');
      await apiFetch(`/api/pilots/updates/${updateId}/sla-trigger`, {
        method: 'POST'
      });
      showToast('SLA Expired! Milestone auto-approved & funds released.');
      // reload
      const updatedPilot = await apiFetch(`/api/pilots/${activePilot.id}`);
      setActivePilot(updatedPilot);
      const updates = await apiFetch(`/api/pilots/${activePilot.id}/updates`);
      setPilotUpdates(updates);
    } catch (e) {}
  };

  // Department: make decision
  const handleSubmitDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePilot) return;
    try {
      const payload = {
        pilotId: activePilot.id,
        decisionType,
        remarks: decisionRemarks
      };
      await apiFetch('/api/pilots/decision', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      showToast(`Final decision made: ${decisionType}`);
      
      if (publishToGem && (decisionType === 'SCALE' || decisionType === 'PROCURE')) {
        await handlePublishToGem(activePilot.id, activePilot.problemTitle + " - Certified Innovative Solution");
      }
      setPublishToGem(false);
      loadDashboardData();
      setView('dashboard');
    } catch (e) {}
  };

  // Expert: Submit Score Card
  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProblem) return;
    // For demo, we evaluate one startup
    // We pick the first recommended startup in the list for scoring
    if (recommendations.length === 0) {
      showToast('No recommended startup found in queue.', 'error');
      return;
    }
    const startupId = recommendations[0].startup.id;
    try {
      const payload = {
        problemId: activeProblem.id,
        startupId,
        feasibilityScore: evalScores.feasibility,
        innovationScore: evalScores.innovation,
        teamScore: evalScores.team,
        costScore: evalScores.cost,
        comments: evalScores.comments
      };
      await apiFetch('/api/evaluations', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      showToast('Evaluation scorecard submitted!');
      setEvalScores({ feasibility: 4, innovation: 4, team: 4, cost: 4, comments: '' });
      loadDashboardData();
      setView('dashboard');
    } catch (e) {}
  };

  // Admin: Toggle status
  const toggleUserStatus = async (userId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
    try {
      await apiFetch(`/api/admin/users/${userId}/status?status=${nextStatus}`, { method: 'POST' });
      showToast('User status updated');
      const users = await apiFetch('/api/admin/users');
      setAdminUsers(users);
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Toast Alert Banner */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl text-white transition-all flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      {/* Header / Navbar */}
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(auth ? 'dashboard' : 'landing')}>
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Building2 size={24} className="animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
                GovStart
              </span>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Maharashtra Procurement Mechanism</p>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            {auth ? (
              <div className="flex items-center gap-4">
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
                <Award size={12} className="text-indigo-600" /> SIH26136 Innovation Pathway
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none sm:text-6xl">
                Bypassing Procurement Barriers for <span className="text-indigo-600">Startups</span>
              </h1>
              <p className="text-lg text-slate-600">
                A legally compliant sandbox framework connecting Maharashtra government departments with vetted tech startups. Standardizing outcomes, automated eligibility checks, AI scoring, and milestone-based secure contract payments.
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

            {/* Quick-Access Demo Roles Panel */}
            <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl text-white max-w-4xl mx-auto border border-slate-800">
              <div className="mb-6 text-center">
                <span className="text-indigo-400 text-xs font-bold tracking-widest uppercase">Guest Demo Access</span>
                <h3 className="text-2xl font-black mt-1">Instant Guest Login</h3>
                <p className="text-slate-400 text-sm mt-1">Log in instantly with a single click as any of the 4 roles below (no passwords required).</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div 
                  onClick={() => handleGuestLogin('dept')}
                  className="bg-slate-800 hover:bg-indigo-900/40 border border-slate-700/60 p-4 rounded-xl cursor-pointer transition-colors text-center group"
                >
                  <Building2 className="mx-auto mb-2 text-indigo-400 group-hover:scale-110 transition-transform" size={32} />
                  <span className="block text-sm font-bold text-slate-100">Department</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Create Problem, Pilot</span>
                </div>
                <div 
                  onClick={() => handleGuestLogin('startup')}
                  className="bg-slate-800 hover:bg-indigo-900/40 border border-slate-700/60 p-4 rounded-xl cursor-pointer transition-colors text-center group"
                >
                  <Rocket className="mx-auto mb-2 text-indigo-400 group-hover:scale-110 transition-transform" size={32} />
                  <span className="block text-sm font-bold text-slate-100">Startup</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Submit updates, profile</span>
                </div>
                <div 
                  onClick={() => handleGuestLogin('expert')}
                  className="bg-slate-800 hover:bg-indigo-900/40 border border-slate-700/60 p-4 rounded-xl cursor-pointer transition-colors text-center group"
                >
                  <GraduationCap className="mx-auto mb-2 text-indigo-400 group-hover:scale-110 transition-transform" size={32} />
                  <span className="block text-sm font-bold text-slate-100">Expert Panel</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Assign ratings, scorecard</span>
                </div>
                <div 
                  onClick={() => handleGuestLogin('admin')}
                  className="bg-slate-800 hover:bg-indigo-900/40 border border-slate-700/60 p-4 rounded-xl cursor-pointer transition-colors text-center group"
                >
                  <Settings className="mx-auto mb-2 text-indigo-400 group-hover:scale-110 transition-transform" size={32} />
                  <span className="block text-sm font-bold text-slate-100">Admin</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Monitor statistics, users</span>
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
                    placeholder="officer@maharashtra.gov.in"
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
                      <option value="STARTUP">Startup Profile</option>
                      <option value="DEPARTMENT">Government Department</option>
                      <option value="EXPERT">Evaluation Expert</option>
                    </select>
                  </div>
                </div>

                {/* Polymorphic forms based on role selection */}
                {registerForm.role === 'DEPARTMENT' && (
                  <div className="space-y-4 border-t border-slate-100 pt-4">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Department Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Department/Corporation Name</label>
                        <input type="text" required value={registerForm.deptName} onChange={e => setRegisterForm({...registerForm, deptName: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Pune Municipal Corporation" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Nodal Contact Person</label>
                        <input type="text" required value={registerForm.deptContactPerson} onChange={e => setRegisterForm({...registerForm, deptContactPerson: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Dr. S. K. Deshpande" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Office Address</label>
                      <input type="text" value={registerForm.deptAddress} onChange={e => setRegisterForm({...registerForm, deptAddress: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="PMC Main Building, Shivajinagar, Pune" />
                    </div>
                  </div>
                )}

                {registerForm.role === 'STARTUP' && (
                  <div className="space-y-4 border-t border-slate-100 pt-4">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Startup DPIIT Profile</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Company Registered Name</label>
                        <input type="text" required value={registerForm.companyName} onChange={e => setRegisterForm({...registerForm, companyName: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="MahaTech Clean energy Pvt Ltd" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">DPIIT Registration Number</label>
                        <input type="text" required value={registerForm.dpiitNumber} onChange={e => setRegisterForm({...registerForm, dpiitNumber: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="DPIIT-489031" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Technology Domain</label>
                        <input type="text" required value={registerForm.startupDomain} onChange={e => setRegisterForm({...registerForm, startupDomain: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Waste Management" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Team Size</label>
                        <input type="number" value={registerForm.teamSize} onChange={e => setRegisterForm({...registerForm, teamSize: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Founded Year</label>
                        <input type="number" value={registerForm.foundedYear} onChange={e => setRegisterForm({...registerForm, foundedYear: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Capabilities Tags (comma-separated)</label>
                      <input type="text" value={registerForm.startupTagsString} onChange={e => setRegisterForm({...registerForm, startupTagsString: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Recycling, Biodegradation, Logistics" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Elevator Pitch Description</label>
                      <textarea value={registerForm.startupDescription} onChange={e => setRegisterForm({...registerForm, startupDescription: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Briefly describe your solution capabilities..." rows={3} />
                    </div>
                  </div>
                )}

                {registerForm.role === 'EXPERT' && (
                  <div className="space-y-4 border-t border-slate-100 pt-4">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Expert Domain Credentials</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Expertise Primary Domain</label>
                        <input type="text" required value={registerForm.expertDomain} onChange={e => setRegisterForm({...registerForm, expertDomain: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="AgriTech / FinTech" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Designation & Institution</label>
                        <input type="text" required value={registerForm.expertDesignation} onChange={e => setRegisterForm({...registerForm, expertDesignation: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Professor, IIT Bombay" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Evaluation Skill Tags (comma-separated)</label>
                      <input type="text" value={registerForm.expertTagsString} onChange={e => setRegisterForm({...registerForm, expertTagsString: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="IoT, AI, Water Management" />
                    </div>
                  </div>
                )}

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg text-sm shadow-md transition-colors cursor-pointer">Register Sandbox Account</button>
              </form>

              <div className="mt-4 text-center">
                <span className="text-xs text-slate-500">Already registered? </span>
                <button onClick={() => setView('login')} className="text-xs font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer">Log in here</button>
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD ROUTER BASED ON AUTH ROLE */}
        {view === 'dashboard' && auth && (
          <div className="space-y-6">
            
            {/* DEPARTMENT ROLE VIEW */}
            {auth.role === 'DEPARTMENT' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">Department Control Panel</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage problem challenges, evaluation results, and pilot sandboxes.</p>
                  </div>
                  <button 
                    onClick={() => setView('post-problem')} 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer transition-transform hover:-translate-y-0.5"
                  >
                    <Plus size={16} /> Post Outcome Challenge
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Problems Posted List */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <FileText size={18} className="text-indigo-600" /> Active Challenges ({problems.length})
                    </h3>
                    <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                      {problems.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">No challenges posted yet. Click 'Post Outcome Challenge' to start.</p>
                      ) : (
                        problems.map(problem => (
                          <div 
                            key={problem.id} 
                            onClick={() => viewProblemDetails(problem)}
                            className="p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 cursor-pointer transition-all flex justify-between items-center group"
                          >
                            <div className="space-y-1">
                              <h4 className="font-bold text-sm text-slate-800 group-hover:text-indigo-700 transition-colors">{problem.title}</h4>
                              <div className="flex flex-wrap gap-1">
                                {problem.tags.slice(0, 3).map((t, i) => (
                                  <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{t}</span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold px-2 py-1 rounded bg-indigo-50 text-indigo-700 uppercase">{problem.status}</span>
                              <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Active Pilots List */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Briefcase size={18} className="text-indigo-600" /> Active Sandbox Pilots ({pilots.length})
                    </h3>
                    <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                      {pilots.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">No active pilots running. Shortlist a startup in challenge recommendations.</p>
                      ) : (
                        pilots.map(pilot => (
                          <div 
                            key={pilot.id} 
                            onClick={() => viewPilotWorkspace(pilot)}
                            className="p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 cursor-pointer transition-all flex justify-between items-center group"
                          >
                            <div className="space-y-1.5 flex-grow">
                              <h4 className="font-bold text-sm text-slate-800 group-hover:text-indigo-700 transition-colors">{pilot.problemTitle}</h4>
                              <p className="text-xs text-slate-500">Startup: <span className="font-semibold">{pilot.startupName}</span></p>
                              
                              {/* Inline mini progress bar */}
                              <div className="flex items-center gap-2 max-w-xs">
                                <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-indigo-600 h-full transition-all" style={{ width: `${pilot.currentProgress}%` }}></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500">{pilot.currentProgress}% Progress</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold px-2 py-1 rounded bg-amber-50 text-amber-700 uppercase">{pilot.status}</span>
                              <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STARTUP ROLE VIEW */}
            {auth.role === 'STARTUP' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black text-slate-800">Startup Command Panel</h2>
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm uppercase">
                        <ShieldCheck size={12} /> DPIIT Verified
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Submit milestone updates, view matches, and track pilot evaluations.</p>
                  </div>
                  <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Past Pilots count</span>
                    <p className="text-lg font-black text-slate-800">1 Pilot</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Matching Problems Board */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Cpu size={18} className="text-indigo-600" /> Matched Challenges ({problems.length})
                    </h3>
                    <div className="space-y-3">
                      {problems.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">No government challenges match your expertise domain tags.</p>
                      ) : (
                        problems.map(problem => (
                          <div 
                            key={problem.id}
                            className="p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 cursor-pointer transition-all flex justify-between items-center group"
                            onClick={() => {
                              showToast("Contact Pune Urban Development to participate in expert evaluation.");
                            }}
                          >
                            <div>
                              <h4 className="font-bold text-sm text-slate-800">{problem.title}</h4>
                              <p className="text-xs text-slate-400 mt-0.5">By: {problem.departmentName}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {problem.tags.map((t, i) => (
                                  <span key={i} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">{t}</span>
                                ))}
                              </div>
                            </div>
                            <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded uppercase tracking-wider">Eligible</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Active Pilots Workspace */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Briefcase size={18} className="text-indigo-600" /> Active Pilots Workspace ({pilots.length})
                    </h3>
                    <div className="space-y-3">
                      {pilots.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">No active pilots running. Wait for department assignment.</p>
                      ) : (
                        pilots.map(pilot => (
                          <div 
                            key={pilot.id} 
                            onClick={() => viewPilotWorkspace(pilot)}
                            className="p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 cursor-pointer transition-all flex justify-between items-center group"
                          >
                            <div className="space-y-1.5 flex-grow">
                              <h4 className="font-bold text-sm text-slate-800 group-hover:text-indigo-700 transition-colors">{pilot.problemTitle}</h4>
                              <p className="text-xs text-slate-500">Department: <span className="font-semibold">{pilot.departmentName}</span></p>
                              
                              <div className="flex items-center gap-2 max-w-xs">
                                <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-indigo-600 h-full transition-all" style={{ width: `${pilot.currentProgress}%` }}></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500">{pilot.currentProgress}% Completed</span>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* EXPERT ROLE VIEW */}
            {auth.role === 'EXPERT' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h2 className="text-2xl font-black text-slate-800">Expert Evaluation Board</h2>
                  <p className="text-sm text-slate-500 mt-1">Evaluate shortlisted startup proposals based on innovation, feasibility, capability, and cost.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-indigo-600" /> Pending Evaluation Queue ({expertQueue.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {expertQueue.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center col-span-2">No problems pending evaluation matching your expert tag domain.</p>
                    ) : (
                      expertQueue.map(problem => (
                        <div 
                          key={problem.id}
                          onClick={() => {
                            setActiveProblem(problem);
                            // Fetch recommendations to score the top startup
                            apiFetch(`/api/problems/${problem.id}/recommendations`).then(recs => {
                              setRecommendations(recs);
                              setView('expert-evaluation-form');
                            });
                          }}
                          className="p-5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 cursor-pointer transition-all flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <h4 className="font-bold text-sm text-slate-800">{problem.title}</h4>
                            <p className="text-xs text-slate-500 line-clamp-2">{problem.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {problem.tags.map((t, i) => (
                                <span key={i} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">{t}</span>
                              ))}
                            </div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-[10px] text-slate-400">Published: {new Date(problem.createdAt).toLocaleDateString()}</span>
                            <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">Evaluate Startup <ArrowRight size={12} /></span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN ROLE VIEW */}
            {auth.role === 'ADMIN' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h2 className="text-2xl font-black text-slate-800">Admin Platform Dashboard</h2>
                  <p className="text-sm text-slate-500 mt-1">Platform monitoring, user approvals, and global KPI statistics.</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-slate-200 gap-6 print:hidden">
                  <button 
                    onClick={() => setAdminTab('overview')}
                    className={`pb-2.5 text-sm font-bold border-b-2 cursor-pointer transition-all ${
                      adminTab === 'overview' 
                        ? 'border-indigo-600 text-indigo-650' 
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    System Overview
                  </button>
                  <button 
                    onClick={() => setAdminTab('audit')}
                    className={`pb-2.5 text-sm font-bold border-b-2 cursor-pointer transition-all ${
                      adminTab === 'audit' 
                        ? 'border-indigo-600 text-indigo-650' 
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Tamper-Evident Audit Ledger
                  </button>
                </div>

                {adminTab === 'overview' ? (
                  <>
                    {/* Metrics Cards */}
                    {adminAnalytics && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <FileText size={24} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total posted challenges</span>
                            <p className="text-2xl font-black text-slate-800">{adminAnalytics.totalProblems} Problems</p>
                          </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Briefcase size={24} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Active Pilots Running</span>
                            <p className="text-2xl font-black text-slate-800">{adminAnalytics.totalPilots} Pilots</p>
                          </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <DollarSign size={24} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Budget Escrow Locked</span>
                            <p className="text-2xl font-black text-slate-800">₹{adminAnalytics.totalBudgetLocked.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* User Management Table */}
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <Users size={18} className="text-indigo-600" /> Platform User Management
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold">
                                <th className="py-3 px-2">Name</th>
                                <th className="py-3 px-2">Email</th>
                                <th className="py-3 px-2">Role</th>
                                <th className="py-3 px-2">Status</th>
                                <th className="py-3 px-2 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                              {adminUsers.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50/50">
                                  <td className="py-3 px-2 font-bold text-slate-800">{user.name}</td>
                                  <td className="py-3 px-2 text-slate-500">{user.email}</td>
                                  <td className="py-3 px-2">
                                    <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100/50 font-semibold">{user.role}</span>
                                  </td>
                                  <td className="py-3 px-2">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                    }`}>{user.status}</span>
                                  </td>
                                  <td className="py-3 px-2 text-right">
                                    <button 
                                      onClick={() => toggleUserStatus(user.id, user.status)}
                                      className={`px-3 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                        user.status === 'ACTIVE' ? 'border-rose-200 text-rose-600 hover:bg-rose-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                                      }`}
                                    >
                                      {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Funnel Pipeline Visualizer */}
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <BarChart3 size={18} className="text-indigo-600" /> Procurement Funnel
                        </h3>
                        {adminAnalytics && (
                          <div className="space-y-4 pt-2">
                            <div>
                              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                <span>Problems Posted</span>
                                <span>{adminAnalytics.totalProblems}</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-indigo-5050 h-full bg-indigo-600" style={{ width: '100%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                <span>Evaluated Challenges</span>
                                <span>{adminAnalytics.problemStatuses.UNDER_EVALUATION || 0}</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-sky-500 h-full" style={{ width: '70%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                <span>Active Sandbox Pilots</span>
                                <span>{adminAnalytics.totalPilots}</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full" style={{ width: '45%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                <span>Scale-Up Decided</span>
                                <span>{adminAnalytics.problemStatuses.DECIDED || 0}</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full" style={{ width: '20%' }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">Tamper-Evident Transaction Ledger</h3>
                        <p className="text-xs text-slate-400">Secured with chained SHA-256 cryptographic hashes.</p>
                      </div>
                      <button 
                        onClick={handleVerifyLedger}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow transition-all flex items-center gap-1.5"
                      >
                        Verify Ledger Integrity
                      </button>
                    </div>

                    {/* Ledger verification status indicator */}
                    {ledgerIntegrity && (
                      <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                        ledgerIntegrity.verified 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                          : 'bg-rose-50 text-rose-800 border-rose-100 animate-pulse'
                      }`}>
                        <ShieldCheck size={20} className={ledgerIntegrity.verified ? 'text-emerald-600' : 'text-rose-600'} />
                        <div className="text-xs">
                          <p className="font-extrabold">{ledgerIntegrity.verified ? 'Ledger Integrity Verified' : 'CRITICAL CORRUPTION DETECTED!'}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {ledgerIntegrity.verified 
                              ? `All ${ledgerIntegrity.totalChecked} transaction blocks are cryptographically valid and chained correctly.` 
                              : `Block ID ${ledgerIntegrity.corruptedLogId} failed the hash chain check. The ledger has been tampered with.`}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Logs List Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[9px]">
                            <th className="py-2.5 px-2">Block ID</th>
                            <th className="py-2.5 px-2">Timestamp</th>
                            <th className="py-2.5 px-2">Actor</th>
                            <th className="py-2.5 px-2">Action</th>
                            <th className="py-2.5 px-2">Details</th>
                            <th className="py-2.5 px-2">SHA-256 Checksum (Chained)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {auditLogs.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50/50">
                              <td className="py-3 px-2 font-mono font-bold text-slate-500">Block #{log.id}</td>
                              <td className="py-3 px-2 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                              <td className="py-3 px-2 font-bold text-slate-800">{log.actor}</td>
                              <td className="py-3 px-2">
                                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold uppercase text-[9px]">
                                  {log.action}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-slate-500 max-w-xs truncate" title={log.details}>{log.details}</td>
                              <td className="py-3 px-2 font-mono text-[9px] text-indigo-600 select-all">
                                {log.checksum.substring(0, 24)}...
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* POST PROBLEM SCREEN */}
        {view === 'post-problem' && (
          <div className="max-w-xl mx-auto py-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Post Outcome Challenge</h2>
              <p className="text-sm text-slate-500 mb-6">Describe the operational bottleneck and outcome goals you require.</p>
              
              <form onSubmit={handleCreateProblem} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Challenge Title</label>
                  <input 
                    type="text" required value={newProblem.title} 
                    onChange={e => setNewProblem({...newProblem, title: e.target.value})}
                    placeholder="E.g., Automated IoT Organic waste segregator for municipal landfill"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Objective Description</label>
                  <textarea 
                    required value={newProblem.description} 
                    onChange={e => setNewProblem({...newProblem, description: e.target.value})}
                    placeholder="Provide specific metrics: e.g., 'We require sorting accuracy of >90% for mixed municipal waste...'"
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Capabilities/Tags Required (comma-separated)</label>
                  <input 
                    type="text" required value={newProblem.tags} 
                    onChange={e => setNewProblem({...newProblem, tags: e.target.value})}
                    placeholder="Waste Management, Recycling, AI, IoT"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Min Budget (₹)</label>
                    <input 
                      type="number" value={newProblem.budgetMin} 
                      onChange={e => setNewProblem({...newProblem, budgetMin: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Max Budget (₹)</label>
                    <input 
                      type="number" value={newProblem.budgetMax} 
                      onChange={e => setNewProblem({...newProblem, budgetMax: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Timeline (days)</label>
                    <input 
                      type="number" value={newProblem.timelineDays} 
                      onChange={e => setNewProblem({...newProblem, timelineDays: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-grow bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg text-sm cursor-pointer shadow-md">Publish Challenge</button>
                  <button type="button" onClick={() => setView('dashboard')} className="px-5 py-3 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-sm cursor-pointer">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CHALLENGE DETAIL VIEW (With Recommendations and Expert suggestions) */}
        {view === 'problem-detail' && activeProblem && (
          <div className="space-y-6 py-6">
            <div className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer" onClick={() => setView('dashboard')}>
              <span>&larr; Back to Dashboard</span>
            </div>

            {/* Header info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-slate-800">{activeProblem.title}</h2>
                  <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold px-2 py-0.5 rounded uppercase">
                    {activeProblem.status}
                  </span>
                </div>
                <p className="text-slate-600 text-sm">{activeProblem.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {activeProblem.tags.map((t, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-600 border border-slate-200/50 px-2.5 py-1 rounded font-medium">{t}</span>
                  ))}
                </div>
              </div>
              <div className="text-right whitespace-nowrap bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium text-slate-800 text-sm space-y-1">
                <p>Budget: ₹{activeProblem.budgetMin.toLocaleString()} - ₹{activeProblem.budgetMax.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Timeline: {activeProblem.timelineDays} days</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recommendations Table */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Rocket size={18} className="text-indigo-600" /> Ranked Recommended Startups
                  </h3>
                  <button 
                    onClick={() => triggerMatching(activeProblem.id)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2 px-4 rounded-lg cursor-pointer transition-transform hover:-translate-y-0.5 shadow-sm"
                  >
                    Run Re-matching
                  </button>
                </div>

                <div className="space-y-4">
                  {recommendations.length === 0 ? (
                    <p className="text-xs text-slate-400 py-8 text-center">No recommendations computed yet. Click "Run Re-matching".</p>
                  ) : (
                    recommendations.map(rec => (
                      <div key={rec.id} className="p-5 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-slate-800">{rec.startup.companyName}</h4>
                              <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded font-bold uppercase">
                                Verified
                              </span>
                              {rec.startup.dpiitNumber && (
                                <button 
                                  onClick={() => handleVerifyDpiit(rec.startup.dpiitNumber)}
                                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer flex items-center gap-0.5"
                                >
                                  <ShieldCheck size={12} /> {rec.startup.dpiitNumber}
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{rec.startup.description}</p>
                          </div>
                          
                          {/* Aggregate Score Ring/Gauges */}
                          <div className="text-right">
                            <span className="block text-2xl font-black text-indigo-600">{Math.round(rec.finalWeightedScore)}%</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Matching score</span>
                          </div>
                        </div>

                        {/* LLM semantic justification */}
                        <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50 flex gap-2">
                          <div className="text-indigo-600 pt-0.5 flex-shrink-0">
                            <Cpu size={14} className="animate-pulse" />
                          </div>
                          <p className="text-xs text-indigo-900 leading-relaxed"><strong className="font-bold text-indigo-950">AI Assessment: </strong>{rec.llmJustification}</p>
                        </div>

                        {/* Details and Payout configuration trigger */}
                        <div className="pt-2 border-t border-slate-50 flex justify-between items-center text-xs">
                          <div className="flex gap-4 text-[10px] text-slate-500 font-bold">
                            <span>Tags overlap: {Math.round(rec.ruleScore)}%</span>
                            <span>LLM Semantics: {Math.round(rec.llmScore)}%</span>
                          </div>
                          <button 
                            onClick={() => openPilotCreation(rec)}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            Launch Pilot Sandbox
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Sidebar: Jaccard Expert Recommendations & evaluations */}
              <div className="space-y-6">
                
                {/* Expert Suggestions */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                  <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
                    <GraduationCap size={18} className="text-indigo-600" /> Recommended Evaluators
                  </h3>
                  <div className="space-y-3">
                    {suggestedExperts.slice(0, 3).map((match, i) => (
                      <div key={i} className="p-3 rounded-xl border border-slate-50 bg-slate-50/50 flex justify-between items-center">
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-xs text-slate-800">{match.expert.user.name}</h4>
                          <span className="text-[10px] text-slate-400 block">{match.expert.designation}</span>
                        </div>
                        <div className="text-right">
                          <button 
                            onClick={() => assignExpert(match.expert.user.name)}
                            className="text-[10px] bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-indigo-600 font-bold px-2 py-1 rounded transition-all cursor-pointer"
                          >
                            Assign
                          </button>
                          <span className="block text-[8px] text-slate-400 mt-1 font-bold">Jaccard Match: {Math.round(match.matchingScore * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evaluation Results */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                  <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
                    <UserCheck size={18} className="text-indigo-600" /> Expert Ratings
                  </h3>
                  <div className="space-y-3">
                    {problemEvaluations.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center">No ratings submitted yet.</p>
                    ) : (
                      problemEvaluations.map(evalu => (
                        <div key={evalu.id} className="p-3.5 rounded-xl border border-slate-100 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-xs text-slate-800">{evalu.expertName}</h4>
                              <p className="text-[9px] text-slate-400 mt-0.5">Assessed: {evalu.startupName}</p>
                            </div>
                            <span className="text-xs font-black text-indigo-600">{evalu.avgScore}/5.0</span>
                          </div>
                          <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded">"{evalu.comments}"</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* EXPERT EVALUATION FORM */}
        {view === 'expert-evaluation-form' && activeProblem && (
          <div className="max-w-xl mx-auto py-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer mb-4" onClick={() => setView('dashboard')}>
                <span>&larr; Back to Queue</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-1">Evaluate Startup</h2>
              <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wider block mb-6">Challenge: {activeProblem.title}</span>

              {recommendations.length > 0 ? (
                <form onSubmit={handleSubmitEvaluation} className="space-y-5">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Candidate Startup</span>
                    <h4 className="font-bold text-sm text-slate-800 mt-1">{recommendations[0].startup.companyName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{recommendations[0].startup.description}</p>
                  </div>

                  {/* 1-5 Sliders for criteria */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Technical Feasibility</span>
                        <span className="text-indigo-600 font-extrabold">{evalScores.feasibility} / 5</span>
                      </div>
                      <input 
                        type="range" min="1" max="5" value={evalScores.feasibility} 
                        onChange={e => setEvalScores({...evalScores, feasibility: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Novelty & Innovation</span>
                        <span className="text-indigo-600 font-extrabold">{evalScores.innovation} / 5</span>
                      </div>
                      <input 
                        type="range" min="1" max="5" value={evalScores.innovation} 
                        onChange={e => setEvalScores({...evalScores, innovation: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Team Implementation Capability</span>
                        <span className="text-indigo-600 font-extrabold">{evalScores.team} / 5</span>
                      </div>
                      <input 
                        type="range" min="1" max="5" value={evalScores.team} 
                        onChange={e => setEvalScores({...evalScores, team: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Cost & Economic Viability</span>
                        <span className="text-indigo-600 font-extrabold">{evalScores.cost} / 5</span>
                      </div>
                      <input 
                        type="range" min="1" max="5" value={evalScores.cost} 
                        onChange={e => setEvalScores({...evalScores, cost: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Expert Remarks</label>
                    <textarea 
                      required value={evalScores.comments} 
                      onChange={e => setEvalScores({...evalScores, comments: e.target.value})}
                      placeholder="Provide specific feedback on the technology and implementation plan..."
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>

                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg text-sm cursor-pointer shadow-md">Submit Scorecard</button>
                </form>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">Error: Recommended startups list empty.</p>
              )}
            </div>
          </div>
        )}

        {/* PILOT WORKSPACE SCREEN */}
        {view === 'pilot-workspace' && activePilot && (
          <div className="space-y-6 py-6">
            <div className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer" onClick={() => setView('dashboard')}>
              <span>&larr; Back to Dashboard</span>
            </div>

            {/* Header / Sandbox status */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-slate-800">Pilot Sandbox Workspace</h2>
                  <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 font-bold px-2.5 py-0.5 rounded uppercase">
                    {activePilot.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Challenge: <span className="font-semibold text-slate-700">{activePilot.problemTitle}</span> | 
                  Department: <span className="font-semibold text-slate-700">{activePilot.departmentName}</span> | 
                  Startup: <span className="font-semibold text-slate-700">{activePilot.startupName}</span>
                </p>
                <p className="text-xs text-slate-400 italic">Scope: "{activePilot.scope}"</p>
              </div>

              {/* Escrow lock box visual indicator */}
              <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-6">
                <div className="p-3 bg-indigo-600 rounded-xl text-white">
                  <ShieldCheck size={28} />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-indigo-400 uppercase font-extrabold tracking-wider block">Escrow Tracker</span>
                  <div className="flex gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 text-[9px] block">Locked Escrow</span>
                      <p className="font-extrabold text-amber-400 text-sm">₹{(activePilot.escrowBalance != null ? activePilot.escrowBalance : activePilot.budget).toLocaleString()}</p>
                    </div>
                    <div className="border-l border-slate-800 pl-4">
                      <span className="text-slate-400 text-[9px] block">Disbursed</span>
                      <p className="font-extrabold text-emerald-400 text-sm">₹{(activePilot.releasedAmount || 0).toLocaleString()}</p>
                    </div>
                    <div className="border-l border-slate-800 pl-4">
                      <span className="text-slate-400 text-[9px] block">Total Budget</span>
                      <p className="font-extrabold text-slate-200 text-sm">₹{activePilot.budget.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 gap-6 print:hidden">
              <button 
                onClick={() => setPilotTab('milestones')}
                className={`pb-2.5 text-sm font-bold border-b-2 cursor-pointer transition-all ${
                  pilotTab === 'milestones' 
                    ? 'border-indigo-600 text-indigo-650' 
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Milestones & Progress
              </button>
              <button 
                onClick={() => setPilotTab('legal')}
                className={`pb-2.5 text-sm font-bold border-b-2 cursor-pointer transition-all ${
                  pilotTab === 'legal' 
                    ? 'border-indigo-600 text-indigo-650' 
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Legal Agreements
              </button>
            </div>

            {pilotTab === 'milestones' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
                
                {/* Progress & Milestone updates logging */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                      <TrendingUp size={18} className="text-indigo-600" /> Milestone Tracking
                    </h3>
                    <p className="text-xs text-slate-400">Chronological history of startup progress updates.</p>
                  </div>

                  {/* Progress bar visual */}
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Pilot Sandbox progress completion</span>
                      <span className="text-indigo-600 font-extrabold">{activePilot.currentProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${activePilot.currentProgress}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {pilotUpdates.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center">No progress updates submitted yet.</p>
                    ) : (
                      pilotUpdates.map(update => (
                        <div key={update.id} className="p-4 rounded-xl border border-slate-100 bg-white space-y-3 relative shadow-sm">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="inline-block text-[10px] bg-slate-100 text-slate-650 px-2 py-0.5 rounded font-bold uppercase">
                                  {update.milestoneName || 'Milestone Update'}
                                </span>
                                {update.status === 'APPROVED' ? (
                                  <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-1.5 py-0.5 rounded uppercase">
                                    <CheckCircle size={10} /> Disbursed
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[9px] bg-amber-50 text-amber-700 border border-amber-100 font-bold px-1.5 py-0.5 rounded uppercase">
                                    <Clock size={10} /> Escrow Locked (Pending)
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 mt-1.5">{update.notes}</p>
                              {update.attachmentName && (
                                <div className="mt-2 p-2 bg-indigo-50/50 text-indigo-900 border border-indigo-150 rounded-lg flex items-center justify-between text-[9px] max-w-lg">
                                  <span className="font-semibold flex items-center gap-1"><ShieldCheck size={12} className="text-indigo-600" /> {update.attachmentName}</span>
                                  <span className="font-mono text-[8px] text-slate-400">SHA-256: {update.attachmentHash ? update.attachmentHash.substring(0, 16) : ''}...</span>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="block text-xs font-black text-indigo-650">{update.progressPercent}% progress</span>
                              <span className="text-[8px] text-slate-400 block mt-0.5">{new Date(update.submittedAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Actions for PENDING milestones */}
                          {update.status === 'PENDING' && (
                            <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-1.5">
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 italic">
                                <Clock size={12} /> SLA Timer: 7 Days Remaining before auto-approval
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleSlaTrigger(update.id)}
                                  className="bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-600 font-bold px-2.5 py-1 rounded text-[10px] cursor-pointer transition-colors"
                                >
                                  Simulate SLA Expiry
                                </button>
                                {auth?.role === 'DEPARTMENT' && (
                                  <button 
                                    onClick={() => handleApproveMilestone(update.id)}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1 rounded text-[10px] cursor-pointer transition-colors shadow-sm"
                                  >
                                    Approve & Release Funds
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Sidebar Action forms based on role (Startup submits progress, Dept decides) */}
                <div className="space-y-6">
                  
                  {/* STARTUP UPDATE FORM */}
                  {auth?.role === 'STARTUP' && activePilot.status === 'PILOT_ACTIVE' && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                      <h3 className="text-md font-bold text-slate-800">Submit Progress Update</h3>
                      <form onSubmit={handleSubmitProgress} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Milestone Name</label>
                          <input 
                            type="text" required value={milestoneName} 
                            onChange={e => setMilestoneName(e.target.value)}
                            placeholder="E.g., Hardware Assembly Complete"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Incremental Progress (%)</label>
                          <input 
                            type="number" min="0" max="100" required value={progressPercent} 
                            onChange={e => setProgressPercent(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notes / Description</label>
                          <textarea 
                            required value={updateNotes} 
                            onChange={e => setUpdateNotes(e.target.value)}
                            placeholder="Brief explanation of work done, testing outputs, or blockers..."
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">IP Protected Document Attachment</label>
                          {uploadedFile ? (
                            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex flex-col gap-1 text-[10px]">
                              <div className="flex items-center justify-between">
                                <span className="font-bold flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-600" /> {uploadedFile.name}</span>
                                <button type="button" onClick={() => setUploadedFile(null)} className="text-slate-400 hover:text-slate-600 font-bold text-xs">&times;</button>
                              </div>
                              <span className="text-[8px] font-mono text-emerald-700 break-all select-all">SHA-256 Hash: {uploadedFile.hash}</span>
                            </div>
                          ) : (
                            <button 
                              type="button"
                              onClick={simulateFileUpload}
                              className="w-full border border-dashed border-indigo-200 hover:bg-indigo-50/50 p-4 rounded-lg flex flex-col items-center justify-center gap-1 text-[10px] text-indigo-650 cursor-pointer transition-all"
                            >
                              <FileText size={18} className="text-indigo-400" />
                              <span className="font-bold">Encrypt & Upload Milestone Proof (PDF/Zip)</span>
                              <span className="text-[8px] text-slate-400">Files are secured with AES-256 client-side hashing</span>
                            </button>
                          )}
                        </div>
                        <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs cursor-pointer shadow">Submit Update</button>
                      </form>
                    </div>
                  )}

                  {/* DEPARTMENT DECISION FORM */}
                  {auth?.role === 'DEPARTMENT' && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                      <h3 className="text-md font-bold text-slate-800">Final Procurement Decision</h3>
                      <form onSubmit={handleSubmitDecision} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Decision Type</label>
                          <select 
                            value={decisionType} 
                            onChange={e => setDecisionType(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                          >
                            <option value="SCALE">Scale pilot deployment</option>
                            <option value="PROCURE">Compliant Procurement (PAC/GeM)</option>
                            <option value="REJECT">Reject / Terminate pilot</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Remarks & Justification</label>
                          <textarea 
                            required value={decisionRemarks} 
                            onChange={e => setDecisionRemarks(e.target.value)}
                            placeholder="Provide legal/technical justification for scaling or procurement pathway..."
                            rows={4}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        {(decisionType === 'SCALE' || decisionType === 'PROCURE') && (
                          <div className="flex items-center gap-2 py-1">
                            <input 
                              type="checkbox" 
                              id="publishGem" 
                              checked={publishToGem} 
                              onChange={e => setPublishToGem(e.target.checked)}
                              className="w-4 h-4 text-indigo-650 border-slate-200 rounded cursor-pointer"
                            />
                            <label htmlFor="publishGem" className="text-xs font-semibold text-slate-700 cursor-pointer">
                              Publish Certified Pilot Catalog to GeM Portal
                            </label>
                          </div>
                        )}
                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-lg text-xs cursor-pointer shadow-md">Submit Decision</button>
                      </form>
                    </div>
                  )}

                </div>

              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-4xl mx-auto space-y-8 print:shadow-none print:border-none print:p-0">
                {/* Print Control Header */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 print:hidden">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">Dynamic Legal Contract Generator</h3>
                    <p className="text-xs text-slate-500">Auto-filled based on active sandbox parameters.</p>
                  </div>
                  <button 
                    onClick={() => window.print()}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer shadow flex items-center gap-1.5 transition-colors"
                  >
                    <FileText size={14} /> Print / Save as PDF
                  </button>
                </div>

                {/* Stamp Paper Design */}
                <div className="border-[3px] border-double border-orange-800 p-6 space-y-8 bg-amber-50/10 min-h-[800px] relative">
                  {/* Top Stamp Header */}
                  <div className="border-2 border-orange-800 p-4 text-center space-y-2 relative bg-orange-50/20">
                    {/* Stamp Emblem Seal */}
                    <div className="absolute top-2 left-6 border border-orange-800 w-16 h-16 rounded-full flex items-center justify-center text-[10px] font-bold text-orange-950 uppercase select-none">
                      Gov of MH
                    </div>
                    <div className="absolute top-2 right-6 border border-orange-800 w-16 h-16 flex items-center justify-center text-[18px] font-black text-orange-950 select-none">
                      ₹ 500
                    </div>
                    
                    <h4 className="text-xl font-bold text-orange-950 tracking-wider">गैर न्यायिक / NON-JUDICIAL</h4>
                    <h2 className="text-2xl font-black text-orange-950 tracking-widest leading-none">भारत सरकार / GOVERNMENT OF INDIA</h2>
                    <h3 className="text-lg font-bold text-orange-900 leading-none">महाराष्ट्र शासन / GOVERNMENT OF MAHARASHTRA</h3>
                    <div className="text-[10px] font-mono text-orange-800/80 mt-1">MH-500AA26136 &bull; SECURE TRANSACTION SANDBOX IDENTIFIER</div>
                  </div>

                  {/* Stamp Paper watermark overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
                    <Building2 size={300} className="text-slate-900" />
                  </div>

                  {/* Contract Content */}
                  <div className="space-y-6 text-slate-800 text-xs leading-relaxed max-w-3xl mx-auto font-serif">
                    <div className="text-center space-y-1">
                      <h3 className="text-md font-extrabold uppercase text-slate-950 tracking-wide underline">SANDBOX PILOT IMPLEMENTATION AGREEMENT</h3>
                      <p className="text-[10px] text-slate-500 italic">Executed under the Maharashtra State Innovative Procurement Exemption Rules (SIH26136)</p>
                    </div>

                    <p>
                      This Agreement is entered into on this <strong>{new Date(activePilot.createdAt).toLocaleDateString()}</strong> by and between:
                    </p>
                    <p className="pl-4">
                      <strong>The Department of {activePilot.departmentName}</strong>, Government of Maharashtra, hereinafter referred to as the "Disbursing Authority" (First Party), AND
                    </p>
                    <p className="pl-4">
                      <strong>{activePilot.startupName}</strong>, a registered startup certified under DPIIT Number: <strong>DPIIT-893021</strong>, hereinafter referred to as the "Sandbox Partner" (Second Party).
                    </p>

                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-950 uppercase">1. OBJECTIVE & SCOPE OF SANDBOX</h4>
                      <p>
                        The Sandbox Partner shall deploy a controlled pilot sandbox for the technological challenge titled <strong>"{activePilot.problemTitle}"</strong>. 
                        The technical deliverables, physical parameters, and deployment boundaries shall be strictly governed by the following Nodal Scope:
                      </p>
                      <p className="bg-slate-50 p-2.5 border-l-2 border-slate-300 italic font-sans text-[11px] text-slate-650">
                        "{activePilot.scope}"
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-950 uppercase">2. TIMELINE & ESCROW PARAMETERS</h4>
                      <p>
                        The Sandbox pilot is scheduled to commence on <strong>{new Date(activePilot.startDate).toLocaleDateString()}</strong> and run for a dedicated duration, finalizing on <strong>{new Date(activePilot.endDate).toLocaleDateString()}</strong>.
                      </p>
                      <p>
                        The total budget allocated and locked in the secure platform Escrow account is <strong>₹{activePilot.budget.toLocaleString()}</strong>. Payments shall be disbursed automatically to the Sandbox Partner upon the approval of quantifiable progress milestones:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Milestone Tranche 1:</strong> Release equal to incremental progress percentage approved by Nodal Officer or SLA auto-approval.</li>
                        <li><strong>Milestone Tranche 2 (Final):</strong> Remaining balance released upon 100% completion scorecard and expert panel closure.</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-950 uppercase">3. DATA SHARING & INTELLECTUAL PROPERTY</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Background IP:</strong> All proprietary designs, algorithms, code libraries, and software patents owned by the Sandbox Partner prior to the pilot shall remain the exclusive intellectual property of the Sandbox Partner.</li>
                        <li><strong>Sandbox Data:</strong> All transactional logs, operational telemetry, citizen inputs, and performance metrics collected during the pilot sandbox shall belong exclusively to the Disbursing Authority.</li>
                        <li><strong>Local License:</strong> The Sandbox Partner grants the First Party a non-exclusive, royalty-free, limited license to run and test the solution for the sandbox duration.</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-950 uppercase">4. INTENT TO PROCURE (EXEMPTION OVERRIDE)</h4>
                      <p>
                        Upon independent expert validation showing successful completion of sandbox deliverables meeting the required SLA (Service Level Agreements), the Disbursing Authority expresses its clear intent to transition this pilot into full-scale procurement under the <strong>Maharashtra State Innovative Startup Procurement Exemption Rules</strong>, bypassing the GFR public bidding L1 requirements.
                      </p>
                    </div>

                    {/* Signature Blocks */}
                    <div className="grid grid-cols-2 gap-8 pt-8 font-sans">
                      <div className="text-center space-y-8">
                        <span className="text-[10px] text-slate-400 block border-b border-dashed border-slate-300 pb-2">Nodal Nanded Representative Signature</span>
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800">{activePilot.departmentName}</p>
                          <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Digitally Signed &bull; SECURE</p>
                        </div>
                      </div>
                      <div className="text-center space-y-8">
                        <span className="text-[10px] text-slate-400 block border-b border-dashed border-slate-300 pb-2">Sandbox Startup Officer Signature</span>
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800">{activePilot.startupName}</p>
                          <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Digitally Signed &bull; SECURE</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-indigo-400" />
            <span className="font-bold text-slate-200">GovStart Pilot Platform</span>
            <span>&bull;</span>
            <span>Smart India Hackathon 2026</span>
          </div>
          <div>
            <p>Designed for Maharashtra State Innovation Society (MSInS). Prototype active.</p>
          </div>
        </div>
      </footer>

      {/* PILOT LAUNCH CONFIGURATION MODAL */}
      {showPilotModal && selectedStartupRec && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-800">Launch Sandbox Pilot</h3>
              <p className="text-xs text-slate-500 mt-1">Configure pilot milestone timeline and lock budget in escrow.</p>
            </div>

            <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50 text-xs">
              <p className="text-indigo-900"><strong className="font-semibold text-indigo-950">Startup Nodal Partner: </strong>{selectedStartupRec.startup.companyName}</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Pilot Project Scope</label>
                <input 
                  type="text" value={pilotForm.scope} 
                  onChange={e => setPilotForm({...pilotForm, scope: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Start Date</label>
                  <input 
                    type="date" value={pilotForm.startDate} 
                    onChange={e => setPilotForm({...pilotForm, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">End Date</label>
                  <input 
                    type="date" value={pilotForm.endDate} 
                    onChange={e => setPilotForm({...pilotForm, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Lock Escrow Payout (₹)</label>
                <input 
                  type="number" value={pilotForm.budget} 
                  onChange={e => setPilotForm({...pilotForm, budget: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={submitLaunchPilot}
                className="flex-grow bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-lg text-xs cursor-pointer shadow"
              >
                Approve & Launch
              </button>
              <button 
                onClick={() => setShowPilotModal(false)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DPIIT REGISTRY LOOKUP MODAL OVERLAY */}
      {showDpiitModal && selectedDpiitData && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-4 relative">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">DPIIT Startup Registry</h3>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded font-extrabold uppercase">
                  API Response Verified
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs font-semibold text-slate-700 pt-2 space-y-3">
              <div className="pt-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wide block mb-0.5">Registration Number</span>
                <p className="font-extrabold text-slate-900">{selectedDpiitData.dpiitNumber}</p>
              </div>
              <div className="pt-3">
                <span className="text-[10px] text-slate-400 uppercase tracking-wide block mb-0.5">Incorporation Date</span>
                <p className="text-slate-700">{selectedDpiitData.incorporationDate}</p>
              </div>
              <div className="pt-3">
                <span className="text-[10px] text-slate-400 uppercase tracking-wide block mb-0.5">Registered Category</span>
                <p className="text-slate-700">{selectedDpiitData.category}</p>
              </div>
              <div className="pt-3">
                <span className="text-[10px] text-slate-400 uppercase tracking-wide block mb-0.5">Registered Office Address</span>
                <p className="text-slate-700 leading-relaxed">{selectedDpiitData.registeredAddress}</p>
              </div>
              <div className="pt-3">
                <span className="text-[10px] text-slate-400 uppercase tracking-wide block mb-0.5">Active Company Directors</span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-700 mt-1">
                  {selectedDpiitData.directors.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4">
              <button 
                onClick={() => setShowDpiitModal(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs cursor-pointer shadow transition-colors"
              >
                Close Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
