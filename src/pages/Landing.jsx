import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Eye, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';

const features = [
  {
    name: 'Real-time Anomaly Detection',
    description: 'Instantly identify gas leaks, temperature spikes, and equipment failures using AI.',
    icon: Activity,
  },
  {
    name: 'Computer Vision Safety',
    description: 'Monitor PPE compliance and restricted zones automatically through existing cameras.',
    icon: Eye,
  },
  {
    name: 'Predictive Maintenance',
    description: 'Stop downtime before it happens by predicting mechanical failures with high accuracy.',
    icon: Zap,
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } }
};

export default function Landing() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="w-full relative overflow-hidden" ref={containerRef} onMouseMove={handleMouseMove}>
      
      {/* Interactive Cursor Spotlight overlay for the whole page */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-0 md:opacity-100 mix-blend-screen dark:mix-blend-overlay"
        animate={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary) / 0.05), transparent 40%)`
        }}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center max-w-5xl mx-auto relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="relative z-10"
        >
          <motion.div variants={fadeUpVariant} className="inline-block relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            <div className="relative inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8 backdrop-blur-md shimmer-effect cursor-default hover:border-primary/50 transition-colors">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
              Announcing SafeOps AI 2.0
            </div>
          </motion.div>
          
          <motion.h1 variants={fadeUpVariant} className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Industrial Safety, <br className="hidden md:block" />
            <span className="text-gradient drop-shadow-2xl text-glow relative inline-block">
              Powered by Intelligence
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 mix-blend-overlay"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </span>
          </motion.h1>
          
          <motion.p variants={fadeUpVariant} className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            The enterprise platform that predicts hazards, monitors environments, and ensures compliance <span className="text-foreground font-semibold">before accidents happen.</span> Protect your workforce with absolute confidence.
          </motion.p>
          
          <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full shadow-glow transition-all duration-300 relative overflow-hidden group hover:-translate-y-1">
                <span className="relative z-10 flex items-center">
                  Start Free Trial 
                  <motion.div className="ml-2" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full backdrop-blur-md bg-background/40 hover:bg-muted/50 border-border/50 hover:border-border transition-all hover:-translate-y-1">
                View Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Dashboard Preview / Glassmorphism showcase */}
      <section className="px-6 pb-32 max-w-6xl mx-auto relative z-10" style={{ perspective: "2000px" }}>
        <motion.div 
          initial={{ opacity: 0, y: 100, rotateX: 15 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.15 }}
          whileHover={{ scale: 1.02, rotateY: 1, rotateX: -1 }}
          className="rounded-2xl p-2 shadow-2xl relative animate-float-delayed glass"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Floating glowing orbs around mockup */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/30 rounded-full blur-[80px] -z-10 animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/30 rounded-full blur-[80px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
          
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 rounded-2xl pointer-events-none" />
          
          <div className="rounded-xl overflow-hidden border border-border/50 bg-background/80 shadow-inner relative z-10 backdrop-blur-xl">
             <div className="h-10 border-b flex items-center px-4 space-x-2 bg-muted/30">
                <div className="w-3 h-3 rounded-full bg-destructive/80 hover:bg-destructive transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-warning/80 hover:bg-warning transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-success/80 hover:bg-success transition-colors cursor-pointer" />
             </div>
             
             {/* Fake Dashboard Content with stagger reveals */}
             <motion.div 
               variants={staggerContainer}
               initial="hidden"
               whileInView="show"
               viewport={{ once: true }}
               className="p-8 grid md:grid-cols-3 gap-6"
             >
               <div className="col-span-2 space-y-6">
                  <motion.div variants={fadeUpVariant} className="h-40 rounded-xl bg-card border border-border/50 p-6 flex flex-col justify-between group hover:border-primary/30 transition-colors relative overflow-hidden shadow-soft">
                     <div className="w-1/3 h-4 rounded bg-muted-foreground/20 group-hover:bg-primary/20 transition-colors" />
                     <div className="flex items-end gap-4">
                        <motion.div initial={{ height: 0 }} whileInView={{ height: '4rem' }} transition={{ duration: 1, delay: 0.2 }} className="w-full rounded bg-primary/20 group-hover:bg-primary/40 transition-colors" />
                        <motion.div initial={{ height: 0 }} whileInView={{ height: '6rem' }} transition={{ duration: 1, delay: 0.3 }} className="w-full rounded bg-primary/40 group-hover:bg-primary/60 transition-colors" />
                        <motion.div initial={{ height: 0 }} whileInView={{ height: '5rem' }} transition={{ duration: 1, delay: 0.4 }} className="w-full rounded bg-primary/30 group-hover:bg-primary/50 transition-colors" />
                        <motion.div initial={{ height: 0 }} whileInView={{ height: '3rem' }} transition={{ duration: 1, delay: 0.5 }} className="w-full rounded bg-primary/10 group-hover:bg-primary/30 transition-colors" />
                     </div>
                  </motion.div>
                  <div className="grid grid-cols-2 gap-6">
                    <motion.div variants={fadeUpVariant} className="h-32 rounded-xl bg-card border border-border/50 p-6 group hover:border-primary/30 transition-colors shadow-soft">
                       <div className="w-1/2 h-4 rounded bg-muted-foreground/20 mb-4 group-hover:bg-primary/20 transition-colors" />
                       <div className="w-3/4 h-8 rounded bg-foreground/10" />
                    </motion.div>
                    <motion.div variants={fadeUpVariant} className="h-32 rounded-xl bg-card border border-border/50 p-6 group hover:border-primary/30 transition-colors shadow-soft">
                       <div className="w-1/2 h-4 rounded bg-muted-foreground/20 mb-4 group-hover:bg-primary/20 transition-colors" />
                       <div className="w-3/4 h-8 rounded bg-foreground/10" />
                    </motion.div>
                  </div>
               </div>
               
               <div className="space-y-6">
                  <motion.div variants={fadeUpVariant} className="h-full rounded-xl bg-card border border-border/50 p-6 space-y-4 group hover:border-primary/30 transition-colors shadow-soft">
                     <div className="w-1/2 h-4 rounded bg-muted-foreground/20 mb-8" />
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                         <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-3 h-3 rounded-full bg-destructive" />
                       </div>
                       <div className="flex-1 space-y-2">
                         <div className="w-full h-3 rounded bg-foreground/10" />
                         <div className="w-2/3 h-3 rounded bg-muted-foreground/20" />
                       </div>
                     </div>
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                         <div className="w-3 h-3 rounded-full bg-warning" />
                       </div>
                       <div className="flex-1 space-y-2">
                         <div className="w-full h-3 rounded bg-foreground/10" />
                         <div className="w-2/3 h-3 rounded bg-muted-foreground/20" />
                       </div>
                     </div>
                  </motion.div>
               </div>
             </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Preview */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-muted/20 skew-y-3 origin-top-left -z-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Enterprise-Grade <span className="text-gradient">Intelligence</span></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Our AI models are trained on millions of hours of industrial data to provide unparalleled accuracy in safety monitoring.</p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name}
                variants={fadeUpVariant}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card rounded-2xl p-8 group relative overflow-hidden transition-all duration-300 border border-border/50 hover:border-primary/50 hover:shadow-glow"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300 shadow-inner">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold mb-4 relative z-10">{feature.name}</h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-6 max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl p-12 md:p-20 overflow-hidden glass border border-primary/20"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-accent/5 pointer-events-none" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/30 rounded-full blur-[100px] pointer-events-none animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/30 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

          <div className="relative z-10">
            <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-8 animate-float" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Ready to transform your plant's safety?</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join industry leaders who trust SafeOps AI to protect their most valuable assets. Don't wait for an incident.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                 <Button size="lg" className="h-14 px-10 rounded-full text-lg shadow-glow transition-all hover:scale-105 active:scale-95">
                   Get Started Now
                 </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
