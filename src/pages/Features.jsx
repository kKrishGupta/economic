import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Activity, ShieldAlert, Eye, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Features() {
  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary transition-colors flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Features</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Powerful Features for <span className="text-primary">Safety</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore the comprehensive suite of AI tools designed to protect your plant and your people.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {[
          { title: "Anomaly Detection", icon: Activity, desc: "Real-time AI monitoring of all operational metrics." },
          { title: "Computer Vision", icon: Eye, desc: "Detect PPE violations and unauthorized access instantly." },
          { title: "Predictive Maintenance", icon: Zap, desc: "Forecast equipment failures before they happen." },
          { title: "Automated Permitting", icon: ShieldAlert, desc: "Streamline safety permits and compliance checks." }
        ].map((feat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <feat.icon className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-2">{feat.title}</h3>
            <p className="text-muted-foreground">{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
