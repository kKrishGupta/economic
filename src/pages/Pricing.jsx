import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Pricing() {
  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary transition-colors flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Pricing</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Transparent <span className="text-primary">Pricing</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Scale your safety operations with predictable enterprise plans.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {['Starter', 'Professional', 'Enterprise'].map((tier, i) => (
          <motion.div
            key={tier}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`bg-card border rounded-3xl p-8 ${i === 1 ? 'border-primary shadow-xl scale-105' : 'border-border/50 shadow-sm'}`}
          >
            <h3 className="text-2xl font-bold mb-2">{tier}</h3>
            <div className="text-4xl font-extrabold mb-6">
              {i === 0 ? '$499' : i === 1 ? '$999' : 'Custom'}<span className="text-lg text-muted-foreground font-normal">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              {[1, 2, 3, 4].map((item) => (
                <li key={item} className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                  Feature item {item} description
                </li>
              ))}
            </ul>
            <Button className="w-full" variant={i === 1 ? 'default' : 'outline'}>
              Choose Plan
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
