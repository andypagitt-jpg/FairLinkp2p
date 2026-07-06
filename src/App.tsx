import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingView from './components/LandingView';
import MarketplaceView from './components/MarketplaceView';
import BorrowView from './components/BorrowView';
import PortfolioView from './components/PortfolioView';
import WalletView from './components/WalletView';
import EarningsView from './components/EarningsView';
import EscrowDisputeView from './components/EscrowDisputeView';
import ProfileView from './components/ProfileView';
import { LoanRequest, MyFundedLoan, Transaction, PlatformEarningLog, EscrowRecord, DisputeRecord } from './types';
import { Bell, Info, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('landing');

  // Core App States (loaded from localStorage if present, else empty/ready for use)
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>(() => {
    const saved = localStorage.getItem('fairlink_loan_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [myFundedLoans, setMyFundedLoans] = useState<MyFundedLoan[]>(() => {
    const saved = localStorage.getItem('fairlink_my_funded_loans');
    return saved ? JSON.parse(saved) : [];
  });

  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('fairlink_wallet_balance');
    return saved ? Number(saved) : 0;
  });

  const [fairScore, setFairScore] = useState<number>(() => {
    const saved = localStorage.getItem('fairlink_fair_score');
    return saved ? Number(saved) : 75; // base score for active peer nodes
  });

  const [platformRevenue, setPlatformRevenue] = useState<number>(() => {
    const saved = localStorage.getItem('fairlink_platform_revenue');
    return saved ? Number(saved) : 0;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fairlink_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [earningLogs, setEarningLogs] = useState<PlatformEarningLog[]>(() => {
    const saved = localStorage.getItem('fairlink_earning_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [escrowRecords, setEscrowRecords] = useState<EscrowRecord[]>(() => {
    const saved = localStorage.getItem('fairlink_escrow_records');
    return saved ? JSON.parse(saved) : [];
  });

  const [disputeRecords, setDisputeRecords] = useState<DisputeRecord[]>(() => {
    const saved = localStorage.getItem('fairlink_dispute_records');
    return saved ? JSON.parse(saved) : [];
  });

  // Active Signed-In User State (Simulated Google Auth)
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    avatar: string;
    isVerified: boolean;
    fairScoreBoost: number;
    phoneVerified: boolean;
    identityVerified: boolean;
    socialsConnected: { twitter?: string; github?: string };
    bio?: string;
  } | null>(() => {
    const saved = localStorage.getItem('fairlink_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Sync current user state and reactive FairScore calculation
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('fairlink_current_user', JSON.stringify(currentUser));
      setFairScore(75 + currentUser.fairScoreBoost);
    } else {
      localStorage.removeItem('fairlink_current_user');
      setFairScore(75); // base score
    }
  }, [currentUser]);

  // Custom Theme State
  const [theme, setTheme] = useState<'white' | 'babyblue' | 'dark'>(() => {
    const saved = localStorage.getItem('fairlink_theme');
    return (saved as 'white' | 'babyblue' | 'dark') || 'babyblue';
  });

  useEffect(() => {
    localStorage.setItem('fairlink_theme', theme);
  }, [theme]);

  // Custom Toast State
  const [toast, setToast] = useState<{ id: string; message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    localStorage.setItem('fairlink_loan_requests', JSON.stringify(loanRequests));
  }, [loanRequests]);

  useEffect(() => {
    localStorage.setItem('fairlink_my_funded_loans', JSON.stringify(myFundedLoans));
  }, [myFundedLoans]);

  useEffect(() => {
    localStorage.setItem('fairlink_wallet_balance', String(walletBalance));
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem('fairlink_fair_score', String(fairScore));
  }, [fairScore]);

  useEffect(() => {
    localStorage.setItem('fairlink_platform_revenue', String(platformRevenue));
  }, [platformRevenue]);

  useEffect(() => {
    localStorage.setItem('fairlink_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fairlink_earning_logs', JSON.stringify(earningLogs));
  }, [earningLogs]);

  useEffect(() => {
    localStorage.setItem('fairlink_escrow_records', JSON.stringify(escrowRecords));
  }, [escrowRecords]);

  useEffect(() => {
    localStorage.setItem('fairlink_dispute_records', JSON.stringify(disputeRecords));
  }, [disputeRecords]);

  // Helper to trigger custom visual toasts
  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
  };

  // Close toast automatically
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 1. ACTION: Fund a Loan Request
  const handleFundLoan = (id: string) => {
    const request = loanRequests.find((r) => r.id === id);
    if (!request || request.funded) return;

    if (walletBalance < request.amount) {
      triggerToast('Insufficient funds in your wallet to fund this request.', 'error');
      return;
    }

    // Deduct principal
    const nextWalletBalance = walletBalance - request.amount;
    setWalletBalance(nextWalletBalance);

    // Calculate platform service fee
    const platformFee = Math.max(2, Math.round(request.amount * 0.015));
    setPlatformRevenue((prev) => prev + platformFee);

    // Create Earning Log
    const newLog: PlatformEarningLog = {
      id: `log-${Date.now()}`,
      loanId: id,
      loanAmount: request.amount,
      feeAmount: platformFee,
      date: new Date().toLocaleDateString(),
      borrowerName: request.borrower,
    };
    setEarningLogs((prev) => [newLog, ...prev]);

    // Create My Funded Loan item
    const expectedRepay = request.amount + Math.round((request.amount * request.tipPercent) / 100);
    const newFunded: MyFundedLoan = {
      ...request,
      fundedDate: new Date().toLocaleDateString(),
      expectedRepay,
      status: 'active',
      funded: true,
    };
    setMyFundedLoans((prev) => [newFunded, ...prev]);

    // Update main marketplace listing
    setLoanRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, funded: true, status: 'funded' } : r))
    );

    // Create Escrow Record
    const newEscrow: EscrowRecord = {
      id: `escrow-${Date.now()}`,
      loanId: id,
      lender: 'You (Jamie D.)',
      borrower: request.borrower,
      amount: request.amount,
      tipAmount: Math.round((request.amount * request.tipPercent) / 100),
      status: 'held',
      lockedDate: new Date().toLocaleDateString(),
      releaseCriteria: `Successful repayment of $${expectedRepay} (principal + tip) on or before ${request.dueDays} days maturity window.`,
      contractHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    };
    setEscrowRecords((prev) => [newEscrow, ...prev]);

    // Record Transaction
    const newTx: Transaction = {
      id: `tx-fund-${Date.now()}`,
      type: 'fund_loan',
      amount: request.amount,
      date: new Date().toLocaleDateString(),
      description: `Funded contract for ${request.borrower}`,
    };

    const lockTx: Transaction = {
      id: `tx-escrow-lock-${Date.now()}`,
      type: 'escrow_lock',
      amount: request.amount,
      date: new Date().toLocaleDateString(),
      description: `Cryptographic Escrow lock initiated for contract #${id}`,
    };

    setTransactions((prev) => [lockTx, newTx, ...prev]);

    triggerToast(`Successfully funded $${request.amount} to ${request.borrower}! Principal locked in escrow.`, 'success');
  };

  // 2. ACTION: Post a Borrow Request
  const handlePostRequest = (amount: number, reason: string, dueDays: number, tipPercent: number) => {
    const newRequest: LoanRequest = {
      id: `loan-user-${Date.now()}`,
      borrower: 'You (Jamie D.)',
      amount,
      tipPercent,
      dueDays,
      reason,
      fairScore, // uses user's active score
      status: 'active',
      funded: false,
      isMine: true,
    };

    setLoanRequests((prev) => [newRequest, ...prev]);
    setCurrentTab('marketplace'); // shift tab to marketplace to see it live
    triggerToast(`Your request for $${amount} has been listed in the marketplace!`, 'success');
  };

  // Reset all simulated data for fresh live info
  const handleResetAllData = () => {
    setLoanRequests([]);
    setMyFundedLoans([]);
    setWalletBalance(0);
    setPlatformRevenue(0);
    setTransactions([]);
    setEarningLogs([]);
    setEscrowRecords([]);
    setDisputeRecords([]);
    
    localStorage.removeItem('fairlink_loan_requests');
    localStorage.removeItem('fairlink_my_funded_loans');
    localStorage.removeItem('fairlink_wallet_balance');
    localStorage.removeItem('fairlink_platform_revenue');
    localStorage.removeItem('fairlink_transactions');
    localStorage.removeItem('fairlink_earning_logs');
    localStorage.removeItem('fairlink_escrow_records');
    localStorage.removeItem('fairlink_dispute_records');
    
    triggerToast('All simulated demo data has been cleared! Ready for live information.', 'success');
  };

  // 2.5. ACTION: Update an existing borrow request (e.g., after tip rebuttal negotiation)
  const handleUpdateLoanRequest = (updated: LoanRequest) => {
    setLoanRequests((prev) => prev.map((r) => r.id === updated.id ? updated : r));
  };

  // 3. ACTION: Simulate Repayment (Lender side & Borrower side)
  const handleSimulateRepayment = (loanId: string) => {
    // Check if it's a loan funded by me (Lender perspective)
    const fundedLoan = myFundedLoans.find((l) => l.id === loanId);
    if (fundedLoan) {
      if (fundedLoan.status === 'repaid') return;

      const totalReturn = fundedLoan.expectedRepay;
      setWalletBalance((prev) => prev + totalReturn);

      // Release escrow
      setEscrowRecords((prev) =>
        prev.map((e) => (e.loanId === loanId ? { ...e, status: 'released' } : e))
      );

      // Record transaction
      const newTx: Transaction = {
        id: `tx-repay-recv-${Date.now()}`,
        type: 'repayment_received',
        amount: totalReturn,
        date: new Date().toLocaleDateString(),
        description: `Repayment received from ${fundedLoan.borrower}`,
      };

      const escrowReleaseTx: Transaction = {
        id: `tx-escrow-rel-${Date.now()}`,
        type: 'escrow_release',
        amount: fundedLoan.amount,
        date: new Date().toLocaleDateString(),
        description: `Escrow released for contract #${loanId}. Funds sent to lender.`,
      };

      setTransactions((prev) => [escrowReleaseTx, newTx, ...prev]);

      // Boost user's FairScore for successful lending operations
      setFairScore((prev) => Math.min(99, prev + 3));

      // Mark as repaid
      setMyFundedLoans((prev) =>
        prev.map((l) =>
          l.id === loanId
            ? { ...l, status: 'repaid', repaidDate: new Date().toLocaleDateString() }
            : l
        )
      );

      triggerToast(`Repayment received! Collected $${totalReturn} principal + gratitude tips.`, 'success');
      return;
    }

    // Check if it's a loan I borrowed (Borrower perspective)
    const myRequest = loanRequests.find((r) => r.id === loanId);
    if (myRequest && myRequest.isMine) {
      if (myRequest.status === 'repaid') return;

      const totalDeduction = myRequest.amount + Math.round((myRequest.amount * myRequest.tipPercent) / 100);
      if (walletBalance < totalDeduction) {
        triggerToast(`Insufficient balance in wallet to repay $${totalDeduction} loan principal and tip. Add funds first!`, 'error');
        return;
      }

      setWalletBalance((prev) => prev - totalDeduction);

      // Release escrow
      setEscrowRecords((prev) =>
        prev.map((e) => (e.loanId === loanId ? { ...e, status: 'released' } : e))
      );

      // Record transaction
      const newTx: Transaction = {
        id: `tx-repay-sent-${Date.now()}`,
        type: 'repay_loan_principal',
        amount: totalDeduction,
        date: new Date().toLocaleDateString(),
        description: `Repaid $${totalDeduction} loan principal & gratitude tip back to community`,
      };

      const escrowReleaseTx: Transaction = {
        id: `tx-escrow-rel-${Date.now()}`,
        type: 'escrow_release',
        amount: myRequest.amount,
        date: new Date().toLocaleDateString(),
        description: `Escrow released for contract #${loanId}. Repayment logged.`,
      };

      setTransactions((prev) => [escrowReleaseTx, newTx, ...prev]);

      // Boost user's FairScore for honest repayment behavior!
      setFairScore((prev) => Math.min(99, prev + 4));

      // Update status
      setLoanRequests((prev) =>
        prev.map((r) => (r.id === loanId ? { ...r, status: 'repaid' } : r))
      );

      triggerToast(`Loan repaid successfully! Your FairScore is now ${Math.min(99, fairScore + 4)}.`, 'success');
    }
  };

  // 4. ACTION: Simulate someone funding my borrow request
  const handleSimulateReceiveFunding = (requestId: string) => {
    const req = loanRequests.find((r) => r.id === requestId);
    if (!req || req.funded) return;

    // Add cash to wallet
    setWalletBalance((prev) => prev + req.amount);

    // Create Escrow Record
    const newEscrow: EscrowRecord = {
      id: `escrow-${Date.now()}`,
      loanId: requestId,
      lender: 'Alice V. (Cooperative)',
      borrower: 'You (Jamie D.)',
      amount: req.amount,
      tipAmount: Math.round((req.amount * req.tipPercent) / 100),
      status: 'held',
      lockedDate: new Date().toLocaleDateString(),
      releaseCriteria: `Successful repayment of $${req.amount + Math.round((req.amount * req.tipPercent) / 100)} on or before ${req.dueDays} days maturity window.`,
      contractHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    };
    setEscrowRecords((prev) => [newEscrow, ...prev]);

    // Update statuses
    setLoanRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, funded: true, status: 'funded' } : r))
    );

    // Add transaction log
    const newTx: Transaction = {
      id: `tx-payout-${Date.now()}`,
      type: 'post_loan_payout',
      amount: req.amount,
      date: new Date().toLocaleDateString(),
      description: `Your request for $${req.amount} was funded by a community lender!`,
    };

    const lockTx: Transaction = {
      id: `tx-escrow-lock-${Date.now()}`,
      type: 'escrow_lock',
      amount: req.amount,
      date: new Date().toLocaleDateString(),
      description: `Cryptographic Escrow lock initiated for contract #${requestId}`,
    };

    setTransactions((prev) => [lockTx, newTx, ...prev]);

    triggerToast(`Congratulations! A community lender just funded your $${req.amount} request.`, 'success');
  };

  // 5. ACTION: Add verified funds via linked bank or card
  const handleAddFunds = (amount: number = 500, description: string = 'Verified Bank Deposit (ACH)') => {
    setWalletBalance((prev) => prev + amount);

    const newTx: Transaction = {
      id: `tx-dep-${Date.now()}`,
      type: 'deposit',
      amount: amount,
      date: new Date().toLocaleDateString(),
      description: description,
      verificationStatus: 'confirmed', // cleared and active instantly!
      verificationType: 'manual_ach'
    };
    setTransactions((prev) => [newTx, ...prev]);

    triggerToast(`Successfully settled $${amount.toLocaleString()} deposit via ${description}.`, 'success');
  };

  // 5.5. ACTION: Clear and authorize pending wallet transactions (Confirm/Deny)
  const handleVerifyTransaction = (txId: string, status: 'confirmed' | 'denied') => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return;

    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, verificationStatus: status } : t))
    );

    if (status === 'denied') {
      if (tx.type === 'deposit') {
        setWalletBalance((prev) => Math.max(0, prev - tx.amount));
        triggerToast(`Transaction rejected. $${tx.amount.toLocaleString()} deposit has been reversed.`, 'error');
      } else {
        triggerToast(`Transaction #${txId} set as Denied & Voided.`, 'info');
      }
    } else {
      triggerToast(`Transaction #${txId} verified & permanently cleared on ledger!`, 'success');
    }
  };

  // 6. ACTION: Platform Earnings Payout
  const handlePayout = () => {
    setPlatformRevenue(0);
    // Payout creates zero transactions on the user's peer wallet, as it goes to their linked bank account.
    // That keeps peer ledger clean!
  };

  // 7. ACTION: Initiate a Dispute on Escrow
  const handleInitiateDispute = (escrowId: string, reason: string, desc: string) => {
    const escrow = escrowRecords.find(e => e.id === escrowId);
    if (!escrow) return;

    // Update escrow record status
    setEscrowRecords((prev) =>
      prev.map((e) => (e.id === escrowId ? { ...e, status: 'disputed' } : e))
    );

    // Update original loan status to disputed
    setLoanRequests((prev) =>
      prev.map((r) => (r.id === escrow.loanId ? { ...r, status: 'disputed' } : r))
    );

    // Also update funded loan status if applicable
    setMyFundedLoans((prev) =>
      prev.map((l) => (l.id === escrow.loanId ? { ...l, status: 'disputed' } : l))
    );

    // Create dispute case with dynamic initiator
    const initiatorName = currentUser ? `${currentUser.name} (${currentUser.email})` : 'Jamie D. (Guest)';
    const newDispute: DisputeRecord = {
      id: `dispute-${Date.now()}`,
      escrowId,
      loanId: escrow.loanId,
      initiator: initiatorName,
      reason,
      description: desc,
      evidence: `witness_proof_0x${Math.random().toString(16).substr(2, 10)}_receipt`,
      juryVotesLender: 1,
      juryVotesBorrower: 0,
      status: 'open',
      createdDate: new Date().toLocaleDateString(),
    };
    setDisputeRecords((prev) => [newDispute, ...prev]);

    // Notify the creator email
    triggerToast(`Dispute opened! Escrow frozen. Notification dispatch sent to creator Drew Pagitt (drewpagittt@gmail.com).`, 'info');
  };

  // 8. ACTION: Vote on a Dispute as Juror
  const handleVoteDispute = (disputeId: string, voteFor: 'lender' | 'borrower') => {
    setDisputeRecords((prev) =>
      prev.map((d) => {
        if (d.id === disputeId) {
          return {
            ...d,
            juryVotesLender: voteFor === 'lender' ? d.juryVotesLender + 1 : d.juryVotesLender,
            juryVotesBorrower: voteFor === 'borrower' ? d.juryVotesBorrower + 1 : d.juryVotesBorrower,
          };
        }
        return d;
      })
    );
    triggerToast('Your community juror vote has been recorded on-chain!', 'success');
  };

  // 9. ACTION: Resolve a Dispute with Mediator Authority
  const handleResolveDispute = (disputeId: string, resolution: 'resolved_to_lender' | 'resolved_to_borrower' | 'dismissed') => {
    const dispute = disputeRecords.find(d => d.id === disputeId);
    if (!dispute) return;

    const escrow = escrowRecords.find(e => e.id === dispute.escrowId);
    if (!escrow) return;

    // Enforce creator transaction verification check for escrow payouts
    const originalTx = transactions.find(
      (tx) => tx.description.includes(escrow.loanId) || tx.id.includes(escrow.loanId)
    );
    if (originalTx && originalTx.verificationStatus !== 'confirmed') {
      triggerToast('Security Block: Dispute cannot be settled until the original funding transaction is verified by Drew Pagitt (drewpagittt@gmail.com).', 'error');
      return;
    }

    // Update dispute status
    setDisputeRecords((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: resolution, resolvedDate: new Date().toLocaleDateString() } : d))
    );

    // Update escrow status based on resolution
    const escrowStatus = resolution === 'resolved_to_lender' ? 'refunded' : 'released';
    setEscrowRecords((prev) =>
      prev.map((e) => (e.id === dispute.escrowId ? { ...e, status: escrowStatus } : e))
    );

    // Release/Refund principal funds
    if (resolution === 'resolved_to_lender') {
      // Refund lender
      setWalletBalance((prev) => prev + escrow.amount);

      const refundTx: Transaction = {
        id: `tx-dispute-ref-${Date.now()}`,
        type: 'dispute_refund',
        amount: escrow.amount,
        date: new Date().toLocaleDateString(),
        description: `Dispute Case #${disputeId} Settle: Principal refund of $${escrow.amount} returned to lender`,
      };
      setTransactions((prev) => [refundTx, ...prev]);

      setLoanRequests((prev) =>
        prev.map((r) => (r.id === escrow.loanId ? { ...r, status: 'repaid' } : r))
      );
      setMyFundedLoans((prev) =>
        prev.map((l) => (l.id === escrow.loanId ? { ...l, status: 'repaid' } : l))
      );

      triggerToast(`Case Settle: Refunded $${escrow.amount} principal back to your wallet.`, 'success');
    } else if (resolution === 'resolved_to_borrower') {
      // Release principal to borrower
      const payoutTx: Transaction = {
        id: `tx-dispute-pay-${Date.now()}`,
        type: 'dispute_payout',
        amount: escrow.amount,
        date: new Date().toLocaleDateString(),
        description: `Dispute Case #${disputeId} Settle: Escrow released to borrower ${escrow.borrower}`,
      };
      setTransactions((prev) => [payoutTx, ...prev]);

      setLoanRequests((prev) =>
        prev.map((r) => (r.id === escrow.loanId ? { ...r, status: 'repaid' } : r))
      );
      setMyFundedLoans((prev) =>
        prev.map((l) => (l.id === escrow.loanId ? { ...l, status: 'repaid' } : l))
      );

      triggerToast(`Case Settle: Released $${escrow.amount} principal securely to the borrower.`, 'success');
    } else {
      // Dismissed
      triggerToast('Case Dismissed. Original contract terms remain active.', 'info');
    }
  };

  // 10. ACTION: Simulate Escrow Timeout warning
  const handleSimulateEscrowTimeout = (escrowId: string) => {
    const escrow = escrowRecords.find(e => e.id === escrowId);
    if (!escrow) return;

    // Deduct a tiny FairScore penalty if it's user's debt
    if (escrow.borrower.includes('Jamie') || escrow.borrower.includes('You')) {
      setFairScore((prev) => Math.max(35, prev - 2));
    }

    triggerToast(`Late warning notification dispatched to ${escrow.borrower}. FairScore adjusted!`, 'info');
  };

  // Helper derivations
  const totalLent = myFundedLoans
    .filter((l) => l.status === 'active')
    .reduce((sum, current) => sum + current.amount, 0);

  const expectedTips = myFundedLoans
    .filter((l) => l.status === 'active')
    .reduce((sum, current) => sum + (current.expectedRepay - current.amount), 0);

  // Derives featured request on landing page dynamically (finds the highest tip percent or defaults)
  const sortedRequests = [...loanRequests].filter((r) => !r.funded);
  const featuredRequest =
    sortedRequests.length > 0
      ? {
          amount: sortedRequests[0].amount,
          days: sortedRequests[0].dueDays,
          score: sortedRequests[0].fairScore,
          repaidCount: 12, // mock statistic
          reason: sortedRequests[0].reason,
          tip: sortedRequests[0].tipPercent,
        }
      : {
          amount: 420,
          days: 8,
          score: 87,
          repaidCount: 12,
          reason: 'Need help with car repair so I can get to work this week.',
          tip: 12,
        };



  const bgClasses = {
    white: 'bg-slate-50 text-gray-900',
    babyblue: 'bg-[#edf5fd] text-slate-900',
    dark: 'bg-[#090D16] text-gray-100',
  };

  return (
    <div className={`min-h-screen ${bgClasses[theme]} flex flex-col font-sans transition-colors duration-300`}>
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        fairScore={fairScore} 
        theme={theme} 
        setTheme={setTheme} 
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          triggerToast('Session closed securely.', 'info');
          setCurrentTab('landing');
        }}
      />

      {/* DYNAMIC CREATOR DISPUTE ALERTS SYSTEM */}
      {disputeRecords.some(d => d.status === 'open') && (
        <div className="bg-rose-600 text-white py-2.5 px-4 text-xs font-bold flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-rose-700 shadow-lg relative z-[45]">
          <div className="flex items-center gap-x-2.5">
            <ShieldAlert className="w-4 h-4 text-white animate-pulse shrink-0" />
            <span className="bg-white/20 text-white text-[9px] px-2 py-0.5 rounded-full font-black tracking-wider uppercase shrink-0">DISPUTE ACTIVE</span>
            <p className="leading-relaxed">
              {currentUser?.email === 'drewpagittt@gmail.com' ? (
                <span><strong>Drew Pagitt</strong>, there are active dispute cases on the ledger. You must verify the original lock transactions in your Portfolio tab to authorize payouts.</span>
              ) : (
                <span>Attention Peer Members: An active dispute is in progress. Ledger escrow funds are frozen awaiting creator (Drew Pagitt) verification.</span>
              )}
            </p>
          </div>
          <button 
            onClick={() => setCurrentTab('portfolio')} 
            className="bg-white text-rose-700 hover:bg-rose-50 px-3.5 py-1.5 rounded-xl text-[10px] font-black transition-all shrink-0 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
          >
            Review Disputed Ledger &rarr;
          </button>
        </div>
      )}

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentTab === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LandingView 
                setCurrentTab={setCurrentTab} 
                featuredRequest={featuredRequest} 
                currentUser={currentUser}
                onLogin={(user) => {
                  setCurrentUser(user);
                  triggerToast('Logged in securely with Google Account.', 'success');
                }}
              />
            </motion.div>
          )}

          {currentTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ProfileView
                currentUser={currentUser}
                onLogout={() => {
                  setCurrentUser(null);
                  triggerToast('Session closed securely.', 'info');
                  setCurrentTab('landing');
                }}
                onUpdateUser={(updated) => {
                  setCurrentUser(updated);
                  triggerToast('Individualized trust credentials updated!', 'success');
                }}
                onLogin={(user) => {
                  setCurrentUser(user);
                  triggerToast('Logged in securely with Google Account.', 'success');
                }}
                onResetAllData={handleResetAllData}
                fairScore={fairScore}
                theme={theme}
                borrowHistory={loanRequests.filter((r) => r.isMine)}
                lendHistory={myFundedLoans}
                transactions={transactions}
              />
            </motion.div>
          )}

          {currentTab === 'marketplace' && (
            <motion.div
              key="marketplace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MarketplaceView
                loanRequests={loanRequests}
                onFundLoan={handleFundLoan}
                walletBalance={walletBalance}
                onUpdateLoanRequest={handleUpdateLoanRequest}
              />
            </motion.div>
          )}

          {currentTab === 'borrow' && (
            <motion.div
              key="borrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <BorrowView fairScore={fairScore} onPostRequest={handlePostRequest} />
            </motion.div>
          )}

          {currentTab === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PortfolioView
                myFundedLoans={myFundedLoans}
                myBorrowRequests={loanRequests.filter((r) => r.isMine)}
                onSimulateRepayment={handleSimulateRepayment}
                onSimulateReceiveFunding={handleSimulateReceiveFunding}
                theme={theme}
                setCurrentTab={setCurrentTab}
                escrowRecords={escrowRecords}
                disputeRecords={disputeRecords}
                transactions={transactions}
                currentUser={currentUser}
                onInitiateDispute={handleInitiateDispute}
                onVoteDispute={handleVoteDispute}
                onResolveDispute={handleResolveDispute}
                onSimulateEscrowTimeout={handleSimulateEscrowTimeout}
                onVerifyTransaction={handleVerifyTransaction}
              />
            </motion.div>
          )}

          {currentTab === 'wallet' && (
            <motion.div
              key="wallet"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <WalletView
                walletBalance={walletBalance}
                totalLent={totalLent}
                expectedTips={expectedTips}
                transactions={transactions}
                onAddFunds={handleAddFunds}
                onVerifyTransaction={handleVerifyTransaction}
              />
            </motion.div>
          )}

          {currentTab === 'earnings' && (
            <motion.div
              key="earnings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EarningsView
                platformRevenue={platformRevenue}
                earningLogs={earningLogs}
                onPayout={handlePayout}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 text-center text-xs text-gray-500 font-sans mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-y-4">
          <div className="flex items-center gap-x-2">
            <span className="font-display font-black text-gray-800 text-sm">FairLink<span className="text-primary-orange">p2p.com</span></span>
            <span className="text-gray-300">|</span>
            <span>Community Short-Term Financing Ledger</span>
          </div>
          <div className="flex items-center gap-x-4">
            <span className="hover:text-gray-800 cursor-pointer">Protocol Rules</span>
            <span className="hover:text-gray-800 cursor-pointer">Security Audits</span>
            <span className="hover:text-gray-800 cursor-pointer">Terms & Fairness</span>
          </div>
        </div>
      </footer>



      {/* Floating Animated Toast Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="fixed bottom-6 right-6 z-[1000] max-w-sm w-full bg-gray-900 text-white rounded-2xl p-4 shadow-xl border border-gray-800 flex items-start gap-x-3.5"
          >
            <div className="w-8 h-8 rounded-full bg-orange-500/10 text-primary-orange flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-primary-orange" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-400 uppercase">Notification</div>
              <p className="text-sm font-medium text-gray-200 mt-0.5 leading-snug">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
