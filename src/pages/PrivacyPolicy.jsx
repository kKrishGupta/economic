import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary transition-colors flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Privacy Policy</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-8">Last updated: October 2024</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-foreground/80">
          <p>
            At SafeOps AI, we take your privacy and the security of your industrial data seriously. 
            This Privacy Policy describes how we collect, use, and handle your information when you use our platform.
          </p>

          <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Information We Collect</h3>
          <p>
            We collect data provided by your sensors, cameras, and IoT devices connected to the SafeOps AI platform. 
            All computer vision streams are processed on edge devices or secure encrypted clouds, and no raw video footage is stored without explicit consent.
          </p>

          <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">2. How We Use Data</h3>
          <p>
            Your data is used strictly for safety analysis, anomaly detection, and providing insights within your organization's dashboard. 
            We do not sell industrial data or use your specific metrics to train generalized models shared with competitors.
          </p>

          <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Data Security</h3>
          <p>
            We implement industry-standard security measures including AES-256 encryption at rest and TLS 1.3 in transit to ensure your operational data remains confidential and tamper-proof.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
