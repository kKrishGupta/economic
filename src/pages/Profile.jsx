import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../providers/AuthProvider';
import { authService } from '../services/AuthService';
import { User, Mail, ShieldAlert, Key, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { toast } from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently';

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await authService.updateProfile({ email });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setIsUpdatingPassword(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsUpdatingPassword(false);
    e.target.reset();
    toast.success('Password updated securely!');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">View your account details and security status.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Quick Info */}
        <motion.div variants={itemVariants} className="space-y-8 md:col-span-1">
          <Card className="glass-card shadow-sm overflow-hidden relative group hover-lift">
            <div className="h-24 bg-gradient-to-r from-primary/20 to-accent/20 absolute inset-x-0 top-0 transition-all group-hover:from-primary/30 group-hover:to-accent/30" />
            <CardContent className="pt-12 pb-6 px-6 flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 rounded-full bg-card border-4 border-background flex items-center justify-center text-4xl font-bold text-primary shadow-xl mb-4 transform transition-transform group-hover:scale-105">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h2 className="text-xl font-bold">{user?.username || 'User'}</h2>
              <p className="text-sm text-muted-foreground mb-4">Email hidden</p>
              
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {user?.role || 'User'}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-sm hover-lift">
             <CardHeader className="pb-4">
               <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
                 <ShieldAlert className="w-4 h-4 mr-2" /> Account Status
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-foreground">Status</span>
                 <span className="text-success font-medium flex items-center bg-success/10 px-2 py-1 rounded-md">
                    <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" /> Active
                 </span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-foreground">Joined</span>
                 <span className="text-muted-foreground">{joinedDate}</span>
               </div>
             </CardContent>
          </Card>
        </motion.div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-8">
          
          <motion.div variants={itemVariants}>
            <Card className="glass-card shadow-sm hover-lift">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your registered personal details.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Username</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input defaultValue={user?.username} className="pl-9 bg-muted/30" readOnly />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="text" 
                          defaultValue="Hidden by administrator"
                          readOnly
                          className="pl-9 bg-muted/30 text-muted-foreground cursor-not-allowed" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="tel" 
                          defaultValue={user?.phoneNumber || '+1 (555) 000-0000'}
                          className="pl-9 bg-muted/30 focus:border-primary transition-colors" 
                          readOnly 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Role Configuration</label>
                      <div className="relative">
                        <ShieldAlert className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          defaultValue={user?.role} 
                          disabled 
                          className="pl-9 bg-muted/50 cursor-not-allowed text-muted-foreground" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">Your role and email are strictly managed by the system administrator.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-card shadow-sm hover-lift">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Update your password and secure your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg border border-border/50 text-center">
                  <Key className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Password Management Disabled</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Self-service password resets are disabled in this environment. Please contact your system administrator to update your credentials.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
        </div>
      </div>
    </motion.div>
  );
}
