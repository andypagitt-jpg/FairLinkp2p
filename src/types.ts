export interface LoanRequest {
  id: string;
  borrower: string;
  amount: number;
  tipPercent: number;
  dueDays: number;
  reason: string;
  fairScore: number;
  status: 'active' | 'funded' | 'repaid' | 'escrow' | 'disputed';
  funded: boolean;
  isMine?: boolean;
  counterTipPercent?: number;
  counterStatus?: 'none' | 'pending' | 'accepted' | 'declined';
  counterProposedBy?: 'lender' | 'borrower';
}

export interface MyFundedLoan extends LoanRequest {
  fundedDate: string;
  expectedRepay: number;
  repaidDate?: string;
}

export interface EscrowRecord {
  id: string;
  loanId: string;
  lender: string;
  borrower: string;
  amount: number;
  tipAmount: number;
  status: 'held' | 'released' | 'refunded' | 'disputed';
  lockedDate: string;
  releaseCriteria: string;
  contractHash: string; // Live ledger address / hash simulation
}

export interface DisputeRecord {
  id: string;
  escrowId: string;
  loanId: string;
  initiator: string;
  reason: string;
  description: string;
  evidence: string;
  juryVotesLender: number;
  juryVotesBorrower: number;
  status: 'open' | 'resolved_to_lender' | 'resolved_to_borrower' | 'dismissed';
  createdDate: string;
  resolvedDate?: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'fund_loan' | 'repayment_received' | 'post_loan_payout' | 'repay_loan_principal' | 'escrow_lock' | 'escrow_release' | 'dispute_payout' | 'dispute_refund';
  amount: number;
  date: string;
  description: string;
  verificationStatus?: 'pending' | 'confirmed' | 'denied';
  verificationType?: 'plaid_auto' | 'manual_ach' | 'internal_consensus';
}

export interface PlatformEarningLog {
  id: string;
  loanId: string;
  loanAmount: number;
  feeAmount: number;
  date: string;
  borrowerName: string;
}

