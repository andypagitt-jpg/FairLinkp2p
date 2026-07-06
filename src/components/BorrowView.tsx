import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Sparkles, HelpCircle, AlertCircle, Quote, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface BorrowViewProps {
  fairScore: number;
  onPostRequest: (amount: number, reason: string, dueDays: number, tipPercent: number) => void;
}

export default function BorrowView({ fairScore, onPostRequest }: BorrowViewProps) {
  const [amount, setAmount] = useState(250);
  const [reason, setReason] = useState('Car repair / maintenance');
  const [dueDays, setDueDays] = useState(7);
  const [tipPercent, setTipPercent] = useState(8);
  const [hasManuallySetTip, setHasManuallySetTip] = useState(false);
  
  const [isDepositVerified, setIsDepositVerified] = useState<boolean>(() => {
    return localStorage.getItem('fairlink_account_analysis_verified') === 'true';
  });

  // Auto recommend tip percentage based on loan amount
  const getRecommendedTipPercent = (amt: number) => {
    if (amt <= 150) return 3; // small loans have lower default tip percentages (e.g. 3%)
    if (amt <= 400) return 5; // standard
    return 8; // generous standard
  };

  // Auto-recommend effect
  useEffect(() => {
    if (!hasManuallySetTip) {
      setTipPercent(getRecommendedTipPercent(amount));
    }
  }, [amount, hasManuallySetTip]);

  const lenderTip = Math.round((amount * tipPercent) / 100);
  const creatorTip = 1; // Mandatory $1 gratitude tip for creator
  const totalRepay = amount + lenderTip + creatorTip;

  const reasons = [
    'Car repair / maintenance',
    'Medical / dental bill',
    'Utility or rent assistance',
    'Groceries / household',
    'Work-related expense',
    'Other emergency',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPostRequest(amount, reason, dueDays, tipPercent);
    // Reset defaults after posting
    setAmount(250);
    setReason('Car repair / maintenance');
    setDueDays(7);
    setTipPercent(5);
    setHasManuallySetTip(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-display text-4xl font-bold tracking-tight text-gray-900">
          Request Funding
        </h2>
        <p className="text-gray-600 mt-1">
          Set your own fair terms. No collateral, no hidden interest, and absolute transparency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-800">Amount needed</label>
                <div className="flex items-center gap-x-1 bg-gray-50 border border-gray-200 focus-within:border-primary-orange focus-within:bg-white rounded-xl px-3 py-1 transition-all">
                  <span className="text-gray-500 font-bold text-sm">$</span>
                  <input
                    type="number"
                    id="amount-input"
                    min="50"
                    max="650"
                    value={amount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setAmount(val);
                    }}
                    onBlur={() => {
                      if (amount < 50) setAmount(50);
                      if (amount > 650) setAmount(650);
                    }}
                    className="w-16 font-display font-bold text-gray-950 text-right bg-transparent border-none outline-none p-0 focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <input
                type="range"
                id="amount-range"
                min="50"
                max="650"
                step="10"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary-orange"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$50</span>
                <span>$350</span>
                <span>$650</span>
              </div>
            </div>

            {/* Purpose Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                What do you need it for?
              </label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-primary-orange focus:bg-white focus:outline-none rounded-2xl px-4 py-3.5 text-sm text-gray-700 transition-all cursor-pointer font-medium"
              >
                {reasons.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Timeline Slider & Tip Slider (Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Repay timeline */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-800">Term (days)</label>
                  <div className="flex items-center gap-x-1 bg-gray-50 border border-gray-200 focus-within:border-primary-orange focus-within:bg-white rounded-xl px-2 py-0.5 transition-all">
                    <input
                      type="number"
                      id="days-input"
                      min="3"
                      max="15"
                      value={dueDays}
                      onChange={(e) => setDueDays(Number(e.target.value))}
                      onBlur={() => {
                        if (dueDays < 3) setDueDays(3);
                        if (dueDays > 15) setDueDays(15);
                      }}
                      className="w-8 font-display font-bold text-gray-950 text-right bg-transparent border-none outline-none p-0 focus:ring-0 focus:outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-gray-500 text-xs font-semibold">days</span>
                  </div>
                </div>
                <input
                  type="range"
                  id="days-range"
                  min="3"
                  max="15"
                  step="1"
                  value={dueDays}
                  onChange={(e) => setDueDays(Number(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary-orange"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>3 days</span>
                  <span>9 days</span>
                  <span>15 days</span>
                </div>
              </div>

              {/* Tips slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-x-1">
                    <span>Lender Gratitude Tip</span>
                    <HelpCircle className="w-3.5 h-3.5 text-gray-300" title="This voluntary tip says thank you to the lender instead of interest." />
                  </label>
                  <div className="flex items-center gap-x-1 bg-gray-50 border border-gray-200 focus-within:border-primary-orange focus-within:bg-white rounded-xl px-2 py-0.5 transition-all">
                    <input
                      type="number"
                      id="tip-input"
                      min="0"
                      max="20"
                      value={tipPercent}
                      onChange={(e) => {
                        setTipPercent(Number(e.target.value));
                        setHasManuallySetTip(true);
                      }}
                      onBlur={() => {
                        if (tipPercent < 0) setTipPercent(0);
                        if (tipPercent > 20) setTipPercent(20);
                      }}
                      className="w-8 font-display font-bold text-primary-orange text-right bg-transparent border-none outline-none p-0 focus:ring-0 focus:outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-primary-orange text-xs font-bold">%</span>
                    <span className="text-gray-400 text-[10px] ml-0.5 font-semibold">(${lenderTip})</span>
                  </div>
                </div>
                <input
                  type="range"
                  id="tip-range"
                  min="0"
                  max="20"
                  step="1"
                  value={tipPercent}
                  onChange={(e) => {
                    setTipPercent(Number(e.target.value));
                    setHasManuallySetTip(true);
                  }}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary-orange"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>0% (No tip)</span>
                  <span>10%</span>
                  <span>20%</span>
                </div>
              </div>
            </div>

            {/* Quick Adjust Preset Settings (Auto recommend & small tips) */}
            <div className="bg-orange-50/50 border border-orange-100/50 rounded-2xl p-4 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-[11px] font-bold text-orange-900 flex items-center gap-x-1">
                  <Sparkles className="w-3 h-3 text-primary-orange" />
                  <span>Adjust Cooperative Gratitude Tips</span>
                </span>
                <span className="text-[10px] font-mono text-orange-700 bg-orange-100/60 px-2 py-0.5 rounded-full font-bold">
                  {!hasManuallySetTip ? "System Recommended" : "Manual Adjustment"}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {[1, 2, 5, 8, 12, 15].map((pct) => {
                  const dVal = Math.round((amount * pct) / 100);
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => {
                        setTipPercent(pct);
                        setHasManuallySetTip(true);
                      }}
                      className={`py-2 px-1 rounded-xl border text-[11px] font-bold transition-all text-center cursor-pointer ${
                        tipPercent === pct
                          ? 'bg-primary-orange border-primary-orange text-white shadow-sm'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-150'
                      }`}
                    >
                      {pct}% (${dVal})
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-500 leading-normal">
                Tips of 1% or 2% are welcome as tokens of appreciation for setting a standard for the next generation of independence.
                {hasManuallySetTip && (
                  <button
                    type="button"
                    onClick={() => {
                      setHasManuallySetTip(false);
                      setTipPercent(getRecommendedTipPercent(amount));
                    }}
                    className="text-primary-orange font-bold hover:underline ml-1 cursor-pointer"
                  >
                    Reset to recommended
                  </button>
                )}
              </p>
            </div>

            {/* Inspirational Hope Quote Card */}
            <div className="bg-gradient-to-br from-indigo-50/70 to-orange-50/50 border border-indigo-100/50 rounded-2xl p-4 relative overflow-hidden">
              <div className="absolute top-2 right-2 text-indigo-500/10 pointer-events-none">
                <Quote className="w-16 h-16 stroke-[1]" />
              </div>
              <div className="flex gap-x-2.5 items-start">
                <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 fill-rose-500" />
                <div className="space-y-1">
                  <p className="text-[11px] italic text-indigo-950 font-medium leading-relaxed">
                    "Hope is the anchor of the soul. This platform is built for people who remain with hope and want to better things, setting a standard for the next generation of independence."
                  </p>
                  <div className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider">
                    Community Beacon of Hope
                  </div>
                </div>
              </div>
            </div>

            {/* Live Financial Breakdown Box */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <div className="flex justify-between items-center text-sm mb-2.5">
                <span className="text-gray-500 font-medium">Principal Loan</span>
                <span className="font-semibold text-gray-900">${amount}</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-2.5">
                <span className="text-gray-500 font-medium flex items-center gap-x-1">
                  <span>Voluntary Lender Tip ({tipPercent}%)</span>
                </span>
                <span className="font-semibold text-primary-orange">
                  +${lenderTip}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pb-3.5 border-b border-gray-200/50">
                <span className="text-gray-500 font-medium flex items-center gap-x-1">
                  <span>Creator Gratitude Fee (Mandatory)</span>
                  <HelpCircle className="w-3.5 h-3.5 text-gray-300" title="A tiny $1 token of appreciation to sustain FairLink as a free, independent platform." />
                </span>
                <span className="font-semibold text-emerald-600">
                  +$1
                </span>
              </div>
              <div className="flex justify-between items-center pt-3.5">
                <span className="font-semibold text-gray-800">Total Repayment</span>
                <span className="text-xl font-bold text-gray-900 font-display" id="repay-total">
                  ${totalRepay}
                </span>
              </div>
              <div className="text-[10px] text-gray-400 mt-2 leading-relaxed flex items-center gap-x-1">
                <AlertCircle className="w-3 h-3 shrink-0 text-gray-300" />
                <span>Zero hidden platform fees for borrowers. All transactions are peer-to-peer.</span>
              </div>
            </div>

            {/* Submit Trigger */}
            <button
              type="submit"
              className="w-full py-4 bg-primary-orange hover:bg-orange-600 text-white font-bold rounded-2xl text-base transition-all hover:shadow-md cursor-pointer active:scale-[0.99]"
            >
              Post Request to Community
            </button>
          </form>
        </div>

        {/* Live Marketplace Preview Box (Right Column) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-x-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-primary-orange" />
              <span>Live Marketplace Card Preview</span>
            </div>

            {/* Fake card component reflecting live status */}
            <div className="bg-white border border-amber-200 ring-4 ring-amber-500/5 rounded-3xl p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-2xl font-bold text-gray-900 tracking-tight font-display">
                    ${amount}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{dueDays} days • {reason}</div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <div className="inline-flex items-center gap-x-1 px-2 py-0.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-full text-[10px] font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>FairScore {fairScore}</span>
                  </div>
                  {isDepositVerified && (
                    <div className="inline-flex items-center gap-x-1 px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-[8.5px] font-bold">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-500 fill-emerald-100" />
                      <span>Verified Deposits</span>
                    </div>
                  )}
                  <div className="text-[9px] text-gray-400 mt-0.5">Pending approval</div>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-gray-100">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase">Lender Gratitude Tip</div>
                    <div className="text-xl font-bold text-primary-orange mt-0.5">{tipPercent}%</div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="text-[10px] text-gray-400">Total Repay</div>
                    <div className="font-bold text-gray-900">${totalRepay}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 w-full py-2.5 bg-amber-50/80 border border-amber-100/50 text-amber-800 rounded-xl font-semibold text-xs text-center">
                Your Own Request (Interactive Preview)
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              This card will instantly appear in the <strong>Marketplace</strong> for other community members to fund. Once funded, the money will deposit immediately into your wallet.
            </p>
          </div>

          {/* Cost Comparison Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            {(() => {
              const paydayFee = Math.round((amount * 0.15) * (dueDays <= 14 ? 1 : 2));
              const fairlinkTip = Math.round((amount * tipPercent) / 100);
              const savings = Math.max(0, paydayFee - fairlinkTip);

              return (
                <>
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-gray-900 text-sm">
                      Cost Comparison
                    </h4>
                    <span className="inline-flex items-center gap-x-1 px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Save ${savings}</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Traditional short-term lenders charge up to 400% APR ($15 per $100 borrowed). FairLink relies entirely on voluntary gratitude tips.
                  </p>

                  <div className="space-y-3.5">
                    {/* Payday Lender Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500 font-medium">Traditional Payday Loan (Avg. Fee)</span>
                        <span className="font-bold text-red-500">${paydayFee}</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-400 rounded-full w-full" />
                      </div>
                      <div className="text-[9px] text-gray-400 mt-1">Approx. 391% APR ($15 per $100 for {dueDays} days)</div>
                    </div>

                    {/* FairLink Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-800 font-semibold">
                          FairLink Cooperative Tip
                        </span>
                        <span className="font-bold text-emerald-500">${fairlinkTip}</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(5, (fairlinkTip / paydayFee) * 100))}%` }}
                        />
                      </div>
                      <div className="text-[9px] text-gray-400 mt-1">Voluntary gratitude tip of {tipPercent}% to lender</div>
                    </div>
                  </div>

                  <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600">Cooperative Savings</span>
                    <span className="text-base font-extrabold text-emerald-600 font-display">
                      ${savings} saved!
                    </span>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Tips for high matching success */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6">
            <h4 className="font-semibold text-gray-900 text-sm mb-3">How to get funded faster</h4>
            <ul className="space-y-3 text-xs text-gray-600">
              <li className="flex items-start gap-x-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>Offer a fair tip:</strong> Requests offering a 5% to 15% tip typically get funded within 2 minutes.</span>
              </li>
              <li className="flex items-start gap-x-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>Build your FairScore:</strong> Repaying on time boosts your score, unlocking larger borrow maximums.</span>
              </li>
              <li className="flex items-start gap-x-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>Keep terms short:</strong> Timelines under 10 days present lower risk profiles to community lenders.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
