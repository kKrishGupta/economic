import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Factory, Cog, Droplet } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Solutions() {
  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary transition-colors flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Solutions</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Tailored for your <span className="text-primary">Industry</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          SafeOps AI adapts to the unique safety challenges of various industrial sectors.
        </p>
      </motion.div>

      <div className="space-y-12 max-w-4xl mx-auto">
        {[
          { title: "Manufacturing", icon: Factory, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Oil & Gas", icon: Droplet, color: "text-amber-500", bg: "bg-amber-500/10" },
          { title: "Heavy Engineering", icon: Cog, color: "text-purple-500", bg: "bg-purple-500/10" }
        ].map((sol, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center gap-8 bg-card border border-border/50 rounded-3xl p-8 shadow-sm"
          >
            <div className={`w-32 h-32 rounded-2xl flex items-center justify-center flex-shrink-0 ${sol.bg}`}>
              <sol.icon className={`w-16 h-16 ${sol.color}`} />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-4">{sol.title}</h3>
              <p className="text-lg text-muted-foreground mb-4">
                Deploy specialized AI models trained on millions of hours of {sol.title.toLowerCase()} sector footage and sensor data to instantly recognize industry-specific hazards.
              </p>
              <Button variant="outline">Learn More</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
