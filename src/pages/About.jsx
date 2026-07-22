import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Building, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function About() {
  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary transition-colors flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">About Us</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Our <span className="text-primary">Mission</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          At SafeOps AI, we believe every worker deserves to return home safely. We are building the next generation of industrial intelligence to make zero-incident environments a reality.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
        {[
          { title: "Founded in 2026", icon: Building },
          { title: "2+ Enterprise Clients", icon: Globe },
          { title: "Team of AI Experts", icon: Users }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-8 glass-card rounded-2xl hover-lift"
          >
            <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold">{stat.title}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
