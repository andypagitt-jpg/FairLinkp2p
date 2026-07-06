import React, { useState } from 'react';
import { 
  ArrowRight, 
  Globe, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Fingerprint, 
  Lock, 
  Shield, 
  Coins, 
  User, 
  Check, 
  Sparkles,
  Info,
  Smartphone,
  CheckCircle,
  X,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AuthModal from './AuthModal';

interface LandingViewProps {
  setCurrentTab: (tab: string) => void;
  featuredRequest: {
    amount: number;
    days: number;
    score: number;
    repaidCount: number;
    reason: string;
    tip: number;
  };
  currentUser: {
    name: string;
    email: string;
    avatar: string;
    isVerified: boolean;
    fairScoreBoost: number;
    phoneVerified: boolean;
    identityVerified: boolean;
    socialsConnected: { twitter?: string; github?: string };
  } | null;
  onLogin: (user: any) => void;
}

export default function LandingView({ 
  setCurrentTab, 
  featuredRequest,
  currentUser,
  onLogin
}: LandingViewProps) {
  // Local state for authentication modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 font-sans">
      
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Signal pitch & Auth Trigger */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-x-2 bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-indigo-100">
            <Shield className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Secure Peer Ledger Protocol v3.8</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight font-black text-gray-950">
            Financial freedom.<br />
            Built on <span className="text-indigo-600">absolute trust.</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed font-sans">
            FairLink replaces predatory credit scores and invasive bank aggregators with secure, self-custodial cryptographic escrows. Borrowers set terms, lenders earn gratitude tips, and the community audits the ledger.
          </p>

          {/* Conditional Onboarding & Action Dashboard */}
          {!currentUser ? (
            <div className="bg-gray-50 border border-gray-200/80 rounded-3xl p-6 max-w-xl space-y-4">
              <div className="flex items-start gap-x-3.5">
                <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">Establish Your Peer Identity</span>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Log in securely using Google, your email, or SMS to generate your cryptographic private-public keypair. This unlocks full dashboard customization, on-chain scoring, and manual asset linking.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  id="google-login-btn"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all font-semibold rounded-2xl text-xs text-gray-700 flex items-center justify-center gap-x-2.5 shadow-sm cursor-pointer"
                >
                  {/* Google Logo SVG */}
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.258-3.133C18.423 1.908 15.618.5 12.24.5c-6.353 0-11.5 5.147-11.5 11.5s5.147 11.5 11.5 11.5c6.63 0 11.033-4.664 11.033-11.233 0-.756-.081-1.332-.18-1.916l-10.853-.066z"/>
                  </svg>
                  <span>Access Secure Gateway</span>
                </button>

                <button
                  onClick={() => setCurrentTab('marketplace')}
                  className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold rounded-2xl text-xs flex items-center justify-center gap-x-1.5 shadow-sm shadow-indigo-600/15 cursor-pointer"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-900 text-white border border-indigo-950 rounded-3xl p-6 sm:p-8 max-w-xl space-y-5 shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10">
                <Sparkles className="w-40 h-40" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-extrabold text-indigo-300 tracking-widest block">Active Session</span>
                <h4 className="font-display font-black text-2xl text-white mt-1">Welcome, {currentUser.name}!</h4>
                <p className="text-xs text-indigo-100 mt-1.5 max-w-md leading-relaxed">
                  Your cryptographic peer identity is securely active. You have full access to explore listed marketplace contracts, request cooperative capital, and audit the global peer ledger.
                </p>
              </div>

              <div className="flex gap-3 pt-1.5">
                <button
                  onClick={() => setCurrentTab('marketplace')}
                  className="px-5 py-2.5 bg-white text-indigo-950 font-bold rounded-xl text-xs hover:bg-indigo-50 transition-all cursor-pointer shadow-sm"
                >
                  Go to Marketplace
                </button>
                <button
                  onClick={() => setCurrentTab('borrow')}
                  className="px-5 py-2.5 border border-indigo-400 text-indigo-100 font-bold rounded-xl text-xs hover:bg-indigo-950/80 transition-all cursor-pointer"
                >
                  Post Loan Request
                </button>
              </div>
            </div>
          )}

          {/* Key Stats */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight font-display">2.4m+</div>
              <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Loans funded</div>
            </div>
            <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight font-display">94s</div>
              <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Avg. funding time</div>
            </div>
            <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight font-display">98%</div>
              <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">On-time repayment</div>
            </div>
          </div>
        </div>

        {/* Right Column: Featured Contract Spotlight */}
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2.5rem] opacity-5 blur-xl"></div>

          <div className="relative bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-sm">
            <div className="flex justify-between items-start mb-5 pb-5 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">Featured Peer Request</span>
                <div className="text-3xl font-black text-gray-950 mt-1 font-display">
                  ${featuredRequest.amount} <span className="text-gray-300 font-light mx-1">•</span> {featuredRequest.days} days
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>FairScore {featuredRequest.score}</span>
                </span>
                <div className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase tracking-wide">
                  {featuredRequest.repaidCount} repayments
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 my-5 relative">
              <span className="absolute -top-2.5 left-4 bg-white border px-2 py-0.5 rounded-md text-[9px] font-bold text-gray-400 uppercase">
                Verified Purpose
              </span>
              <p className="text-gray-700 italic text-sm leading-relaxed mt-1">
                "{featuredRequest.reason}"
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Cooperative Tip Offered</span>
                <div className="text-2xl sm:text-3xl font-black text-indigo-600 flex items-center gap-x-1 mt-0.5">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <span>{featuredRequest.tip}%</span>
                </div>
              </div>
              
              <button
                onClick={() => setCurrentTab('marketplace')}
                className="px-6 py-3 bg-gray-950 hover:bg-black text-white text-xs font-bold rounded-2xl flex items-center gap-x-2 transition-all cursor-pointer shadow-sm hover:-translate-y-0.5"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Fund Request</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Signal Philosophy Grid */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="bg-white border border-gray-150 p-6 rounded-3xl hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base font-bold text-gray-950 mb-2">Self-Custodial Escrow</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Funds are locked in decentralised cooperative escrows. They are only released automatically on maturity or community dispute jury agreement. No intermediaries handle your cash.
          </p>
        </div>

        <div className="bg-white border border-gray-150 p-6 rounded-3xl hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base font-bold text-gray-950 mb-2">Audit-Based Reliability</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Instead of commercial banking scores, we compute FairScore dynamically based on physical biometric ID scans, cryptographic social connectors, and ledger history.
          </p>
        </div>

        <div className="bg-white border border-gray-150 p-6 rounded-3xl hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
            <Coins className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base font-bold text-gray-950 mb-2">Voluntary Interest Tips</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Interest rates are entirely peer-driven and optional. Borrowers set a voluntary tip that represents their gratitude, avoiding toxic compounding interest traps.
          </p>
        </div>

      </div>

      {/* UNIFIED MULTI-METHOD SECURE AUTH MODAL */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={onLogin}
      />

    </div>
  );
}
