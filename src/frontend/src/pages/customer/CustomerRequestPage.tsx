import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppShell from '../../components/layout/AppShell';
import { buildWhatsAppLink } from '../../utils/whatsapp';
import { CheckCircle, Send } from 'lucide-react';

export default function CustomerRequestPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    remarks: '',
    partTimeEmployment: '',
    fullTimeEmployment: '',
    loanReason: ''
  });
  const [consentChecked, setConsentChecked] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile.replace(/[^0-9]/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.partTimeEmployment.trim()) {
      newErrors.partTimeEmployment = 'Part Time Employment is required';
    }

    if (!formData.fullTimeEmployment.trim()) {
      newErrors.fullTimeEmployment = 'Full Time Employment is required';
    }

    if (!formData.loanReason.trim()) {
      newErrors.loanReason = 'Loan reason is required';
    }

    if (!consentChecked) {
      newErrors.consent = 'You must agree to share your details';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Open WhatsApp with pre-filled message
    const whatsappUrl = buildWhatsAppLink(formData);
    window.open(whatsappUrl, '_blank');

    // Show success message
    setIsSubmitted(true);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isSubmitted) {
    const firstName = formData.name.trim().split(' ')[0];
    
    return (
      <AppShell>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">Request Submitted!</CardTitle>
              <CardDescription className="text-base mt-2">
                Thank you, {firstName}! Your request has been sent via WhatsApp.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  Our team will review your request and get back to you shortly.
                </AlertDescription>
              </Alert>
              <Button 
                onClick={() => navigate({ to: '/' })} 
                className="w-full"
              >
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  const isFormValid = consentChecked && 
    formData.name.trim() && 
    formData.mobile.trim() && 
    formData.address.trim() &&
    formData.partTimeEmployment.trim() &&
    formData.fullTimeEmployment.trim() &&
    formData.loanReason.trim();

  return (
    <AppShell>
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Submit a Request</CardTitle>
              <CardDescription>
                Fill out the form below to submit your finance request. We'll contact you via WhatsApp.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    placeholder="Enter your 10-digit mobile number"
                  />
                  {errors.mobile && (
                    <p className="text-sm text-destructive">{errors.mobile}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Enter your complete address"
                    rows={3}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partTimeEmployment">Part Time Employment *</Label>
                  <Input
                    id="partTimeEmployment"
                    value={formData.partTimeEmployment}
                    onChange={(e) => handleChange('partTimeEmployment', e.target.value)}
                    placeholder="Enter your part time employment details"
                  />
                  {errors.partTimeEmployment && (
                    <p className="text-sm text-destructive">{errors.partTimeEmployment}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullTimeEmployment">Full Time Employment *</Label>
                  <Input
                    id="fullTimeEmployment"
                    value={formData.fullTimeEmployment}
                    onChange={(e) => handleChange('fullTimeEmployment', e.target.value)}
                    placeholder="Enter your full time employment details"
                  />
                  {errors.fullTimeEmployment && (
                    <p className="text-sm text-destructive">{errors.fullTimeEmployment}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanReason">Loan Reason *</Label>
                  <Textarea
                    id="loanReason"
                    value={formData.loanReason}
                    onChange={(e) => handleChange('loanReason', e.target.value)}
                    placeholder="Enter the reason for requesting the loan"
                    rows={3}
                  />
                  {errors.loanReason && (
                    <p className="text-sm text-destructive">{errors.loanReason}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    value={formData.remarks}
                    onChange={(e) => handleChange('remarks', e.target.value)}
                    placeholder="Any additional information (optional)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-start space-x-3 rounded-md border border-border p-4 bg-muted/30">
                    <Checkbox
                      id="consent"
                      checked={consentChecked}
                      onCheckedChange={(checked) => {
                        setConsentChecked(checked === true);
                        if (errors.consent) {
                          setErrors(prev => ({ ...prev, consent: '' }));
                        }
                      }}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="consent"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        I agree to share my details for contact purpose
                      </Label>
                    </div>
                  </div>
                  {errors.consent && (
                    <p className="text-sm text-destructive">{errors.consent}</p>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate({ to: '/' })}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={!isFormValid}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Request
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
