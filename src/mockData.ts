import { LoanRequest } from './types';

export const INITIAL_LOAN_REQUESTS: LoanRequest[] = [
  {
    id: 'loan-1',
    borrower: 'Maria T.',
    amount: 180,
    tipPercent: 10,
    dueDays: 5,
    reason: 'Car repair / maintenance',
    fairScore: 91,
    status: 'active',
    funded: false
  },
  {
    id: 'loan-2',
    borrower: 'James K.',
    amount: 320,
    tipPercent: 15,
    dueDays: 12,
    reason: 'Medical / dental bill',
    fairScore: 76,
    status: 'active',
    funded: false
  },
  {
    id: 'loan-3',
    borrower: 'Aisha R.',
    amount: 95,
    tipPercent: 8,
    dueDays: 4,
    reason: 'Groceries / household',
    fairScore: 95,
    status: 'active',
    funded: false
  },
  {
    id: 'loan-4',
    borrower: 'Carlos M.',
    amount: 450,
    tipPercent: 12,
    dueDays: 10,
    reason: 'Work-related expense',
    fairScore: 68,
    status: 'active',
    funded: false
  },
  {
    id: 'loan-5',
    borrower: 'Priya S.',
    amount: 210,
    tipPercent: 5,
    dueDays: 7,
    reason: 'Utility or rent assistance',
    fairScore: 88,
    status: 'active',
    funded: false
  }
];
