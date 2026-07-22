import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle2, AlertCircle, Loader2, PlayCircle, ShieldAlert, Camera, CameraOff, Video } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useSubmitAnalysis, useAnalysisStatus } from '../hooks/useAnalysis';
import { api } from '../services/api/axios';
import { toast } from 'react-hot-toast';

export default function Analysis() {
  const [mode, setMode] = useState('upload'); // 'upload' | 'live'
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [isCameraRunning, setIsCameraRunning] = useState(false);
  const [liveData, setLiveData] = useState(null);
  
  const { mutate: submitAnalysis, isPending: isSubmitting, isError: isSubmitError, error: submitError } = useSubmitAnalysis();
  const { data: statusData, isError: isPollError } = useAnalysisStatus(jobId);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [isStoppingCamera, setIsStoppingCamera] = useState(false);

  useEffect(() => {
    let eventSource;
    if (isCameraRunning) {
      eventSource = new EventSource(`/api/cv/stream`);
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLiveData(data);
        } catch (e) {
          console.error("Error parsing stream data", e);
        }
      };
    }
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [isCameraRunning]);

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

  const handleStartAnalysis = () => {
    const payload = {
      zoneId: "ZONE_3",
      shiftRiskFactor: 0.15,
      sensorRawHistory: [
        [18.0, 28.0, 1.2], [21.0, 28.5, 1.2], [38.0, 31.0, 1.8]
      ],
      cvRawFrame: { 
        zoneId: "ZONE_3", 
        workersDetected: 2,
        violations: [{ worker_id: "W_1", violation_type: "NO_HELMET" }]
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
    submitAnalysis(payload, { onSuccess: (data) => setJobId(data.jobId) });
  };

  const toggleCamera = async () => {
    if (isCameraRunning) {
      try {
        setIsStoppingCamera(true);
        await fetch('/api/camera/stop', { method: 'POST' });
        setIsCameraRunning(false);
        setLiveData(null);
      } catch (error) {
        console.error("Failed to stop camera:", error);
        toast.error("Failed to stop camera on the server.");
      } finally {
        setIsStoppingCamera(false);
      }
    } else {
      try {
        setIsStartingCamera(true);
        await fetch('/api/camera/start', { method: 'POST' });
        setIsCameraRunning(true);
      } catch (error) {
        console.error("Failed to start camera:", error);
        toast.error(error.response?.data?.message || error.response?.data?.detail || "Failed to start camera on the server.");
      } finally {
        setIsStartingCamera(false);
      }
    }
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

      <div className="flex gap-4 mb-4">
        <Button 
          variant={mode === 'upload' ? 'default' : 'outline'} 
          onClick={() => { setMode('upload'); handleReset(); }}
        >
          <Upload className="w-4 h-4 mr-2" /> Upload Image
        </Button>
        <Button 
          variant={mode === 'live' ? 'default' : 'outline'} 
          onClick={() => { setMode('live'); handleReset(); }}
        >
          <Video className="w-4 h-4 mr-2" /> Live Camera
        </Button>
      </div>

      <Card className="glass-card min-h-[400px]">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            {mode === 'upload' && !isPending && !evalResult && !isError && (
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
                  <h3 className="text-lg font-semibold mb-2">Upload Camera Frame</h3>
                  <p className="text-sm text-muted-foreground mb-4">Simulate the visual feed for the CV Agent.</p>
                  
                  {file && (
                    <div className="mt-4 p-4 bg-background border border-border rounded-xl inline-flex flex-col items-center">
                       <p className="text-sm font-medium">{file.name}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button size="lg" onClick={handleStartAnalysis}>
                    Run Agent Evaluation <PlayCircle className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {mode === 'live' && (
              <motion.div
                key="step-live"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between p-6 border rounded-xl bg-accent/10">
                  <div>
                    <h3 className="text-lg font-semibold">Live Camera Processing</h3>
                    <p className="text-sm text-muted-foreground">Start the camera to begin real-time CV analysis.</p>
                  </div>
                  <Button 
                    size="lg" 
                    variant={isCameraRunning ? "destructive" : "default"}
                    onClick={toggleCamera}
                    disabled={isStartingCamera || isStoppingCamera}
                  >
                    {isCameraRunning ? (
                      <><CameraOff className="w-5 h-5 mr-2" /> Stop Camera</>
                    ) : (
                      <><Camera className="w-5 h-5 mr-2" /> Start Camera</>
                    )}
                  </Button>
                </div>

                {isCameraRunning && (
                  <div className="space-y-4">
                    <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg border ${liveData?.violations?.length > 0 ? 'bg-destructive/10 border-destructive/30' : 'bg-success/10 border-success/30'}`}>
                      <div className={`w-3 h-3 rounded-full animate-pulse ${liveData?.violations?.length > 0 ? 'bg-destructive' : 'bg-success'}`} />
                      <span className={`font-semibold text-sm ${liveData?.violations?.length > 0 ? 'text-destructive' : 'text-success'}`}>
                        {liveData?.violations?.length > 0 ? 'WARNING: Safety Violations Detected' : 'Live Feed Active - All Compliant'}
                      </span>
                    </div>

                    <div className={`rounded-xl overflow-hidden border-4 max-w-2xl mx-auto shadow-[0_0_30px_rgba(0,0,0,0.1)] relative transition-all duration-300 ${liveData?.violations?.length > 0 ? 'border-destructive shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'border-success shadow-[0_0_30px_rgba(34,197,94,0.3)]'}`}>
                      <img 
                        src="/api/cv/video_stream" 
                        alt="Live YOLO CV Feed" 
                        className="w-full h-auto object-cover" 
                      />
                      {/* Overlay to make it look like AI is analyzing */}
                      <div className="absolute inset-0 border-2 border-primary/50 animate-pulse pointer-events-none rounded-xl" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <Card className="bg-background">
                        <CardContent className="p-4">
                          <h4 className="text-sm font-semibold text-muted-foreground mb-2">Workers Detected</h4>
                          <p className="text-3xl font-bold">{liveData ? liveData.workers_detected : '--'}</p>
                        </CardContent>
                      </Card>
                      <Card className={`transition-all duration-300 ${liveData?.violations?.length > 0 ? 'bg-destructive/10 border-destructive/30' : 'bg-success/10 border-success/30'}`}>
                        <CardContent className="p-4 flex flex-col items-center justify-center">
                          <h4 className={`text-sm font-semibold mb-2 ${liveData?.violations?.length > 0 ? 'text-destructive' : 'text-success'}`}>Active Violations</h4>
                          <p className={`text-4xl font-black ${liveData?.violations?.length > 0 ? 'text-destructive' : 'text-success'}`}>{liveData ? liveData.violations?.length : '--'}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {liveData?.violations?.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <h4 className="font-semibold text-destructive flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" /> Safety Alerts
                        </h4>
                        {liveData.violations.map((v, i) => (
                          <div key={i} className="p-3 border border-destructive/20 bg-destructive/10 rounded-lg flex justify-between items-center">
                            <span className="font-medium text-destructive">{v.violation_type}</span>
                            <span className="text-sm text-destructive/80">Worker: {v.worker_id} ({(v.confidence * 100).toFixed(0)}%)</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Remaining result screens for Upload Mode... */}
            {mode === 'upload' && isPending && (
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

            {mode === 'upload' && isError && (
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

            {mode === 'upload' && evalResult && (
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