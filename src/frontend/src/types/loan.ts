// Local type definitions for loan management
// These types mirror the backend structure but are defined locally
// since the backend interface doesn't export them

export type LoanStatus = 'active' | 'closed' | 'delinquent';

export interface EMI {
  dueDate: bigint;
  amount: number;
  paid: boolean;
  paidDate: bigint | null;
  balanceAfterPayment: number;
}

export interface Loan {
  id: string;
  customerId: string;
  amount: number;
  interestRate: number;
  termMonths: bigint;
  emiAmount: number;
  startDate: bigint;
  status: LoanStatus;
  emiSchedule: EMI[];
  paidEmis: bigint;
  balanceDue: number;
  totalInterest: number;
  principalRemaining: number;
}

export interface Customer {
  name: string;
  mobile: string;
  aadhar: string;
  pan: string;
  referral: string;
  address: string;
  remarks: string;
}
