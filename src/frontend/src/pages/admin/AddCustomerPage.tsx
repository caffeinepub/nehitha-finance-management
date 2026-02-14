import { useState } from 'react';
import { User, Phone, CheckCircle2, CreditCard, MapPin, FileText, Users, AlertCircle, Loader2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAddCustomer, useGetAllCustomers, useIsCallerAdmin } from '../../hooks/useQueries';

export default function AddCustomerPage() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [pan, setPan] = useState('');
  const [referral, setReferral] = useState('');
  const [address, setAddress] = useState('');
  const [remarks, setRemarks] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const addCustomerMutation = useAddCustomer();
  const { data: customers = [], isLoading: customersLoading } = useGetAllCustomers();
  const { data: isAdmin, isLoading: isCheckingAdmin, isFetched: isAdminCheckFetched } = useIsCallerAdmin();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile is required';
    }

    if (!aadhar.trim()) {
      newErrors.aadhar = 'Aadhar is required';
    }

    if (!pan.trim()) {
      newErrors.pan = 'PAN is required';
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);
    setErrors({});

    // Check if admin permission is still loading
    if (isCheckingAdmin) {
      setErrors({ 
        submit: 'Checking permissions... Please wait a moment and try again.' 
      });
      return;
    }

    // Check backend admin permission after it has loaded
    if (isAdminCheckFetched && !isAdmin) {
      setErrors({ 
        submit: 'You are not authorized to add customers. Please ensure you are signed in with an admin Internet Identity account.' 
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      await addCustomerMutation.mutateAsync({
        name: name.trim(),
        mobile: mobile.trim(),
        aadhar: aadhar.trim(),
        pan: pan.trim(),
        referral: referral.trim(),
        address: address.trim(),
        remarks: remarks.trim()
      });
      
      setShowSuccess(true);
      setName('');
      setMobile('');
      setAadhar('');
      setPan('');
      setReferral('');
      setAddress('');
      setRemarks('');
      setErrors({});

      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error: any) {
      console.error('Error adding customer:', error);
      const errorMessage = error.message || 'Failed to add customer. Please try again.';
      setErrors({ submit: errorMessage });
    }
  };

  // Form is disabled if: checking admin status, mutation in progress, or not admin
  const isFormDisabled = isCheckingAdmin || addCustomerMutation.isPending || (isAdminCheckFetched && !isAdmin);

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground">Add New Customer</h2>
        <p className="text-muted-foreground mt-2">Create a new customer record in the system</p>
      </div>

      {/* Show permission checking state */}
      {isCheckingAdmin && (
        <Alert className="mb-6">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Checking admin permissions...
          </AlertDescription>
        </Alert>
      )}

      {/* Show unauthorized state */}
      {isAdminCheckFetched && !isAdmin && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>
            <strong>Unauthorized Access</strong>
            <p className="mt-1">
              You do not have permission to add customers. This form is disabled because your Internet Identity principal is not authorized for admin actions.
            </p>
          </AlertDescription>
        </Alert>
      )}

      <Card className="shadow-soft mb-8">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>Enter the customer's details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium">
                  Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter customer name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-14 text-base"
                    autoFocus
                    disabled={isFormDisabled}
                  />
                </div>
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-base font-medium">
                  Mobile *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="pl-10 h-14 text-base"
                    disabled={isFormDisabled}
                  />
                </div>
                {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadhar" className="text-base font-medium">
                  Aadhar *
                </Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="aadhar"
                    type="text"
                    placeholder="Enter Aadhar number"
                    value={aadhar}
                    onChange={(e) => setAadhar(e.target.value)}
                    className="pl-10 h-14 text-base"
                    disabled={isFormDisabled}
                  />
                </div>
                {errors.aadhar && <p className="text-sm text-destructive">{errors.aadhar}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pan" className="text-base font-medium">
                  PAN *
                </Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="pan"
                    type="text"
                    placeholder="Enter PAN number"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    className="pl-10 h-14 text-base"
                    disabled={isFormDisabled}
                  />
                </div>
                {errors.pan && <p className="text-sm text-destructive">{errors.pan}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral" className="text-base font-medium">
                  Referral
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="referral"
                    type="text"
                    placeholder="Enter referral source (optional)"
                    value={referral}
                    onChange={(e) => setReferral(e.target.value)}
                    className="pl-10 h-14 text-base"
                    disabled={isFormDisabled}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-base font-medium">
                  Address *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="address"
                    type="text"
                    placeholder="Enter address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="pl-10 h-14 text-base"
                    disabled={isFormDisabled}
                  />
                </div>
                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks" className="text-base font-medium">
                Remarks
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Textarea
                  id="remarks"
                  placeholder="Enter any additional remarks (optional)"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="pl-10 min-h-[120px] text-base resize-none"
                  disabled={isFormDisabled}
                />
              </div>
            </div>

            {errors.submit && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            {showSuccess && (
              <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Customer added successfully!
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-14 text-base"
              disabled={isFormDisabled}
            >
              {addCustomerMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Adding Customer...
                </>
              ) : isCheckingAdmin ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Checking Permissions...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add Customer
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>All registered customers in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {customersLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-2">Loading customers...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No customers found. Add your first customer above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Aadhar</TableHead>
                    <TableHead>PAN</TableHead>
                    <TableHead>Referral</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.mobile}</TableCell>
                      <TableCell>{customer.aadhar}</TableCell>
                      <TableCell>{customer.pan}</TableCell>
                      <TableCell>{customer.referral || '-'}</TableCell>
                      <TableCell>{customer.address}</TableCell>
                      <TableCell>{customer.remarks || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
