import { useNavigate } from '@tanstack/react-router';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppShell from '../components/layout/AppShell';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-foreground tracking-tight">
            Nehitha Thandal Management
          </h1>
        </div>

        <div className="flex justify-center w-full max-w-md mt-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-accent/50 w-full">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-2xl">Customer Portal</CardTitle>
              <CardDescription className="text-base">
                Submit requests and manage your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate({ to: '/customer/signin' })}
                className="w-full bg-accent hover:bg-accent/90"
                size="lg"
              >
                Access Customer Portal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
