import React from 'react';
import { motion } from 'framer-motion';
import { Users, Building, Globe } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export default function DashboardAbout() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">About SafeOps AI</h2>
        <p className="text-muted-foreground mt-2">Learn more about our mission and vision.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center my-12"
      >
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
          Our <span className="text-primary">Mission</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          At SafeOps AI, we believe every worker deserves to return home safely. We are building the next generation of industrial intelligence to make zero-incident environments a reality.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
        {[
          { title: "Founded in 2026", icon: Building },
          { title: "50+ Enterprise Clients", icon: Globe },
          { title: "Team of AI Experts", icon: Users }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Card className="text-center glass-card h-full flex flex-col justify-center py-8 hover-lift">
              <CardContent className="pt-6">
                <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold">{stat.title}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
