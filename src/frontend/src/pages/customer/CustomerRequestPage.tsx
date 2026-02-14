import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppShell from '../../components/layout/AppShell';
import { isCustomerSessionActive } from '../../state/session';
import { buildWhatsAppLink } from '../../utils/whatsapp';
import { isWhatsAppConfigured } from '../../config/appConfig';

interface FormData {
  name: string;
  mobile: string;
  address: string;
  aadhar: string;
  pan: string;
  remarks: string;
}

interface FormErrors {
  name?: string;
  mobile?: string;
  address?: string;
  aadhar?: string;
  pan?: string;
}

export default function CustomerRequestPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    mobile: '',
    address: '',
    aadhar: '',
    pan: '',
    remarks: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [configError, setConfigError] = useState('');
  const [showAcknowledgement, setShowAcknowledgement] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isCustomerSessionActive()) {
      navigate({ to: '/customer/signin' });
    }
  }, [navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10,15}$/.test(formData.mobile.replace(/[\s-]/g, ''))) {
      newErrors.mobile = 'Please enter a valid mobile number (10-15 digits)';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (formData.aadhar.trim() && formData.aadhar.replace(/\s/g, '').length !== 12) {
      newErrors.aadhar = 'Aadhar should be 12 digits';
    }

    if (formData.pan.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(formData.pan.toUpperCase())) {
      newErrors.pan = 'Please enter a valid PAN format (e.g., ABCDE1234F)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfigError('');
    setShowAcknowledgement(false);

    if (!validateForm()) {
      return;
    }

    if (!isWhatsAppConfigured()) {
      setConfigError(
        'WhatsApp number is not configured. Please contact the administrator to set up the owner WhatsApp number in the application configuration.'
      );
      return;
    }

    setIsSubmitting(true);

    // Store trimmed name and show acknowledgement immediately
    const trimmedName = formData.name.trim();
    setSubmittedName(trimmedName);
    setShowAcknowledgement(true);

    // Open WhatsApp
    const whatsappLink = buildWhatsAppLink(formData);
    window.open(whatsappLink, '_blank');

    setIsSubmitting(false);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBackToPortal = () => {
    navigate({ to: '/customer' });
  };

  if (!isCustomerSessionActive()) {
    return null;
  }

  // Show acknowledgement screen after successful submission
  if (showAcknowledgement) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-soft border-accent/20">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-accent" />
                </div>
              </div>
              
              <h2 className="text-3xl font-semibold mb-4 text-foreground">
                Hi {submittedName}, thanks for contacting us. Our team will get back to you.
              </h2>
              
              <p className="text-base text-muted-foreground mb-8 max-w-xl mx-auto">
                Your request has been sent via WhatsApp. Please continue the conversation in WhatsApp to receive responses from our team.
              </p>

              <div className="bg-muted/50 border border-border rounded-lg p-4 mb-8 max-w-xl mx-auto">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> This acknowledgement is shown instantly in the portal. Automated WhatsApp replies are not sent by this application — all communication happens directly in WhatsApp.
                </p>
              </div>

              <Button
                onClick={handleBackToPortal}
                className="bg-accent hover:bg-accent/90"
                size="lg"
              >
                Back to Portal
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  // Show form
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={handleBackToPortal}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Portal
        </Button>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-3xl">Finance Request Form</CardTitle>
            <CardDescription className="text-base">
              Please fill out all required fields marked with *
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="h-11"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              {/* Mobile */}
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-base">
                  Mobile Number *
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={formData.mobile}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                  className="h-11"
                />
                {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-base">
                  Address *
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
              </div>

              {/* Aadhar */}
              <div className="space-y-2">
                <Label htmlFor="aadhar" className="text-base">
                  Aadhar Number
                </Label>
                <Input
                  id="aadhar"
                  type="text"
                  placeholder="Enter your 12-digit Aadhar number"
                  value={formData.aadhar}
                  onChange={(e) => handleChange('aadhar', e.target.value)}
                  className="h-11"
                  maxLength={12}
                />
                {errors.aadhar && <p className="text-sm text-destructive">{errors.aadhar}</p>}
              </div>

              {/* PAN */}
              <div className="space-y-2">
                <Label htmlFor="pan" className="text-base">
                  PAN Number
                </Label>
                <Input
                  id="pan"
                  type="text"
                  placeholder="Enter your PAN (e.g., ABCDE1234F)"
                  value={formData.pan}
                  onChange={(e) => handleChange('pan', e.target.value.toUpperCase())}
                  className="h-11"
                  maxLength={10}
                />
                {errors.pan && <p className="text-sm text-destructive">{errors.pan}</p>}
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <Label htmlFor="remarks" className="text-base">
                  Remarks
                </Label>
                <Textarea
                  id="remarks"
                  placeholder="Any additional information or comments"
                  value={formData.remarks}
                  onChange={(e) => handleChange('remarks', e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Config Error */}
              {configError && (
                <div className="flex items-start gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-destructive">{configError}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base bg-accent hover:bg-accent/90"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                <Send className="ml-2 w-5 h-5" />
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Your request will be sent via WhatsApp to our team
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
