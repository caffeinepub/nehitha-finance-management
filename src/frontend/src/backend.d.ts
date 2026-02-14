import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCustomer(name: string, mobile: string, aadhar: string, pan: string, referral: string, address: string, remarks: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllCustomers(): Promise<Array<Customer>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomer(name: string): Promise<Customer | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    requestCustomer(name: string, message: string): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
