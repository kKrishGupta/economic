import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Eye, Zap } from 'lucide-react';
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

export default function Landing() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Announcing SafeOps AI 2.0
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Industrial Safety, <br className="hidden md:block" />
            <span className="text-gradient">Powered by Intelligence</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            The enterprise platform that predicts hazards, monitors environments, and ensures compliance before accidents happen. Protect your workforce with absolute confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full backdrop-blur-sm bg-background/50 border-muted">
                View Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Dashboard Preview / Glassmorphism showcase */}
      <section className="px-6 pb-32 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-2xl glass p-2 shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 rounded-2xl pointer-events-none" />
          <div className="rounded-xl overflow-hidden border border-border/50 bg-background/80 shadow-inner">
             <div className="h-10 border-b flex items-center px-4 space-x-2 bg-muted/50">
                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                <div className="w-3 h-3 rounded-full bg-warning/80" />
                <div className="w-3 h-3 rounded-full bg-success/80" />
             </div>
             <div className="p-8 grid md:grid-cols-3 gap-6">
               {/* Fake Dashboard Content */}
               <div className="col-span-2 space-y-6">
                  <div className="h-40 rounded-xl bg-card border border-border/50 p-6 flex flex-col justify-between">
                     <div className="w-1/3 h-4 rounded bg-muted-foreground/20" />
                     <div className="flex items-end gap-4">
                        <div className="w-full h-16 rounded bg-primary/20" />
                        <div className="w-full h-24 rounded bg-primary/40" />
                        <div className="w-full h-20 rounded bg-primary/30" />
                        <div className="w-full h-12 rounded bg-primary/10" />
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="h-32 rounded-xl bg-card border border-border/50 p-6">
                       <div className="w-1/2 h-4 rounded bg-muted-foreground/20 mb-4" />
                       <div className="w-3/4 h-8 rounded bg-foreground/10" />
                    </div>
                    <div className="h-32 rounded-xl bg-card border border-border/50 p-6">
                       <div className="w-1/2 h-4 rounded bg-muted-foreground/20 mb-4" />
                       <div className="w-3/4 h-8 rounded bg-foreground/10" />
                    </div>
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="h-full rounded-xl bg-card border border-border/50 p-6 space-y-4">
                     <div className="w-1/2 h-4 rounded bg-muted-foreground/20 mb-8" />
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-destructive/20" />
                       <div className="flex-1 space-y-2">
                         <div className="w-full h-3 rounded bg-foreground/10" />
                         <div className="w-2/3 h-3 rounded bg-muted-foreground/20" />
                       </div>
                     </div>
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-warning/20" />
                       <div className="flex-1 space-y-2">
                         <div className="w-full h-3 rounded bg-foreground/10" />
                         <div className="w-2/3 h-3 rounded bg-muted-foreground/20" />
                       </div>
                     </div>
                  </div>
               </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Features Preview */}
      <section className="py-24 bg-muted/30 border-y border-border/50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-Grade Intelligence</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Our AI models are trained on millions of hours of industrial data to provide unparalleled accuracy in safety monitoring.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-2xl p-8 hover-lift hover:border-primary/50 group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.name}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to transform your plant's safety?</h2>
        <p className="text-xl text-muted-foreground mb-10">Join industry leaders who trust SafeOps AI to protect their most valuable assets.</p>
        <Link to="/register">
           <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-xl shadow-primary/20">
             Get Started Now
           </Button>
        </Link>
      </section>
    </div>
  );
}
