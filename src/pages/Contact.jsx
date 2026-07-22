import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function Contact() {
  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary transition-colors flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Contact</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Get in <span className="text-primary">Touch</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Our safety experts are ready to help you deploy intelligent monitoring.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <div className="flex items-start">
            <Mail className="w-6 h-6 text-primary mt-1 mr-4" />
            <div>
              <h3 className="text-lg font-bold">Email Us</h3>
              <p className="text-muted-foreground">contact@safeops.ai</p>
            </div>
          </div>
          <div className="flex items-start">
            <Phone className="w-6 h-6 text-primary mt-1 mr-4" />
            <div>
              <h3 className="text-lg font-bold">Call Us</h3>
              <p className="text-muted-foreground">+1 (800) 555-0199</p>
            </div>
          </div>
          <div className="flex items-start">
            <MapPin className="w-6 h-6 text-primary mt-1 mr-4" />
            <div>
              <h3 className="text-lg font-bold">Headquarters</h3>
              <p className="text-muted-foreground">100 Innovation Drive<br/>San Francisco, CA 94105</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 rounded-3xl hover-lift">
          <form className="space-y-4">
            <Input placeholder="Your Name" />
            <Input type="email" placeholder="Email Address" />
            <textarea 
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[120px]"
              placeholder="How can we help?"
            />
            <Button className="w-full">Send Message</Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
