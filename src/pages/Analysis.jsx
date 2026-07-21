import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle2, AlertCircle, Loader2, PlayCircle, ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useSubmitAnalysis, useAnalysisStatus } from '../hooks/useAnalysis';

export default function Analysis() {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  
  const { mutate: submitAnalysis, isPending: isSubmitting, isError: isSubmitError, error: submitError } = useSubmitAnalysis();
  const { data: statusData, isError: isPollError } = useAnalysisStatus(jobId);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1
  });

  const startAnalysis = () => {
    const payload = {
      zoneId: "ZONE_3",
      shiftRiskFactor: 0.15,
      sensorRawHistory: [
        [18.0, 28.0, 1.2],
        [21.0, 28.5, 1.2],
        [38.0, 31.0, 1.8]
      ],
      cvRawFrame: { 
        zoneId: "ZONE_3", 
        workersDetected: 2,
        violations: [
          { worker_id: "W_1", violation_type: "NO_HELMET" }
        ]
      },
      activePermitsRaw: [
        {
          permit_id: "HW_042",
          type: "HOT_WORK",
          zoneId: "ZONE_3",
          start_time: new Date().toISOString(),
          expiry: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
        }
      ]
    };

    submitAnalysis(payload, {
      onSuccess: (data) => {
        setJobId(data.jobId);
      }
    });
  };

  const handleReset = () => {
    setFile(null);
    setJobId(null);
  };

  const isPending = isSubmitting || (jobId && statusData && (statusData.status === 'PROCESSING' || statusData.status === 'PENDING'));
  const evalResult = statusData?.status === 'COMPLETED' ? statusData.result : null;
  const isError = isSubmitError || isPollError || statusData?.status === 'FAILED';
  const errorObj = submitError || (statusData?.errorMessage ? { response: { data: { detail: statusData.errorMessage } } } : null);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Safety Evaluation</h2>
        <p className="text-muted-foreground mt-2">Trigger a complete LangGraph agent evaluation across Sensor, CV, and Permit systems.</p>
      </div>

      <Card className="border-border/50 min-h-[400px]">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            {!isPending && !evalResult && !isError && (
              <motion.div
                key="step-upload"
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
                  <h3 className="text-lg font-semibold mb-2">Upload Camera Frame (Optional)</h3>
                  <p className="text-sm text-muted-foreground mb-4">Simulate the visual feed for the CV Agent.</p>
                  
                  {file && (
                    <div className="mt-4 p-4 bg-background border border-border rounded-xl inline-flex flex-col items-center">
                       <p className="text-sm font-medium">{file.name}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button size="lg" onClick={startAnalysis}>
                    Run Agent Evaluation <PlayCircle className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {isPending && (
              <motion.div
                key="step-processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center min-h-[300px] space-y-8"
              >
                <div className="relative w-32 h-32">
                   <div className="w-32 h-32 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" /> 
                    {statusData?.status === 'PROCESSING' ? 'Evaluating Safety Logic...' : 'Job Queued...'}
                  </h3>
                  <p className="text-muted-foreground">Running Sensor, CV, and Permit logic asynchronously...</p>
                </div>
              </motion.div>
            )}

            {isError && (
              <motion.div
                key="step-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center p-8 bg-destructive/10 border border-destructive/20 rounded-xl"
              >
                 <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                 <h3 className="text-xl font-bold text-destructive">Evaluation Failed</h3>
                 <p className="text-muted-foreground mt-2">{errorObj?.response?.data?.detail || 'The backend could not process the request.'}</p>
                 <Button variant="outline" className="mt-6" onClick={handleReset}>Try Again</Button>
              </motion.div>
            )}

            {evalResult && (
              <motion.div
                key="step-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className={`p-6 border rounded-xl flex items-center gap-6 ${evalResult.risk_fusion_out?.severity === 'CRITICAL' ? 'bg-destructive/10 border-destructive/30' : 'bg-success/10 border-success/30'}`}>
                   <ShieldAlert className={`w-12 h-12 ${evalResult.risk_fusion_out?.severity === 'CRITICAL' ? 'text-destructive' : 'text-success'}`} />
                   <div>
                     <h3 className="text-2xl font-bold">Action Taken: {evalResult.action_taken}</h3>
                     <p className="text-muted-foreground">Risk Score: {evalResult.risk_fusion_out?.score} | Severity: {evalResult.risk_fusion_out?.severity}</p>
                   </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                   <Card>
                     <CardContent className="p-6">
                       <h4 className="font-bold mb-2">Sensor Agent</h4>
                       <p className="text-sm">Anomaly Score: {evalResult.sensor_anomaly_out?.anomaly_score}</p>
                       <p className="text-sm">Severity: {evalResult.sensor_anomaly_out?.severity}</p>
                     </CardContent>
                   </Card>
                   <Card>
                     <CardContent className="p-6">
                       <h4 className="font-bold mb-2">CV Agent</h4>
                       <p className="text-sm">Violations: {evalResult.cv_safety_out?.violations?.length}</p>
                     </CardContent>
                   </Card>
                   <Card>
                     <CardContent className="p-6">
                       <h4 className="font-bold mb-2">Permit Agent</h4>
                       <p className="text-sm">Conflicts: {evalResult.permit_intel_out?.conflicts?.length}</p>
                     </CardContent>
                   </Card>
                </div>

                {evalResult.rag_compliance_out && (
                  <Card className="border-warning/50 bg-warning/5">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-warning mb-4">AI Compliance Recommendations (RAG)</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        {evalResult.rag_compliance_out.recommended_actions?.map((action, i) => (
                          <li key={i} className="text-sm">{action}</li>
                        ))}
                      </ul>
                      <div className="mt-4 pt-4 border-t border-warning/20">
                        <p className="text-xs text-muted-foreground">Sources cited: {evalResult.rag_compliance_out.rag_sources_cited?.join(', ')}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end">
                  <Button variant="outline" onClick={handleReset}>New Evaluation</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}