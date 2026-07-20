import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Bell, Moon, Sun, Monitor, Key, Smartphone, Mail, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';
import { useAuth } from '../providers/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from 'react-hot-toast';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('appearance');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  // Notification states
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    critical: true,
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword } = useForm();
  
  const onPasswordSubmit = async (data) => {
    setIsUpdatingPassword(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    toast.success('Password updated successfully.');
    resetPassword();
    setIsUpdatingPassword(false);
  };

  const handleToggle = (key) => {
    setNotifications(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      // Move side effects outside state updater by using setTimeout or just checking state before update
      return newState;
    });
    // The previous state is what we are changing from, so if it WAS true, it is now disabled.
    const isNowEnabled = !notifications[key];
    toast.success(`${key} notifications ${isNowEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion is disabled in demo mode.');
  };

  const handleRevokeSession = () => {
    toast.success('Session revoked successfully.');
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Key },
    { id: 'account', label: 'Account', icon: Shield },
  ];

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-2">Manage your account preferences, appearance, and security.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all overflow-hidden ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBackground"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <motion.div key="appearance" variants={contentVariants} initial="initial" animate="animate" exit="exit">
                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize how the dashboard looks on your device.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Theme Preference</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { id: 'light', label: 'Light', icon: Sun },
                          { id: 'dark', label: 'Dark', icon: Moon },
                          { id: 'system', label: 'System', icon: Monitor },
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                              theme === t.id
                                ? 'border-primary bg-primary/5 text-primary shadow-sm'
                                : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50 text-muted-foreground'
                            }`}
                          >
                            <t.icon className="w-8 h-8 mb-3" />
                            <span className="font-medium">{t.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <motion.div key="notifications" variants={contentVariants} initial="initial" animate="animate" exit="exit">
                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose what alerts you want to receive and how.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { id: 'email', title: 'Email Alerts', description: 'Receive daily summaries and critical alerts via email.', icon: Mail },
                      { id: 'push', title: 'Push Notifications', description: 'Receive real-time alerts in the dashboard.', icon: Smartphone },
                      { id: 'critical', title: 'Critical Safety Alerts', description: 'Get immediately notified for anomaly detections.', icon: Shield },
                    ].map((item, idx) => (
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{item.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          </div>
                        </div>
                        {/* Custom Framer Motion Toggle Switch */}
                        <div 
                          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${notifications[item.id] ? 'bg-primary justify-end' : 'bg-muted justify-start'}`}
                          onClick={() => handleToggle(item.id)}
                        >
                          <motion.div 
                            className="w-4 h-4 bg-white rounded-full shadow-md"
                            layout
                            initial={false}
                            transition={{
                              type: "spring",
                              stiffness: 700,
                              damping: 30
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <motion.div key="security" variants={contentVariants} initial="initial" animate="animate" exit="exit">
                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Update your password and secure your account.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5 max-w-md">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Current Password</label>
                        <Input type="password" {...registerPassword('currentPassword')} required className="transition-all focus:ring-primary/20" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">New Password</label>
                        <Input type="password" {...registerPassword('newPassword')} required minLength={8} className="transition-all focus:ring-primary/20" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Confirm New Password</label>
                        <Input type="password" {...registerPassword('confirmPassword')} required minLength={8} className="transition-all focus:ring-primary/20" />
                      </div>
                      <Button type="submit" disabled={isUpdatingPassword} className="transition-all">
                        {isUpdatingPassword ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Key className="w-4 h-4 mr-2" />}
                        {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                      </Button>
                    </form>

                    <div className="pt-6 border-t border-border/50">
                      <h4 className="text-sm font-medium mb-4">Active Sessions</h4>
                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border transition-all hover:bg-muted/50">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <Monitor className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Windows PC - Chrome</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Current Session • New York, US</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleRevokeSession} className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive transition-colors">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Account Settings */}
            {activeTab === 'account' && (
              <motion.div key="account" variants={contentVariants} initial="initial" animate="animate" exit="exit">
                <Card className="border-destructive/30 shadow-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-destructive flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" /> Danger Zone
                    </CardTitle>
                    <CardDescription>Irreversible and destructive actions for your account.</CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border border-destructive/20 bg-destructive/5 rounded-xl transition-all hover:border-destructive/40">
                      <div>
                        <h4 className="font-medium text-foreground">Delete Account</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                      </div>
                      <Button variant="destructive" onClick={handleDeleteAccount} className="shrink-0 flex items-center gap-2 transition-transform hover:scale-105 shadow-md">
                        <Trash2 className="w-4 h-4" /> Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
