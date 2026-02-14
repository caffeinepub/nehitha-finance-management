// Email normalization and validation utilities

const ALLOWED_ADMIN_EMAIL = 'peramharkrishna@gmail.com';

/**
 * Normalize email by removing all whitespace and converting to lowercase
 */
export function normalizeEmail(email: string): string {
  return email.replace(/\s+/g, '').toLowerCase().trim();
}

/**
 * Check if the normalized email matches the allowed admin email
 */
export function isAuthorizedAdminEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  return normalized === ALLOWED_ADMIN_EMAIL;
}

/**
 * Get the allowed admin email (for display purposes)
 */
export function getAllowedAdminEmail(): string {
  return ALLOWED_ADMIN_EMAIL;
}
