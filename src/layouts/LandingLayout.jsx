import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Sun, Moon } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';
import { Button } from '../components/ui/Button';
import { PageTransition } from '../components/ui/PageTransition';
import { motion } from 'framer-motion';

export function LandingLayout() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isActive = (path) => location.pathname === path;

  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans flex flex-col">
      {/* Animated Background layers */}
      <div className="noise-overlay" />
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none -z-20 opacity-[0.15]" />
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] bg-gradient-aurora animate-blob pointer-events-none -z-10" />
      <div className="fixed top-[20%] right-[-10%] w-[40%] h-[60%] bg-accent/20 rounded-full blur-[100px] animate-blob animation-delay-2000 pointer-events-none -z-10" />
      <div className="fixed bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-secondary/20 rounded-full blur-[120px] animate-blob animation-delay-4000 pointer-events-none -z-10" />

      {/* Navbar */}
      <header className={`fixed top-0 z-50 w-full transition-all duration-500 ${isScrolled ? 'py-3' : 'py-6'}`}>
        <div className={`absolute inset-0 transition-all duration-500 ${isScrolled ? 'glass shadow-sm border-b' : 'bg-transparent border-transparent'}`} />
        <nav className="relative flex items-center justify-between px-6 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight">SafeOps <span className="text-primary">AI</span></span>
          </Link>
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <Link to="/features" className={`transition-colors ${isActive('/features') ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`}>Features</Link>
            <Link to="/solutions" className={`transition-colors ${isActive('/solutions') ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`}>Solutions</Link>
            <Link to="/pricing" className={`transition-colors ${isActive('/pricing') ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`}>Pricing</Link>
          </div>
          <div className="flex space-x-2 sm:space-x-4 items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full shrink-0"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Link to="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
            </Link>
            <Link to="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 w-full">
        <PageTransition mode="fade">
          <Outlet />
        </PageTransition>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="border-t border-border glass py-16 relative z-10 mt-auto"
      >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group inline-flex">
              <ShieldAlert className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
              <span className="text-xl font-bold">SafeOps AI</span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              The world's most advanced AI-powered safety platform for industrial environments.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/analysis" className="hover:text-primary transition-colors">Analysis</Link></li>
              <li><Link to="/sensors" className="hover:text-primary transition-colors">Sensors</Link></li>
              <li><Link to="/permits" className="hover:text-primary transition-colors">Permits</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
