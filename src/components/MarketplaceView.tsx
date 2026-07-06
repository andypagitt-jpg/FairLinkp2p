import React, { useState } from 'react';
import { LoanRequest } from '../types';
import { Search, SlidersHorizontal, ShieldCheck, Heart, User, CheckCircle2, X, Award, TrendingUp, ShieldAlert, ArrowRight, UserCheck, MessageSquare, AlertCircle, KeySquare, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MarketplaceViewProps {
  loanRequests: LoanRequest[];
  onFundLoan: (id: string) => void;
  walletBalance: number;
  onUpdateLoanRequest?: (updated: LoanRequest) => void;
}

export default function MarketplaceView({ loanRequests, onFundLoan, walletBalance, onUpdateLoanRequest }: MarketplaceViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReason, setSelectedReason] = useState('All Reasons');
  const [sortBy, setSortBy] = useState<'highest-tip' | 'lowest-amount' | 'highest-score' | 'shortest-duration'>('highest-tip');
  const [selectedLoan, setSelectedLoan] = useState<LoanRequest | null>(null);
  const [checklistVerified, setChecklistVerified] = useState({
    identity: true,
    score: true,
    protocol: true,
  });

  // Tip counter-offer and negotiation states
  const [counterTipPercent, setCounterTipPercent] = useState(8);
  const [negotiationLog, setNegotiationLog] = useState<string[]>([]);
  const [negotiationStatus, setNegotiationStatus] = useState<'idle' | 'pending' | 'accepted' | 'declined' | 'rebuttal'>('idle');
  const [rebuttedPercent, setRebuttedPercent] = useState(0);

  // Secure authorization PIN state
  const [securityPin, setSecurityPin] = useState('1234');
  const [isPinVerified, setIsPinVerified] = useState(true);
  const [pinError, setPinError] = useState('');

  const selectLoanWithReset = (loan: LoanRequest | null) => {
    setSelectedLoan(loan);
    setChecklistVerified({ identity: true, score: true, protocol: true });
    setSecurityPin('1234');
    setIsPinVerified(true);
    setPinError('');
    if (loan) {
      setCounterTipPercent(loan.tipPercent);
      setNegotiationLog([`Borrower ${loan.borrower}: "I am requesting $${loan.amount} on a cooperative ledger contract with an initial ${loan.tipPercent}% gratitude tip instead of standard interest."`]);
      setNegotiationStatus('idle');
      setRebuttedPercent(0);
    }
  };

  const handleSendCounterOffer = () => {
    if (!selectedLoan) return;

    const prevTip = selectedLoan.tipPercent;
    let reply = "";

    if (counterTipPercent >= prevTip) {
      // Lender generously offered equal or higher tip: accepted!
      reply = `Borrower ${selectedLoan.borrower}: "Wow, thank you! I gratefully accept your counter-offer of a ${counterTipPercent}% tip. This will help set a standard for our mutual independence."`;
      setNegotiationStatus('accepted');

      const updatedLoan = {
        ...selectedLoan,
        tipPercent: counterTipPercent,
        counterTipPercent: counterTipPercent,
        counterStatus: 'accepted' as const,
      };
      setSelectedLoan(updatedLoan);
      if (onUpdateLoanRequest) {
        onUpdateLoanRequest(updatedLoan);
      }
    } else if (counterTipPercent >= prevTip - 2 && counterTipPercent >= 1) {
      // Slightly lower but still within bounds: accepted
      reply = `Borrower ${selectedLoan.borrower}: "Thank you for the proposal. I accept your counter-offer of ${counterTipPercent}% tip so we can proceed with cooperative funding."`;
      setNegotiationStatus('accepted');

      const updatedLoan = {
        ...selectedLoan,
        tipPercent: counterTipPercent,
        counterTipPercent: counterTipPercent,
        counterStatus: 'accepted' as const,
      };
      setSelectedLoan(updatedLoan);
      if (onUpdateLoanRequest) {
        onUpdateLoanRequest(updatedLoan);
      }
    } else {
      // Way lower tip: borrower proposes rebuttal compromise
      const compromisePercent = Math.max(1, Math.round((prevTip + counterTipPercent) / 2));
      reply = `Borrower ${selectedLoan.borrower}: "A ${counterTipPercent}% tip is a bit tight for me to cover the standard of community insurance. Can we compromise and settle on a rebuttal of ${compromisePercent}% tip instead?"`;
      setNegotiationStatus('rebuttal');
      setRebuttedPercent(compromisePercent);
    }

    setNegotiationLog((prev) => [
      ...prev,
      `You proposed: ${counterTipPercent}% tip ($${Math.round((selectedLoan.amount * counterTipPercent) / 100)} value).`,
      reply
    ]);
  };

  const handleAcceptRebuttal = () => {
    if (!selectedLoan) return;

    const reply = `Borrower ${selectedLoan.borrower}: "Tremendous! Deal locked on the decentralized ledger at ${rebuttedPercent}% tip. Thank you for working with me!"`;
    setNegotiationStatus('accepted');
    setNegotiationLog((prev) => [
      ...prev,
      `You accepted rebuttal: ${rebuttedPercent}% tip ($${Math.round((selectedLoan.amount * rebuttedPercent) / 100)} value).`,
      reply
    ]);

    const updatedLoan = {
      ...selectedLoan,
      tipPercent: rebuttedPercent,
      counterTipPercent: rebuttedPercent,
      counterStatus: 'accepted' as const,
    };
    setSelectedLoan(updatedLoan);
    if (onUpdateLoanRequest) {
      onUpdateLoanRequest(updatedLoan);
    }
  };

  // Filter requests that are NOT yet funded
  const activeRequests = loanRequests.filter((r) => !r.funded);

  const reasons = [
    'All Reasons',
    'Car repair / maintenance',
    'Medical / dental bill',
    'Utility or rent assistance',
    'Groceries / household',
    'Work-related expense',
    'Other emergency',
  ];

  const filteredRequests = activeRequests
    .filter((req) => {
      const matchesSearch =
        req.borrower.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.reason.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesReason = selectedReason === 'All Reasons' || req.reason === selectedReason;
      return matchesSearch && matchesReason;
    })
    .sort((a, b) => {
      if (sortBy === 'highest-tip') return b.tipPercent - a.tipPercent;
      if (sortBy === 'lowest-amount') return a.amount - b.amount;
      if (sortBy === 'highest-score') return b.fairScore - a.fairScore;
      if (sortBy === 'shortest-duration') return a.dueDays - b.dueDays;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-y-4">
        <div>
          <h2 className="font-display text-4xl font-bold tracking-tight text-gray-900">
            P2P Marketplace
          </h2>
          <p className="text-gray-600 mt-1">
            Support community members directly by funding active short-term contracts.
          </p>
        </div>
        <div className="flex items-center gap-x-2 self-start bg-orange-50 border border-orange-100 px-4 py-2 rounded-2xl">
          <span className="w-2 h-2 bg-primary-orange rounded-full animate-pulse"></span>
          <span className="text-sm font-semibold text-gray-800" id="active-count">
            {activeRequests.length} requests live
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 mb-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="relative lg:col-span-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by borrower name or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-primary-orange focus:bg-white focus:outline-none rounded-2xl pl-11 pr-4 py-3 text-sm transition-all text-gray-800"
            />
          </div>

          {/* Reason Filter */}
          <div className="lg:col-span-4">
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-primary-orange focus:bg-white focus:outline-none rounded-2xl px-4 py-3 text-sm text-gray-700 transition-all cursor-pointer"
            >
              {reasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="lg:col-span-3 flex items-center gap-x-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-primary-orange focus:bg-white focus:outline-none rounded-2xl px-3 py-3 text-sm text-gray-700 transition-all cursor-pointer"
            >
              <option value="highest-tip">Highest Tip % First</option>
              <option value="lowest-amount">Lowest Amount First</option>
              <option value="highest-score">Highest FairScore First</option>
              <option value="shortest-duration">Shortest Days First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm max-w-lg mx-auto mt-6">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800">No active matches found</h3>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Try resetting your search filters or browse other request categories.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedReason('All Reasons');
            }}
            className="mt-6 px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-semibold transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="marketplace-list">
          {filteredRequests.map((request) => {
            const isUserLoan = !!request.isMine;
            return (
              <motion.div
                key={request.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`bg-white border rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                  isUserLoan ? 'border-amber-200 ring-2 ring-amber-500/10' : 'border-gray-100'
                }`}
              >
                <div>
                  {/* Top Line */}
                  <div className="flex justify-between items-start gap-x-2">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 tracking-tight font-display">
                        ${request.amount}
                      </div>
                      <div className="text-xs font-semibold text-gray-500 mt-0.5 uppercase tracking-wider">
                        {request.dueDays} days term
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`inline-flex items-center gap-x-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          request.fairScore >= 85
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : request.fairScore >= 75
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : 'bg-rose-50 text-rose-700 border-rose-100'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>FairScore {request.fairScore}</span>
                      </div>
                    </div>
                  </div>

                  {/* Reason & Borrower info */}
                  <div className="my-5">
                    <div className="text-sm font-semibold text-gray-800 leading-snug">
                      "{request.reason}"
                    </div>
                    <div className="text-xs text-gray-400 mt-2 flex items-center gap-x-1.5">
                      <User className="w-3 h-3 text-gray-300" />
                      <span>Borrower: <strong className="text-gray-600 font-medium">{request.borrower}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Bottom Stats & Trigger */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Lender Gratitude Tip</div>
                      <div className="text-2xl font-bold text-primary-orange mt-0.5">
                        {request.tipPercent}%
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="text-gray-400">Total Repay</div>
                      <div className="font-bold text-gray-900">
                        ${(request.amount + Math.round((request.amount * request.tipPercent) / 100)).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {isUserLoan ? (
                    <div className="w-full py-3.5 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl font-semibold text-sm flex items-center justify-center gap-x-1.5 cursor-not-allowed">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Your Own Request</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => selectLoanWithReset(request)}
                      className="w-full py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-x-1.5 transition-all cursor-pointer hover:shadow-md"
                    >
                      <span>View details & fund</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Contract Detail & Funding Modal */}
      <AnimatePresence>
        {selectedLoan && (
          <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLoan(null)}
              className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-lg w-full overflow-hidden relative z-10 flex flex-col font-sans"
            >
              {/* Top Cover */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 relative">
                <button
                  onClick={() => setSelectedLoan(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-x-2 text-xs text-primary-orange font-bold uppercase tracking-widest mb-1.5">
                  <Award className="w-4 h-4" />
                  <span>Cooperative Contract Inspection</span>
                </div>
                <h3 className="text-2xl font-bold font-display tracking-tight text-white">
                  Jamie's Circle Match
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  P2P short-term ledger contract #{selectedLoan.id}
                </p>
              </div>

              {/* Content Body */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
                {/* Borrower Summary */}
                <div className="flex items-start justify-between gap-x-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <div className="text-[10px] uppercase font-extrabold tracking-wider text-gray-400">Borrower</div>
                    <div className="text-base font-bold text-gray-900 mt-0.5">{selectedLoan.borrower}</div>
                    <div className="text-xs text-gray-500 mt-1 leading-snug">"{selectedLoan.reason}"</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] uppercase font-extrabold tracking-wider text-gray-400">Trust Factor</div>
                    <div className="inline-flex items-center gap-x-1 px-2.5 py-0.5 mt-1 bg-orange-100 border border-orange-200 text-primary-orange rounded-full text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Score {selectedLoan.fairScore}</span>
                    </div>
                  </div>
                </div>

                {/* Repayment Cost Breakdown */}
                <div className="bg-orange-50 border-2 border-primary-orange/40 rounded-2xl p-5 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary-orange/10 rounded-full blur-xl pointer-events-none" />
                  <h4 className="text-xs font-bold text-primary-orange uppercase tracking-wider mb-3 flex items-center gap-x-1.5 relative z-10">
                    <TrendingUp className="w-4 h-4 text-primary-orange" />
                    <span>Financial Ledger Breakdown</span>
                  </h4>
                  <div className="space-y-2 text-xs relative z-10">
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Principal Funded Amount</span>
                      <span className="font-bold text-gray-900 text-sm">${selectedLoan.amount}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600 pb-3 border-b border-gray-200/60">
                      <span className="flex items-center gap-x-1">
                        <span>Gratitude Tip ({selectedLoan.tipPercent}%)</span>
                        <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[9px] font-extrabold rounded">Cooperative</span>
                      </span>
                      <span className="font-bold text-emerald-600 text-sm">
                        +${Math.round((selectedLoan.amount * selectedLoan.tipPercent) / 100)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3">
                      <div>
                        <span className="font-bold text-gray-900 text-sm block">Total Return Expectation</span>
                        <span className="text-[10px] text-gray-500 block">Released securely to you on repayment</span>
                      </div>
                      <span className="text-2xl font-black text-gray-900 font-display">
                        ${selectedLoan.amount + Math.round((selectedLoan.amount * selectedLoan.tipPercent) / 100)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Peer-to-Peer Tip Negotiation Panel */}
                <div className="bg-slate-50 border border-gray-200/80 rounded-2xl p-4.5 space-y-3.5 shadow-inner">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-x-1.5">
                      <MessageSquare className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>P2P Tip Rebuttal & Counter-Offer</span>
                    </h4>
                    <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Interactive Chat
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-normal">
                    Lenders can counter and rebuttal a borrower's gratitude tip percentage request. The borrower's consensus algorithm will analyze and respond in real-time.
                  </p>

                  <div className="space-y-2 pt-1.5 border-t border-gray-200/40">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-700">Counter-Offer Tip</span>
                      <div className="flex items-center gap-x-1 bg-amber-50 border border-amber-200 rounded-xl px-2.5 py-0.5 transition-all focus-within:border-amber-500 focus-within:bg-white">
                        <input
                          type="number"
                          id="counter-tip-input"
                          min="1"
                          max="20"
                          value={counterTipPercent}
                          onChange={(e) => setCounterTipPercent(Number(e.target.value))}
                          onBlur={() => {
                            if (counterTipPercent < 1) setCounterTipPercent(1);
                            if (counterTipPercent > 20) setCounterTipPercent(20);
                          }}
                          disabled={negotiationStatus === 'accepted'}
                          className="w-8 font-mono font-extrabold text-amber-600 text-right bg-transparent border-none outline-none p-0 focus:ring-0 focus:outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-40"
                        />
                        <span className="text-amber-600 text-xs font-bold">%</span>
                        <span className="text-gray-400 text-[10px] ml-0.5 font-semibold">(${Math.round((selectedLoan.amount * counterTipPercent) / 100)})</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={counterTipPercent}
                      onChange={(e) => setCounterTipPercent(Number(e.target.value))}
                      disabled={negotiationStatus === 'accepted'}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-40"
                    />
                    <div className="flex justify-between text-[9px] text-gray-400">
                      <span>1% (Minimal Appreciation)</span>
                      <span>10%</span>
                      <span>20% (Highest Counter)</span>
                    </div>
                  </div>

                  {negotiationLog.length > 0 && (
                    <div className="bg-white border border-gray-200/80 rounded-xl p-3 space-y-2.5 max-h-40 overflow-y-auto">
                      {negotiationLog.map((log, index) => (
                        <div key={index} className="text-[11px] leading-relaxed text-gray-700 border-l-2 border-amber-400 pl-2">
                          {log}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    {negotiationStatus !== 'accepted' ? (
                      <button
                        type="button"
                        onClick={handleSendCounterOffer}
                        className="w-full bg-gray-900 hover:bg-black text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer shadow-sm text-center"
                      >
                        Propose Counter-Offer Tip
                      </button>
                    ) : (
                      <div className="w-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Counter-Offer Accepted & Locked</span>
                      </div>
                    )}

                    {negotiationStatus === 'rebuttal' && (
                      <button
                        type="button"
                        onClick={handleAcceptRebuttal}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3.5 rounded-xl transition-all cursor-pointer shadow-sm text-center"
                      >
                        Accept Rebuttal ({rebuttedPercent}%)
                      </button>
                    )}
                  </div>
                </div>

                {/* Score Breakdown Analysis */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                    Cooperative Reliability Audit
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white border border-gray-100 rounded-2xl p-3 text-center">
                      <div className="text-[10px] font-bold text-gray-400 uppercase">Repay Rate</div>
                      <div className="text-lg font-bold text-emerald-600 mt-0.5">
                        {selectedLoan.fairScore >= 85 ? '100%' : selectedLoan.fairScore >= 75 ? '98.4%' : '94.2%'}
                      </div>
                      <div className="text-[9px] text-gray-400 mt-0.5">Community history</div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl p-3 text-center">
                      <div className="text-[10px] font-bold text-gray-400 uppercase">Average Term</div>
                      <div className="text-lg font-bold text-gray-800 mt-0.5">
                        {selectedLoan.dueDays} Days
                      </div>
                      <div className="text-[9px] text-gray-400 mt-0.5">Matching cycle</div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl p-3 text-center">
                      <div className="text-[10px] font-bold text-gray-400 uppercase">Trust Grade</div>
                      <div className="text-lg font-bold text-primary-orange mt-0.5">
                        {selectedLoan.fairScore >= 85 ? 'Grade A+' : selectedLoan.fairScore >= 75 ? 'Grade B' : 'Grade C'}
                      </div>
                      <div className="text-[9px] text-gray-400 mt-0.5">Assigned tier</div>
                    </div>
                  </div>
                </div>

                {/* Interactive Audit Checklist */}
                <div className="space-y-3 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cooperative Reliability Audit Verification</span>
                  </h4>
                  <p className="text-[10px] text-emerald-700/80 leading-relaxed">
                    Verify this borrower's cryptographic ledger history below to authorize contract deployment:
                  </p>

                  <div className="bg-emerald-600/10 border border-emerald-500/20 text-emerald-800 text-[10px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-x-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>FairLink Smart-Consent Auto-Audit: Active & Verified</span>
                  </div>
                  
                  <div className="space-y-2 pt-1">
                    <label className="flex items-start gap-x-2.5 text-xs text-gray-700 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={checklistVerified.identity}
                        onChange={(e) => setChecklistVerified(prev => ({ ...prev, identity: e.target.checked }))}
                        className="mt-0.5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={checklistVerified.identity ? 'text-emerald-950 font-semibold line-through decoration-emerald-600/60' : ''}>
                        Identity verified via decentralized ledger signature
                      </span>
                    </label>
                    
                    <label className="flex items-start gap-x-2.5 text-xs text-gray-700 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={checklistVerified.score}
                        onChange={(e) => setChecklistVerified(prev => ({ ...prev, score: e.target.checked }))}
                        className="mt-0.5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={checklistVerified.score ? 'text-emerald-950 font-semibold line-through decoration-emerald-600/60' : ''}>
                        FairScore ({selectedLoan.fairScore}) verified on decentralized oracle nodes
                      </span>
                    </label>

                    <label className="flex items-start gap-x-2.5 text-xs text-gray-700 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={checklistVerified.protocol}
                        onChange={(e) => setChecklistVerified(prev => ({ ...prev, protocol: e.target.checked }))}
                        className="mt-0.5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={checklistVerified.protocol ? 'text-emerald-950 font-semibold line-through decoration-emerald-600/60' : ''}>
                        I agree to the dual-channel escrow lock & dispute protocols
                      </span>
                    </label>
                  </div>
                </div>

                {/* Secure Transaction Authorization Pin */}
                <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4 space-y-2.5">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-x-1.5">
                    <KeySquare className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Secure Transaction Authorization PIN</span>
                  </h4>
                  <p className="text-[10px] text-gray-500 leading-normal">
                    Enter your 4-digit security authorization PIN to sign the ledger contract. (Default PIN: <code className="bg-gray-200 px-1 py-0.2 rounded text-[10px] font-mono font-bold text-indigo-700">1234</code>)
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center">
                    <input
                      type="password"
                      placeholder="PIN"
                      maxLength={4}
                      value={securityPin}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setSecurityPin(val);
                        if (val === '1234') {
                          setIsPinVerified(true);
                          setPinError('');
                        } else {
                          setIsPinVerified(false);
                          if (val.length === 4) {
                            setPinError('Invalid PIN code. Enter the default PIN (1234).');
                          } else {
                            setPinError('');
                          }
                        }
                      }}
                      className="w-24 px-3 py-2 bg-white border border-gray-300 focus:border-indigo-500 focus:outline-none rounded-xl text-center font-bold tracking-widest text-sm"
                    />
                    {isPinVerified ? (
                      <span className="text-emerald-700 text-xs font-bold flex items-center gap-x-1 bg-emerald-50 border border-emerald-100 rounded-xl px-2.5 py-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Secure Signature Verified</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400">Please type default PIN 1234 to sign.</span>
                    )}
                  </div>
                  {pinError && <p className="text-[10px] text-rose-600 font-extrabold">{pinError}</p>}
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => selectLoanWithReset(null)}
                  className="w-full sm:w-1/3 py-3 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold rounded-2xl text-xs transition-all cursor-pointer text-center"
                >
                  Cancel Audit
                </button>

                {walletBalance >= selectedLoan.amount ? (
                  <button
                    disabled={!(checklistVerified.identity && checklistVerified.score && checklistVerified.protocol && isPinVerified)}
                    onClick={() => {
                      onFundLoan(selectedLoan.id);
                      selectLoanWithReset(null);
                    }}
                    className={`w-full sm:w-2/3 py-3 font-bold rounded-2xl text-xs transition-all text-center active:scale-95 ${
                      (checklistVerified.identity && checklistVerified.score && checklistVerified.protocol && isPinVerified)
                        ? 'bg-primary-orange hover:bg-orange-600 text-white cursor-pointer hover:shadow-md'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {(checklistVerified.identity && checklistVerified.score && checklistVerified.protocol && isPinVerified) 
                      ? `Confirm & Fund $${selectedLoan.amount}` 
                      : !isPinVerified 
                        ? "Enter Secure PIN Code First"
                        : "Verify Audit Checklist First"}
                  </button>
                ) : (
                  <div className="w-full sm:w-2/3 bg-rose-50 border border-rose-100 text-rose-700 font-bold rounded-2xl text-[11px] p-3 text-center leading-tight flex items-center justify-center gap-x-1">
                    <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Need ${selectedLoan.amount - walletBalance} more in Wallet to fund</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
