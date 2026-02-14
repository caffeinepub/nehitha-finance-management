import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import AppShell from '../components/layout/AppShell';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <h2 className="text-4xl font-bold text-foreground">Page Not Found</h2>
          <p className="text-xl text-muted-foreground max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate({ to: '/' })}
            size="lg"
          >
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
