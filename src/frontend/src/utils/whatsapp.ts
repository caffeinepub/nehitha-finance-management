import { OWNER_WHATSAPP_NUMBER } from '../config/appConfig';

export interface RequestDetails {
  name: string;
  mobile: string;
  address: string;
  remarks: string;
  partTimeEmployment: string;
  fullTimeEmployment: string;
  loanReason: string;
}

export function formatRequestMessage(details: RequestDetails): string {
  return `*Nehitha Thandal Management*
_New Customer Request_

*Name:* ${details.name}
*Mobile Number:* ${details.mobile}
*Address:* ${details.address}
*Part Time Employment:* ${details.partTimeEmployment}
*Full Time Employment:* ${details.fullTimeEmployment}
*Loan Reason:* ${details.loanReason}
*Remarks:* ${details.remarks || 'None'}

---
Sent via Nehitha Thandal Management Portal`;
}

export function buildWhatsAppLink(details: RequestDetails): string {
  const message = formatRequestMessage(details);
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = OWNER_WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

// New helper for customer-targeted WhatsApp messages
export function buildCustomerWhatsAppLink(customerMobile: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = customerMobile.replace(/[^0-9]/g, '');
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

// Format loan closure message
export function formatLoanClosureMessage(loanAmount: number): string {
  return `This is to confirm that we have received the full repayment of ₹${loanAmount.toLocaleString()}. Your loan is now fully closed with no outstanding dues. Thank you.`;
}

// Format EMI paid message
export function formatEMIPaidMessage(
  emiAmount: number,
  emiNumber: number,
  remainingEmis: number,
  balanceDues: number
): string {
  const ordinal = getOrdinalSuffix(emiNumber);
  return `Thank you for your payment of ₹${emiAmount.toLocaleString()}. Your ${ordinal} EMI has been successfully received and cleared. ${remainingEmis} EMIs are remaining. Balance due: ₹${balanceDues.toLocaleString()}. Kindly continue the payments as per schedule.`;
}

// Helper to get ordinal suffix (1st, 2nd, 3rd, etc.)
export function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) {
    return `${num}st`;
  }
  if (j === 2 && k !== 12) {
    return `${num}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${num}rd`;
  }
  return `${num}th`;
}
