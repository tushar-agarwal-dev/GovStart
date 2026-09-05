import { useState } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  ChevronDown, 
  Bell, 
  LogOut, 
  Lock, 
  HelpCircle, 
  Briefcase, 
  FileSignature, 
  CheckCircle,
  ShoppingCart,
  Users,
  BarChart3,
  Award,
  Cpu,
  Send,
  FileText
} from 'lucide-react';

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

interface DepartmentDashboardProps {
  auth: {
    name: string;
    email: string;
    role: string;
    userId: number;
  };
  problems: Problem[];
  pilots: Pilot[];
  onPostChallenge: () => void;
  onViewProblem: (problem: Problem) => void;
  onViewPilot: (pilot: Pilot) => void;
  onLogout: () => void;
}

export default function DepartmentDashboard({
  auth,
  problems,
  pilots,
  onPostChallenge,
  onViewProblem,
  onViewPilot,
  onLogout
}: DepartmentDashboardProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'challenges' | 'discovery' | 'pilots' | 'procurement' | 'audit'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState('ALL');
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [gemPublishSuccess, setGemPublishSuccess] = useState<string | null>(null);
  const [auditLedgerVerified, setAuditLedgerVerified] = useState<boolean | null>(null);

  // Expert Scorecard State
  const [feasibilityScore, setFeasibilityScore] = useState(4);
  const [innovationScore, setInnovationScore] = useState(5);
  const [teamScore, setTeamScore] = useState(4);
  const [costScore, setCostScore] = useState(4);
  const [expertRemarks, setExpertRemarks] = useState('');
  const [scorecardSubmitted, setScorecardSubmitted] = useState(false);

  // Startup Milestone Update State
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [milestoneName, setMilestoneName] = useState('Phase 2: Data Calibration & IoT Integration');
  const [milestoneProgress, setMilestoneProgress] = useState(75);
  const [milestoneNotes, setMilestoneNotes] = useState('Installed and calibrated 15 primary telemetry sensor nodes.');
  const [milestoneSubmitted, setMilestoneSubmitted] = useState(false);

  // Admin User List State
  const [adminUsers, setAdminUsers] = useState([
    { id: 1, name: 'Dr. S. K. Deshpande', email: 'dept@yuktisetu.gov.in', role: 'DEPARTMENT', status: 'ACTIVE' },
    { id: 2, name: 'Maha-EcoTech Solutions Pvt Ltd', email: 'ecotech@startups.in', role: 'STARTUP', status: 'ACTIVE' },
    { id: 3, name: 'Prof. Ravindra Kulkarni', email: 'kulkarni@coep.ac.in', role: 'EXPERT', status: 'ACTIVE' },
    { id: 4, name: 'State Super Admin', email: 'admin@yuktisetu.gov.in', role: 'ADMIN', status: 'ACTIVE' }
  ]);

  // Determine user role
  const roleUpper = (auth.role || 'DEPARTMENT').toUpperCase();
  const isStartup = roleUpper.includes('STARTUP');
  const isExpert = roleUpper.includes('EXPERT');
  const isAdmin = roleUpper.includes('ADMIN');

  // Sample Government Challenges
  const sampleChallenges = [
    {
      id: "CH-2026-014",
      title: "Smart Landfill Monitoring & Odor Sensor Network",
      sector: "Waste Management",
      budget: "₹20,00,000",
      timeline: "120 Days",
      stage: "AI Matching",
      status: "Recommended",
      statusColor: "emerald"
    },
    {
      id: "CH-2026-013",
      title: "AI-based Traffic Congestion Control & Signals",
      sector: "Urban Mobility",
      budget: "₹12,00,000",
      timeline: "90 Days",
      stage: "Expert Evaluation",
      status: "Review Required",
      statusColor: "amber"
    },
    {
      id: "CH-2026-012",
      title: "Rural Telemedicine Portal & Diagnostic Kiosk",
      sector: "Healthcare",
      budget: "₹15,00,000",
      timeline: "120 Days",
      stage: "Contract",
      status: "Approved",
      statusColor: "emerald"
    },
    {
      id: "CH-2026-011",
      title: "Drone-Based Crop Health Analytics Framework",
      sector: "Agriculture",
      budget: "₹18,00,000",
      timeline: "120 Days",
      stage: "Pilot",
      status: "Active",
      statusColor: "blue"
    }
  ];

  // Sample Active Pilots
  const samplePilots = [
    {
      id: "PILOT-026",
      challenge: "Rural Telemedicine Portal",
      startup: "HealthSetu Technologies Pvt. Ltd.",
      stage: "Contract Signed",
      progress: 0,
      escrowBalance: "₹15,00,000",
      nextMilestone: "Pilot Start",
      action: "Open"
    },
    {
      id: "PILOT-024",
      challenge: "Drone-Based Crop Health Analytics",
      startup: "KrishiDrone Innovations Pvt. Ltd.",
      stage: "Pilot Active",
      progress: 75,
      escrowBalance: "₹3,00,000",
      nextMilestone: "KPI Verification",
      action: "Verify"
    },
    {
      id: "PILOT-025",
      challenge: "Smart Landfill Monitoring",
      startup: "Maha-EcoTech Solutions",
      stage: "Scale Approved",
      progress: 100,
      escrowBalance: "₹0",
      nextMilestone: "Completed",
      action: "View Outcome"
    }
  ];

  const filteredChallenges = sampleChallenges.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sector.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStage = selectedStageFilter === 'ALL' || 
      item.status.toUpperCase().includes(selectedStageFilter);

    return matchesSearch && matchesStage;
  });

  const toggleUserStatus = (userId: number) => {
    setAdminUsers(adminUsers.map(u => 
      u.id === userId ? { ...u, status: u.status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE' } : u
    ));
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen text-slate-800 font-sans flex flex-col antialiased">
      
      {/* ==================================================
          1. TOP UTILITY BAR
         ================================================== */}
      <div className="bg-[#0F172A] text-slate-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-slate-800 flex flex-wrap justify-between items-center tracking-wide font-medium">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200">
            Government Innovation & Procurement Portal
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">
            State Innovation & Public Exemption Framework
          </span>
        </div>
        <div className="flex items-center gap-5 text-slate-300">
          <span className="hover:text-white cursor-pointer transition-colors">Digital Governance</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer transition-colors">Transparency</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">
            <HelpCircle size={12} /> Help & Guidelines
          </span>
        </div>
      </div>

      {/* ==================================================
          2. MAIN HEADER / NAVIGATION BAR
         ================================================== */}
      <header className="bg-white border-b border-[#D9DEE7] shadow-2xs sticky top-0 z-40">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo Header */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-md bg-[#0F172A] text-white flex items-center justify-center shadow-xs">
              <Building2 size={20} className="text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  Yukti<span className="text-indigo-700">Setu</span>
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase border ${
                  isStartup ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                  isExpert ? 'bg-purple-50 text-purple-800 border-purple-200' :
                  isAdmin ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-blue-50 text-blue-800 border-blue-200'
                }`}>
                  {isStartup ? 'Startup Desk' : isExpert ? 'Academic Panel' : isAdmin ? 'Super Admin' : 'Gov Portal'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Government Innovation & Procurement Platform
              </p>
            </div>
          </div>

          {/* Department Navigation Links */}
          {!isStartup && !isExpert && !isAdmin && (
            <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-600">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700 font-extrabold border-b-2 border-indigo-700' : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('challenges')}
                className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'challenges' ? 'bg-indigo-50 text-indigo-700 font-extrabold border-b-2 border-indigo-700' : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Challenges
              </button>
              <button 
                onClick={() => setActiveTab('discovery')}
                className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'discovery' ? 'bg-indigo-50 text-indigo-700 font-extrabold border-b-2 border-indigo-700' : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Startup Discovery
              </button>
              <button 
                onClick={() => setActiveTab('pilots')}
                className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'pilots' ? 'bg-indigo-50 text-indigo-700 font-extrabold border-b-2 border-indigo-700' : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Pilots
              </button>
              <button 
                onClick={() => setActiveTab('procurement')}
                className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'procurement' ? 'bg-indigo-50 text-indigo-700 font-extrabold border-b-2 border-indigo-700' : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Procurement
              </button>
              <button 
                onClick={() => setActiveTab('audit')}
                className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'audit' ? 'bg-indigo-50 text-indigo-700 font-extrabold border-b-2 border-indigo-700' : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Reports & Audit
              </button>
            </nav>
          )}

          {/* Right Header User Controls */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
                className="w-9 h-9 rounded-md border border-[#D9DEE7] hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
                title="Pending Actions"
              >
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-xs">
                  3
                </span>
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 p-1.5 rounded-md hover:bg-slate-100/80 border border-[#D9DEE7] transition-colors cursor-pointer"
              >
                <div className={`w-8 h-8 rounded text-white font-bold text-xs flex items-center justify-center border ${
                  isStartup ? 'bg-emerald-700 border-emerald-600' :
                  isExpert ? 'bg-purple-700 border-purple-600' :
                  isAdmin ? 'bg-rose-700 border-rose-600' : 'bg-indigo-900 border-indigo-700'
                }`}>
                  {isStartup ? 'ST' : isExpert ? 'EX' : isAdmin ? 'AD' : 'UD'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-extrabold text-slate-900 leading-tight">
                    {auth.name || 'User Session'}
                  </p>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                    {auth.role}
                  </span>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#D9DEE7] rounded-md shadow-xl py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{auth.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{auth.email}</p>
                    <span className="mt-1 inline-block text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold uppercase">
                      Role: {auth.role}
                    </span>
                  </div>
                  <div className="pt-1 border-t border-slate-100">
                    <button 
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut size={14} /> Log Out Session
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="max-w-[1500px] w-full mx-auto px-4 sm:px-8 py-6 space-y-6 flex-grow">
        
        {/* ==================================================
            ROLE WORKSPACE A: STARTUP COMMAND PANEL
           ================================================== */}
        {isStartup && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-md border border-[#D9DEE7] shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Startup Command Panel</h1>
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 uppercase">
                    <ShieldCheck size={13} /> DPIIT Verified: DPIIT-893021
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Manage matched government challenges, active sandbox pilots, and milestone escrow disbursements.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowMilestoneModal(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={15} /> Submit Pilot Milestone Update
                </button>
              </div>
            </div>

            {milestoneSubmitted && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-md text-xs flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-extrabold">Milestone Update Successfully Submitted!</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">The Nodal Officer has been notified for SLA milestone verification and escrow tranche release.</p>
                </div>
              </div>
            )}

            {/* Matched Challenges & Active Pilots */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Matched Government Challenges */}
              <div className="bg-white p-5 rounded-md border border-[#D9DEE7] shadow-2xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Cpu size={18} className="text-indigo-700" /> Matched Government Challenges (4)
                  </h3>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold border border-indigo-200">
                    AI Algorithmic Match
                  </span>
                </div>

                <div className="space-y-3">
                  {sampleChallenges.map(c => (
                    <div key={c.id} className="p-4 rounded-md border border-slate-200 hover:border-indigo-400 bg-slate-50/60 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-xs font-bold text-indigo-700">{c.id}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                          {c.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{c.title}</h4>
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200">
                        <span>Sector: <strong className="text-slate-800">{c.sector}</strong></span>
                        <span>Budget: <strong className="text-slate-900 font-mono">{c.budget}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Pilot Workspace */}
              <div className="bg-white p-5 rounded-md border border-[#D9DEE7] shadow-2xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Briefcase size={18} className="text-emerald-700" /> Active Pilot Workspace (1)
                  </h3>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-200">
                    Escrow Account Locked
                  </span>
                </div>

                <div className="p-5 rounded-md border border-emerald-200 bg-emerald-50/40 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase block">PILOT-025</span>
                      <h4 className="font-black text-base text-slate-900">Smart AI Landfill Waste Sorter</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Nanded Municipal Community Landfill Site</p>
                    </div>
                    <span className="bg-emerald-700 text-white text-[10px] font-black px-2.5 py-1 rounded uppercase">
                      Active Sandbox
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Milestone Progress</span>
                      <span>75% Completed</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full w-[75%]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Sanctioned</span>
                      <span className="font-mono font-black text-slate-900 text-sm">₹20,00,000</span>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Escrow Tranche 2</span>
                      <span className="font-mono font-black text-emerald-700 text-sm">₹7,00,000 Pending</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================================================
            ROLE WORKSPACE B: ACADEMIC EXPERT BOARD
           ================================================== */}
        {isExpert && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-md border border-[#D9DEE7] shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Expert Evaluation Board</h1>
                  <span className="bg-purple-100 text-purple-800 border border-purple-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 uppercase">
                    <Award size={13} /> COEP / VJTI Academic Technical Panel
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Evaluate shortlisted startup proposals based on technical feasibility, novelty, team capability, and cost.
                </p>
              </div>

              <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1.5 rounded border border-slate-200">
                1 Pending Evaluation in Queue
              </span>
            </div>

            {scorecardSubmitted && (
              <div className="bg-purple-50 border border-purple-300 text-purple-900 p-4 rounded-md text-xs flex items-center gap-2">
                <CheckCircle size={18} className="text-purple-700 flex-shrink-0" />
                <div>
                  <p className="font-extrabold text-purple-900">Academic Scorecard Successfully Submitted!</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">The Nodal Officer has received your quantitative ratings and technical evaluation report.</p>
                </div>
              </div>
            )}

            {/* Scorecard Form / Pending Queue */}
            <div className="bg-white p-6 rounded-md border border-[#D9DEE7] shadow-2xs space-y-6">
              <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-widest block">CANDIDATE STARTUP SCORING</span>
                  <h3 className="text-lg font-black text-slate-900">HealthSetu Technologies Pvt. Ltd.</h3>
                  <p className="text-xs text-slate-500">Proposal for Challenge: <strong className="text-slate-800">CH-2026-013 (AI Traffic Congestion Control)</strong></p>
                </div>
                <span className="bg-purple-50 text-purple-800 border border-purple-200 px-3 py-1 rounded text-xs font-bold uppercase">
                  DPIIT-489031
                </span>
              </div>

              {/* 4 Metric Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2 bg-slate-50 p-4 rounded-md border border-slate-200">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-extrabold text-slate-800">1. Technical Feasibility (1–5)</label>
                    <span className="font-mono font-black text-indigo-700 text-sm">{feasibilityScore} / 5</span>
                  </div>
                  <input 
                    type="range" min="1" max="5" value={feasibilityScore}
                    onChange={e => setFeasibilityScore(Number(e.target.value))}
                    className="w-full accent-indigo-700 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">Evaluates whether technology is scientifically sound and deployable.</p>
                </div>

                <div className="space-y-2 bg-slate-50 p-4 rounded-md border border-slate-200">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-extrabold text-slate-800">2. Novelty & Innovation (1–5)</label>
                    <span className="font-mono font-black text-indigo-700 text-sm">{innovationScore} / 5</span>
                  </div>
                  <input 
                    type="range" min="1" max="5" value={innovationScore}
                    onChange={e => setInnovationScore(Number(e.target.value))}
                    className="w-full accent-indigo-700 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">Evaluates technological uniqueness and IP strength over legacy hardware.</p>
                </div>

                <div className="space-y-2 bg-slate-50 p-4 rounded-md border border-slate-200">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-extrabold text-slate-800">3. Team Implementation Capability (1–5)</label>
                    <span className="font-mono font-black text-indigo-700 text-sm">{teamScore} / 5</span>
                  </div>
                  <input 
                    type="range" min="1" max="5" value={teamScore}
                    onChange={e => setTeamScore(Number(e.target.value))}
                    className="w-full accent-indigo-700 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">Evaluates founder execution track record and engineering capacity.</p>
                </div>

                <div className="space-y-2 bg-slate-50 p-4 rounded-md border border-slate-200">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-extrabold text-slate-800">4. Cost & Economic Viability (1–5)</label>
                    <span className="font-mono font-black text-indigo-700 text-sm">{costScore} / 5</span>
                  </div>
                  <input 
                    type="range" min="1" max="5" value={costScore}
                    onChange={e => setCostScore(Number(e.target.value))}
                    className="w-full accent-indigo-700 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">Evaluates financial breakdown and cost effectiveness for public funds.</p>
                </div>

              </div>

              {/* Expert Remarks Textarea */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 block">Expert Qualitative Remarks & Recommendations</label>
                <textarea 
                  value={expertRemarks}
                  onChange={e => setExpertRemarks(e.target.value)}
                  placeholder="Enter academic review, technical risks, and implementation recommendations..."
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-600 font-medium"
                />
              </div>

              <button 
                onClick={() => setScorecardSubmitted(true)}
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-6 py-2.5 rounded-md shadow-xs transition-colors cursor-pointer"
              >
                Submit Academic Scorecard
              </button>
            </div>
          </div>
        )}

        {/* ==================================================
            ROLE WORKSPACE C: SUPER ADMIN CONTROL PANEL
           ================================================== */}
        {isAdmin && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-md border border-[#D9DEE7] shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Platform Dashboard</h1>
                  <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 uppercase">
                    <Lock size={13} /> State Super Admin
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Global system overview, user access permissions, procurement funnel visualizer, and SHA-256 audit ledger.
                </p>
              </div>
            </div>

            {/* Admin Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-md border border-[#D9DEE7] shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-slate-900">4 Problems</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total Posted Challenges</p>
                </div>
                <div className="w-10 h-10 rounded bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
                  <FileText size={20} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-md border border-[#D9DEE7] shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-slate-900">4 Pilots</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Active Sandbox Pilots</p>
                </div>
                <div className="w-10 h-10 rounded bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
                  <Briefcase size={20} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-md border border-[#D9DEE7] shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-slate-900">₹45,20,000</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total Escrow Funds Locked</p>
                </div>
                <div className="w-10 h-10 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <Lock size={20} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* User Management Table */}
              <div className="lg:col-span-8 bg-white p-5 rounded-md border border-[#D9DEE7] shadow-2xs space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Users size={18} className="text-rose-700" /> Platform User Management
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 uppercase font-black text-[10px] border-b border-[#D9DEE7]">
                        <th className="py-2.5 px-3">Name</th>
                        <th className="py-2.5 px-3">Email</th>
                        <th className="py-2.5 px-3">Role</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {adminUsers.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-bold text-slate-900">{u.name}</td>
                          <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{u.email}</td>
                          <td className="py-3 px-3">
                            <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-slate-200">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button 
                              onClick={() => toggleUserStatus(u.id)}
                              className={`px-3 py-1 rounded text-xs font-bold border cursor-pointer ${
                                u.status === 'ACTIVE' ? 'border-rose-200 text-rose-700 hover:bg-rose-50' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                              }`}
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

              {/* Procurement Funnel Visualizer */}
              <div className="lg:col-span-4 bg-white p-5 rounded-md border border-[#D9DEE7] shadow-2xs space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <BarChart3 size={18} className="text-rose-700" /> Procurement Funnel
                </h3>

                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Problems Posted</span>
                      <span>4 (100%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full w-[100%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Evaluated Challenges</span>
                      <span>3 (75%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full w-[75%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Active Sandbox Pilots</span>
                      <span>2 (50%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[50%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>GeM Scale-Up Decided</span>
                      <span>1 (25%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full w-[25%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            ROLE WORKSPACE D: DEPARTMENT NODAL DASHBOARD
           ================================================== */}
        {!isStartup && !isExpert && !isAdmin && (
          <>
            {/* PAGE HEADER STRIP */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-md border border-[#D9DEE7] shadow-2xs">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {activeTab === 'dashboard' && 'Department Dashboard'}
                    {activeTab === 'challenges' && 'Government Challenge Register'}
                    {activeTab === 'discovery' && 'AI-Assisted Startup Discovery & Matchmaker'}
                    {activeTab === 'pilots' && 'Active Pilot Sandboxes Control Center'}
                    {activeTab === 'procurement' && 'Scale-Up & GeM Marketplace Publishing Hub'}
                    {activeTab === 'audit' && 'Tamper-Evident SHA-256 Audit Ledger'}
                  </h1>
                  <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded border border-slate-200 uppercase">
                    State Procurement Node
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  <span className="font-extrabold text-slate-900">Urban Development Department</span> • Jaipur • Financial Year 2026–27
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={onPostChallenge}
                  className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-4 py-2.5 rounded-md shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus size={15} /> Post Outcome Challenge
                </button>
                <button 
                  onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-md border border-[#D9DEE7] transition-colors cursor-pointer"
                >
                  View Pending Actions (3)
                </button>
              </div>
            </div>

            {/* TAB 1: EXECUTIVE DASHBOARD VIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Notification / Action Strip */}
                <div className="bg-amber-50/90 border border-amber-200 rounded-md p-3.5 text-amber-900 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-amber-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      !
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                      3 Actions Require Your Attention:
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span 
                      onClick={() => setActiveTab('discovery')}
                      className="bg-white border border-amber-300 text-amber-900 px-3 py-1 rounded-md font-bold text-[11px] flex items-center gap-1.5 shadow-2xs cursor-pointer hover:bg-amber-100"
                    >
                      <AlertTriangle size={13} className="text-amber-600" /> 2 startup matches awaiting review
                    </span>
                    <span 
                      onClick={() => setActiveTab('challenges')}
                      className="bg-white border border-amber-300 text-amber-900 px-3 py-1 rounded-md font-bold text-[11px] flex items-center gap-1.5 shadow-2xs cursor-pointer hover:bg-amber-100"
                    >
                      <AlertTriangle size={13} className="text-amber-600" /> 1 expert scorecard awaiting approval
                    </span>
                    <span 
                      onClick={() => setActiveTab('pilots')}
                      className="bg-white border border-amber-300 text-amber-900 px-3 py-1 rounded-md font-bold text-[11px] flex items-center gap-1.5 shadow-2xs cursor-pointer hover:bg-amber-100"
                    >
                      <AlertTriangle size={13} className="text-amber-600" /> 1 pilot milestone awaiting verification
                    </span>
                  </div>
                </div>

                {/* Procurement Overview Metrics */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">
                      PROCUREMENT OVERVIEW
                    </h2>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Live Sanctioned & Escrow Balances
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    <div className="bg-white p-4 rounded-md border border-[#D9DEE7] shadow-2xs flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-black text-slate-900 tracking-tight">₹45.0L</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total Pilot Allocation</p>
                      </div>
                      <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
                        <Building2 size={16} />
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-md border border-[#D9DEE7] shadow-2xs flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-black text-slate-900 tracking-tight">₹33.75L</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Funds Committed</p>
                      </div>
                      <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
                        <Lock size={16} />
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-md border border-[#D9DEE7] shadow-2xs flex items-center justify-between cursor-pointer hover:border-indigo-400" onClick={() => setActiveTab('pilots')}>
                      <div>
                        <p className="text-2xl font-black text-indigo-700 tracking-tight">4</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Active Pilot Programs</p>
                      </div>
                      <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
                        <Briefcase size={16} />
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-md border border-[#D9DEE7] shadow-2xs flex items-center justify-between cursor-pointer hover:border-amber-400" onClick={() => setActiveTab('challenges')}>
                      <div>
                        <p className="text-2xl font-black text-amber-700 tracking-tight">2</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Challenges Awaiting Review</p>
                      </div>
                      <div className="w-8 h-8 rounded bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                        <Clock size={16} />
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-md border border-[#D9DEE7] shadow-2xs flex items-center justify-between cursor-pointer hover:border-rose-400" onClick={() => setActiveTab('pilots')}>
                      <div>
                        <p className="text-2xl font-black text-rose-700 tracking-tight">1</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Milestone Verification Pending</p>
                      </div>
                      <div className="w-8 h-8 rounded bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
                        <AlertTriangle size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Procurement Lifecycle Stepper */}
                <div className="bg-white p-5 rounded-md border border-[#D9DEE7] shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                    <div>
                      <h2 className="text-xs font-black text-indigo-900 uppercase tracking-widest">PROCUREMENT LIFECYCLE</h2>
                      <p className="text-xs text-slate-500 font-medium">Track each challenge from problem definition to procurement.</p>
                    </div>
                    <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200 uppercase self-start sm:self-auto">
                      Institutional Case Flow
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
                    <div onClick={() => setActiveTab('challenges')} className="bg-emerald-50/60 border border-emerald-200 p-3 rounded-md space-y-1.5 cursor-pointer hover:bg-emerald-50">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-emerald-800">01</span>
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center">✓</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 leading-tight">Challenge Definition</h4>
                      <span className="inline-block text-[10px] font-black text-emerald-800 uppercase tracking-wider">COMPLETED</span>
                    </div>

                    <div onClick={() => setActiveTab('discovery')} className="bg-emerald-50/60 border border-emerald-200 p-3 rounded-md space-y-1.5 cursor-pointer hover:bg-emerald-50">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-emerald-800">02</span>
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center">✓</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 leading-tight">Startup Discovery</h4>
                      <span className="inline-block text-[10px] font-black text-emerald-800 uppercase tracking-wider">COMPLETED</span>
                    </div>

                    <div onClick={() => setActiveTab('challenges')} className="bg-amber-50/90 border border-amber-300 p-3 rounded-md space-y-1.5 cursor-pointer hover:bg-amber-50 ring-2 ring-amber-400/50">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-amber-800">03</span>
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[11px] flex items-center justify-center">⚠</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 leading-tight">Expert Evaluation</h4>
                      <span className="inline-block text-[10px] font-black text-amber-800 uppercase tracking-wider">ACTION REQUIRED</span>
                    </div>

                    <div onClick={() => setActiveTab('discovery')} className="bg-slate-50 border border-slate-200 p-3 rounded-md space-y-1.5 cursor-pointer hover:bg-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-slate-500">04</span>
                        <span className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 font-bold text-[11px] flex items-center justify-center">○</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-700 leading-tight">Digital Contract</h4>
                      <span className="inline-block text-[10px] font-black text-slate-500 uppercase tracking-wider">PENDING</span>
                    </div>

                    <div onClick={() => setActiveTab('pilots')} className="bg-slate-50 border border-slate-200 p-3 rounded-md space-y-1.5 cursor-pointer hover:bg-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-slate-500">05</span>
                        <span className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 font-bold text-[11px] flex items-center justify-center">○</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-700 leading-tight">Pilot Sandbox</h4>
                      <span className="inline-block text-[10px] font-black text-slate-500 uppercase tracking-wider">PENDING</span>
                    </div>

                    <div onClick={() => setActiveTab('procurement')} className="bg-slate-50 border border-slate-200 p-3 rounded-md space-y-1.5 cursor-pointer hover:bg-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-slate-500">06</span>
                        <span className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 font-bold text-[11px] flex items-center justify-center">○</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-700 leading-tight">Scale / Procurement</h4>
                      <span className="inline-block text-[10px] font-black text-slate-500 uppercase tracking-wider">PENDING</span>
                    </div>
                  </div>
                </div>

                {/* Challenge Register Table Preview */}
                <div className="bg-white rounded-md border border-[#D9DEE7] shadow-2xs p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Active Challenge Register</h3>
                      <p className="text-xs text-slate-500">Quick overview of innovation challenges raised by departments.</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('challenges')}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900"
                    >
                      View All Challenges →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 uppercase font-black text-[10px] border-b border-[#D9DEE7]">
                          <th className="py-2.5 px-3">Challenge ID</th>
                          <th className="py-2.5 px-3">Challenge Title</th>
                          <th className="py-2.5 px-3">Sector</th>
                          <th className="py-2.5 px-3">Budget</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-medium">
                        {sampleChallenges.map(c => (
                          <tr key={c.id} className="hover:bg-slate-50">
                            <td className="py-3 px-3 font-mono font-bold text-slate-900">{c.id}</td>
                            <td className="py-3 px-3 font-bold text-slate-800">{c.title}</td>
                            <td className="py-3 px-3 text-slate-600">{c.sector}</td>
                            <td className="py-3 px-3 font-extrabold text-slate-900">{c.budget}</td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                c.statusColor === 'emerald' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                                c.statusColor === 'amber' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
                              }`}>
                                {c.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button 
                                onClick={() => setActiveTab('discovery')}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2.5 py-1 rounded text-xs"
                              >
                                Review
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

            {/* TAB 2: GOVERNMENT CHALLENGE REGISTER VIEW */}
            {activeTab === 'challenges' && (
              <div className="bg-white rounded-md border border-[#D9DEE7] shadow-2xs overflow-hidden space-y-4">
                <div className="p-5 border-b border-[#D9DEE7] space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">
                        Government Challenge Register
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Active innovation challenges raised by government departments under Option 5 Exemption.
                      </p>
                    </div>
                    <button 
                      onClick={onPostChallenge}
                      className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-4 py-2 rounded-md shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <Plus size={14} /> Post Outcome Challenge
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[240px]">
                      <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search by Challenge ID, title or keyword..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-[#D9DEE7] rounded-md text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:bg-white"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select 
                        value={selectedStageFilter}
                        onChange={e => setSelectedStageFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-[#D9DEE7] rounded-md text-xs font-semibold text-slate-700 focus:outline-none"
                      >
                        <option value="ALL">Status: All</option>
                        <option value="RECOMMENDED">Recommended</option>
                        <option value="REVIEW">Review Required</option>
                        <option value="APPROVED">Approved</option>
                        <option value="ACTIVE">Active</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto p-5 pt-0">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/80 text-[11px] font-black text-slate-600 uppercase tracking-wider border-b border-[#D9DEE7]">
                        <th className="py-3 px-4">Challenge ID</th>
                        <th className="py-3 px-4">Challenge</th>
                        <th className="py-3 px-4">Sector</th>
                        <th className="py-3 px-4">Budget</th>
                        <th className="py-3 px-4">Timeline</th>
                        <th className="py-3 px-4">Current Stage</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {filteredChallenges.map((item) => (
                        <tr key={item.id} className="hover:bg-indigo-50/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{item.id}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{item.title}</td>
                          <td className="py-3.5 px-4 text-slate-600">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[11px]">
                              {item.sector}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-extrabold text-slate-900">{item.budget}</td>
                          <td className="py-3.5 px-4 text-slate-600">{item.timeline}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700">{item.stage}</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-bold text-[10px] uppercase ${
                              item.statusColor === 'emerald' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                              item.statusColor === 'amber' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button 
                              onClick={() => {
                                if (problems && problems.length > 0) onViewProblem(problems[0]);
                                else setActiveTab('discovery');
                              }}
                              className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-3 py-1 rounded text-xs transition-colors"
                            >
                              View Challenge
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: AI STARTUP DISCOVERY & MATCHMAKER VIEW */}
            {activeTab === 'discovery' && (
              <div className="bg-white p-6 rounded-md border border-[#D9DEE7] shadow-2xs space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">
                        AI-Assisted Startup Discovery & Matchmaker
                      </h3>
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded uppercase">
                        Explainable Decision Support
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Algorithmic match breakdown for Challenge: <span className="font-extrabold text-slate-800">CH-2026-013 (AI-based Traffic Congestion Control)</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded font-bold border border-slate-200">
                      8 startups identified
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded font-extrabold border border-emerald-300">
                      1 recommended
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start bg-slate-50/80 p-5 rounded-md border border-slate-200">
                  <div className="lg:col-span-5 space-y-4">
                    <div>
                      <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-widest block mb-1">
                        TOP RECOMMENDED CANDIDATE
                      </span>
                      <h4 className="text-xl font-black text-slate-900">
                        HealthSetu Technologies Pvt. Ltd.
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-slate-600">DPIIT Reg: DPIIT-489031</span>
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <ShieldCheck size={12} /> DPIIT Verified
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-md border border-[#D9DEE7] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                          Overall Algorithmic Match
                        </span>
                        <p className="text-xs text-slate-500 font-medium">Weighted Institutional Score</p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-black text-indigo-900">91</span>
                        <span className="text-xs font-bold text-slate-400"> / 100</span>
                      </div>
                    </div>

                    <div className="bg-indigo-50/80 border border-indigo-200 p-4 rounded-md space-y-1.5">
                      <h5 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider">
                        Why this startup was recommended
                      </h5>
                      <p className="text-xs text-slate-700 leading-relaxed font-normal">
                        "Strong alignment with the challenge KPIs, relevant deployment experience, verified startup credentials, and a proposed solution within the approved pilot budget."
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-3">
                    <h5 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      Quantitative Scoring Breakdown
                    </h5>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="bg-white p-3.5 rounded-md border border-[#D9DEE7] space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Problem Alignment</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-lg font-black text-slate-900">95</span>
                          <span className="text-[10px] font-bold text-emerald-600">High Fit</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full w-[95%]" />
                        </div>
                      </div>

                      <div className="bg-white p-3.5 rounded-md border border-[#D9DEE7] space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Technical Capability</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-lg font-black text-slate-900">89</span>
                          <span className="text-[10px] font-bold text-emerald-600">Vetted</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full w-[89%]" />
                        </div>
                      </div>

                      <div className="bg-white p-3.5 rounded-md border border-[#D9DEE7] space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Past Experience</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-lg font-black text-slate-900">92</span>
                          <span className="text-[10px] font-bold text-emerald-600">Proven</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full w-[92%]" />
                        </div>
                      </div>

                      <div className="bg-white p-3.5 rounded-md border border-[#D9DEE7] space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Budget Compatibility</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-lg font-black text-slate-900">88</span>
                          <span className="text-[10px] font-bold text-indigo-600">Within Limit</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full w-[88%]" />
                        </div>
                      </div>

                      <div className="bg-white p-3.5 rounded-md border border-[#D9DEE7] space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Pilot Readiness</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-lg font-black text-slate-900">91</span>
                          <span className="text-[10px] font-bold text-emerald-600">Ready</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full w-[91%]" />
                        </div>
                      </div>

                      <div className="bg-white p-3.5 rounded-md border border-[#D9DEE7] space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">DPIIT Verification</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-[11px] font-black text-emerald-700 flex items-center gap-1 mt-1">
                            <CheckCircle size={14} /> Verified
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 block font-mono">DPIIT-489031</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button 
                        onClick={() => setActiveTab('pilots')}
                        className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-5 py-2 rounded-md shadow-xs transition-colors cursor-pointer"
                      >
                        Approve for Digital Contract & Pilot
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ACTIVE PILOTS CONTROL CENTER VIEW */}
            {activeTab === 'pilots' && (
              <div className="bg-white rounded-md border border-[#D9DEE7] shadow-2xs overflow-hidden space-y-4 p-5">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      Active Pilot Sandboxes Control Center
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Live sandbox programs undergoing performance milestone verification and escrow disbursement.
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded border border-slate-200">
                    Total Active Pilots: 3
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/80 text-[11px] font-black text-slate-600 uppercase tracking-wider border-b border-[#D9DEE7]">
                        <th className="py-3 px-4">Pilot ID</th>
                        <th className="py-3 px-4">Challenge</th>
                        <th className="py-3 px-4">Startup</th>
                        <th className="py-3 px-4">Pilot Stage</th>
                        <th className="py-3 px-4">Progress</th>
                        <th className="py-3 px-4">Escrow Balance</th>
                        <th className="py-3 px-4">Next Milestone</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {samplePilots.map((pilot) => (
                        <tr key={pilot.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{pilot.id}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{pilot.challenge}</td>
                          <td className="py-3.5 px-4 text-slate-700 font-semibold">{pilot.startup}</td>
                          <td className="py-3.5 px-4">
                            <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold text-[10px] uppercase border border-slate-200">
                              {pilot.stage}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2 max-w-[120px]">
                              <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-indigo-600 h-full" style={{ width: `${pilot.progress}%` }} />
                              </div>
                              <span className="font-extrabold text-slate-900 text-[11px]">{pilot.progress}%</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-black text-slate-900">{pilot.escrowBalance}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-600">{pilot.nextMilestone}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button 
                              onClick={() => {
                                if (pilots && pilots.length > 0) onViewPilot(pilots[0]);
                              }}
                              className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-3 py-1 rounded text-xs cursor-pointer"
                            >
                              {pilot.action === 'Verify' ? 'Verify Milestone' : pilot.action === 'View Outcome' ? 'View Outcome' : 'Open Workspace'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: SCALE-UP & GeM MARKETPLACE PUBLISHING VIEW */}
            {activeTab === 'procurement' && (
              <div className="bg-white p-6 rounded-md border border-[#D9DEE7] shadow-2xs space-y-6">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      Scale-Up & GeM Marketplace Publishing Hub
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Convert 100% completed sandbox pilots into state-wide direct procurement listings on the GeM Portal.
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded">
                    Option 5 Exemption Active
                  </span>
                </div>

                <div className="bg-slate-50 p-5 rounded-md border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest block">
                        CERTIFIED SANDBOX OUTCOME
                      </span>
                      <h4 className="text-xl font-black text-slate-900">
                        Smart AI Landfill Waste Sorter (PILOT-025)
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Startup: <span className="font-bold text-slate-800">Maha-EcoTech Solutions</span> • Nanded Landfill Sandbox
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded text-xs font-black uppercase block">
                        100% KPI Achieved
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 block">Sorting Accuracy: 93.5%</span>
                    </div>
                  </div>

                  {gemPublishSuccess && (
                    <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-md text-xs space-y-1">
                      <p className="font-extrabold flex items-center gap-1.5 text-emerald-800">
                        <CheckCircle size={16} /> Certified Outcome Successfully Published to GeM Portal!
                      </p>
                      <p className="font-mono text-[11px] text-emerald-700">GeM Catalog ID: {gemPublishSuccess}</p>
                      <p className="text-[10px] text-slate-500">All government municipal bodies across India can now procure this solution directly under Govt Exemption Order #MH-PROC-2026-05.</p>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-3">
                    <button 
                      onClick={() => setGemPublishSuccess('GEM-CATALOG-893012')}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-md shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <ShoppingCart size={15} /> Publish Certified Solution to GeM Marketplace
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: TAMPER-EVIDENT SHA-256 AUDIT LEDGER VIEW */}
            {activeTab === 'audit' && (
              <div className="bg-white p-6 rounded-md border border-[#D9DEE7] shadow-2xs space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      Tamper-Evident SHA-256 Cryptographic Audit Ledger
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Public procurement compliance and cryptographic hash verification for state audit inspectors.
                    </p>
                  </div>
                  <button 
                    onClick={() => setAuditLedgerVerified(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-md shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <ShieldCheck size={15} /> Verify Ledger Integrity
                  </button>
                </div>

                {auditLedgerVerified && (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-md text-xs flex items-center gap-3">
                    <CheckCircle size={20} className="text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-extrabold text-emerald-900 text-sm">Cryptographic Ledger Integrity Verified</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        All 12 transaction blocks passed SHA-256 hash chaining checks. 0 tampered records found. 100% GFR Audit Compliant.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Audit Trail Status</span>
                    <span className="text-xs font-black text-emerald-700 uppercase flex items-center gap-1">
                      <CheckCircle size={13} /> ACTIVE & SIGNED
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Transaction Integrity</span>
                    <span className="text-xs font-black text-indigo-700 uppercase flex items-center gap-1">
                      <ShieldCheck size={13} /> SHA-256 Chained
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Startup Verification</span>
                    <span className="text-xs font-black text-emerald-700 uppercase flex items-center gap-1">
                      <CheckCircle size={13} /> DPIIT Verified
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Contract Records</span>
                    <span className="text-xs font-black text-slate-900 uppercase flex items-center gap-1">
                      <FileSignature size={13} /> Digitally Signed
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Pilot Payments</span>
                    <span className="text-xs font-black text-indigo-700 uppercase flex items-center gap-1">
                      <Lock size={13} /> Milestone Escrow
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">GFR Compliance</span>
                    <span className="text-xs font-black text-emerald-700 uppercase flex items-center gap-1">
                      <CheckCircle size={13} /> GFR Checks Passed
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 uppercase font-black text-[10px] border-b border-[#D9DEE7]">
                        <th className="py-2.5 px-3">Block ID</th>
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Actor</th>
                        <th className="py-2.5 px-3">Action</th>
                        <th className="py-2.5 px-3">Details</th>
                        <th className="py-2.5 px-3">SHA-256 Checksum (Chained)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-slate-900">Block #104</td>
                        <td className="py-3 px-3 text-slate-500">2026-02-28 09:42</td>
                        <td className="py-3 px-3 font-bold text-slate-800 font-sans">System Auto-Verifier</td>
                        <td className="py-3 px-3 font-sans"><span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">DPIIT_VERIFY</span></td>
                        <td className="py-3 px-3 text-slate-600 font-sans">DPIIT Registration #DPIIT-489031 verified successfully</td>
                        <td className="py-3 px-3 text-indigo-600 select-all">89a4f2c8d3e1b7f0a5c8...</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-slate-900">Block #103</td>
                        <td className="py-3 px-3 text-slate-500">2026-02-28 09:18</td>
                        <td className="py-3 px-3 font-bold text-slate-800 font-sans">Prof. Ravindra Kulkarni (COEP)</td>
                        <td className="py-3 px-3 font-sans"><span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">EXPERT_SCORECARD</span></td>
                        <td className="py-3 px-3 text-slate-600 font-sans">Submitted scorecard rating 91/100 for HealthSetu Technologies</td>
                        <td className="py-3 px-3 text-indigo-600 select-all">77b3d1e2f4a5c6b7d8e9...</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-slate-900">Block #102</td>
                        <td className="py-3 px-3 text-slate-500">2026-02-27 16:30</td>
                        <td className="py-3 px-3 font-bold text-slate-800 font-sans">Dr. S. K. Deshpande (Urban Dev)</td>
                        <td className="py-3 px-3 font-sans"><span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">DIGITAL_STAMP_SIGN</span></td>
                        <td className="py-3 px-3 text-slate-600 font-sans">Executed e-Stamp Paper Agreement #MH893012 for PILOT-026</td>
                        <td className="py-3 px-3 text-indigo-600 select-all">55c1d2e3f4a5b6c7d8e9...</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-slate-900">Block #101</td>
                        <td className="py-3 px-3 text-slate-500">2026-02-27 14:15</td>
                        <td className="py-3 px-3 font-bold text-slate-800 font-sans">KrishiDrone Innovations</td>
                        <td className="py-3 px-3 font-sans"><span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">ESCROW_MILESTONE_REQ</span></td>
                        <td className="py-3 px-3 text-slate-600 font-sans">Requested Milestone 2 Escrow Release (₹3,00,000)</td>
                        <td className="py-3 px-3 text-indigo-600 select-all">33a9b8c7d6e5f4a3b2c1...</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

      </main>

      {/* Startup Milestone Modal */}
      {showMilestoneModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Send size={18} className="text-emerald-600" /> Submit Pilot Milestone Update
              </h3>
              <button onClick={() => setShowMilestoneModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">×</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-extrabold text-slate-800 block mb-1">Milestone Name</label>
                <input 
                  type="text" 
                  value={milestoneName} 
                  onChange={e => setMilestoneName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded font-medium focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-extrabold text-slate-800">Completion Progress (%)</label>
                  <span className="font-mono font-bold text-emerald-700">{milestoneProgress}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={milestoneProgress} 
                  onChange={e => setMilestoneProgress(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-800 block mb-1">Progress Summary Notes & SLA Metrics</label>
                <textarea 
                  value={milestoneNotes} 
                  onChange={e => setMilestoneNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded font-medium focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button onClick={() => setShowMilestoneModal(false)} className="px-4 py-2 rounded text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700">Cancel</button>
              <button 
                onClick={() => {
                  setMilestoneSubmitted(true);
                  setShowMilestoneModal(false);
                }} 
                className="px-5 py-2 rounded text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
              >
                Submit Milestone Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-[#0F172A] text-slate-400 pt-12 pb-6 border-t border-slate-800 mt-12">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-indigo-700 text-white flex items-center justify-center font-black">
                  Y
                </div>
                <span className="text-xl font-black text-white tracking-tight">
                  Yukti<span className="text-indigo-400">Setu</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Government Innovation & Procurement Platform
              </p>
              <p className="text-[11px] text-slate-500 italic">
                "Designed for transparent, outcome-driven public procurement."
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li><button onClick={() => setActiveTab('challenges')} className="hover:text-white transition-colors">Challenges Register</button></li>
                <li><button onClick={() => setActiveTab('discovery')} className="hover:text-white transition-colors">Startup Discovery API</button></li>
                <li><button onClick={() => setActiveTab('pilots')} className="hover:text-white transition-colors">Pilot Sandboxes</button></li>
                <li><button onClick={() => setActiveTab('procurement')} className="hover:text-white transition-colors">GeM Marketplace Integration</button></li>
                <li><button onClick={() => setActiveTab('audit')} className="hover:text-white transition-colors">Reports & Audit Ledger</button></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">
                Support & Rules
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Help & Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GFR Procurement Exemption Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nodal Contact Desk</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy & Cryptographic Keys Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Governance</a></li>
              </ul>
            </div>

            {/* User Session Info */}
            <div className="space-y-2 bg-slate-900/80 p-4 rounded-md border border-slate-800">
              <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">
                Active Session Info
              </h4>
              <p className="text-xs font-bold text-slate-300">
                {auth.name || 'User Session'}
              </p>
              <p className="text-[11px] text-slate-400">
                Role: <span className="text-indigo-400 font-bold uppercase">{auth.role}</span>
              </p>
              <span className="inline-block text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold uppercase mt-2">
                • Security Token Valid
              </span>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© 2026 YuktiSetu Platform. State Public Procurement Exemption Framework. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-300">NIC Guidelines</a>
              <a href="#" className="hover:text-slate-300">Cyber Security Audit</a>
              <a href="#" className="hover:text-slate-300">Accessibility Statement</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
