import { useState } from 'react';
import { useGetAllCustomers, useGetAllLoans, useCloseLoan, useRecordPayment } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Loader2, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { buildCustomerWhatsAppLink, formatLoanClosureMessage, formatEMIPaidMessage, getOrdinalSuffix } from '../../utils/whatsapp';
import type { Loan, LoanStatus } from '../../types/loan';

export default function LoansPage() {
  const { data: customers = [], isLoading: customersLoading } = useGetAllCustomers();
  const { data: allLoans = [], isLoading: loansLoading, error: loansError } = useGetAllLoans();
  const closeLoanMutation = useCloseLoan();
  const recordPaymentMutation = useRecordPayment();

  const [processingLoanId, setProcessingLoanId] = useState<string | null>(null);
  const [processingEmiLoanId, setProcessingEmiLoanId] = useState<string | null>(null);

  const isLoading = customersLoading || loansLoading;

  const getCustomerByName = (customerId: string) => {
    return customers.find(c => c.name === customerId);
  };

  const handleCloseLoan = async (loan: Loan) => {
    const customer = getCustomerByName(loan.customerId);
    if (!customer) {
      alert('Customer not found');
      return;
    }

    setProcessingLoanId(loan.id);

    try {
      // Open WhatsApp with closure message
      const message = formatLoanClosureMessage(loan.amount);
      const whatsappUrl = buildCustomerWhatsAppLink(customer.mobile, message);
      window.open(whatsappUrl, '_blank');

      // Close the loan in backend
      await closeLoanMutation.mutateAsync(loan.id);
    } catch (error: any) {
      console.error('Error closing loan:', error);
      alert(error.message || 'Failed to close loan');
    } finally {
      setProcessingLoanId(null);
    }
  };

  const handleRecordPayment = async (loan: Loan) => {
    const customer = getCustomerByName(loan.customerId);
    if (!customer) {
      alert('Customer not found');
      return;
    }

    const remainingEmis = Number(loan.termMonths) - Number(loan.paidEmis);
    if (remainingEmis <= 0) {
      alert('All EMIs have been paid');
      return;
    }

    setProcessingEmiLoanId(loan.id);

    try {
      const nextEmiNumber = Number(loan.paidEmis) + 1;
      const remainingAfterPayment = remainingEmis - 1;
      const balanceAfterPayment = Math.max(0, loan.balanceDue - loan.emiAmount);

      // Open WhatsApp with EMI paid message
      const message = formatEMIPaidMessage(
        loan.emiAmount,
        nextEmiNumber,
        remainingAfterPayment,
        balanceAfterPayment
      );
      const whatsappUrl = buildCustomerWhatsAppLink(customer.mobile, message);
      window.open(whatsappUrl, '_blank');

      // Record payment in backend
      const paidDate = BigInt(Date.now() * 1000000); // Convert to nanoseconds
      await recordPaymentMutation.mutateAsync({ loanId: loan.id, paidDate });
    } catch (error: any) {
      console.error('Error recording payment:', error);
      alert(error.message || 'Failed to record payment');
    } finally {
      setProcessingEmiLoanId(null);
    }
  };

  const getStatusBadge = (status: LoanStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      case 'delinquent':
        return <Badge variant="destructive">Delinquent</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading loans...</p>
        </div>
      </div>
    );
  }

  if (loansError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load loans. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (allLoans.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Loans Found</h3>
        <p className="text-muted-foreground">
          There are no loans in the system yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Loans Management</h2>
        <p className="text-muted-foreground">
          Manage customer loans, record payments, and close loans
        </p>
      </div>

      <div className="space-y-4">
        {allLoans.map((loan) => {
          const customer = getCustomerByName(loan.customerId);
          const remainingEmis = Number(loan.termMonths) - Number(loan.paidEmis);
          const isClosed = loan.status === 'closed';
          const isProcessingClose = processingLoanId === loan.id;
          const isProcessingEmi = processingEmiLoanId === loan.id;

          return (
            <Card key={loan.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {customer?.name || loan.customerId}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(loan.status)}
                      {customer && (
                        <span className="text-sm text-muted-foreground">
                          Mobile: {customer.mobile}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    {isClosed ? (
                      <Button variant="secondary" disabled>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Closed
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        onClick={() => handleCloseLoan(loan)}
                        disabled={isProcessingClose || !customer}
                      >
                        {isProcessingClose ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Closing...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 mr-2" />
                            Close Loan
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Loan Amount</p>
                    <p className="text-lg font-semibold">₹{loan.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">EMI Amount</p>
                    <p className="text-lg font-semibold">₹{loan.emiAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Paid EMIs</p>
                    <p className="text-lg font-semibold">
                      {loan.paidEmis.toString()} / {loan.termMonths.toString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Remaining EMIs</p>
                    <p className="text-lg font-semibold">{remainingEmis}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Balance Due</p>
                    <p className="text-lg font-semibold text-destructive">
                      ₹{Math.max(0, loan.balanceDue).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Interest Rate</p>
                    <p className="text-lg font-semibold">{loan.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Term</p>
                    <p className="text-lg font-semibold">{loan.termMonths.toString()} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                    <p className="text-sm font-medium">
                      {new Date(Number(loan.startDate) / 1000000).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {!isClosed && remainingEmis > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground">EMI Payment</h4>
                      <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Next EMI ({getOrdinalSuffix(Number(loan.paidEmis) + 1)})
                          </p>
                          <p className="text-xl font-bold">₹{loan.emiAmount.toLocaleString()}</p>
                        </div>
                        <Button
                          onClick={() => handleRecordPayment(loan)}
                          disabled={isProcessingEmi || !customer}
                        >
                          {isProcessingEmi ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Mark as Paid
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {isClosed && (
                  <Alert className="mt-4">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      This loan has been fully closed. No further payments are required.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
