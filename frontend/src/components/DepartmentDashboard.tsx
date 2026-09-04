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
  CheckCircle 
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'challenges' | 'pilots' | 'procurement' | 'audit'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState('ALL');
  const [selectedChallengeForDrawer, setSelectedChallengeForDrawer] = useState<number | null>(null);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  // Sample Government Challenges matching requested specs
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

  // Sample Active Pilots matching specs
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

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen text-slate-800 font-sans flex flex-col antialiased">
      
      {/* ==================================================
          2. TOP UTILITY BAR (Thin Government Portal Header)
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
          3. MAIN HEADER / NAVIGATION
         ================================================== */}
      <header className="bg-white border-b border-[#D9DEE7] shadow-2xs sticky top-0 z-40">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 h-18 flex items-center justify-between">
          
          {/* Left Brand Header */}
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-md bg-[#0F172A] text-white flex items-center justify-center shadow-xs">
              <Building2 size={20} className="text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  Yukti<span className="text-indigo-700">Setu</span>
                </span>
                <span className="text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded uppercase">
                  Gov Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Government Innovation & Procurement Platform
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-600">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-slate-100 text-indigo-700 font-extrabold border-b-2 border-indigo-700' : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('challenges')}
              className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
                activeTab === 'challenges' ? 'bg-slate-100 text-indigo-700 font-extrabold border-b-2 border-indigo-700' : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Challenges
            </button>
            <button 
              onClick={() => setActiveTab('challenges')}
              className="px-4 py-2 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Startup Discovery
            </button>
            <button 
              onClick={() => setActiveTab('pilots')}
              className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
                activeTab === 'pilots' ? 'bg-slate-100 text-indigo-700 font-extrabold border-b-2 border-indigo-700' : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Pilots
            </button>
            <button 
              onClick={() => setActiveTab('procurement')}
              className="px-4 py-2 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Procurement
            </button>
            <button 
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
                activeTab === 'audit' ? 'bg-slate-100 text-indigo-700 font-extrabold border-b-2 border-indigo-700' : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Reports & Audit
            </button>
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4">
            
            {/* Notification Bell Icon */}
            <div className="relative">
              <button 
                onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
                className="w-9 h-9 rounded-md border border-[#D9DEE7] hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
                title="Pending Officer Actions"
              >
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-xs">
                  3
                </span>
              </button>
            </div>

            {/* Department Officer Info & Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 p-1.5 rounded-md hover:bg-slate-100/80 border border-[#D9DEE7] transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded bg-indigo-900 text-white font-bold text-xs flex items-center justify-center border border-indigo-700">
                  UD
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-extrabold text-slate-900 leading-tight">
                    {auth.name || 'Urban Development Dept'}
                  </p>
                  <span className="text-[10px] text-slate-500 font-semibold block">
                    Nodal Administrative Officer
                  </span>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {/* Profile Dropdown Menu with Logout inside */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#D9DEE7] rounded-md shadow-xl py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{auth.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{auth.email}</p>
                    <span className="mt-1 inline-block text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold uppercase">
                      Role: {auth.role}
                    </span>
                  </div>
                  <div className="py-1">
                    <a href="#profile" className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium">
                      Department Profile & Credentials
                    </a>
                    <a href="#settings" className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium">
                      Procurement Delegation Rules
                    </a>
                    <a href="#audit" className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium">
                      Cryptographic Audit Keys
                    </a>
                  </div>
                  <div className="pt-1 border-t border-slate-100">
                    <button 
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut size={14} /> Log Out Administrative Session
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
            4. PAGE HEADER & COMPACT ACTION STRIP
           ================================================== */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-md border border-[#D9DEE7] shadow-2xs">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Department Dashboard
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

          {/* Compact Notification / Action Strip */}
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
              <span className="bg-white border border-amber-300 text-amber-900 px-3 py-1 rounded-md font-bold text-[11px] flex items-center gap-1.5 shadow-2xs">
                <AlertTriangle size={13} className="text-amber-600" /> 2 startup matches awaiting review
              </span>
              <span className="bg-white border border-amber-300 text-amber-900 px-3 py-1 rounded-md font-bold text-[11px] flex items-center gap-1.5 shadow-2xs">
                <AlertTriangle size={13} className="text-amber-600" /> 1 expert scorecard awaiting approval
              </span>
              <span className="bg-white border border-amber-300 text-amber-900 px-3 py-1 rounded-md font-bold text-[11px] flex items-center gap-1.5 shadow-2xs">
                <AlertTriangle size={13} className="text-amber-600" /> 1 pilot milestone awaiting verification
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================
            5. PROCUREMENT OVERVIEW (5 Compact Administrative Metrics)
           ================================================== */}
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
            
            {/* Metric 1 */}
            <div className="bg-white p-4 rounded-md border border-[#D9DEE7] shadow-2xs hover:border-slate-400 transition-colors flex items-center justify-between">
              <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">₹45.0L</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  Total Pilot Allocation
                </p>
              </div>
              <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
                <Building2 size={16} />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white p-4 rounded-md border border-[#D9DEE7] shadow-2xs hover:border-slate-400 transition-colors flex items-center justify-between">
              <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">₹33.75L</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  Funds Committed
                </p>
              </div>
              <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
                <Lock size={16} />
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white p-4 rounded-md border border-[#D9DEE7] shadow-2xs hover:border-slate-400 transition-colors flex items-center justify-between">
              <div>
                <p className="text-2xl font-black text-indigo-700 tracking-tight">4</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  Active Pilot Programs
                </p>
              </div>
              <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
                <Briefcase size={16} />
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white p-4 rounded-md border border-[#D9DEE7] shadow-2xs hover:border-slate-400 transition-colors flex items-center justify-between">
              <div>
                <p className="text-2xl font-black text-amber-700 tracking-tight">2</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  Challenges Awaiting Review
                </p>
              </div>
              <div className="w-8 h-8 rounded bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <Clock size={16} />
              </div>
            </div>

            {/* Metric 5 */}
            <div className="bg-white p-4 rounded-md border border-[#D9DEE7] shadow-2xs hover:border-slate-400 transition-colors flex items-center justify-between">
              <div>
                <p className="text-2xl font-black text-rose-700 tracking-tight">1</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  Milestone Verification Pending
                </p>
              </div>
              <div className="w-8 h-8 rounded bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
                <AlertTriangle size={16} />
              </div>
            </div>

          </div>
        </div>

        {/* ==================================================
            6. PROCUREMENT LIFECYCLE (Horizontal Case Workflow)
           ================================================== */}
        <div className="bg-white p-5 rounded-md border border-[#D9DEE7] shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
            <div>
              <h2 className="text-xs font-black text-indigo-900 uppercase tracking-widest">
                PROCUREMENT LIFECYCLE
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Track each challenge from problem definition to procurement.
              </p>
            </div>
            <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200 uppercase self-start sm:self-auto">
              Institutional Case Flow
            </span>
          </div>

          {/* Horizontal Stepper Flow */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 relative">
            
            {/* Stage 1 */}
            <div className="bg-emerald-50/60 border border-emerald-200 p-3 rounded-md space-y-1.5 relative group cursor-pointer hover:bg-emerald-50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-emerald-800">01</span>
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center">✓</span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-900 leading-tight">Challenge Definition</h4>
              <span className="inline-block text-[10px] font-black text-emerald-800 uppercase tracking-wider">COMPLETED</span>
            </div>

            {/* Stage 2 */}
            <div className="bg-emerald-50/60 border border-emerald-200 p-3 rounded-md space-y-1.5 relative group cursor-pointer hover:bg-emerald-50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-emerald-800">02</span>
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center">✓</span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-900 leading-tight">Startup Discovery</h4>
              <span className="inline-block text-[10px] font-black text-emerald-800 uppercase tracking-wider">COMPLETED</span>
            </div>

            {/* Stage 3 */}
            <div className="bg-amber-50/90 border border-amber-300 p-3 rounded-md space-y-1.5 relative group cursor-pointer hover:bg-amber-50 transition-colors ring-2 ring-amber-400/50">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-amber-800">03</span>
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[11px] flex items-center justify-center">⚠</span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-900 leading-tight">Expert Evaluation</h4>
              <span className="inline-block text-[10px] font-black text-amber-800 uppercase tracking-wider">ACTION REQUIRED</span>
            </div>

            {/* Stage 4 */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-md space-y-1.5 relative group cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-500">04</span>
                <span className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 font-bold text-[11px] flex items-center justify-center">○</span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-700 leading-tight">Digital Contract</h4>
              <span className="inline-block text-[10px] font-black text-slate-500 uppercase tracking-wider">PENDING</span>
            </div>

            {/* Stage 5 */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-md space-y-1.5 relative group cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-500">05</span>
                <span className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 font-bold text-[11px] flex items-center justify-center">○</span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-700 leading-tight">Pilot Sandbox</h4>
              <span className="inline-block text-[10px] font-black text-slate-500 uppercase tracking-wider">PENDING</span>
            </div>

            {/* Stage 6 */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-md space-y-1.5 relative group cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-500">06</span>
                <span className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 font-bold text-[11px] flex items-center justify-center">○</span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-700 leading-tight">Scale / Procurement</h4>
              <span className="inline-block text-[10px] font-black text-slate-500 uppercase tracking-wider">PENDING</span>
            </div>

          </div>
        </div>

        {/* ==================================================
            7. GOVERNMENT CHALLENGE REGISTER (Main Administrative Table)
           ================================================== */}
        <div className="bg-white rounded-md border border-[#D9DEE7] shadow-2xs overflow-hidden">
          
          {/* Table Header & Toolbar */}
          <div className="p-5 border-b border-[#D9DEE7] space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Government Challenge Register
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Active innovation challenges raised by government departments.
                </p>
              </div>
              <button 
                onClick={onPostChallenge}
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-4 py-2 rounded-md shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus size={14} /> Post Outcome Challenge
              </button>
            </div>

            {/* Toolbar Filters */}
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

                <button className="px-3 py-2 bg-slate-50 border border-[#D9DEE7] rounded-md text-xs font-semibold text-slate-700 flex items-center gap-1 hover:bg-slate-100">
                  Sector ▼
                </button>
                <button className="px-3 py-2 bg-slate-50 border border-[#D9DEE7] rounded-md text-xs font-semibold text-slate-700 flex items-center gap-1 hover:bg-slate-100">
                  Budget ▼
                </button>
                <button className="px-3 py-2 bg-slate-50 border border-[#D9DEE7] rounded-md text-xs font-semibold text-slate-700 flex items-center gap-1 hover:bg-slate-100">
                  Date ▼
                </button>
              </div>
            </div>
          </div>

          {/* Official Government Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
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
              <tbody className="divide-y divide-slate-200 text-xs font-medium">
                {sampleChallenges.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-indigo-50/40 transition-colors ${
                      selectedChallengeForDrawer === 1 && item.id === "CH-2026-013" ? "bg-amber-50/50" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">
                      {item.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[11px]">
                        {item.sector}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      {item.budget}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {item.timeline}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {item.stage}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.statusColor === 'emerald' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded font-bold text-[10px] uppercase">
                          <CheckCircle size={12} /> {item.status}
                        </span>
                      )}
                      {item.statusColor === 'amber' && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded font-bold text-[10px] uppercase">
                          <AlertTriangle size={12} /> {item.status}
                        </span>
                      )}
                      {item.statusColor === 'blue' && (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded font-bold text-[10px] uppercase">
                          <Clock size={12} /> {item.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {item.status === 'Review Required' ? (
                        <button 
                          onClick={() => setSelectedChallengeForDrawer(selectedChallengeForDrawer === 1 ? null : 1)}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1 rounded text-xs transition-colors cursor-pointer shadow-2xs"
                        >
                          Review Evaluation
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            if (problems && problems.length > 0) onViewProblem(problems[0]);
                            else setSelectedChallengeForDrawer(selectedChallengeForDrawer === 1 ? null : 1);
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold px-3 py-1 rounded text-xs transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==================================================
            8 & 9. AI-ASSISTED STARTUP EVALUATION PREVIEW (Institutional Scoring Section)
           ================================================== */}
        <div className="bg-white p-6 rounded-md border border-[#D9DEE7] shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  AI-Assisted Startup Evaluation
                </h3>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded uppercase">
                  Explainable Decision Support
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Evaluation breakdown for Challenge: <span className="font-extrabold text-slate-800">CH-2026-013 (AI-based Traffic Congestion Control)</span>
              </p>
            </div>
            
            {/* Summary badges */}
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded font-bold border border-slate-200">
                8 startups identified
              </span>
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded font-bold border border-slate-200">
                3 shortlisted
              </span>
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded font-extrabold border border-emerald-300">
                1 recommended
              </span>
            </div>
          </div>

          {/* Recommended Startup Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start bg-slate-50/80 p-5 rounded-md border border-slate-200">
            
            {/* Left side info & Score */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-widest block mb-1">
                  TOP RECOMMENDED STARTUP
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

              {/* Match Score Display */}
              <div className="bg-white p-4 rounded-md border border-[#D9DEE7] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    Overall Institutional Score
                  </span>
                  <p className="text-xs text-slate-500 font-medium">Weighted Algorithmic Match</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-indigo-900">91</span>
                  <span className="text-xs font-bold text-slate-400"> / 100</span>
                </div>
              </div>

              {/* Justification Box */}
              <div className="bg-indigo-50/80 border border-indigo-200 p-4 rounded-md space-y-1.5">
                <h5 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider">
                  Why this startup was recommended
                </h5>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  "Strong alignment with the challenge KPIs, relevant deployment experience, verified startup credentials, and a proposed solution within the approved pilot budget."
                </p>
              </div>
            </div>

            {/* Right side Quantitative Breakdown Grid */}
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

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-5 py-2 rounded-md shadow-xs transition-colors cursor-pointer">
                  Approve for Digital Contract
                </button>
                <button className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2 rounded-md border border-[#D9DEE7] transition-colors cursor-pointer">
                  Request Academic Re-evaluation
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ==================================================
            10. ACTIVE PILOT REGISTER (Data Table)
           ================================================== */}
        <div className="bg-white rounded-md border border-[#D9DEE7] shadow-2xs overflow-hidden">
          
          <div className="p-5 border-b border-[#D9DEE7] flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Active Pilot Register
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Live sandbox programs undergoing performance milestone verification.
              </p>
            </div>
            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded border border-slate-200">
              Total Active Pilots: 3
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
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
              <tbody className="divide-y divide-slate-200 text-xs font-medium">
                {samplePilots.map((pilot) => (
                  <tr key={pilot.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {pilot.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {pilot.challenge}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-semibold">
                      {pilot.startup}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold text-[10px] uppercase border border-slate-200">
                        {pilot.stage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 max-w-[120px]">
                        <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full transition-all" 
                            style={{ width: `${pilot.progress}%` }} 
                          />
                        </div>
                        <span className="font-extrabold text-slate-900 text-[11px]">{pilot.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      {pilot.escrowBalance}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600">
                      {pilot.nextMilestone}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {pilot.action === 'Verify' ? (
                        <button 
                          onClick={() => {
                            if (pilots && pilots.length > 0) onViewPilot(pilots[0]);
                          }}
                          className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-3 py-1 rounded text-xs transition-colors cursor-pointer shadow-2xs"
                        >
                          Verify Milestone
                        </button>
                      ) : pilot.action === 'View Outcome' ? (
                        <button 
                          onClick={() => {
                            if (pilots && pilots.length > 0) onViewPilot(pilots[0]);
                          }}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1 rounded text-xs transition-colors cursor-pointer shadow-2xs"
                        >
                          View Outcome
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            if (pilots && pilots.length > 0) onViewPilot(pilots[0]);
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold px-3 py-1 rounded text-xs transition-colors cursor-pointer"
                        >
                          Open Pilot
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==================================================
            11 & 12. AUDIT & TRANSPARENCY + RECENT ACTIVITY (Two Column Row)
           ================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Audit & Transparency Controls */}
          <div className="lg:col-span-7 bg-white p-6 rounded-md border border-[#D9DEE7] shadow-2xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Audit & Transparency
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Public procurement compliance and cryptographic ledger status.
                </p>
              </div>
              <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded uppercase">
                100% Audit Coverage
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Audit Trail</span>
                <span className="text-xs font-black text-emerald-700 uppercase flex items-center gap-1">
                  <CheckCircle size={12} /> ACTIVE
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Transaction Integrity</span>
                <span className="text-xs font-black text-indigo-700 uppercase flex items-center gap-1">
                  <ShieldCheck size={12} /> SHA-256 Chained
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Startup Verification</span>
                <span className="text-xs font-black text-emerald-700 uppercase flex items-center gap-1">
                  <CheckCircle size={12} /> DPIIT Verified
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Contract Records</span>
                <span className="text-xs font-black text-slate-900 uppercase flex items-center gap-1">
                  <FileSignature size={12} /> Digitally Signed
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Pilot Payments</span>
                <span className="text-xs font-black text-indigo-700 uppercase flex items-center gap-1">
                  <Lock size={12} /> Milestone Controlled
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">GFR Compliance</span>
                <span className="text-xs font-black text-emerald-700 uppercase flex items-center gap-1">
                  <CheckCircle size={12} /> GFR Checks Passed
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setActiveTab('audit')}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-md shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                View Complete Audit Trail →
              </button>
            </div>
          </div>

          {/* Recent Administrative Activity */}
          <div className="lg:col-span-5 bg-white p-6 rounded-md border border-[#D9DEE7] shadow-2xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Recent Activity
              </h3>
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Officer Event Log
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="font-mono font-bold text-slate-500 text-[11px] w-12 flex-shrink-0">
                  09:42
                </span>
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900">DPIIT verification completed</p>
                  <p className="text-[10px] text-slate-500 font-mono">CH-2026-013 • HealthSetu Technologies</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="font-mono font-bold text-slate-500 text-[11px] w-12 flex-shrink-0">
                  09:18
                </span>
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900">Expert scorecard submitted</p>
                  <p className="text-[10px] text-slate-500 font-mono">CH-2026-012 • Prof. Kulkarni (COEP)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="font-mono font-bold text-slate-500 text-[11px] w-12 flex-shrink-0">
                  Yesterday
                </span>
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900">Digital contract signed</p>
                  <p className="text-[10px] text-slate-500 font-mono">PILOT-026 • e-Stamp Paper #MH893012</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="font-mono font-bold text-slate-500 text-[11px] w-12 flex-shrink-0">
                  Yesterday
                </span>
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900">Pilot milestone verified</p>
                  <p className="text-[10px] text-slate-500 font-mono">PILOT-024 • KrishiDrone Milestone 2</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* ==================================================
          13. FOOTER (Official Dark Navy Footer)
         ================================================== */}
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
                <li><a href="#" className="hover:text-white transition-colors">Challenges Register</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Startup Discovery API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pilot Sandboxes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GeM Marketplace Integration</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reports & Audit Ledger</a></li>
              </ul>
            </div>

            {/* Institutional Support */}
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

            {/* Department Officer Info */}
            <div className="space-y-2 bg-slate-900/80 p-4 rounded-md border border-slate-800">
              <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">
                Active Department Node
              </h4>
              <p className="text-xs font-bold text-slate-300">
                Urban Development Department
              </p>
              <p className="text-[11px] text-slate-400">
                Jaipur Nodal Desk • FY 2026-27
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
