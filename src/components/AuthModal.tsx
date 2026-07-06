import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Smartphone, 
  Lock, 
  User, 
  ChevronRight, 
  RefreshCw, 
  ShieldCheck, 
  Key, 
  Check, 
  AlertCircle 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'google' | 'email' | 'sms'>('google');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manual Google entry state
  const [showAddGoogleForm, setShowAddGoogleForm] = useState(false);
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // Manual Email State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailName, setEmailName] = useState('');

  // SMS State
  const [phone, setPhone] = useState('');
  const [smsOtp, setSmsOtp] = useState('');
  const [smsSent, setSmsSmsSent] = useState(false);
  const [simulatedCode, setSimulatedCode] = useState('');

  const handleSimulatedAuth = (user: any) => {
    setIsSubmitting(true);
    setError(null);
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin(user);
      onClose();
    }, 1200);
  };

  const handleGooglePreload = (name: string, email: string, avatar: string) => {
    handleSimulatedAuth({
      name,
      email,
      avatar,
      isVerified: true,
      fairScoreBoost: email === 'drewpagittt@gmail.com' ? 15 : 10,
      phoneVerified: email === 'drewpagittt@gmail.com',
      identityVerified: true,
      socialsConnected: email === 'drewpagittt@gmail.com' ? { twitter: 'drew_pagitt', github: 'dpagitt' } : {}
    });
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleName || !customGoogleEmail) {
      setError('Please fill in both name and email.');
      return;
    }
    const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(customGoogleName)}`;
    handleSimulatedAuth({
      name: customGoogleName,
      email: customGoogleEmail,
      avatar,
      isVerified: true,
      fairScoreBoost: 10,
      phoneVerified: false,
      identityVerified: false,
      socialsConnected: {}
    });
  };

  const handleManualEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }
    const name = emailName || email.split('@')[0];
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(capitalizedName)}`;
    handleSimulatedAuth({
      name: capitalizedName,
      email: email,
      avatar,
      isVerified: true,
      fairScoreBoost: 8,
      phoneVerified: false,
      identityVerified: false,
      socialsConnected: {}
    });
  };

  const handleSendSMS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 7) {
      setError('Please enter a valid phone number.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSimulatedCode(code);
      setSmsSmsSent(true);
      setError(null);
    }, 1000);
  };

  const handleVerifySMS = (e: React.FormEvent) => {
    e.preventDefault();
    if (smsOtp !== simulatedCode && smsOtp !== '123456') {
      setError('Invalid verification code. Enter ' + simulatedCode + ' or 123456.');
      return;
    }
    handleSimulatedAuth({
      name: `Phone User (${phone.slice(-4)})`,
      email: `${phone.replace(/\D/g, '')}@fairlink.sms`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(phone)}`,
      isVerified: true,
      fairScoreBoost: 12,
      phoneVerified: true,
      identityVerified: false,
      socialsConnected: {}
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1010] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white rounded-3xl overflow-hidden relative z-10 max-w-md w-full shadow-2xl flex flex-col font-sans border border-gray-150"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex justify-between items-center border-b border-gray-100">
              <div>
                <h3 className="font-display font-extrabold text-lg text-gray-900 flex items-center gap-x-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                  <span>Secure Node Login</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Select your preferred authentication gateway</p>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selector Tabs */}
            <div className="grid grid-cols-3 bg-gray-50 p-1.5 mx-6 mt-4 rounded-2xl border border-gray-100">
              <button
                type="button"
                onClick={() => { setActiveTab('google'); setError(null); }}
                className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'google' 
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-100' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Google Sign-In
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('email'); setError(null); }}
                className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'email' 
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-100' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Manual Email
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('sms'); setError(null); }}
                className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'sms' 
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-100' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                SMS Gateway
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl flex items-start gap-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Main Tab Content */}
            <div className="p-6">
              {isSubmitting ? (
                <div className="text-center py-12 space-y-4">
                  <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Exchanging Cryptographic Keys...</span>
                    <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                      Connecting to decentralized auth node and verifying trust proof on-chain
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* GOOGLE TAB */}
                  {activeTab === 'google' && (
                    <div className="space-y-4">
                      {!showAddGoogleForm ? (
                        <>
                          <div className="space-y-2.5">
                            {/* Account Option 1: Drew Pagitt */}
                            <button
                              type="button"
                              onClick={() => handleGooglePreload('Drew Pagitt', 'drewpagittt@gmail.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&h=128&q=80')}
                              className="w-full flex items-center gap-x-3 p-3 hover:bg-gray-50 rounded-2xl border border-gray-150 cursor-pointer text-left transition-all hover:border-gray-300"
                            >
                              <img 
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&h=128&q=80" 
                                alt="Drew Pagitt" 
                                className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1">
                                <span className="text-xs font-bold text-gray-900 block">Drew Pagitt</span>
                                <span className="text-[10px] text-gray-500 block">drewpagittt@gmail.com</span>
                              </div>
                              <span className="text-[9px] font-black bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-150">
                                Creator account
                              </span>
                              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                            </button>

                            {/* Account Option 2: Jamie D. */}
                            <button
                              type="button"
                              onClick={() => handleGooglePreload('Jamie D.', 'jamie.d@fairlink.peer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80')}
                              className="w-full flex items-center gap-x-3 p-3 hover:bg-gray-50 rounded-2xl border border-gray-150 cursor-pointer text-left transition-all hover:border-gray-300"
                            >
                              <img 
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80" 
                                alt="Jamie D." 
                                className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1">
                                <span className="text-xs font-bold text-gray-900 block">Jamie D.</span>
                                <span className="text-[10px] text-gray-500 block">jamie.d@fairlink.peer</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                            </button>

                            {/* Add/Link Custom Account Option */}
                            <button
                              type="button"
                              onClick={() => setShowAddGoogleForm(true)}
                              className="w-full flex items-center gap-x-3 p-3 hover:bg-gray-50 rounded-2xl border border-dashed border-gray-300 hover:border-indigo-400 cursor-pointer text-left transition-all"
                            >
                              <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500">
                                <User className="w-5 h-5 text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-bold text-gray-700 block">Use another Google account</span>
                                <p className="text-[9px] text-gray-400 leading-none mt-0.5">Let others use their own device account manually</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <form onSubmit={handleCustomGoogleSubmit} className="space-y-4">
                          <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Device Google Credentials</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Full Name</label>
                              <div className="relative">
                                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                                <input
                                  type="text"
                                  placeholder="e.g. Alexis Carter"
                                  value={customGoogleName}
                                  onChange={(e) => setCustomGoogleName(e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-2 px-3 pl-10 text-xs text-gray-900 outline-none transition-all"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Google Email Address</label>
                              <div className="relative">
                                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                                <input
                                  type="email"
                                  placeholder="alexis.c@gmail.com"
                                  value={customGoogleEmail}
                                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-2 px-3 pl-10 text-xs text-gray-900 outline-none transition-all"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-2 flex items-center gap-x-2">
                            <button
                              type="button"
                              onClick={() => { setShowAddGoogleForm(false); setError(null); }}
                              className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold rounded-xl cursor-pointer transition-all"
                            >
                              Back to Accounts
                            </button>
                            <button
                              type="submit"
                              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-md shadow-indigo-600/10"
                            >
                              Authorize & Sign In
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}

                  {/* MANUAL EMAIL TAB */}
                  {activeTab === 'email' && (
                    <form onSubmit={handleManualEmailSubmit} className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Your Name</label>
                          <div className="relative">
                            <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                            <input
                              type="text"
                              placeholder="Jamie Miller"
                              value={emailName}
                              onChange={(e) => setEmailName(e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-2.5 px-3 pl-10 text-xs text-gray-900 outline-none transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Email Address</label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                            <input
                              type="email"
                              placeholder="you@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-2.5 px-3 pl-10 text-xs text-gray-900 outline-none transition-all"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Password</label>
                          <div className="relative">
                            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                            <input
                              type="password"
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-2.5 px-3 pl-10 text-xs text-gray-900 outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-md shadow-indigo-600/15"
                      >
                        Authenticate Email Gateway
                      </button>
                    </form>
                  )}

                  {/* SMS TAB */}
                  {activeTab === 'sms' && (
                    <div className="space-y-4">
                      {!smsSent ? (
                        <form onSubmit={handleSendSMS} className="space-y-4">
                          <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Mobile Number</label>
                            <div className="relative">
                              <Smartphone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                              <input
                                type="tel"
                                placeholder="+1 (555) 019-2834"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-3 pl-10 text-xs text-gray-900 outline-none transition-all"
                                required
                              />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1.5 leading-normal">
                              We will dispatch an SMS text containing an authorization OTP token code to verify ownership.
                            </p>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-md shadow-indigo-600/15"
                          >
                            Send OTP Code
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifySMS} className="space-y-4">
                          <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                              Verification Code Sent to {phone}
                            </label>
                            <div className="relative">
                              <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                              <input
                                type="text"
                                maxLength={6}
                                placeholder="Enter 6-digit OTP code"
                                value={smsOtp}
                                onChange={(e) => setSmsOtp(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-3 pl-10 text-xs text-gray-900 outline-none transition-all tracking-widest text-center font-mono font-bold"
                                required
                              />
                            </div>
                            <div className="mt-2.5 bg-indigo-50 text-indigo-700 p-2.5 rounded-xl text-[10px] font-semibold text-center border border-indigo-100 animate-pulse">
                              💬 Simulated SMS Received: Code is <strong>{simulatedCode}</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-x-2">
                            <button
                              type="button"
                              onClick={() => { setSmsSmsSent(false); setSmsOtp(''); setError(null); }}
                              className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold rounded-xl cursor-pointer transition-all"
                            >
                              Change Number
                            </button>
                            <button
                              type="submit"
                              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-md shadow-indigo-600/15"
                            >
                              Verify OTP
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-100">
              <span className="flex items-center gap-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>SSL Secured Ledger Handshake</span>
              </span>
              <span className="hover:underline cursor-pointer">Security Protocol</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
