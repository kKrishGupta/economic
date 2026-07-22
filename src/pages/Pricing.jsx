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
        {[
          {
            name: 'Starter',
            price: '$499',
            features: [
              'Up to 5 camera streams',
              'Basic anomaly detection',
              'Daily safety reports',
              'Email support'
            ]
          },
          {
            name: 'Professional',
            price: '$999',
            features: [
              'Up to 20 camera streams',
              'Advanced predictive maintenance',
              'Real-time alert notifications',
              'Priority 24/7 support'
            ]
          },
          {
            name: 'Enterprise',
            price: 'Custom',
            features: [
              'Unlimited camera streams',
              'Custom AI model training',
              'Dedicated success manager',
              'On-premise deployment options'
            ]
          }
        ].map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`glass-card rounded-3xl p-8 transition-all ${i === 1 ? 'border-primary shadow-glow scale-105 relative z-10' : 'border-border shadow-soft hover-lift'}`}
          >
            <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
            <div className="text-4xl font-extrabold mb-6">
              {tier.price}<span className="text-lg text-muted-foreground font-normal">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                  {feature}
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
