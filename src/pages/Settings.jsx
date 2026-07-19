import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Shield, Bell, Moon, Sun, Monitor, Key, Smartphone, Mail, Trash2 } from 'lucide-react';
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

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword } = useForm();
  
  const onPasswordSubmit = (data) => {
    // Mock password update
    toast.success('Password updated successfully.');
    resetPassword();
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Key },
    { id: 'account', label: 'Account', icon: Shield },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-2">Manage your account preferences, appearance, and security.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 space-y-6">
          
          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <Card className="border-border/50">
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
                        className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                          theme === t.id
                            ? 'border-primary bg-primary/5 text-primary'
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
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what alerts you want to receive and how.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { title: 'Email Alerts', description: 'Receive daily summaries and critical alerts via email.', icon: Mail },
                  { title: 'Push Notifications', description: 'Receive real-time alerts in the dashboard.', icon: Smartphone },
                  { title: 'Critical Safety Alerts', description: 'Get immediately notified for anomaly detections.', icon: Shield },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-4 border-b border-border/50 last:border-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    {/* Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                      <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Update your password and secure your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Current Password</label>
                    <Input type="password" {...registerPassword('currentPassword')} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">New Password</label>
                    <Input type="password" {...registerPassword('newPassword')} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <Input type="password" {...registerPassword('confirmPassword')} required />
                  </div>
                  <Button type="submit">Update Password</Button>
                </form>

                <div className="pt-6 border-t border-border/50 mt-6">
                  <h4 className="text-sm font-medium mb-4">Active Sessions</h4>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <Monitor className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Windows PC - Chrome</p>
                        <p className="text-xs text-muted-foreground">Current Session • New York, US</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive">
                      Revoke
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Settings */}
          {activeTab === 'account' && (
            <Card className="border-border/50 border-destructive/30">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" /> Danger Zone
                </CardTitle>
                <CardDescription>Irreversible and destructive actions for your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">Delete Account</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                  </div>
                  <Button variant="destructive" className="shrink-0 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}

// Ensure AlertCircle is imported if used
import { AlertCircle } from 'lucide-react';
