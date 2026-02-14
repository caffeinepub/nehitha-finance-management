import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Loan {
    id: string;
    status: LoanStatus;
    principalRemaining: number;
    totalInterest: number;
    termMonths: bigint;
    paidEmis: bigint;
    interestRate: number;
    emiAmount: number;
    balanceDue: number;
    customerId: string;
    amount: number;
    emiSchedule: Array<EMI>;
    startDate: bigint;
}
export interface EMI {
    balanceAfterPayment: number;
    paid: boolean;
    dueDate: bigint;
    paidDate?: bigint;
    amount: number;
}
export interface Customer {
    pan: string;
    referral: string;
    name: string;
    address: string;
    mobile: string;
    aadhar: string;
    remarks: string;
}
export interface UserProfile {
    name: string;
}
export enum LoanStatus {
    closed = "closed",
    active = "active",
    delinquent = "delinquent"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCustomer(name: string, mobile: string, aadhar: string, pan: string, referral: string, address: string, remarks: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    closeLoan(loanId: string): Promise<void>;
    createLoan(customerId: string, amount: number, interestRate: number, termMonths: bigint): Promise<string>;
    getAllCustomers(): Promise<Array<Customer>>;
    getBalanceDue(loanId: string): Promise<number>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomer(name: string): Promise<Customer | null>;
    getLoan(loanId: string): Promise<Loan | null>;
    getLoanStatus(loanId: string): Promise<LoanStatus>;
    getLoansForCustomer(customerId: string): Promise<Array<Loan>>;
    getRemainingEmis(loanId: string): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordPayment(loanId: string, paidDate: bigint): Promise<void>;
    requestCustomer(name: string, message: string): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
