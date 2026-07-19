import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../providers/AuthProvider';
import { User, Mail, ShieldAlert, Key, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

export default function Profile() {
  const { user } = useAuth();

  // The backend User model only contains username, email, role, and createdAt.
  // We display these safely.
  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account details and security preferences.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="space-y-8 md:col-span-1">
          <Card className="border-border/50 shadow-sm overflow-hidden relative">
            <div className="h-24 bg-gradient-to-r from-primary/20 to-accent/20 absolute inset-x-0 top-0" />
            <CardContent className="pt-12 pb-6 px-6 flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 rounded-full bg-card border-4 border-background flex items-center justify-center text-4xl font-bold text-primary shadow-lg mb-4">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h2 className="text-xl font-bold">{user?.username || 'User'}</h2>
              <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
              
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {user?.role || 'User'}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
             <CardHeader className="pb-4">
               <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
                 <ShieldAlert className="w-4 h-4 mr-2" /> Account Status
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-foreground">Status</span>
                 <span className="text-success font-medium flex items-center">
                    <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" /> Active
                 </span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-foreground">Joined</span>
                 <span className="text-muted-foreground">{joinedDate}</span>
               </div>
             </CardContent>
          </Card>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-8">
          
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Review your registered personal details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input defaultValue={user?.username} className="pl-9" readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input type="email" defaultValue={user?.email} className="pl-9" readOnly />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role Configuration</label>
                  <Input defaultValue={user?.role} disabled className="bg-muted/50 cursor-not-allowed" />
                  <p className="text-xs text-muted-foreground">Your role is managed by the system administrator.</p>
                </div>
                
                {/* Save button omitted because these are readonly based on current backend constraints */}
              </form>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Update your password and secure your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="password" placeholder="••••••••" className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="password" placeholder="••••••••" className="pl-9" />
                  </div>
                </div>
                <Button type="submit" variant="default" className="mt-2">
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  );
}
