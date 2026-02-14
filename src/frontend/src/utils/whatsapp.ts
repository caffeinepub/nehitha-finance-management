import { OWNER_WHATSAPP_NUMBER } from '../config/appConfig';

export interface RequestDetails {
  name: string;
  mobile: string;
  address: string;
  aadhar: string;
  pan: string;
  remarks: string;
}

export function formatRequestMessage(details: RequestDetails): string {
  return `*Nehitha Finance Management*
_New Customer Request_

*Name:* ${details.name}
*Mobile Number:* ${details.mobile}
*Address:* ${details.address}
*Aadhar Number:* ${details.aadhar || 'Not provided'}
*PAN Number:* ${details.pan || 'Not provided'}
*Remarks:* ${details.remarks || 'None'}

---
Sent via Nehitha Finance Management Portal`;
}

export function buildWhatsAppLink(details: RequestDetails): string {
  const message = formatRequestMessage(details);
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = OWNER_WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
