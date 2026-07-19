import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle2, AlertCircle, Loader2, PlayCircle, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useSubmitAnalysis, useAnalysisStatus } from '../hooks/useAnalysis';

const steps = [
  { id: 'upload', name: 'Data Upload' },
  { id: 'processing', name: 'AI Analysis' },
  { id: 'results', name: 'Results' }
];

export default function Analysis() {
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);

  const { mutateAsync: submitAnalysis, isPending: isSubmitting } = useSubmitAnalysis();
  const { data: jobStatus, isLoading: isPolling } = useAnalysisStatus(jobId);

  useEffect(() => {
    if (jobStatus) {
      if (jobStatus.status === 'COMPLETED') {
        setCurrentStep(2);
      } else if (jobStatus.status === 'FAILED') {
        setCurrentStep(2); // We can render error in step 2
      }
    }
  }, [jobStatus]);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
    },
    maxFiles: 1
  });

  const startAnalysis = async () => {
    setCurrentStep(1);
    
    // Construct a valid payload matching AnalysisRequest
    const payload = {
      zoneId: "Zone B",
      shiftRiskFactor: 0.15,
      sensorRawHistory: [[10.5, 2.1], [11.0, 2.3], [12.4, 2.8]],
      cvRawFrame: { "camera": "cam-01", "objects": ["person", "hardhat"] },
      activePermitsRaw: [{ "permitId": "PTW-100", "type": "Hot Work" }]
    };

    try {
      const response = await submitAnalysis(payload);
      if (response && response.jobId) {
        setJobId(response.jobId);
      }
    } catch (error) {
      setCurrentStep(0);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setFile(null);
    setJobId(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Analysis Workspace</h2>
        <p className="text-muted-foreground mt-2">Submit sensor data logs or camera frames for deep neural network analysis via async job queue.</p>
      </div>

      {/* Stepper */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 rounded" />
        <div className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 rounded transition-all duration-500 ease-in-out" 
             style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
        
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-300 ${
                  isCompleted ? 'bg-primary text-primary-foreground' :
                  isCurrent ? 'bg-background border-2 border-primary text-primary' :
                  'bg-background border-2 border-border text-muted-foreground'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-semibold">{index + 1}</span>}
                </div>
                <span className={`mt-2 text-sm font-medium ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <Card className="border-border/50 min-h-[400px]">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Upload Payload JSON (Optional)</h3>
                  <p className="text-sm text-muted-foreground mb-4">Click "Start Analysis" to use the default payload.</p>
                  
                  {file && (
                    <div className="mt-6 p-3 bg-background border border-border rounded-lg inline-flex items-center gap-3">
                       <BarChart3 className="w-5 h-5 text-primary" />
                       <div className="text-left">
                         <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                         <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                       </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button size="lg" onClick={startAnalysis} isLoading={isSubmitting}>
                    Start Analysis <PlayCircle className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center justify-center min-h-[300px] space-y-8"
              >
                <div className="relative w-32 h-32">
                   <div className="w-32 h-32 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" /> Job Status: {jobStatus?.status || 'SUBMITTED'}
                  </h3>
                  <p className="text-muted-foreground">Job ID: {jobId}</p>
                  <p className="text-sm text-primary animate-pulse">Polling backend for results...</p>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && jobStatus && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {jobStatus.status === 'COMPLETED' ? (
                  <>
                    <div className="flex items-center justify-between p-6 bg-success/10 border border-success/20 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center text-success-foreground shadow-lg shadow-success/30">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-success">Analysis Complete</h3>
                          <p className="text-sm font-medium">Job {jobId} finished successfully.</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-muted/50 rounded-xl border border-border">
                      <h4 className="font-semibold mb-4">Raw Result Data</h4>
                      <pre className="text-xs text-muted-foreground bg-card p-4 rounded border overflow-x-auto">
                        {JSON.stringify(jobStatus.result, null, 2)}
                      </pre>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between p-6 bg-destructive/10 border border-destructive/20 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground shadow-lg shadow-destructive/30">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-destructive">Analysis Failed</h3>
                        <p className="text-sm font-medium">Job {jobId} encountered an error.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <Button variant="outline" onClick={reset}>Analyze Another</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}