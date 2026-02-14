import { normalizeEmail, isAuthorizedAdminEmail } from '../utils/email';

const ADMIN_EMAIL_KEY = 'nehitha_admin_email';
const CUSTOMER_EMAIL_KEY = 'nehitha_customer_email';

// Admin session management
export function setAdminEmail(email: string): void {
  const normalized = normalizeEmail(email);
  sessionStorage.setItem(ADMIN_EMAIL_KEY, normalized);
}

export function getAdminEmail(): string | null {
  return sessionStorage.getItem(ADMIN_EMAIL_KEY);
}

export function getNormalizedAdminEmail(): string | null {
  const email = getAdminEmail();
  return email ? normalizeEmail(email) : null;
}

export function isAdminAuthorized(): boolean {
  const email = getAdminEmail();
  return email ? isAuthorizedAdminEmail(email) : false;
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(ADMIN_EMAIL_KEY);
}

export function isAdminSessionActive(): boolean {
  return !!getAdminEmail();
}

// Customer session management
export function setCustomerEmail(email: string): void {
  sessionStorage.setItem(CUSTOMER_EMAIL_KEY, email);
}

export function getCustomerEmail(): string | null {
  return sessionStorage.getItem(CUSTOMER_EMAIL_KEY);
}

export function clearCustomerSession(): void {
  sessionStorage.removeItem(CUSTOMER_EMAIL_KEY);
}

export function isCustomerSessionActive(): boolean {
  return !!getCustomerEmail();
}
