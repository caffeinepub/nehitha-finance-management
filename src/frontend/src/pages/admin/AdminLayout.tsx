import { useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from '@tanstack/react-router';
import { LogOut, UserPlus, LayoutDashboard, AlertCircle, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { clearAdminSession, isAdminSessionActive, getAdminEmail } from '../../state/session';
import { useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { getSecretParameter } from '../../utils/urlParams';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const adminEmail = getAdminEmail();
  
  const { identity, clear } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin, isFetched } = useIsCallerAdmin();

  // Check for admin token
  const hasAdminToken = !!getSecretParameter('caffeineAdminToken');

  useEffect(() => {
    // Check if admin session exists
    if (!isAdminSessionActive()) {
      clearAdminSession();
      queryClient.clear();
      navigate({ to: '/admin/signin' });
      return;
    }

    // Check if Internet Identity is authenticated
    if (!identity) {
      clearAdminSession();
      queryClient.clear();
      navigate({ 
        to: '/admin/signin',
        search: { error: 'Authentication required. Please complete Internet Identity sign-in to access the Admin area.' }
      });
      return;
    }
  }, [navigate, queryClient, identity]);

  const handleSignOut = async () => {
    await clear();
    clearAdminSession();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const isActive = (path: string) => location.pathname === path;

  // Don't render content if not authorized
  if (!isAdminSessionActive() || !identity) {
    return null;
  }

  // Show loading state while checking admin permission
  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (isFetched && !isAdmin) {
    const principalId = identity.getPrincipal().toString();
    
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{adminEmail}</span>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-12">
          <Alert variant="destructive" className="max-w-3xl mx-auto">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-base space-y-4">
              <div>
                <strong className="text-lg">Access Denied</strong>
              </div>
              
              <div className="space-y-2">
                <p>
                  Your Internet Identity principal is not authorized for admin actions.
                </p>
                <div className="bg-destructive/10 p-3 rounded-md font-mono text-sm break-all">
                  <strong>Current Principal:</strong> {principalId}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Admin Authorization Setup
                </p>
                <p>
                  The first Internet Identity principal to authenticate with a valid admin token becomes the admin.
                </p>
                {hasAdminToken ? (
                  <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-md">
                    <p className="text-green-700 dark:text-green-400">
                      ✓ Admin token detected in your session
                    </p>
                    <p className="text-sm mt-1">
                      However, another principal has already been registered as admin. 
                      If you need to change the admin, please contact the system operator.
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-md">
                    <p className="text-yellow-700 dark:text-yellow-400">
                      ⚠ No admin token found
                    </p>
                    <p className="text-sm mt-1">
                      To become an admin, you need a special authorization link with the <code className="bg-background px-1 py-0.5 rounded">caffeineAdminToken</code> parameter.
                      Please obtain this link from the system operator.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-destructive/20">
                <p className="font-semibold mb-2">What to do:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Sign out using the button below</li>
                  <li>Obtain the correct admin authorization link (if you don't have one)</li>
                  <li>Sign in with the Internet Identity account that has admin permissions</li>
                </ol>
              </div>

              <Button 
                onClick={handleSignOut} 
                variant="outline" 
                size="sm" 
                className="mt-4"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{adminEmail}</span>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card">
          <nav className="p-4 space-y-2">
            <Button
              variant={isActive('/admin') ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => navigate({ to: '/admin' })}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={isActive('/admin/add-customer') ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => navigate({ to: '/admin/add-customer' })}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Nehitha Finance Management. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname || 'nehitha-finance'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
