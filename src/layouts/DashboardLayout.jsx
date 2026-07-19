import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { useTheme } from '../providers/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Sun, Moon, Bell, Search, User, LogOut, 
  LayoutDashboard, Activity, Radio, FileText, Settings, ShieldAlert
} from 'lucide-react';
import { cn } from '../utils/cn';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Gas Leak Detected', message: 'Zone B has elevated methane levels.', type: 'danger', time: '2m ago', read: false },
    { id: 2, title: 'Permit Approved', message: 'Hot work permit for Sector 4 is approved.', type: 'success', time: '1h ago', read: false },
    { id: 3, title: 'Maintenance Required', message: 'Pump 03 vibrations exceeded threshold.', type: 'warning', time: '3h ago', read: false },
  ]);

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
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans text-foreground">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          x: sidebarOpen ? 0 : -320,
          width: 280
        }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card shadow-lg md:relative md:flex md:w-64 md:translate-x-0 transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center px-6 border-b">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">SafeOps <span className="text-primary">AI</span></span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="ml-auto md:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  'group flex items-center px-3 py-2.5 text-sm rounded-md transition-colors relative'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                  />
                )}
                <item.icon
                  className={cn(
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                    'mr-3 flex-shrink-0 h-5 w-5 transition-colors'
                  )}
                  aria-hidden="true"
                />
                {item.name}
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
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b bg-card/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-6 h-6" />
            </button>
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
                    className="absolute right-0 mt-2 w-80 rounded-xl shadow-xl bg-card ring-1 ring-black ring-opacity-5 border z-50 origin-top-right overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b flex items-center justify-between bg-muted/30">
                      <h3 className="font-semibold text-sm">Notifications {unreadCount > 0 && `(${unreadCount})`}</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">Mark all as read</button>
                      )}
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
        <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
