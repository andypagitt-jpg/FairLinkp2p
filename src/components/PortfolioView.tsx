import React, { useState } from 'react';
import { MyFundedLoan, LoanRequest } from '../types';
import { 
  Coins, 
  Handshake, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Lock, 
  HelpCircle,
  Calendar,
  Layers,
  ArrowRight,
  CreditCard,
  Wallet,
  X,
  RefreshCw,
  Fingerprint
} from 'lucide-react';
import { motion } from 'motion/react';

interface PortfolioViewProps {
  myFundedLoans: MyFundedLoan[];
  myBorrowRequests: LoanRequest[];
  onSimulateRepayment: (loanId: string) => void;
  onSimulateReceiveFunding: (requestId: string) => void;
  theme?: 'white' | 'babyblue' | 'dark';
  setCurrentTab?: (tab: string) => void;
}

export default function PortfolioView({
  myFundedLoans,
  myBorrowRequests,
  onSimulateRepayment,
  onSimulateReceiveFunding,
  theme = 'babyblue',
  setCurrentTab,
}: PortfolioViewProps) {
  // Separate active and repaid funded loans
  const activeFunded = myFundedLoans.filter((l) => l.status === 'active');
  const repaidFunded = myFundedLoans.filter((l) => l.status === 'repaid');

  // Theme configuration styles mapping
  const s = {
    white: {
      card: 'bg-white border border-gray-150 shadow-sm text-gray-900',
      cardInner: 'bg-gray-50/70 border-gray-100',
      textMuted: 'text-gray-500',
      textMain: 'text-gray-900',
      textHeading: 'text-gray-900',
      subText: 'text-gray-400',
      border: 'border-gray-100',
      divider: 'border-gray-200/60',
      bentoBg: 'bg-white border border-gray-150/80',
    },
    babyblue: {
      card: 'bg-white/95 border border-blue-100/70 shadow-sm shadow-blue-100/10 text-slate-900',
      cardInner: 'bg-blue-50/30 border-blue-100/35',
      textMuted: 'text-slate-500',
      textMain: 'text-slate-900',
      textHeading: 'text-slate-950',
      subText: 'text-slate-400',
      border: 'border-blue-100/40',
      divider: 'border-blue-200/30',
      bentoBg: 'bg-white/90 border border-blue-100/70',
    },
    dark: {
      card: 'bg-slate-900/80 border border-slate-800 shadow-xl text-gray-100',
      cardInner: 'bg-slate-950/40 border-slate-800/40',
      textMuted: 'text-gray-400',
      textMain: 'text-gray-100',
      textHeading: 'text-white',
      subText: 'text-gray-500',
      border: 'border-slate-800',
      divider: 'border-slate-800/75',
      bentoBg: 'bg-slate-900/40 border border-slate-800/80',
    }
  }[theme];

  // Interactive Repayment States
  const [activeRepayLoanId, setActiveRepayLoanId] = useState<string | null>(null);
  const [repayChannel, setRepayChannel] = useState<'debit_card' | 'chirp' | 'crypto'>('debit_card');
  const [isRepaySimulating, setIsRepaySimulating] = useState(false);
  const [repaySuccessMsg, setRepaySuccessMsg] = useState<string | null>(null);

  // Calculations for statistics
  const totalLentAmount = myFundedLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const activeLentAmount = activeFunded.reduce((sum, loan) => sum + loan.amount, 0);
  const expectedReturnAmount = activeFunded.reduce((sum, loan) => sum + loan.expectedRepay, 0);
  
  // Tips Accrued (Earned + Pending)
  const completedTips = repaidFunded.reduce((sum, loan) => sum + (loan.expectedRepay - loan.amount), 0);
  const pendingTips = activeFunded.reduce((sum, loan) => sum + (loan.expectedRepay - loan.amount), 0);
  const totalAccruedTips = completedTips + pendingTips;

  // Active Escrow Volume
  const activeBorrowFunded = myBorrowRequests.filter(r => r.funded && r.status !== 'repaid');
  const activeEscrowVolume = activeLentAmount + activeBorrowFunded.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
      
      {/* Redesigned Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-x-2 px-3 py-1 bg-primary-orange/10 rounded-full text-xs font-bold text-primary-orange uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Cooperative Capital Ledger</span>
          </div>
          <h2 className={`font-display text-4xl font-extrabold tracking-tight ${s.textHeading}`}>
            My Portfolio Ledger
          </h2>
          <p className={`${s.textMuted} mt-1 text-sm`}>
            Track active dual-channel escrows, monitor loan maturity timelines, and audit your cooperative yields.
          </p>
        </div>

        {/* Live Status Indicator */}
        <div className={`shrink-0 flex items-center gap-x-3 px-4 py-2.5 rounded-2xl ${s.card}`}>
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
          <div className="text-xs font-mono">
            <span className={`${s.subText}`}>LEDGER_SYNC: </span>
            <span className="text-emerald-500 font-bold">STABLE_V2_ACTIVE</span>
          </div>
        </div>
      </div>

      {/* High-Fidelity Bento Grid Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Card 1: Active Deployments */}
        <div className={`rounded-3xl p-5 shadow-sm relative overflow-hidden ${s.bentoBg}`}>
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary-orange/5 rounded-full blur-xl"></div>
          <div className="flex items-center gap-x-2 text-xs font-bold text-primary-orange uppercase tracking-wider mb-2.5">
            <Coins className="w-4 h-4 text-primary-orange" />
            <span>Active Deployments</span>
          </div>
          <div className="text-3xl font-black font-display tracking-tight">${activeLentAmount}</div>
          <div className="text-[11px] mt-1.5 flex justify-between items-center">
            <span className={s.textMuted}>Total Lent: ${totalLentAmount}</span>
            <span className="text-emerald-500 font-bold">{completedCount(myFundedLoans)} repaid</span>
          </div>
        </div>

        {/* Card 2: Gratitude Tips */}
        <div className={`rounded-3xl p-5 shadow-sm relative overflow-hidden ${s.bentoBg}`}>
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl"></div>
          <div className="flex items-center gap-x-2 text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2.5">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Gratitude Yield</span>
          </div>
          <div className="text-3xl font-black font-display tracking-tight text-emerald-500">${totalAccruedTips}</div>
          <div className="text-[11px] mt-1.5 flex justify-between items-center">
            <span className={s.textMuted}>Pending: +${pendingTips}</span>
            <span className="bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded text-[10px] font-bold">
              {myFundedLoans.length > 0 ? `${Math.round((totalAccruedTips / (totalLentAmount || 1)) * 100)}% Avg` : '0% Avg'}
            </span>
          </div>
        </div>

        {/* Card 3: Secure Escrows */}
        <div className={`rounded-3xl p-5 shadow-sm relative overflow-hidden ${s.bentoBg}`}>
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl"></div>
          <div className="flex items-center gap-x-2 text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2.5">
            <Lock className="w-4 h-4 text-indigo-500" />
            <span>Escrow Protected</span>
          </div>
          <div className="text-3xl font-black font-display tracking-tight text-indigo-500">${activeEscrowVolume}</div>
          <div className="text-[11px] mt-1.5 flex justify-between items-center">
            <span className={s.textMuted}>In cryptographic safety locks</span>
            <span className="text-xs font-mono font-bold text-indigo-400">DUAL_KEY</span>
          </div>
        </div>

        {/* Card 4: Trust Score & Streak */}
        <div className={`rounded-3xl p-5 shadow-sm relative overflow-hidden ${s.bentoBg}`}>
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl"></div>
          <div className="flex items-center gap-x-2 text-xs font-bold text-amber-500 uppercase tracking-wider mb-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Cooperative Trust</span>
          </div>
          <div className="text-3xl font-black font-display tracking-tight text-amber-500">Grade A+</div>
          <div className="text-[11px] mt-1.5 flex justify-between items-center">
            <span className={s.textMuted}>Reliable repayment history</span>
            <span className="text-amber-500 font-extrabold text-xs">100% Rate</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Active Funding (Assets Ledger) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-primary-orange/15">
            <div className="flex items-center gap-x-2.5">
              <div className="w-8 h-8 bg-primary-orange/10 rounded-xl flex items-center justify-center">
                <Coins className="w-4 h-4 text-primary-orange" />
              </div>
              <h3 className={`font-display text-xl font-bold ${s.textHeading}`}>
                Asset Ledger (Lent Capital)
              </h3>
            </div>
            <span className="text-xs bg-primary-orange/10 text-primary-orange px-2.5 py-1 rounded-full font-bold">
              {activeFunded.length} Active Contracts
            </span>
          </div>

          {/* Active Funding Cards */}
          <div className="space-y-4">
            {activeFunded.length === 0 ? (
              <div className={`rounded-3xl p-8 text-center ${s.card}`}>
                <Clock className="w-12 h-12 text-gray-400/40 mx-auto mb-3" />
                <p className="font-bold text-md mb-1">No active loans funded yet.</p>
                <p className={`text-xs ${s.textMuted} max-w-sm mx-auto mb-5`}>
                  Browse community loan requests on the P2P Marketplace and start earning volunteer gratitude tips.
                </p>
                <button
                  onClick={() => {
                    if (setCurrentTab) {
                      setCurrentTab('marketplace');
                    } else {
                      const el = document.getElementById('nav-tab-marketplace');
                      if (el) el.click();
                    }
                  }}
                  className="px-5 py-2.5 bg-primary-orange hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all hover:scale-[1.02]"
                >
                  Go to Marketplace
                </button>
              </div>
            ) : (
              activeFunded.map((loan) => (
                <div
                  key={loan.id}
                  className={`rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all duration-300 ${s.card}`}
                >
                  {/* Decorative Lock Icon Indicator in Background */}
                  <div className="absolute top-4 right-4 text-emerald-500/10 pointer-events-none">
                    <Lock className="w-24 h-24 stroke-[1]" />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-x-2.5">
                        <span className="font-black text-2xl tracking-tight">${loan.amount}</span>
                        <span className={`text-xs ${s.textMuted}`}>funded to</span>
                        <span className="text-xs font-bold bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full">
                          {loan.borrower}
                        </span>
                      </div>
                      
                      <p className={`text-xs italic ${s.textMuted}`}>"{loan.reason}"</p>
                      
                      <div className="flex items-center gap-x-2.5">
                        <span className={`text-[10px] font-mono ${s.subText} uppercase tracking-wider`}>
                          Contract: 0x{loan.id.padEnd(8, '4')}...
                        </span>
                        <span className="text-emerald-500 flex items-center gap-x-1 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Escrow Held</span>
                        </span>
                      </div>
                    </div>

                    {/* Return Calculations */}
                    <div className="sm:text-right space-y-1 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 self-start">
                      <div className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Expected Return</div>
                      <div className="text-xl font-extrabold text-emerald-500 font-display">
                        +${loan.expectedRepay}
                      </div>
                      <div className={`text-[10px] ${s.textMuted}`}>
                        Includes +${loan.expectedRepay - loan.amount} ({loan.tipPercent}%) Tip
                      </div>
                    </div>
                  </div>

                  {/* 3-Stage Contract Maturity Progress Bar */}
                  <div className={`mt-5 pt-4 border-t ${s.divider}`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Maturity Progress timeline</div>
                    <div className="grid grid-cols-3 gap-2 relative">
                      {/* Progress Line */}
                      <div className="absolute top-2 left-4 right-4 h-0.5 bg-gray-200/60 -z-0"></div>
                      <div className="absolute top-2 left-4 w-1/2 h-0.5 bg-emerald-500 -z-0"></div>

                      {/* Stage 1 */}
                      <div className="flex flex-col items-center text-center relative z-10">
                        <div className="w-5.5 h-5.5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                          ✓
                        </div>
                        <span className="text-[10px] font-bold text-emerald-500 mt-1">Escrow Locked</span>
                      </div>

                      {/* Stage 2 */}
                      <div className="flex flex-col items-center text-center relative z-10">
                        <div className="w-5.5 h-5.5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm animate-pulse">
                          ●
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 mt-1">{loan.dueDays} Days Term</span>
                      </div>

                      {/* Stage 3 */}
                      <div className="flex flex-col items-center text-center relative z-10">
                        <div className="w-5.5 h-5.5 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-400 shadow-inner">
                          3
                        </div>
                        <span className={`text-[10px] font-medium ${s.textMuted} mt-1`}>Settled Yield</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress completion info when active */}
                  <div className="mt-4 pt-3 flex items-center justify-between text-[10px] text-gray-400 font-medium">
                    <div className="flex items-center gap-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Secured escrow lock active until maturity threshold</span>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Historical Completed Funds */}
          {repaidFunded.length > 0 && (
            <div className="pt-4 space-y-3">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${s.textMuted}`}>Completed Receipts</h4>
              <div className="space-y-2.5">
                {repaidFunded.map((loan) => (
                  <div
                    key={loan.id}
                    className={`rounded-xl p-4 flex justify-between items-center text-sm ${s.cardInner}`}
                  >
                    <div>
                      <div className="font-bold text-gray-800 dark:text-gray-200">
                        ${loan.amount} to {loan.borrower}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Repaid on {loan.repaidDate || 'Recently'} • Collected {loan.tipPercent}% tip
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-500 font-extrabold">+${loan.expectedRepay}</div>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded font-extrabold inline-flex items-center gap-x-0.5 mt-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Completed</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section: My Borrow Requests (Liabilities Ledger) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-500/15">
            <div className="flex items-center gap-x-2.5">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <Handshake className="w-4 h-4 text-emerald-500" />
              </div>
              <h3 className={`font-display text-xl font-bold ${s.textHeading}`}>
                Liability Ledger (Borrowed)
              </h3>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full font-bold">
              {myBorrowRequests.length} Total
            </span>
          </div>

          <div className="space-y-4">
            {myBorrowRequests.length === 0 ? (
              <div className={`rounded-3xl p-8 text-center ${s.card}`}>
                <Clock className="w-12 h-12 text-gray-400/40 mx-auto mb-3" />
                <p className="font-bold text-md mb-1">No active borrow requests.</p>
                <p className={`text-xs ${s.textMuted} max-w-sm mx-auto mb-5`}>
                  Need emergency capital? Set your term, offer a voluntary gratitude tip, and request P2P community support.
                </p>
                <button
                  onClick={() => {
                    if (setCurrentTab) {
                      setCurrentTab('borrow');
                    } else {
                      const el = document.getElementById('nav-tab-borrow');
                      if (el) el.click();
                    }
                  }}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all hover:scale-[1.02]"
                >
                  Create Borrow Request
                </button>
              </div>
            ) : (
              myBorrowRequests.map((req) => {
                const totalRepayment = req.amount + Math.round((req.amount * req.tipPercent) / 100);
                const isFunded = req.funded;
                return (
                  <div
                    key={req.id}
                    className={`rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all duration-300 ${s.card}`}
                  >
                    <div className="flex justify-between items-start gap-x-2">
                      <div>
                        <div className="flex items-center gap-x-2">
                          <span className="font-black text-2xl tracking-tight">${req.amount}</span>
                          <span className={`text-xs ${s.textMuted}`}>for {req.reason}</span>
                        </div>
                        <div className="text-xs mt-1.5 flex items-center gap-x-3 text-gray-400 font-medium">
                          <span>{req.dueDays} Days Term</span>
                          <span>•</span>
                          <span>{req.tipPercent}% voluntary gratitude tip</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {!isFunded ? (
                          <span className="text-xs bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-x-1 animate-pulse">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            <span>Matching...</span>
                          </span>
                        ) : req.status === 'repaid' ? (
                          <span className="text-xs bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5 animate-bounce" />
                            <span>Repaid</span>
                          </span>
                        ) : (
                          <span className="text-xs bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Escrow Active</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Borrow Progress Visual Timeline */}
                    <div className={`mt-5 pt-4 border-t ${s.divider}`}>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Escrow Progression Tracker</div>
                      <div className="grid grid-cols-4 gap-1 relative">
                        {/* Progress Tracker Line */}
                        <div className="absolute top-2 left-4 right-4 h-0.5 bg-gray-200/60 -z-0"></div>
                        <div className={`absolute top-2 left-4 h-0.5 bg-emerald-500 -z-0 ${
                          req.status === 'repaid' ? 'w-[90%]' : isFunded ? 'w-[60%]' : 'w-[20%]'
                        }`}></div>

                        {/* Node 1: Created */}
                        <div className="flex flex-col items-center text-center relative z-10">
                          <div className="w-5.5 h-5.5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                            ✓
                          </div>
                          <span className="text-[9px] font-bold text-emerald-500 mt-1 leading-tight">Listed</span>
                        </div>

                        {/* Node 2: Funded / Escrow locked */}
                        <div className="flex flex-col items-center text-center relative z-10">
                          <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${
                            isFunded ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
                          }`}>
                            {isFunded ? '✓' : '2'}
                          </div>
                          <span className={`text-[9px] font-bold mt-1 leading-tight ${isFunded ? 'text-emerald-500' : 'text-gray-400'}`}>
                            Escrow Lock
                          </span>
                        </div>

                        {/* Node 3: Active usage */}
                        <div className="flex flex-col items-center text-center relative z-10">
                          <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${
                            isFunded && req.status !== 'repaid' ? 'bg-emerald-500 text-white animate-pulse' : isFunded && req.status === 'repaid' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
                          }`}>
                            {isFunded && req.status === 'repaid' ? '✓' : '3'}
                          </div>
                          <span className={`text-[9px] font-bold mt-1 leading-tight ${isFunded ? 'text-emerald-500' : 'text-gray-400'}`}>
                            Maturity
                          </span>
                        </div>

                        {/* Node 4: Repaid */}
                        <div className="flex flex-col items-center text-center relative z-10">
                          <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${
                            req.status === 'repaid' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
                          }`}>
                            {req.status === 'repaid' ? '✓' : '4'}
                          </div>
                          <span className={`text-[9px] font-bold mt-1 leading-tight ${req.status === 'repaid' ? 'text-emerald-500' : 'text-gray-400'}`}>
                            Settled
                          </span>
                        </div>

                      </div>
                    </div>

                    {/* Matching status indicator */}
                    {!isFunded && (
                      <div className="mt-4 pt-3.5 border-t border-gray-100/80 flex items-center justify-between text-[10px] text-gray-400">
                        <div className="flex items-center gap-x-1.5">
                          <Activity className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>Awaiting peer matching on the P2P Marketplace...</span>
                        </div>
                      </div>
                    )}

                    {/* Active Repayment Action */}
                    {isFunded && req.status !== 'repaid' && (
                      <div className="mt-4 pt-4 border-t border-gray-100/80 space-y-3">
                        {activeRepayLoanId !== req.id ? (
                          <div className="flex items-center justify-between gap-x-2">
                            <div className={`text-[10px] ${s.textMuted} leading-normal`}>
                              Repayment of <strong>${totalRepayment}</strong> (Principal + Tip) is expected.
                            </div>
                            <button
                              onClick={() => {
                                setActiveRepayLoanId(req.id);
                                setRepaySuccessMsg(null);
                              }}
                              className="px-4 py-2 bg-primary-orange hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer whitespace-nowrap transition-all hover:scale-[1.02]"
                            >
                              Repay Now
                            </button>
                          </div>
                        ) : (
                          <div className="bg-slate-50 rounded-2xl p-4.5 border border-gray-200/60 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Debit Repayment Interface</span>
                              <button
                                onClick={() => setActiveRepayLoanId(null)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-150"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <p className="text-xs text-gray-600 leading-normal">
                              Select a verified funding ledger to repay <strong>${totalRepayment}</strong> with instant clearance settlement:
                            </p>

                            <div className="grid grid-cols-3 gap-2">
                              {/* Option 1: Debit Card */}
                              <button
                                type="button"
                                onClick={() => setRepayChannel('debit_card')}
                                className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-y-1 cursor-pointer transition-all ${
                                  repayChannel === 'debit_card'
                                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold'
                                    : 'border-gray-200 hover:bg-gray-100 text-gray-500'
                                }`}
                              >
                                <CreditCard className="w-4.5 h-4.5 shrink-0" />
                                <span className="text-[9px] font-bold">Debit Card</span>
                              </button>

                              {/* Option 2: Chirp Direct */}
                              <button
                                type="button"
                                onClick={() => setRepayChannel('chirp')}
                                className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-y-1 cursor-pointer transition-all ${
                                  repayChannel === 'chirp'
                                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold'
                                    : 'border-gray-200 hover:bg-gray-100 text-gray-500'
                                }`}
                              >
                                <Fingerprint className="w-4.5 h-4.5 shrink-0" />
                                <span className="text-[9px] font-bold">Chirp Sync</span>
                              </button>

                              {/* Option 3: Crypto Wallet */}
                              <button
                                type="button"
                                onClick={() => setRepayChannel('crypto')}
                                className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-y-1 cursor-pointer transition-all ${
                                  repayChannel === 'crypto'
                                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold'
                                    : 'border-gray-200 hover:bg-gray-100 text-gray-500'
                                }`}
                              >
                                <Coins className="w-4.5 h-4.5 shrink-0" />
                                <span className="text-[9px] font-bold">Crypto USDC</span>
                              </button>
                            </div>

                            {/* Info text based on channel */}
                            {repayChannel === 'debit_card' && (
                              <p className="text-[10px] text-gray-500 italic bg-white p-2 rounded-lg border border-gray-150">
                                ✓ Settles via linked Mastercard / VISA debit gateway. Processing fee: <strong>$0.00</strong> (Cooperative Member Waiver)
                              </p>
                            )}
                            {repayChannel === 'chirp' && (
                              <p className="text-[10px] text-gray-500 italic bg-white p-2 rounded-lg border border-gray-150">
                                ✓ Settles via Plaid/Chirp open banking digital sync. Real-time ACH direct bank clearance active. Fee: <strong>$0.00</strong>
                              </p>
                            )}
                            {repayChannel === 'crypto' && (
                              <p className="text-[10px] text-gray-500 italic bg-white p-2 rounded-lg border border-gray-150">
                                ✓ Settles via USDC / USDT on Base L2 or Solana. Zero gas fees applied on instant digital escrow settlement.
                              </p>
                            )}

                            <button
                              type="button"
                              disabled={isRepaySimulating}
                              onClick={() => {
                                setIsRepaySimulating(true);
                                setTimeout(() => {
                                  setIsRepaySimulating(false);
                                  onSimulateRepayment(req.id);
                                  setActiveRepayLoanId(null);
                                }, 1500);
                              }}
                              className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-x-2 cursor-pointer shadow-md"
                            >
                              {isRepaySimulating ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                                  <span>Authorizing Ledger Settlement...</span>
                                </>
                              ) : (
                                <span>Authorize Repayment (${totalRepayment})</span>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Simple Helper function to count completed loans
function completedCount(loans: MyFundedLoan[]) {
  return loans.filter((l) => l.status === 'repaid').length;
}
