import { useNavigate } from '@tanstack/react-router';
import { Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppShell from '../components/layout/AppShell';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleAdminPortalClick = () => {
    window.location.href = 'https://nehitha-thandal-managementtool-0c2.caffeine.xyz/';
  };

  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-foreground tracking-tight">
            Nehitha Finance Management
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Streamline your financial operations with our comprehensive management platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mt-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
              <CardDescription className="text-base">
                Manage customers and oversee operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleAdminPortalClick}
                className="w-full"
                size="lg"
              >
                Access Admin Portal
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-accent/50">
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
