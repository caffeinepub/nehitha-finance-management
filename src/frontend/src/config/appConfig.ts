// Application configuration
// IMPORTANT: Set your WhatsApp number here in E.164 format (e.g., +919876543210)
export const OWNER_WHATSAPP_NUMBER: string = '+917013568898';

// Validation
export const isWhatsAppConfigured = (): boolean => {
  return OWNER_WHATSAPP_NUMBER.length > 5 && OWNER_WHATSAPP_NUMBER.startsWith('+');
};
