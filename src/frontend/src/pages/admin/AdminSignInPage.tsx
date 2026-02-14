import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppShell from '../../components/layout/AppShell';
import { setAdminEmail, isAdminSessionActive } from '../../state/session';
import { isAuthorizedAdminEmail } from '../../utils/email';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export default function AdminSignInPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { error?: string };
  const [email, setEmail] = useState('');
  const [error, setError] = useState(search.error || '');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [waitingForIdentity, setWaitingForIdentity] = useState(false);
  
  const { login, identity, loginStatus, isLoginError } = useInternetIdentity();

  // Check if already authenticated and has session
  useEffect(() => {
    if (isAdminSessionActive() && identity) {
      navigate({ to: '/admin' });
    }
  }, [navigate, identity]);

  // Handle post-login navigation once identity is available
  useEffect(() => {
    if (waitingForIdentity && identity) {
      // Identity is now available, create session and navigate
      const storedEmail = sessionStorage.getItem('pendingAdminEmail');
      if (storedEmail) {
        setAdminEmail(storedEmail);
        sessionStorage.removeItem('pendingAdminEmail');
        navigate({ to: '/admin' });
      }
      setWaitingForIdentity(false);
      setIsAuthenticating(false);
    }
  }, [waitingForIdentity, identity, navigate]);

  // Handle login errors
  useEffect(() => {
    if (waitingForIdentity && isLoginError) {
      setError('Authentication was not completed. Please try again to access the Admin area.');
      setWaitingForIdentity(false);
      setIsAuthenticating(false);
      sessionStorage.removeItem('pendingAdminEmail');
    }
  }, [waitingForIdentity, isLoginError]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Check if the email is authorized
    if (!isAuthorizedAdminEmail(email)) {
      setError('This email is not authorized for Admin access. Please contact the system administrator.');
      return;
    }

    // Start authentication flow
    setIsAuthenticating(true);
    
    try {
      // Store email temporarily
      sessionStorage.setItem('pendingAdminEmail', email);
      
      // Start Internet Identity login
      setWaitingForIdentity(true);
      await login();
      
      // If login completes and identity is already available (edge case)
      if (identity) {
        setAdminEmail(email);
        sessionStorage.removeItem('pendingAdminEmail');
        navigate({ to: '/admin' });
        setWaitingForIdentity(false);
        setIsAuthenticating(false);
      }
      // Otherwise, the useEffect above will handle navigation once identity becomes available
      
    } catch (error: any) {
      console.error('Authentication error:', error);
      sessionStorage.removeItem('pendingAdminEmail');
      setWaitingForIdentity(false);
      setIsAuthenticating(false);
      
      if (error.message === 'User is already authenticated') {
        // User is already authenticated, proceed
        setAdminEmail(email);
        navigate({ to: '/admin' });
      } else {
        setError('Authentication was not completed. Please try again to access the Admin area.');
      }
    }
  };

  const isLoading = isAuthenticating || loginStatus === 'logging-in';

  return (
    <AppShell>
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md shadow-soft">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold">Admin Sign In</CardTitle>
            <CardDescription className="text-base">
              Enter your email and authenticate with Internet Identity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@nehitha.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    autoFocus
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
                {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
