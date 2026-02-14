import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { FileText, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppShell from '../../components/layout/AppShell';
import { clearCustomerSession, isCustomerSessionActive, getCustomerEmail } from '../../state/session';
import { useQueryClient } from '@tanstack/react-query';

export default function CustomerHomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const customerEmail = getCustomerEmail();

  useEffect(() => {
    if (!isCustomerSessionActive()) {
      navigate({ to: '/customer/signin' });
    }
  }, [navigate]);

  const handleSignOut = () => {
    clearCustomerSession();
    queryClient.clear();
    navigate({ to: '/' });
  };

  if (!isCustomerSessionActive()) {
    return null;
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Customer Portal</h1>
            <p className="text-muted-foreground mt-2">Welcome, {customerEmail}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Request Card */}
        <Card className="shadow-soft hover:shadow-lg transition-shadow border-2 hover:border-accent/50">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <FileText className="w-10 h-10 text-accent" />
            </div>
            <CardTitle className="text-3xl">Submit a Request</CardTitle>
            <CardDescription className="text-base mt-2">
              Fill out a finance request form to get started with your application
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button
              onClick={() => navigate({ to: '/customer/request' })}
              className="bg-accent hover:bg-accent/90 h-12 px-8"
              size="lg"
            >
              Create New Request
              <FileText className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

