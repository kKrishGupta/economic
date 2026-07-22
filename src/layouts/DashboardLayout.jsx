import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { useTheme } from '../providers/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Sun, Moon, Bell, Search, User, LogOut, 
  LayoutDashboard, Activity, Radio, FileText, Settings, ShieldAlert,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'USER'] },
  { name: 'Analysis', href: '/analysis', icon: Activity, roles: ['ADMIN'] },
  { name: 'Sensors', href: '/sensors', icon: Radio, roles: ['ADMIN'] },
  { name: 'Permits', href: '/permits', icon: FileText, roles: ['ADMIN'] },
  { name: 'About Us', href: '/dashboard-about', icon: FileText, roles: ['ADMIN', 'USER'] },
  { name: 'Admin', href: '/admin', icon: ShieldAlert, roles: ['ADMIN'] },
];

export function DashboardLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const queryClient = useQueryClient();
  const latestEval = queryClient.getQueryData(['latestEval']);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'System Online', message: 'SafeOps AI backend connected.', type: 'success', time: 'Just now', read: false }
  ]);

  // Dynamically push new notifications when latestEval changes
  React.useEffect(() => {
    if (latestEval) {
      const severity = latestEval.risk_fusion_out?.severity;
      const isAlert = severity === 'CRITICAL' || severity === 'HIGH';
      
      const newNotif = {
        id: Date.now(),
        title: `Eval: ${latestEval.action_taken}`,
        message: `Zone ${latestEval.zone_id} | Risk Score: ${latestEval.risk_fusion_out?.score?.toFixed(2) || 'N/A'}`,
        type: severity === 'CRITICAL' ? 'danger' : severity === 'HIGH' ? 'warning' : 'success',
        time: 'Just now',
        read: false
      };
      setNotifications(prev => [newNotif, ...prev].slice(0, 5)); // Keep last 5

      // Show dynamic toast popups based on severity
      if (isAlert) {
        toast.error(`⚠️ ALERT: ${latestEval.action_taken} in Zone ${latestEval.zone_id}`, {
          duration: 5000,
          position: 'top-right',
          id: `alert-${latestEval.zone_id}-${Date.now()}` // Prevent duplicates
        });
        
        // If the user is an admin, show that a mail alert was dispatched
        if (user?.role === 'ADMIN') {
          setTimeout(() => {
            toast('Emergency Mail Alert dispatched to Admin team', {
              icon: '📧',
              duration: 4000,
              position: 'top-right',
              id: `mail-${latestEval.zone_id}-${Date.now()}`
            });
          }, 500); // Small delay for visual effect
        }
      } else {
        toast.success(`Update: ${latestEval.action_taken}`, {
          duration: 3000,
          position: 'top-right',
          id: `update-${latestEval.zone_id}-${Date.now()}`
        });
      }
    }
  }, [latestEval, user?.role]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const filteredNavigation = navigation.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  return (
    <div className="h-screen w-full bg-background flex overflow-hidden font-sans text-foreground">
      {/* Sidebar Container */}
      <div
        className={cn(
          "flex flex-col border-r bg-card shadow-lg transition-all duration-300 ease-in-out shrink-0 overflow-hidden",
          sidebarOpen ? "w-[280px] md:w-64" : "w-0 border-r-0"
        )}
      >
        {/* Inner fixed-width container prevents content squishing during transition */}
        <div className="w-[280px] md:w-64 h-full flex flex-col shrink-0">
        <div className="flex h-16 items-center justify-between px-6 border-b shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight whitespace-nowrap">SafeOps <span className="text-primary">AI</span></span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-md border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shrink-0"
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold shadow-soft'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  'group flex items-center px-4 py-3 text-sm rounded-lg transition-all relative overflow-hidden'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute inset-0 bg-primary opacity-10"
                  />
                )}
                <item.icon
                  className={cn(
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground',
                    'mr-3 flex-shrink-0 h-5 w-5 transition-colors z-10'
                  )}
                  aria-hidden="true"
                />
                <span className="z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 p-2">
             <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
               {user?.name?.charAt(0) || 'U'}
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.role || 'Role'}</p>
             </div>
          </div>
        </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b glass z-30 transition-all">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-muted-foreground hover:text-foreground p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
              >
                <PanelLeftOpen className="w-5 h-5" />
              </button>
            )}
            <div className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="pl-9 pr-4 py-2 text-sm bg-muted/50 border-transparent rounded-full focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-64 focus:w-80"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-card animate-pulse"></span>
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-[-60px] sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 rounded-xl shadow-xl bg-card ring-1 ring-black ring-opacity-5 border z-50 origin-top-right overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b flex items-center justify-between bg-muted/30">
                      <h3 className="font-semibold text-sm">Notifications {unreadCount > 0 && `(${unreadCount})`}</h3>
                      <div className="flex items-center gap-3">
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">Mark all as read</button>
                        )}
                        <button onClick={() => setNotificationsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div key={notif.id} className={`px-4 py-3 border-b hover:bg-muted/50 transition-colors cursor-pointer flex gap-3 ${notif.read ? 'opacity-60' : ''}`}>
                          <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                            notif.type === 'danger' ? 'bg-destructive' : 
                            notif.type === 'warning' ? 'bg-warning' : 'bg-success'
                          }`} />
                          <div>
                            <p className={`text-sm text-foreground ${!notif.read ? 'font-bold' : 'font-medium'}`}>{notif.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                            <p className="text-xs text-muted-foreground mt-1 opacity-70">{notif.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 text-center border-t bg-muted/30">
                      <Link to="/dashboard" onClick={() => setNotificationsOpen(false)} className="text-sm text-primary font-medium hover:underline">View all</Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card ring-1 ring-black ring-opacity-5 border z-50 origin-top-right"
                  >
                    <div className="py-1">
                      <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted">
                        <User className="w-4 h-4 mr-2" /> Profile
                      </Link>
                      <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted">
                        <Settings className="w-4 h-4 mr-2" /> Settings
                      </Link>
                      <div className="h-px bg-border my-1" />
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
