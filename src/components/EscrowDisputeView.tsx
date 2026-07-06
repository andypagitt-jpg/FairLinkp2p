import React, { useState } from 'react';
import { EscrowRecord, DisputeRecord, LoanRequest } from '../types';
import { Shield, Lock, Unlock, Gavel, AlertCircle, FileText, CheckCircle, RefreshCw, HelpCircle, ArrowRight, Vote, Sparkles, Scale, Info, Layers, Flame, UserCheck, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EscrowDisputeViewProps {
  escrowRecords: EscrowRecord[];
  disputeRecords: DisputeRecord[];
  loanRequests: LoanRequest[];
  walletBalance: number;
  onInitiateDispute: (escrowId: string, reason: string, desc: string) => void;
  onVoteDispute: (disputeId: string, voteFor: 'lender' | 'borrower') => void;
  onResolveDispute: (disputeId: string, resolution: 'resolved_to_lender' | 'resolved_to_borrower' | 'dismissed') => void;
  onSimulateEscrowTimeout: (escrowId: string) => void;
  setCurrentTab?: (tab: string) => void;
}

export default function EscrowDisputeView({
  escrowRecords,
  disputeRecords,
  loanRequests,
  walletBalance,
  onInitiateDispute,
  onVoteDispute,
  onResolveDispute,
  onSimulateEscrowTimeout,
  setCurrentTab,
}: EscrowDisputeViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'vault' | 'disputes'>('vault');
  const [disputeModalEscrowId, setDisputeModalEscrowId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState('Payment Delay');
  const [disputeDesc, setDisputeDesc] = useState('');
  const [disputeEvidence, setDisputeEvidence] = useState('');

  // Search/Filters
  const [filterStatus, setFilterStatus] = useState<'all' | 'held' | 'released' | 'disputed'>('all');

  const filteredEscrows = escrowRecords.filter(e => {
    if (filterStatus === 'all') return true;
    return e.status === filterStatus;
  });

  const handleSubmitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeModalEscrowId) return;
    onInitiateDispute(disputeModalEscrowId, disputeReason, `${disputeDesc}. Evidence file ref: ${disputeEvidence || 'No files attached'}`);
    setDisputeModalEscrowId(null);
    setDisputeDesc('');
    setDisputeEvidence('');
    setActiveSubTab('disputes');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="font-display text-4xl font-bold tracking-tight text-gray-900">
          Smart Escrow & Disputes
        </h2>
        <p className="text-gray-600 mt-1">
          Monitor locked escrow channels, verify smart contracts, or participate in decentralized cooperative arbitration.
        </p>
      </div>

      {/* Sub-tab Navigation and Info Cards */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-5">
        <div className="flex items-center gap-x-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
          <button
            onClick={() => setActiveSubTab('vault')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-x-2 ${
              activeSubTab === 'vault'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Lock className="w-4 h-4 text-primary-orange" />
            <span>Escrow Holding Vault</span>
            <span className="bg-gray-100 text-gray-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">
              {escrowRecords.filter(e => e.status === 'held').length} held
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab('disputes')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-x-2 ${
              activeSubTab === 'disputes'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Scale className="w-4 h-4 text-primary-orange" />
            <span>Cooperative Dispute Center</span>
            <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">
              {disputeRecords.filter(d => d.status === 'open').length} active
            </span>
          </button>
        </div>

        {/* Quick status counters */}
        <div className="flex items-center gap-x-4 text-xs">
          <div className="flex items-center gap-x-1.5 text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Total Escrow Volume:</span>
            <span className="font-bold text-gray-800">
              ${escrowRecords.reduce((acc, e) => acc + e.amount, 0)}
            </span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-x-1.5 text-gray-500">
            <Gavel className="w-4 h-4 text-amber-500" />
            <span>Resolved Disputes:</span>
            <span className="font-bold text-gray-800">
              {disputeRecords.filter(d => d.status !== 'open').length}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Panels */}
      <div>
        <AnimatePresence mode="wait">
          {activeSubTab === 'vault' ? (
            <motion.div
              key="vault-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Filter Row */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-x-2 text-xs font-semibold text-gray-600">
                  <span className="text-gray-400">Filter Escrow Status:</span>
                  {(['all', 'held', 'released', 'disputed'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3 py-1.5 rounded-lg border text-xs capitalize font-bold transition-all cursor-pointer ${
                        filterStatus === status
                          ? 'bg-gray-900 border-gray-900 text-white'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-x-2 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-1.5">
                  <Info className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>Funds are automatically locked here immediately upon funding.</span>
                </div>
              </div>

              {filteredEscrows.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center">
                  <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="font-display font-bold text-gray-800 text-base">No Escrow Holdings Found</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed mb-5">
                    Once a peer-to-peer loan is funded in the Marketplace, the digital principal will lock securely in escrow. Try funding a loan request to inspect!
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentTab && setCurrentTab('marketplace')}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                  >
                    Go to Marketplace
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredEscrows.map(escrow => {
                    const matchedLoan = loanRequests.find(l => l.id === escrow.loanId);

                    return (
                      <div
                        key={escrow.id}
                        className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 relative overflow-hidden"
                      >
                        {/* Escrow Ribbon status */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-x-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${
                              escrow.status === 'held' ? 'bg-amber-500 animate-pulse' :
                              escrow.status === 'released' ? 'bg-emerald-500' :
                              escrow.status === 'disputed' ? 'bg-rose-500 animate-bounce' : 'bg-gray-400'
                            }`} />
                            <span className="text-[10px] uppercase font-extrabold tracking-wider text-gray-400">
                              Escrow Vault Reference
                            </span>
                          </div>

                          <span className={`inline-flex items-center gap-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                            escrow.status === 'held' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                            escrow.status === 'released' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                            escrow.status === 'disputed' ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-gray-50 border-gray-200 text-gray-500'
                          }`}>
                            {escrow.status === 'held' && <Lock className="w-3 h-3 text-amber-500" />}
                            {escrow.status === 'released' && <Unlock className="w-3 h-3 text-emerald-500" />}
                            {escrow.status === 'disputed' && <AlertCircle className="w-3 h-3 text-rose-500" />}
                            <span>{escrow.status === 'held' ? 'Held in Trust' : escrow.status}</span>
                          </span>
                        </div>

                        {/* Summary details */}
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex justify-between items-center">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Amount Locked</span>
                            <div className="text-xl font-black text-gray-900 font-display">
                              ${escrow.amount}
                            </div>
                            <span className="text-[9px] text-gray-500">
                              + ${escrow.tipAmount} cooperative gratuity
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Parties Involved</span>
                            <div className="text-xs text-gray-700 font-semibold mt-0.5">
                              {escrow.lender} (Lender)
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-x-1 justify-end">
                              <ArrowRight className="w-3 h-3 text-gray-400" />
                              <span>{escrow.borrower} (Borrower)</span>
                            </div>
                          </div>
                        </div>

                        {/* Release Condition */}
                        <div className="space-y-2">
                          <div className="text-xs font-bold text-gray-700 flex items-center gap-x-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>Unlock & Release Criteria:</span>
                          </div>
                          <p className="text-[11px] text-gray-500 bg-emerald-50/50 border border-emerald-100/40 p-2.5 rounded-xl leading-relaxed">
                            {escrow.releaseCriteria}
                          </p>
                        </div>

                        {/* Cryptographic Hash for real-money deployment */}
                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 bg-gray-50 p-2 rounded-xl">
                          <span className="flex items-center gap-x-1 font-semibold text-gray-500">
                            <Layers className="w-3.5 h-3.5 text-gray-400" />
                            <span>Smart Contract:</span>
                          </span>
                          <span className="text-gray-600 font-bold truncate max-w-[200px]" title={escrow.contractHash}>
                            {escrow.contractHash}
                          </span>
                        </div>

                        {/* Escrow Claim Options */}
                        {escrow.status === 'held' && (
                          <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-2.5">
                            <button
                              onClick={() => setDisputeModalEscrowId(escrow.id)}
                              className="flex-1 py-2 bg-rose-50 border border-rose-150 hover:bg-rose-100/60 text-rose-700 font-bold rounded-xl text-[11px] transition-all flex items-center justify-center gap-x-1 cursor-pointer"
                            >
                              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                              <span>Initiate Dispute Claim</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="disputes-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Introduction to disputes */}
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-gray-900 text-sm flex items-center gap-x-1.5">
                    <Gavel className="w-4 h-4 text-primary-orange" />
                    <span>Decentralized Cooperative Court</span>
                  </h4>
                  <p className="text-xs text-gray-500 max-w-2xl leading-relaxed">
                    When repayment is delayed or disputes arise, funds remain locked securely in the smart escrow contract. The community jury votes on fund distribution based on submitted evidence, ensuring strict cooperative fairness.
                  </p>
                </div>
                <div className="inline-flex items-center gap-x-1 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-bold">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Jury Network Active</span>
                </div>
              </div>

              {disputeRecords.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center">
                  <Scale className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="font-display font-bold text-gray-800 text-base">No Active Disputes</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed mb-5">
                    Lenders and borrowers can initiate disputes directly from active escrow records. Currently, all peer cooperative transactions are in compliance.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('vault')}
                    className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                  >
                    Check Escrow Vault
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {disputeRecords.map(dispute => {
                    const matchedEscrow = escrowRecords.find(e => e.id === dispute.escrowId);
                    const totalVotes = dispute.juryVotesLender + dispute.juryVotesBorrower;
                    const lenderPercentage = totalVotes > 0 ? Math.round((dispute.juryVotesLender / totalVotes) * 100) : 50;
                    const borrowerPercentage = totalVotes > 0 ? Math.round((dispute.juryVotesBorrower / totalVotes) * 100) : 50;

                    return (
                      <div
                        key={dispute.id}
                        className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 relative overflow-hidden"
                      >
                        {/* Top Meta */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
                          <div>
                            <div className="flex items-center gap-x-2">
                              <span className="text-xs font-black font-display text-gray-900 uppercase">
                                CASE #{dispute.id}
                              </span>
                              <span className="text-xs text-gray-400">|</span>
                              <span className="text-[10px] text-gray-500">Initiated {dispute.createdDate}</span>
                            </div>
                            <h5 className="font-bold text-gray-800 text-sm mt-1">
                              Reason: {dispute.reason}
                            </h5>
                          </div>

                          <span className={`inline-flex items-center gap-x-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
                            dispute.status === 'open' ? 'bg-orange-50 border-orange-100 text-primary-orange animate-pulse' :
                            dispute.status === 'resolved_to_lender' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                            dispute.status === 'resolved_to_borrower' ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-500'
                          }`}>
                            {dispute.status === 'open' ? 'Awaiting Jury Decision' : `Resolved: ${dispute.status.replace('_', ' ')}`}
                          </span>
                        </div>

                        {/* Mid Details & Description */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Case Description</span>
                              <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-2xl border border-gray-100 leading-relaxed">
                                {dispute.description}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Submitted Cryptographic Evidence</span>
                              <div className="flex items-center gap-x-2 bg-gray-50 border border-gray-100 p-2.5 rounded-xl text-xs text-gray-600">
                                <FileText className="w-4 h-4 text-primary-orange shrink-0" />
                                <span className="font-mono text-[10px] truncate">{dispute.evidence}</span>
                              </div>
                            </div>
                          </div>

                          {/* Jury Voting Dashboard */}
                          <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-5 space-y-4">
                            <div className="flex items-center justify-between">
                              <h6 className="font-bold text-xs text-gray-700 flex items-center gap-x-1">
                                <Vote className="w-4 h-4 text-primary-orange" />
                                <span>Cooperative Jury Vote Standings</span>
                              </h6>
                              <span className="text-[10px] text-gray-400 font-semibold">{totalVotes} community votes cast</span>
                            </div>

                            {/* Bar Visualizer */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600 font-medium">Refund to Lender</span>
                                <span className="text-gray-800 font-bold">{dispute.juryVotesLender} votes ({lenderPercentage}%)</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600 font-medium">Release to Borrower</span>
                                <span className="text-gray-800 font-bold">{dispute.juryVotesBorrower} votes ({borrowerPercentage}%)</span>
                              </div>

                              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                                <div
                                  style={{ width: `${lenderPercentage}%` }}
                                  className="h-full bg-emerald-500 transition-all duration-300"
                                />
                                <div
                                  style={{ width: `${borrowerPercentage}%` }}
                                  className="h-full bg-orange-400 transition-all duration-300"
                                />
                              </div>
                            </div>

                            {/* Vote actions */}
                            {dispute.status === 'open' && (
                              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                                <button
                                  onClick={() => onVoteDispute(dispute.id, 'lender')}
                                  className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 font-bold rounded-xl text-[10px] transition-all cursor-pointer text-center"
                                >
                                  Vote Refund Lender
                                </button>
                                <button
                                  onClick={() => onVoteDispute(dispute.id, 'borrower')}
                                  className="flex-1 py-2 bg-orange-50 hover:bg-orange-100 border border-orange-100 text-primary-orange font-bold rounded-xl text-[10px] transition-all cursor-pointer text-center"
                                >
                                  Vote Release Borrower
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Mediator Authority Controls (sandbox preview) */}
                        {dispute.status === 'open' && (
                          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-2xl">
                            <div className="flex items-center gap-x-2">
                              <Scale className="w-5 h-5 text-primary-orange shrink-0" />
                              <div>
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold font-mono">
                                  Mediator Console
                                </span>
                                <span className="text-xs text-gray-200">
                                  Force final consensus or settle escrow contract allocation
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-x-2">
                              <button
                                onClick={() => onResolveDispute(dispute.id, 'resolved_to_lender')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                              >
                                Settle: Refund Lender
                              </button>
                              <button
                                onClick={() => onResolveDispute(dispute.id, 'resolved_to_borrower')}
                                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                              >
                                Settle: Release Borrower
                              </button>
                              <button
                                onClick={() => onResolveDispute(dispute.id, 'dismissed')}
                                className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                              >
                                Dismiss Case
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Slide-Up Custom Filing Modal */}
      <AnimatePresence>
        {disputeModalEscrowId && (
          <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDisputeModalEscrowId(null)}
              className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full overflow-hidden relative z-10 font-sans"
            >
              <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
                <div className="flex items-center gap-x-2">
                  <Gavel className="w-5 h-5 text-primary-orange" />
                  <div>
                    <h4 className="font-display font-bold text-sm tracking-tight text-white">
                      File Escrow Contract Claim
                    </h4>
                    <p className="text-[10px] text-gray-400">Initiates decentralized mediation & lockup</p>
                  </div>
                </div>
                <button
                  onClick={() => setDisputeModalEscrowId(null)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
                >
                  <RefreshCw className="w-4 h-4 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleSubmitDispute} className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">
                    Select Dispute Category
                  </label>
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary-orange"
                  >
                    <option value="Payment Delay">Overdue Payment Delay</option>
                    <option value="Proof Conflicted">Conflicting Payment Confirmation</option>
                    <option value="Non-cooperative">Non-cooperative Behavior</option>
                    <option value="Other">Other Unspecified Issue</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">
                    Detailed Account / Statement
                  </label>
                  <textarea
                    required
                    value={disputeDesc}
                    onChange={(e) => setDisputeDesc(e.target.value)}
                    placeholder="Provide a clear, fact-based description of what occurred, timeline of expectations, and desired remedy..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 h-24 focus:outline-none focus:ring-1 focus:ring-primary-orange"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">
                    Link Cryptographic Hash or Receipt Proof
                  </label>
                  <input
                    type="text"
                    value={disputeEvidence}
                    onChange={(e) => setDisputeEvidence(e.target.value)}
                    placeholder="e.g. txn_hash_0x3e18a2... or screenshot link"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary-orange"
                  />
                  <span className="text-[9px] text-gray-400 block mt-0.5">
                    Submitting false or malicious claims results in an automatic -10 FairScore penalty.
                  </span>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setDisputeModalEscrowId(null)}
                    className="w-1/3 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl text-xs text-center cursor-pointer hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs text-center cursor-pointer shadow-md shadow-rose-600/15"
                  >
                    Submit Dispute Claim
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
