import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Sparkles, 
  Twitter, 
  Github, 
  UserCheck, 
  CheckCircle, 
  Smartphone, 
  QrCode, 
  TrendingUp, 
  Info, 
  ChevronRight, 
  Copy, 
  Check, 
  Upload, 
  ScanFace, 
  Building, 
  Wallet, 
  RefreshCw, 
  Key,
  Flame,
  User,
  LogOut,
  X,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  FileText,
  DollarSign
} from 'lucide-react';
import { LoanRequest, MyFundedLoan, Transaction } from '../types';
import AuthModal from './AuthModal';

interface ProfileViewProps {
  currentUser: {
    name: string;
    email: string;
    avatar: string;
    isVerified: boolean;
    fairScoreBoost: number;
    phoneVerified: boolean;
    identityVerified: boolean;
    socialsConnected: { twitter?: string; github?: string };
    bio?: string;
  } | null;
  onLogout: () => void;
  onUpdateUser: (updated: any) => void;
  onLogin: (user: any) => void;
  onResetAllData: () => void;
  fairScore: number;
  theme: 'white' | 'babyblue' | 'dark';
  borrowHistory: LoanRequest[];
  lendHistory: MyFundedLoan[];
  transactions: Transaction[];
}

export default function ProfileView({
  currentUser,
  onLogout,
  onUpdateUser,
  onLogin,
  onResetAllData,
  fairScore,
  theme,
  borrowHistory,
  lendHistory,
  transactions,
}: ProfileViewProps) {
  // Authentication Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Manual social linking modal states
  const [activeModal, setActiveModal] = useState<'twitter' | 'github' | 'id' | 'phone' | null>(null);
  
  // Twitter manual linkage states
  const [twitterHandle, setTwitterHandle] = useState('');
  const [tweetStatusUrl, setTweetStatusUrl] = useState('');
  const [tweetCopied, setTweetCopied] = useState(false);
  const [isTwitterVerifying, setIsTwitterVerifying] = useState(false);

  // GitHub linkage states
  const [githubUsername, setGithubUsername] = useState('');
  const [sshCopied, setSshCopied] = useState(false);
  const [isGithubVerifying, setIsGithubVerifying] = useState(false);

  // ID verification states
  const [idFileUploaded, setIdFileUploaded] = useState(false);
  const [idScanStep, setIdScanStep] = useState<'upload' | 'biometrics' | 'success'>('upload');
  const [isIdVerifying, setIsIdVerifying] = useState(false);

  // Phone verification states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneStep, setPhoneStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [isPhoneVerifying, setIsPhoneVerifying] = useState(false);

  // Bio editor states
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(currentUser?.bio || '');
  const [historyTab, setHistoryTab] = useState<'lending' | 'borrowing' | 'ledger'>('lending');

  useEffect(() => {
    if (currentUser) {
      setBioText(currentUser.bio || '');
    }
  }, [currentUser?.bio]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 px-6 py-12 text-center bg-white rounded-3xl border border-gray-100 shadow-xl font-sans relative">
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="font-display font-bold text-xl text-gray-900">Sign in to view your Profile</h3>
        <p className="text-sm text-gray-500 mt-2 text-center leading-relaxed">
          Your individualized P2P dashboard and secure digital identity features are unlocked after establishing your session.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="mt-6 inline-flex items-center gap-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs shadow-md transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 duration-150 animate-bounce"
        >
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Access Secure Login Gateway</span>
        </button>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={onLogin}
        />
      </div>
    );
  }

  // Calculate dynamic verified score
  const baseRepayScore = 75; 
  const totalScore = baseRepayScore + currentUser.fairScoreBoost;

  // Manual Twitter Link Submission
  const handleVerifyTwitter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!twitterHandle || !tweetStatusUrl) return;

    setIsTwitterVerifying(true);
    setTimeout(() => {
      setIsTwitterVerifying(false);
      onUpdateUser({
        ...currentUser,
        fairScoreBoost: currentUser.fairScoreBoost + 8,
        socialsConnected: {
          ...currentUser.socialsConnected,
          twitter: twitterHandle.startsWith('@') ? twitterHandle : `@${twitterHandle}`,
        }
      });
      setActiveModal(null);
      setTwitterHandle('');
      setTweetStatusUrl('');
    }, 2000);
  };

  // Manual GitHub Link Submission
  const handleVerifyGithub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUsername) return;

    setIsGithubVerifying(true);
    setTimeout(() => {
      setIsGithubVerifying(false);
      onUpdateUser({
        ...currentUser,
        fairScoreBoost: currentUser.fairScoreBoost + 10,
        socialsConnected: {
          ...currentUser.socialsConnected,
          github: githubUsername,
        }
      });
      setActiveModal(null);
      setGithubUsername('');
    }, 1800);
  };

  // Manual ID Verification Submission
  const handleStartBiometrics = () => {
    setIdScanStep('biometrics');
    setIsIdVerifying(true);
    setTimeout(() => {
      setIsIdVerifying(false);
      onUpdateUser({
        ...currentUser,
        fairScoreBoost: currentUser.fairScoreBoost + 15,
        identityVerified: true,
      });
      setIdScanStep('success');
    }, 3000);
  };

  // Manual Phone Verification Submission
  const handleVerifyPhone = () => {
    setIsPhoneVerifying(true);
    setTimeout(() => {
      setIsPhoneVerifying(false);
      onUpdateUser({
        ...currentUser,
        fairScoreBoost: currentUser.fairScoreBoost + 7,
        phoneVerified: true,
      });
      setPhoneStep('success');
    }, 1500);
  };

  // Handle profile photo selection and Base64 converting
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdateUser({
            ...currentUser,
            avatar: reader.result
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBio = () => {
    onUpdateUser({
      ...currentUser,
      bio: bioText
    });
    setIsEditingBio(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16 font-sans">
      
      {/* Upper Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Card: Individualized Identity Overview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Google Verified</span>
            </div>

            <div className="flex flex-col items-center text-center mt-4">
              <div className="relative group cursor-pointer w-20 h-20">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-20 h-20 rounded-full border-2 border-indigo-100 shadow-md object-cover transition-opacity group-hover:opacity-75" 
                  referrerPolicy="no-referrer"
                />
                <label htmlFor="avatar-file-input" className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload className="w-5 h-5 text-white" />
                </label>
                <input 
                  type="file" 
                  id="avatar-file-input" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="hidden" 
                />
              </div>
              <label htmlFor="avatar-file-input" className="text-[10px] text-indigo-500 font-semibold hover:underline mt-1.5 block cursor-pointer">
                Change Profile Photo
              </label>

              <h3 className="font-display font-bold text-xl text-gray-900 mt-2">{currentUser.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{currentUser.email}</p>

              {/* Bio Section */}
              <div className="mt-4 w-full border-t border-gray-50 pt-4 px-1">
                {isEditingBio ? (
                  <div className="space-y-2">
                    <textarea
                      value={bioText}
                      onChange={(e) => setBioText(e.target.value)}
                      placeholder="Write a short peer bio (max 160 chars)..."
                      maxLength={160}
                      className="w-full text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      rows={3}
                    />
                    <div className="flex justify-center gap-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setBioText(currentUser.bio || '');
                          setIsEditingBio(false);
                        }}
                        className="px-3 py-1 bg-gray-100 text-gray-650 hover:bg-gray-200 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveBio}
                        className="px-3 py-1 bg-indigo-600 text-white hover:bg-indigo-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-gray-600 italic leading-relaxed">
                      {currentUser.bio ? `"${currentUser.bio}"` : "Introduce yourself to the peer-to-peer cooperative network."}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setBioText(currentUser.bio || '');
                        setIsEditingBio(true);
                      }}
                      className="text-[10px] text-indigo-600 font-semibold hover:underline mt-1 cursor-pointer block mx-auto"
                    >
                      {currentUser.bio ? 'Edit Bio' : 'Add Short Bio'}
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {currentUser.identityVerified ? (
                  <span className="inline-flex items-center gap-x-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full">
                    <UserCheck className="w-3 h-3" />
                    <span>KYC ID Passed</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-x-1 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-full">
                    <span>Identity Unverified</span>
                  </span>
                )}

                {currentUser.phoneVerified ? (
                  <span className="inline-flex items-center gap-x-1 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full">
                    <Smartphone className="w-3 h-3" />
                    <span>SMS Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-x-1 text-[10px] font-bold bg-gray-50 text-gray-500 border border-gray-150 px-2.5 py-1 rounded-full">
                    <span>No Linked Phone</span>
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Linked Google SSO</span>
                <span className="font-mono text-gray-700 font-bold">{currentUser.email.split('@')[0]}@g</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Cooperative Node status</span>
                <span className="text-emerald-600 font-bold flex items-center gap-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Active Ledger Peer</span>
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Security protocol</span>
                <span className="text-gray-700 font-mono font-semibold">ECDSA On-Chain</span>
              </div>
            </div>

            <button 
              onClick={onLogout}
              className="w-full mt-6 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl flex items-center justify-center gap-x-2 cursor-pointer transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Secure Session</span>
            </button>

            <button 
              onClick={onResetAllData}
              className="w-full mt-3 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-xs font-bold rounded-xl flex items-center justify-center gap-x-2 cursor-pointer transition-all"
            >
              <RefreshCw className="w-4 h-4 text-indigo-500" />
              <span>Clear Simulated Data (Fresh Slate)</span>
            </button>
          </div>

          {/* Connected Wallets & Banks list summary */}
          <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm">
            <h4 className="font-display font-bold text-sm text-gray-900 mb-3.5">Connected Assets & Direct Links</h4>
            
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-x-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                    B
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Chase Checking</span>
                    <span className="text-[10px] text-gray-400 block">Direct bank draft link</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100/60 text-emerald-800 px-2 py-0.5 rounded-full">Active</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-x-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                    C
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Chirp Sync Chime</span>
                    <span className="text-[10px] text-gray-400 block">Direct peer node banking</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100/60 text-emerald-800 px-2 py-0.5 rounded-full">Synced</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-x-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0">
                    W3
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Base L2 Wallet</span>
                    <span className="text-[10px] text-gray-400 block">0x3a19...9b23</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">Web3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Core Stats, FairScore Wheel, and Connectors */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Top Banner: Dynamic FairScore Wheel */}
          <div className="bg-gradient-to-br from-slate-900 to-[#121A2E] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center justify-center pointer-events-none">
              <Sparkles className="w-64 h-64 text-indigo-400 animate-spin" style={{ animationDuration: '40s' }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-x-1.5 bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                  <Flame className="w-3.5 h-3.5 text-orange-400 animate-bounce" />
                  <span>Individualized Reliability Score</span>
                </div>
                
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mt-4">Your Trust Index</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  FairScore is updated dynamically using decentralized social connectors, KYC proofing, and your historic on-chain repayments. Higher score unlocks zero platform fees and larger peer borrowing maximums.
                </p>

                <div className="mt-6 flex gap-x-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Base Repay Factor</span>
                    <span className="text-base font-bold text-white mt-0.5 block">{baseRepayScore} pts</span>
                  </div>
                  <div className="w-[1px] bg-slate-800"></div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Social/ID Boost</span>
                    <span className="text-base font-bold text-indigo-300 mt-0.5 block">+{currentUser.fairScoreBoost} pts</span>
                  </div>
                </div>
              </div>

              {/* Graphical Circular Wheel */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  
                  {/* Outer circle */}
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle 
                      cx="72" 
                      cy="72" 
                      r="64" 
                      className="stroke-slate-800" 
                      strokeWidth="8" 
                      fill="transparent" 
                    />
                    <circle 
                      cx="72" 
                      cy="72" 
                      r="64" 
                      className="stroke-indigo-500 transition-all duration-1000" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={402}
                      strokeDashoffset={402 - (402 * Math.min(100, totalScore)) / 100}
                    />
                  </svg>

                  {/* Score text inside */}
                  <div className="text-center relative">
                    <span className="text-4xl font-extrabold tracking-tighter text-white font-display block">
                      {totalScore}
                    </span>
                    <span className="text-[9px] uppercase font-extrabold tracking-wider text-indigo-300 block">
                      {totalScore >= 90 ? 'Excellent' : totalScore >= 80 ? 'Cooperative' : 'Starter'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section: P2P Connector Badges */}
          <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm">
            <h4 className="font-display font-bold text-base text-gray-900">Decentralized Trust Connectors</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Verify your web presence to prove authentic creditworthiness without submitting invasive bank credentials.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              
              {/* Connector: Government ID Scan */}
              <div className="border border-gray-150 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                      <UserCheck className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      +15 Points
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-gray-800 mt-3 block">Holographic ID & Biometrics</h5>
                  <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                    Instantly verify your government identity document secure-node biometrics. Keep your details private.
                  </p>
                </div>
                
                {currentUser.identityVerified ? (
                  <div className="mt-4 flex items-center gap-x-1.5 text-xs font-bold text-emerald-600">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Government ID Verified</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setActiveModal('id');
                      setIdFileUploaded(false);
                      setIdScanStep('upload');
                    }}
                    className="mt-4 w-full py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer text-center"
                  >
                    Start Manual Scan
                  </button>
                )}
              </div>

              {/* Connector: Twitter Link via Tweet Proof */}
              <div className="border border-gray-150 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      <Twitter className="w-5 h-5 fill-blue-500" />
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                      +8 Points
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-gray-800 mt-3 block">Twitter / X Reputation</h5>
                  <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                    Verify ownership of your public Twitter account by publishing a cryptographically signed cryptographic post.
                  </p>
                </div>
                
                {currentUser.socialsConnected.twitter ? (
                  <div className="mt-4 flex items-center gap-x-1.5 text-xs font-bold text-blue-600">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Connected {currentUser.socialsConnected.twitter}</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => setActiveModal('twitter')}
                    className="mt-4 w-full py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer text-center"
                  >
                    Verify via Tweet-Proof
                  </button>
                )}
              </div>

              {/* Connector: GitHub Developer Link */}
              <div className="border border-gray-150 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                      <Github className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
                      +10 Points
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-gray-800 mt-3 block">GitHub Profile & SSH Proof</h5>
                  <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                    Link your active developer repository by authorizing with an SSH key or manual signature.
                  </p>
                </div>
                
                {currentUser.socialsConnected.github ? (
                  <div className="mt-4 flex items-center gap-x-1.5 text-xs font-bold text-purple-600">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>Linked as @{currentUser.socialsConnected.github}</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => setActiveModal('github')}
                    className="mt-4 w-full py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer text-center"
                  >
                    Authenticate GitHub Node
                  </button>
                )}
              </div>

              {/* Connector: Phone Verification */}
              <div className="border border-gray-150 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                      <Smartphone className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                      +7 Points
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-gray-800 mt-3 block">Direct Mobile SMS Link</h5>
                  <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                    Bind your cell phone number with a secure SMS pin verification. Prevents ledger duplication.
                  </p>
                </div>
                
                {currentUser.phoneVerified ? (
                  <div className="mt-4 flex items-center gap-x-1.5 text-xs font-bold text-orange-600">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    <span>Mobile SMS Active</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setActiveModal('phone');
                      setPhoneStep('phone');
                    }}
                    className="mt-4 w-full py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer text-center"
                  >
                    Send Verification SMS
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* MODAL CONTROLLER FOR CONNECTORS */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[1002] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-gray-950/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl overflow-hidden relative z-10 max-w-sm w-full shadow-2xl flex flex-col font-sans"
            >
              
              {/* MODAL TYPE: TWITTER VERIFIER */}
              {activeModal === 'twitter' && (
                <form onSubmit={handleVerifyTwitter}>
                  <div className="bg-blue-600 text-white p-5 flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                      <Twitter className="w-5 h-5 fill-white" />
                      <div>
                        <h4 className="font-bold text-sm text-white">Manual Twitter Verifier</h4>
                        <p className="text-[10px] text-blue-200">Prove identity via signed Tweet-Proof</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setActiveModal(null)}
                      className="text-blue-100 hover:text-white p-1 rounded-lg hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase">1. Copy Verification Statement</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex justify-between items-center">
                        <span className="font-mono text-[10px] text-gray-700 leading-tight">
                          "Verifying my self-custodial credit profile on @FairLink: 0x{currentUser.email.slice(0, 4)}...PROOF"
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(`Verifying my self-custodial credit profile on @FairLink: 0x${currentUser.email.slice(0, 4).toUpperCase()}PROOF`);
                            setTweetCopied(true);
                            setTimeout(() => setTweetCopied(false), 2000);
                          }}
                          className="text-xs font-bold text-blue-600 border border-blue-200 px-2 py-1 bg-white rounded-lg hover:bg-blue-50 cursor-pointer"
                        >
                          {tweetCopied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase">2. Your Twitter Handle</label>
                      <input
                        type="text"
                        required
                        value={twitterHandle}
                        onChange={(e) => setTwitterHandle(e.target.value)}
                        placeholder="e.g. @jamie_d_ledger"
                        className="w-full bg-gray-50 border border-gray-250 rounded-xl px-3 py-2 text-xs focus:outline-none text-gray-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase">3. Published Status URL</label>
                      <input
                        type="url"
                        required
                        value={tweetStatusUrl}
                        onChange={(e) => setTweetStatusUrl(e.target.value)}
                        placeholder="e.g. https://x.com/username/status/123..."
                        className="w-full bg-gray-50 border border-gray-250 rounded-xl px-3 py-2 text-xs focus:outline-none text-gray-800"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isTwitterVerifying}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-x-2 transition-all cursor-pointer shadow-md"
                    >
                      {isTwitterVerifying ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-blue-200" />
                          <span>Verifying tweet on-chain...</span>
                        </>
                      ) : (
                        <span>Verify & Bind Account</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* MODAL TYPE: GITHUB VERIFIER */}
              {activeModal === 'github' && (
                <form onSubmit={handleVerifyGithub}>
                  <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                      <Github className="w-5 h-5 text-white" />
                      <div>
                        <h4 className="font-bold text-sm text-white">Manual SSH Developer Link</h4>
                        <p className="text-[10px] text-slate-300">Link developer profile self-custodially</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setActiveModal(null)}
                      className="text-slate-400 hover:text-white p-1 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase">GitHub Username</label>
                      <input
                        type="text"
                        required
                        value={githubUsername}
                        onChange={(e) => setGithubUsername(e.target.value)}
                        placeholder="e.g. jamiedev-ledger"
                        className="w-full bg-gray-50 border border-gray-250 rounded-xl px-3 py-2 text-xs focus:outline-none text-gray-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase">1. Add SSH Key Verification Comment</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex justify-between items-center">
                        <span className="font-mono text-[9px] text-gray-700 leading-tight">
                          "ssh-rsa AAAAB3NzaC1yc2EAA... fairlink-node-id-{currentUser.email.split('@')[0]}"
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(`ssh-rsa AAAAB3NzaC1yc2EAA fairlink-node-id-${currentUser.email.split('@')[0]}`);
                            setSshCopied(true);
                            setTimeout(() => setSshCopied(false), 2000);
                          }}
                          className="text-xs font-bold text-slate-700 border border-gray-200 px-2 py-1 bg-white rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          {sshCopied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <span className="text-[9px] text-gray-400 leading-none">Add this public challenge to your GitHub user key profile.</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isGithubVerifying}
                      className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-x-2 transition-all cursor-pointer shadow-md"
                    >
                      {isGithubVerifying ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
                          <span>Polling GitHub keys...</span>
                        </>
                      ) : (
                        <span>Verify Public SSH Registry</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* MODAL TYPE: ID VERIFICATION */}
              {activeModal === 'id' && (
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="flex items-center gap-x-2">
                      <UserCheck className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-bold text-sm text-gray-900">Government ID Manual Scanner</h4>
                    </div>
                    <button 
                      onClick={() => setActiveModal(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {idScanStep === 'upload' && (
                    <div className="space-y-4 text-center">
                      <p className="text-xs text-gray-500 text-left">
                        Upload a front scan of your Driver's License or Government Passport. Our automated local client verifies holographic stamps without storing personal files.
                      </p>

                      <div 
                        onClick={() => setIdFileUploaded(true)}
                        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                          idFileUploaded ? 'border-emerald-500 bg-emerald-50/20' : 'border-gray-200 hover:border-indigo-500'
                        }`}
                      >
                        {idFileUploaded ? (
                          <>
                            <CheckCircle className="w-10 h-10 text-emerald-500 animate-bounce" />
                            <span className="text-xs font-bold text-emerald-800 mt-2">ID_FRONT_PROOF_ACCEPTED.PNG</span>
                            <span className="text-[9px] text-gray-400 mt-0.5">Click to replace</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-gray-400" />
                            <span className="text-xs font-bold text-gray-700 mt-2">Drag or upload document front</span>
                            <span className="text-[9px] text-gray-400 mt-0.5">JPEG, PNG, or PDF up to 10MB</span>
                          </>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={!idFileUploaded}
                        onClick={handleStartBiometrics}
                        className={`w-full py-3 font-bold rounded-xl text-xs flex items-center justify-center gap-x-2 shadow-sm ${
                          idFileUploaded ? 'bg-gray-900 hover:bg-black text-white cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <ScanFace className="w-4 h-4" />
                        <span>Continue to Face Geometry Scan</span>
                      </button>
                    </div>
                  )}

                  {idScanStep === 'biometrics' && (
                    <div className="text-center space-y-4">
                      <div className="relative w-28 h-28 mx-auto rounded-full border-4 border-indigo-500/20 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
                        <ScanFace className="w-14 h-14 text-indigo-600 animate-pulse" />
                        {/* Scan laser line */}
                        <div className="absolute left-0 right-0 h-0.5 bg-indigo-500 opacity-60 animate-bounce top-1/2"></div>
                      </div>

                      <div>
                        <h5 className="font-bold text-xs text-gray-800">Biometrics Face Verification Active</h5>
                        <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                          Checking match with photographic ID holographic seal... Keep your head still inside the browser viewer.
                        </p>
                      </div>

                      <div className="flex justify-center items-center gap-x-1.5 text-[10px] text-indigo-700 font-mono">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>COMPUTING MATCH INDEX...</span>
                      </div>
                    </div>
                  )}

                  {idScanStep === 'success' && (
                    <div className="text-center space-y-4 py-3">
                      <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                        <CheckCircle className="w-7 h-7" />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-gray-900">Biometrics & ID Match Confirmed</h5>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          Holographic markers matched. Biometrics geometry matched with 99.8% precision. FairScore upgraded.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Back to Profile
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* MODAL TYPE: PHONE LINK */}
              {activeModal === 'phone' && (
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="flex items-center gap-x-2">
                      <Smartphone className="w-5 h-5 text-orange-600" />
                      <h4 className="font-bold text-sm text-gray-900">SMS Mobile Connector</h4>
                    </div>
                    <button 
                      onClick={() => setActiveModal(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {phoneStep === 'phone' && (
                    <div className="space-y-4">
                      <p className="text-xs text-gray-500">
                        Enter your mobile number to authorize your cooperative node key. Standard carrier charges apply.
                      </p>

                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase">Mobile Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d+ ]/g, ''))}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-gray-50 border border-gray-250 rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        disabled={phoneNumber.length < 7}
                        onClick={() => {
                          setIsPhoneVerifying(true);
                          setTimeout(() => {
                            setIsPhoneVerifying(false);
                            setPhoneStep('otp');
                          }, 1200);
                        }}
                        className={`w-full py-3 font-bold rounded-xl text-xs flex items-center justify-center gap-x-2 shadow-sm ${
                          phoneNumber.length >= 7 ? 'bg-gray-900 hover:bg-black text-white cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isPhoneVerifying ? <RefreshCw className="w-4 h-4 animate-spin text-gray-400" /> : null}
                        <span>Request Verification SMS Code</span>
                      </button>
                    </div>
                  )}

                  {phoneStep === 'otp' && (
                    <div className="space-y-4 text-center">
                      <div className="bg-orange-50 border border-orange-100 p-2.5 rounded-xl">
                        <span className="text-[9px] text-orange-800 uppercase font-bold">Verification Simulator SMS</span>
                        <p className="text-xs text-orange-700 font-semibold mt-0.5">Your verification code is <strong className="font-mono text-orange-950 text-sm">3399</strong></p>
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase block text-center">Enter Code</label>
                        <input
                          type="text"
                          required
                          maxLength={4}
                          value={phoneOtp}
                          onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ''))}
                          placeholder="3399"
                          className="w-24 mx-auto text-center font-mono font-bold text-lg bg-gray-50 border border-gray-250 rounded-xl px-3 py-2 text-gray-800 focus:outline-none block"
                        />
                      </div>

                      <button
                        type="button"
                        disabled={phoneOtp !== '3399'}
                        onClick={handleVerifyPhone}
                        className={`w-full py-3 font-bold rounded-xl text-xs flex items-center justify-center gap-x-2 shadow-sm ${
                          phoneOtp === '3399' ? 'bg-orange-600 hover:bg-orange-700 text-white cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isPhoneVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                        <span>Confirm Security Code</span>
                      </button>
                    </div>
                  )}

                  {phoneStep === 'success' && (
                    <div className="text-center space-y-4 py-3">
                      <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                        <CheckCircle className="w-7 h-7" />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-gray-900">Mobile SMS Linked</h5>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          Your phone was successfully validated. Safe cryptographic multi-ledger binding active.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Back to Profile
                      </button>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
