import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mb-6">
        <Lock className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">403</h1>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Access Denied</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
      </p>
      <Link to="/dashboard">
        <Button size="lg">Return to Dashboard</Button>
      </Link>
    </div>
  );
}