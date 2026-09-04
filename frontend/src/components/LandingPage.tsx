import { useState } from 'react';
import { 
  Building2, 
  Rocket, 
  GraduationCap, 
  ShieldCheck, 
  Shield, 
  Lock, 
  Wallet, 
  CheckCircle, 
  ArrowRight, 
  ChevronDown, 
  Sparkles, 
  Target, 
  FileText, 
  Coins, 
  ShoppingCart, 
  Plug, 
  FileSignature, 
  BrainCircuit, 
  Users, 
  LayoutGrid
} from 'lucide-react';

interface LandingPageProps {
  onGuestLogin: (role: string) => void;
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export default function LandingPage({
  onGuestLogin,
  onNavigateToLogin,
  onNavigateToRegister,
}: LandingPageProps) {
  const [openDropdown, setOpenDropdown] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen font-sans text-slate-800 flex flex-col">
      {/* 1. HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Platform Label */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 p-2 text-white shadow-md shadow-indigo-600/20 flex items-center justify-center transition-transform group-hover:scale-105">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Yukti<span className="text-indigo-600">Setu</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-600 font-extrabold tracking-wider uppercase">
                STATE INNOVATION & PROCUREMENT PLATFORM (OPTION 5 HYBRID)
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <div className="relative">
              <button 
                onClick={() => setOpenDropdown(!openDropdown)}
                className="flex items-center gap-1 hover:text-indigo-600 transition-colors py-2 cursor-pointer"
              >
                Platform <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown && (
                <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 mt-1 z-50 animate-in fade-in slide-in-from-top-2">
                  <a 
                    href="#pathway" 
                    onClick={() => { setOpenDropdown(false); scrollToSection('pathway'); }}
                    className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    6-Step Exemption Pathway
                  </a>
                  <a 
                    href="#security" 
                    onClick={() => { setOpenDropdown(false); scrollToSection('security'); }}
                    className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Audit & Security Safeguards
                  </a>
                  <a 
                    href="#metrics" 
                    onClick={() => { setOpenDropdown(false); scrollToSection('metrics'); }}
                    className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Live Sandbox Metrics
                  </a>
                </div>
              )}
            </div>
            <button onClick={() => scrollToSection('pathway')} className="hover:text-indigo-600 transition-colors cursor-pointer">
              How It Works
            </button>
            <button onClick={() => scrollToSection('security')} className="hover:text-indigo-600 transition-colors cursor-pointer">
              Security
            </button>
            <button onClick={() => scrollToSection('metrics')} className="hover:text-indigo-600 transition-colors cursor-pointer">
              Resources
            </button>
            <button onClick={() => scrollToSection('footer')} className="hover:text-indigo-600 transition-colors cursor-pointer">
              About Us
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onNavigateToLogin}
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button 
              onClick={onNavigateToRegister}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all cursor-pointer hover:shadow-indigo-600/30"
            >
              Register Account <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-slate-50 to-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/60">
        {/* Background Dot Pattern Decor */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Badge Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-extrabold tracking-wide uppercase shadow-2xs">
                <Sparkles size={14} className="text-indigo-600 animate-spin-slow" />
                <span>STATE PUBLIC PROCUREMENT & INNOVATION EXEMPTION FRAMEWORK</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Direct Sandbox Procurement for{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                  High-Impact Innovators
                </span>
              </h1>

              {/* Subtitle / Description */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                YuktiSetu empowers municipal and state government departments to define outcome goals, run explainable AI startup matching, execute digital stamp contracts, lock escrow pilot budgets, and catalog certified outcomes to the GeM Portal.
              </p>

              {/* Primary / Secondary CTA buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button 
                  onClick={() => onGuestLogin('dept')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2.5 transition-all cursor-pointer hover:-translate-y-0.5"
                >
                  Explore Demo Workspace <ArrowRight size={18} />
                </button>
                <button 
                  onClick={onNavigateToRegister}
                  className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-base px-7 py-3.5 rounded-xl border border-slate-300 shadow-xs transition-all cursor-pointer hover:-translate-y-0.5 hover:border-slate-400"
                >
                  Register Account
                </button>
              </div>

              {/* 1-Click Persona Demos */}
              <div className="pt-6 border-t border-slate-200/80 space-y-3">
                <p className="text-[11px] font-extrabold text-slate-600 tracking-widest uppercase">
                  1-CLICK LIVE PERSONA DEMOS
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button 
                    onClick={() => onGuestLogin('dept')}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 text-xs font-bold transition-all shadow-2xs group cursor-pointer"
                  >
                    <span className="text-base group-hover:scale-110 transition-transform">🏛️</span>
                    <span className="truncate">Municipal Dept</span>
                  </button>
                  <button 
                    onClick={() => onGuestLogin('startup')}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 text-xs font-bold transition-all shadow-2xs group cursor-pointer"
                  >
                    <span className="text-base group-hover:scale-110 transition-transform">🚀</span>
                    <span className="truncate">EcoTech Startup</span>
                  </button>
                  <button 
                    onClick={() => onGuestLogin('expert')}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 text-xs font-bold transition-all shadow-2xs group cursor-pointer"
                  >
                    <span className="text-base group-hover:scale-110 transition-transform">🎓</span>
                    <span className="truncate">Academic Expert</span>
                  </button>
                  <button 
                    onClick={() => onGuestLogin('admin')}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 text-xs font-bold transition-all shadow-2xs group cursor-pointer"
                  >
                    <span className="text-base group-hover:scale-110 transition-transform">🛡️</span>
                    <span className="truncate">Super Admin</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Hero Right Visual Mockup (Interactive Sandbox Portal Preview Card) */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl bg-white p-2 shadow-2xl border border-slate-200/90 overflow-hidden group">
                
                {/* Mockup Frame Header & Outer Shell */}
                <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-2.5 rounded-t-xl text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-bold text-slate-200 text-xs truncate">
                      YuktiSetu Option 5 Hybrid Sandbox Portal
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </div>
                </div>

                {/* Dashboard Inner Screen Layout (Sidebar + Main Panel) */}
                <div className="flex bg-slate-100 rounded-b-xl overflow-hidden min-h-[380px]">
                  
                  {/* Left Dark Sidebar */}
                  <div className="w-14 bg-slate-900 text-slate-400 flex flex-col items-center py-4 gap-5 border-r border-slate-800">
                    <button className="p-2 bg-indigo-600 text-white rounded-lg cursor-pointer">
                      <LayoutGrid size={18} />
                    </button>
                    <button className="p-2 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
                      <Target size={18} />
                    </button>
                    <button className="p-2 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
                      <FileText size={18} />
                    </button>
                    <button className="p-2 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
                      <Coins size={18} />
                    </button>
                    <button className="p-2 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
                      <ShoppingCart size={18} />
                    </button>
                    <button className="p-2 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer mt-auto">
                      <ShieldCheck size={18} />
                    </button>
                  </div>

                  {/* Main Interior Content Area */}
                  <div className="flex-1 p-4 space-y-3.5 bg-slate-50/80">
                    
                    {/* Top Row Stat Widgets */}
                    <div className="grid grid-cols-2 gap-3">
                      
                      {/* Active Pilots Card */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                          Active Pilots
                        </span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-black text-slate-900">4</span>
                          <span className="text-[11px] font-semibold text-slate-500">Running Programs</span>
                        </div>
                        {/* Mini Sparkline Chart */}
                        <div className="pt-1">
                          <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 25">
                            <defs>
                              <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            <path 
                              d="M0 20 Q 25 18, 40 10 T 75 14 T 100 4 L 100 25 L 0 25 Z" 
                              fill="url(#purpleGrad)" 
                            />
                            <path 
                              d="M0 20 Q 25 18, 40 10 T 75 14 T 100 4" 
                              fill="none" 
                              stroke="#6366f1" 
                              strokeWidth="2.5" 
                              strokeLinecap="round" 
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Escrow Locked Card */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                          Escrow Locked
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-black text-slate-900">₹45.2L</span>
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <Lock size={14} />
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500 block">
                          Total Budget Vetted
                        </span>
                      </div>

                    </div>

                    {/* Middle Row Widgets */}
                    <div className="grid grid-cols-2 gap-3">
                      
                      {/* Compliance Card */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                            Compliance
                          </span>
                          <span className="text-xl font-black text-emerald-600">100%</span>
                          <span className="text-[10px] font-semibold text-slate-500 block">GFR Audit Compliant</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                          <CheckCircle size={18} />
                        </div>
                      </div>

                      {/* DPIIT Lookup Card */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                            DPIIT Lookup
                          </span>
                          <span className="text-xl font-black text-indigo-600">Live</span>
                          <span className="text-[10px] font-semibold text-slate-500 block">Startup Registry API</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center relative">
                          <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        </div>
                      </div>

                    </div>

                    {/* Recent Activity Panel */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Recent Activity
                      </span>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <div className="flex items-center gap-2.5 truncate">
                            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                              <Building2 size={14} />
                            </div>
                            <div className="truncate">
                              <p className="font-bold text-slate-800 truncate">Smart Waste Management Pilot</p>
                              <p className="text-[10px] text-slate-500">Escrow milestone 1 released</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-emerald-600 font-bold flex-shrink-0 ml-2">2h ago</span>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <div className="flex items-center gap-2.5 truncate">
                            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                              <GraduationCap size={14} />
                            </div>
                            <div className="truncate">
                              <p className="font-bold text-slate-800 truncate">Water Quality Monitoring Solution</p>
                              <p className="text-[10px] text-slate-500">Academic scorecard submitted</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-emerald-600 font-bold flex-shrink-0 ml-2">5h ago</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. METRICS / STATS BAR (4 Grid Cards) */}
      <section id="metrics" className="py-12 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Metric Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 border border-indigo-100">
                <Wallet size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900">₹45 Lakhs+</h3>
                <p className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                  ESCROW BUDGET VETTED
                </p>
                <p className="text-xs text-slate-500">Secured for innovation pilots</p>
              </div>
            </div>

            {/* Metric Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                <Rocket size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900">4 Active</h3>
                <p className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
                  SANDBOX PILOTS RUNNING
                </p>
                <p className="text-xs text-slate-500">Across multiple departments</p>
              </div>
            </div>

            {/* Metric Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0 border border-sky-100">
                <Plug size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900">DPIIT Live Lookup</h3>
                <p className="text-xs font-extrabold text-sky-600 uppercase tracking-wider">
                  STARTUP REGISTRY API
                </p>
                <p className="text-xs text-slate-500">Real-time verification</p>
              </div>
            </div>

            {/* Metric Card 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 border border-teal-100">
                <ShieldCheck size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900">100% GFR</h3>
                <p className="text-xs font-extrabold text-teal-600 uppercase tracking-wider">
                  AUDIT COMPLIANCE
                </p>
                <p className="text-xs text-slate-500">Built for government standards</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. WORKFLOW SECTION: "6-STEP INSTITUTIONAL EXEMPTION PATHWAY" */}
      <section id="pathway" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-black text-indigo-600 tracking-widest uppercase">
              6-STEP INSTITUTIONAL EXEMPTION PATHWAY
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              From Challenge to GeM Marketplace
            </h2>
            <p className="text-base text-slate-600">
              End-to-end workflow from challenge definition to scale-up procurement
            </p>
          </div>

          {/* 6 Step Cards Grid with Connecting Flow */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative">
            
            {/* Step 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-indigo-600/30">
                    1
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Target size={20} />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block mb-1">
                    CHALLENGE POSTING
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Outcome Goal Definition
                  </h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Nodal officers define measurable success criteria and KPI targets rather than rigid hardware specs.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-indigo-600/30">
                    2
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <BrainCircuit size={20} />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider block mb-1">
                    AI MATCHMAKING
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Dual-Engine Discovery
                  </h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Syntactic Jaccard tag match + Gemini 1.5 Flash AI semantic score with DPIIT verification bonus.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-indigo-600/30">
                    3
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block mb-1">
                    EXPERT VETTING
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Academic Scorecards
                  </h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  University professors (COEP/VJTI) execute quantitative technical feasibility scorecards.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-indigo-600/30">
                    4
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <FileSignature size={20} />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block mb-1">
                    LEGAL SIGNING
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    E-Signature Stamp Agreements
                  </h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Dual e-signature stamp paper agreements with mutual NDA and IP protection clauses.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-indigo-600/30">
                    5
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Coins size={20} />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider block mb-1">
                    ACTIVE SANDBOX
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Milestone Escrow Payouts
                  </h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Real-time KPI performance measurement with milestone-linked escrow tranches (25%, 35%, 40%).
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-indigo-600/30">
                    6
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <ShoppingCart size={20} />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-teal-600 uppercase tracking-wider block mb-1">
                    GEM CATALOGING
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    State-Wide Procurement
                  </h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Certified sandbox outcomes published directly to the GeM Portal Marketplace for state scale-up.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. PLATFORM SECURITY & AUDIT SAFEGUARDS SECTION */}
      <section id="security" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-2">
            <span className="text-xs font-black text-indigo-600 tracking-widest uppercase">
              PLATFORM SECURITY & AUDIT SAFEGUARDS
            </span>
          </div>

          {/* 2 Large Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Feature Card 1 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 border border-indigo-200/80">
                <ShieldCheck size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900">
                  SHA-256 Chained Transaction Audit Ledger
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every transaction state transition is cryptographically signed with a SHA-256 hash chained to the prior block, ensuring 100% auditability for state auditors.
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-200/80">
                <Lock size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Client-Side IP Encryption Vault
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Startups submit technical schematics with local AES-256 client encryption, storing hash keys to protect proprietary startup intellectual property.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. FOOTER SECTION */}
      <footer id="footer" className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white pt-16 pb-8 overflow-hidden">
        
        {/* Background Government Building Silhouette Watermark */}
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-10 translate-x-12 translate-y-6">
          <svg width="480" height="240" viewBox="0 0 500 250" fill="none" stroke="currentColor" strokeWidth="1.5">
            {/* Vidhan Bhavan / Secretariat dome vector geometry */}
            <path d="M50 240 L450 240 M80 240 L80 140 L420 140 L420 240 M120 140 L120 240 M160 140 L160 240 M200 140 L200 240 M300 140 L300 240 M340 140 L340 240 M380 140 L380 240 M200 140 C200 70 300 70 300 140 M250 70 L250 30 M245 30 L255 30 L250 20 Z" />
            <circle cx="250" cy="100" r="15" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          
          {/* Top Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand Logo & Subtitle */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 p-2 text-white flex items-center justify-center shadow-md">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <span className="text-2xl font-black tracking-tight text-white">
                  Yukti<span className="text-indigo-400">Setu</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                State Innovation & Procurement Exemption Framework
              </p>
            </div>

            {/* Feature Column 1 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-900/80 border border-indigo-700/60 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles size={16} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-100">Built for Impact</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Empowering innovators to solve real-world government challenges.
                </p>
              </div>
            </div>

            {/* Feature Column 2 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-900/80 border border-indigo-700/60 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ScaleIcon size={16} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-100">Transparent & Explainable</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  AI-driven decisions with human oversight and clear audit trails.
                </p>
              </div>
            </div>

            {/* Feature Column 3 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-900/80 border border-indigo-700/60 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield size={16} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-100">Secure by Design</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enterprise-grade security with privacy-first architecture.
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Links & Copyright Bar */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2025 YuktiSetu. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

function ScaleIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h18" />
    </svg>
  );
}
