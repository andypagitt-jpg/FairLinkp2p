import React, { useState } from 'react';
import { PlatformEarningLog } from '../types';
import { Landmark, TrendingUp, ArrowDownRight, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EarningsViewProps {
  platformRevenue: number;
  earningLogs: PlatformEarningLog[];
  onPayout: () => void;
}

export default function EarningsView({ platformRevenue, earningLogs, onPayout }: EarningsViewProps) {
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);
  const [errorWarning, setErrorWarning] = useState<string | null>(null);

  const handlePayoutClick = () => {
    if (platformRevenue <= 0) {
      setErrorWarning('Platform account balance is currently $0.00. Fund cooperative contracts to generate fee holdings.');
      setTimeout(() => setErrorWarning(null), 4000);
      return;
    }
    setPaidAmount(platformRevenue);
    onPayout();
    setShowPayoutModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-display text-4xl font-bold tracking-tight text-gray-900">
          Platform Earnings
        </h2>
        <p className="text-gray-600 mt-1">
          Monitor platform service fees collected as the administrator and claim payouts instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Claims Panel */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Total Revenue Collected
                </div>
                <div className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tighter mt-1 font-display" id="platform-revenue">
                  ${platformRevenue.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full font-bold inline-flex items-center gap-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{earningLogs.length} contracts fee-collected</span>
                </span>
              </div>
            </div>

            {errorWarning && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 mb-5 text-xs font-medium flex items-center gap-x-2"
              >
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{errorWarning}</span>
              </motion.div>
            )}

            <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-600 leading-relaxed mb-8 flex items-start gap-x-2.5">
              <Info className="w-4 h-4 text-primary-orange shrink-0 mt-0.5" />
              <span>
                <strong>Fee Model:</strong> FairLink levies a microscopic 1.5% matching service fee on funded principals (minimum $2). Borrowers pay zero platform fees, keeping lending genuinely cooperative.
              </span>
            </div>

            <button
              onClick={handlePayoutClick}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition-all text-white font-bold rounded-2xl flex items-center justify-center gap-x-2.5 text-base shadow-sm shadow-emerald-600/15 cursor-pointer"
            >
              <Landmark className="w-5 h-5 text-white" />
              <span>Payout to Me (Owner)</span>
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              Funds are cleared under ACH rule compliance and settled into your linked checking account within 1 business day.
            </p>
          </div>

          {/* Revenue Breakdown mini chart or status card */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 text-white shadow-sm font-sans">
            <h4 className="font-semibold text-white/90 text-sm mb-4">Payout Claims Policy</h4>
            <ul className="space-y-3 text-xs text-white/80">
              <li className="flex items-start gap-x-2">
                <span className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 shrink-0"></span>
                <span>Payouts have zero transaction latency and clear instantly.</span>
              </li>
              <li className="flex items-start gap-x-2">
                <span className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 shrink-0"></span>
                <span>Minimum payout threshold is $0.01.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Platform Audit Logs */}
        <div className="lg:col-span-6 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="font-display text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 mb-5">
            Audit Logs: Service Fees Collected
          </h3>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2 font-sans">
            {earningLogs.length === 0 ? (
              <div className="text-center text-gray-400 py-12 text-sm">
                No service fees collected yet. Once you fund a marketplace request, platform revenue logs will populate here.
              </div>
            ) : (
              earningLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-all border border-gray-50/50"
                >
                  <div className="flex items-center gap-x-3">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                      <ArrowDownRight className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-800">
                        Loan match: {log.borrowerName}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Principal: ${log.loanAmount} • {log.date}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-emerald-600 font-display">
                    +${log.feeAmount}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Success Payout Modal (Replaces browser alerts gracefully!) */}
      <AnimatePresence>
        {showPayoutModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setShowPayoutModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl border border-gray-100 font-sans"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-900">
                Payout Complete!
              </h3>
              <p className="mt-2.5 text-sm text-gray-600 leading-relaxed">
                We've successfully transferred <strong className="text-gray-900">${paidAmount}</strong> from the smart escrow ledger directly to your verified external checking account.
              </p>
              <button
                onClick={() => setShowPayoutModal(false)}
                className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
              >
                Awesome, thank you
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
