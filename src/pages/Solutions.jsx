import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Factory, Cog, Droplet } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Solutions() {
  const [expandedId, setExpandedId] = useState(null);

  const solutions = [
    { 
      title: "Manufacturing", 
      icon: Factory, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10",
      capabilities: [
        "Assembly line bottleneck detection",
        "Machine wear-and-tear predictive analytics",
        "Automated QA visual inspection",
        "Worker fatigue monitoring"
      ]
    },
    { 
      title: "Oil & Gas", 
      icon: Droplet, 
      color: "text-amber-500", 
      bg: "bg-amber-500/10",
      capabilities: [
        "Real-time optical gas leak detection",
        "Pressure valve anomaly alerts",
        "Offshore rig compliance monitoring",
        "Hazardous zone breach detection"
      ]
    },
    { 
      title: "Heavy Engineering", 
      icon: Cog, 
      color: "text-purple-500", 
      bg: "bg-purple-500/10",
      capabilities: [
        "Crane load sway analysis",
        "Structural integrity micro-fracture detection",
        "Hard-hat and PPE compliance tracking",
        "Heavy machinery proximity warnings"
      ]
    }
  ];

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
        {solutions.map((sol, i) => {
          const isExpanded = expandedId === i;
          return (
            <motion.div
              layout
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, layout: { duration: 0.3 } }}
              className="flex flex-col glass-card rounded-3xl p-8 hover-lift"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className={`w-32 h-32 rounded-2xl flex items-center justify-center flex-shrink-0 ${sol.bg}`}>
                  <sol.icon className={`w-16 h-16 ${sol.color}`} />
                </div>
                <div className="flex-1 w-full text-center md:text-left">
                  <h3 className="text-3xl font-bold mb-4">{sol.title}</h3>
                  <p className="text-lg text-muted-foreground mb-4">
                    Deploy specialized AI models trained on millions of hours of {sol.title.toLowerCase()} sector footage and sensor data to instantly recognize industry-specific hazards.
                  </p>
                  <Button 
                    variant={isExpanded ? "default" : "outline"}
                    onClick={() => setExpandedId(isExpanded ? null : i)}
                    className="transition-all"
                  >
                    {isExpanded ? 'Show Less' : 'Learn More'}
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border/50 pt-6 mt-8">
                      <h4 className="font-semibold text-lg mb-4 text-foreground">Key Capabilities:</h4>
                      <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        {sol.capabilities.map((cap, j) => (
                          <div key={j} className="flex items-center gap-3 bg-muted/30 p-3 rounded-lg">
                            <div className={`w-2 h-2 rounded-full ${sol.bg.replace('/10', '')} ${sol.color.replace('text', 'bg')}`} />
                            <span className="text-sm text-muted-foreground">{cap}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className="shadow-glow"
                        onClick={() => {
                          import('react-hot-toast').then(({ default: toast }) => {
                            toast.success(`Downloading ${sol.title} Case Study PDF...`, {
                              icon: '📄',
                            });
                          });
                        }}
                      >
                        View Case Studies
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
