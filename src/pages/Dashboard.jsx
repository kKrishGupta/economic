import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../providers/AuthProvider';
import { 
  Activity, ShieldAlert, AlertTriangle, CheckCircle2, 
  Users, Clock, ThermometerSun, Radio, Zap
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useSystemHealth } from '../hooks/api/useDashboard';
import { useSafetySocket } from '../hooks/useSafetySocket';
import { useSimulatorMode, useUpdateSimulatorMode } from '../hooks/useSimulator';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  
  // Real backend polling for health
  const { data: healthData, isLoading: healthLoading } = useSystemHealth();

  const zoneId = 'ZONE_3';

  // STOMP WebSocket Connection
  const { isConnected, safetyData, error } = useSafetySocket(zoneId);

  // Simulator Control Hooks
  const { data: simModeData } = useSimulatorMode();
  const { mutate: updateMode, isPending: isUpdatingMode } = useUpdateSimulatorMode();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Determine colors based on severity
  const severity = safetyData?.risk_fusion_out?.severity || 'NORMAL';
  const isCritical = severity === 'CRITICAL';
  const isHigh = severity === 'HIGH';
  const isWarning = severity === 'MEDIUM';
  const scoreColor = isCritical ? '#ef4444' : isHigh ? '#f97316' : isWarning ? '#eab308' : '#22c55e';
  // Risk score is 0.0 (safe) to 1.0 (danger). Safety index = (1 - risk) * 100
  const scoreValue = safetyData?.risk_fusion_out?.score !== undefined ? ((1 - safetyData.risk_fusion_out.score) * 100) : 100;
  
  const chartData = [
    { name: 'Score', value: scoreValue },
    { name: 'Remaining', value: 100 - scoreValue }
  ];

  const sensorChartData = safetyData?.sensor_raw_history?.map((reading, index) => ({
    time: index,
    Gas: reading[0],
    Temp: reading[1],
    Pressure: reading[2],
  })) || [];

  return (
    <div className="space-y-6">
      {/* Live STOMP Connection Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Command Center</h2>
          <p className="text-muted-foreground mt-2">God-Level Real-Time Artificial Intelligence Feed.</p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2 mt-4 sm:mt-0">
           <div className="flex items-center gap-2">
             <span className={`flex items-center px-3 py-1 rounded-full text-xs font-bold border ${isConnected ? 'border-success text-success bg-success/10' : 'border-destructive text-destructive bg-destructive/10'}`}>
               {isConnected ? <Radio className="w-3 h-3 mr-2 animate-pulse" /> : <AlertTriangle className="w-3 h-3 mr-2" />}
               STOMP WebSocket: {isConnected ? 'LIVE' : 'DISCONNECTED'}
             </span>
           </div>
           {/* Quick Simulator Toggles */}
           <div className="flex items-center gap-2 mt-1">
             <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Sim Mode:</span>
             <div className="flex gap-1">
               {['NORMAL', 'DRIFT', 'SPIKE'].map((mode) => (
                 <Button 
                   key={mode}
                   variant={simModeData?.simulationMode === mode ? 'default' : 'outline'}
                   size="sm"
                   className={`h-6 text-[10px] px-2 py-0 ${user?.role !== 'ADMIN' ? 'opacity-50 cursor-not-allowed' : ''}`}
                   onClick={(e) => {
                     if (user?.role !== 'ADMIN') {
                       e.preventDefault();
                       toast.error("Only Admin can change simulation mode.");
                       return;
                     }
                     updateMode({ simulationMode: mode, zoneId: 'ZONE_3' });
                   }}
                   disabled={isUpdatingMode}
                 >
                   {mode}
                 </Button>
               ))}
             </div>
           </div>
           {error && (
             <span className="text-xs text-destructive flex items-center">
               <ShieldAlert className="w-3 h-3 mr-1" /> {error}
             </span>
           )}
        </div>
      </div>

      {/* Critical Anomaly Banner */}
      <AnimatePresence>
        {(isCritical || isHigh) && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="w-full bg-destructive/20 border-l-4 border-destructive p-4 rounded-r-md flex items-center justify-between"
          >
            <div className="flex items-center">
              <Zap className="w-6 h-6 text-destructive mr-3 animate-pulse" />
              <div>
                <h3 className="text-destructive font-bold">SYSTEM ANOMALY DETECTED</h3>
                <p className="text-sm text-destructive/80">Sensor fusion engine has detected anomalous signatures in ZONE_3.</p>
              </div>
            </div>
            {safetyData.action_taken !== 'NONE' && (
               <div className="px-4 py-2 bg-destructive text-destructive-foreground font-bold rounded animate-bounce">
                 ACTION: {safetyData.action_taken}
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Animated Radial Score */}
        <motion.div variants={itemVariants}>
          <Card className={`glass-card overflow-hidden relative group h-full hover-lift ${isCritical ? 'border-destructive/50 bg-destructive/5' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-0">
              <CardTitle className="text-sm font-medium">Live Safety Index</CardTitle>
              <Activity className={`w-4 h-4 ${isCritical ? 'text-destructive animate-pulse' : 'text-success'}`} />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-0 h-[120px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="80%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill={scoreColor} />
                    <Cell fill="var(--muted)" opacity={0.2} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute bottom-4 flex flex-col items-center">
                <span className="text-2xl font-black" style={{ color: scoreColor }}>
                  {scoreValue.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={`glass-card overflow-hidden relative group h-full hover-lift ${severity !== 'NORMAL' ? 'border-warning/50 bg-warning/5' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
              <AlertTriangle className={`w-4 h-4 ${safetyData?.risk_level !== 'NORMAL' ? 'text-warning' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mt-2" style={{ color: scoreColor }}>
                {severity || 'UNKNOWN'}
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                AI Evaluated Severity
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card overflow-hidden relative group h-full hover-lift">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold capitalize mt-2 ${healthData?.status === 'DOWN' ? 'text-destructive' : 'text-success'}`}>
                {healthData?.status || 'Unknown'}
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                {healthData?.status === 'UP' ? 'All systems operational' : 
                 healthData?.status === 'DOWN' ? 'Some components degraded' : 'Connecting...'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card overflow-hidden relative group h-full hover-lift">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Auto Mitigation</CardTitle>
              <ShieldAlert className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold mt-2 truncate">
                {safetyData?.action_taken || 'Awaiting Data'}
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                LangGraph Output
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 glass-card shadow-soft">
          <CardHeader>
            <CardTitle>AI Fusion Insights & Recommendations</CardTitle>
            <CardDescription>Real-time intelligence from the multi-agent fusion engine.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2">
               {/* Show Breakdown if available */}
               {safetyData?.risk_fusion_out?.breakdown && (
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                   {Object.entries(safetyData.risk_fusion_out.breakdown).map(([key, value]) => (
                     <div key={key} className="bg-muted/50 p-2 rounded-md border border-border/50 text-center">
                       <p className="text-[10px] text-muted-foreground uppercase">{key.replace('_', ' ')}</p>
                       <p className={`text-lg font-bold ${value > 0.5 ? 'text-destructive' : value > 0.2 ? 'text-warning' : 'text-success'}`}>
                         {(value * 100).toFixed(0)}%
                       </p>
                     </div>
                   ))}
                 </div>
               )}

               {/* Show Sensor Anomaly Intel */}
               {safetyData?.sensor_anomaly_out && (
                 <div className="bg-primary/5 p-3 rounded-lg border border-primary/20 flex items-center justify-between">
                   <div>
                     <p className="text-xs font-semibold text-primary uppercase">Sensor Anomaly Engine</p>
                     <p className="text-sm mt-1">Trend: <span className="font-bold">{safetyData.sensor_anomaly_out.trend}</span></p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-muted-foreground uppercase">Anomaly Score</p>
                     <p className="text-lg font-black text-primary">{(safetyData.sensor_anomaly_out.anomaly_score * 100).toFixed(1)}%</p>
                   </div>
                 </div>
               )}

               {/* Show Recommendations */}
               {safetyData?.rag_compliance_out?.recommended_actions && safetyData.rag_compliance_out.recommended_actions.length > 0 ? (
                 <div className="space-y-3 mt-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Recommended Mitigation</p>
                    {safetyData.rag_compliance_out.recommended_actions.map((rec, i) => (
                       <motion.div 
                         key={i}
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-start space-x-3"
                       >
                         <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                         <span className="text-sm">{rec}</span>
                       </motion.div>
                    ))}
                 </div>
               ) : (
                 <div className="mt-4 p-4 text-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                    No active compliance recommendations required. System is stable.
                 </div>
               )}

               {/* SHOW RAG SIMILAR INCIDENTS */}
               {safetyData?.rag_compliance_out?.similar_incidents && safetyData.rag_compliance_out.similar_incidents.length > 0 && (
                 <div className="space-y-3 mt-6 border-t border-border/50 pt-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Similar Historical Incidents (RAG)</p>
                    {safetyData.rag_compliance_out.similar_incidents.map((incident, i) => (
                       <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                         <div className="flex justify-between items-start mb-1">
                           <p className="font-bold text-sm text-destructive">{incident.plant}</p>
                           <span className="text-[10px] bg-destructive/20 text-destructive px-2 py-0.5 rounded-full font-bold">{(incident.similarity_score * 100).toFixed(0)}% Match</span>
                         </div>
                         <p className="text-xs text-muted-foreground mb-2 font-mono">{incident.date} - {incident.incident_id}</p>
                         <p className="text-sm mb-2">{incident.description}</p>
                         <div className="bg-destructive/20 p-2 rounded text-xs font-semibold text-destructive mt-2">Outcome: {incident.outcome}</div>
                       </motion.div>
                    ))}
                 </div>
               )}

               {/* SHOW RAG APPLICABLE REGULATIONS */}
               {safetyData?.rag_compliance_out?.applicable_regulations && safetyData.rag_compliance_out.applicable_regulations.length > 0 && (
                 <div className="space-y-3 mt-6 border-t border-border/50 pt-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Regulatory Violations (RAG)</p>
                    {safetyData.rag_compliance_out.applicable_regulations.map((reg, i) => (
                       <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-warning/10 border border-warning/20 rounded-lg flex items-start space-x-3">
                         <AlertTriangle className="w-4 h-4 mt-0.5 text-warning shrink-0" />
                         <div>
                           <p className="text-sm font-bold text-warning">{reg.title} (Clause {reg.clause})</p>
                           <p className="text-xs mt-1 text-foreground/90">{reg.requirement}</p>
                           <p className="text-[10px] text-muted-foreground mt-2 font-mono break-all">Source: {reg.source}</p>
                         </div>
                       </motion.div>
                    ))}
                 </div>
               )}
             </div>
           </CardContent>
        </Card>

        <Card className="md:col-span-3 glass-card shadow-soft">
          <CardHeader>
            <CardTitle>Live Violations Feed</CardTitle>
            <CardDescription>Computer vision infractions detected instantly.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {safetyData?.cv_safety_out?.violations && safetyData.cv_safety_out.violations.length > 0 ? (
                safetyData.cv_safety_out.violations.map((violation, idx) => (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="flex items-start space-x-4 bg-destructive/10 p-3 rounded-md border border-destructive/20"
                 >
                  <div className="mt-1 rounded-full p-2 bg-destructive/20">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-destructive">CV Violation ({violation.worker_id || 'Unknown'})</p>
                    <p className="text-xs mt-1">{violation.violation_type || JSON.stringify(violation)}</p>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Now
                  </div>
                </motion.div>
                ))
              ) : (
                <div className="text-sm text-success flex flex-col items-center justify-center p-8 border border-success/20 bg-success/5 rounded-md">
                  <CheckCircle2 className="w-8 h-8 mb-2 opacity-50" />
                  No violations detected
                </div>
              )}
              
              {safetyData?.permit_intel_out?.conflicts?.length > 0 && (
                <div className="mt-4 space-y-4 border-t border-border/50 pt-4">
                  <h4 className="text-sm font-semibold text-destructive flex items-center">
                    <ShieldAlert className="w-4 h-4 mr-2" /> Permit Conflicts Detected!
                  </h4>
                  {safetyData.permit_intel_out.conflicts.map((conflict, idx) => (
                    <motion.div 
                      key={`conflict-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-start space-x-4 bg-destructive/20 p-3 rounded-md border border-destructive/40"
                    >
                      <div className="flex-1 space-y-1">
                        <p className="text-xs font-bold text-destructive">{conflict.risk_description || conflict.reason}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-7 glass-card shadow-soft mt-6">
          <CardHeader>
            <CardTitle>Live Sensor Telemetry</CardTitle>
            <CardDescription>Real-time gas, temperature, and pressure readings for {zoneId || 'ZONE_3'}.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {sensorChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sensorChartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" opacity={0.2} />
                  <XAxis dataKey="time" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis yAxisId="left" stroke="var(--muted-foreground)" fontSize={12} domain={['auto', 'auto']} tickFormatter={(value) => value.toFixed(0)} />
                  <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={12} domain={['auto', 'auto']} tickFormatter={(value) => value.toFixed(2)} />
                  
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
                  <Legend />
                  
                  <Line yAxisId="left" type="monotone" dataKey="Gas" name="Gas (%)" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line yAxisId="left" type="monotone" dataKey="Temp" name="Temp (°C)" stroke="#f97316" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line yAxisId="right" type="monotone" dataKey="Pressure" name="Pressure (atm)" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                Waiting for sensor stream...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}