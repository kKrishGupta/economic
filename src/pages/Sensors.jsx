import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ThermometerSun, Wind, Droplets, Gauge, PlayCircle, Loader2, Activity } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useSensorAnalysis } from '../hooks/api/useSensors';
import { useSafetySocket } from '../hooks/useSafetySocket';

export default function Sensors() {
  const { mutate: analyzeSensor, isPending, data: mlSensorData, isError, error } = useSensorAnalysis();
  
  // Connect to the Live STOMP Websocket for Zone 3
  const { safetyData, isConnected } = useSafetySocket('ZONE_3');

  // Simulated rolling data for the chart, will be updated by the backend result AND the socket stream
  const [timeData, setTimeData] = useState([
    { time: '10:00', temp: 28.0, pressure: 1.2 },
    { time: '10:05', temp: 28.2, pressure: 1.2 },
    { time: '10:10', temp: 28.1, pressure: 1.2 },
    { time: '10:15', temp: 28.5, pressure: 1.2 },
  ]);

  const triggerLiveAnalysis = () => {
    const payload = {
      sensor_raw_history: [
        [18.0, 28.0, 1.2],
        [18.1, 28.2, 1.2],
        [18.0, 28.1, 1.2],
        [25.0, 29.5, 1.5], // Simulating a drift
        [38.0, 31.0, 1.8], // Simulating anomaly
      ]
    };
    analyzeSensor(payload);
  };

  // Update chart when websocket sends new data
  useEffect(() => {
    if (safetyData?.sensor_data) {
      const now = new Date();
      setTimeData(prev => [
        ...prev.slice(1), 
        { 
          time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`, 
          temp: safetyData.sensor_data.temperature || 28.0, 
          pressure: safetyData.sensor_data.gas_pressure || 1.2 
        }
      ]);
    }
  }, [safetyData]);

  const getStatusColor = (severity) => {
    if (severity === 'CRITICAL') return 'text-destructive';
    if (severity === 'HIGH') return 'text-warning';
    return 'text-success';
  };

  const currentTemp = safetyData?.sensor_data?.temperature?.toFixed(1) || '28.5';
  const currentPressure = safetyData?.sensor_data?.gas_pressure?.toFixed(1) || '1.2';
  const severity = safetyData?.risk_fusion_out?.severity || 'NORMAL';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Live Sensor Telemetry
            {isConnected && (
              <span className="flex items-center text-xs font-bold px-2 py-1 bg-success/10 text-success rounded-full border border-success/20">
                <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" /> LIVE
              </span>
            )}
          </h2>
          <p className="text-muted-foreground mt-2">Real-time PyTorch LSTM monitoring across all facility zones.</p>
        </div>
        <Button onClick={triggerLiveAnalysis} disabled={isPending} className="whitespace-nowrap shadow-glow">
          {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <PlayCircle className="w-4 h-4 mr-2" />}
          Run LSTM Inference
        </Button>
      </div>

      {isError && (
         <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
           Error running sensor analysis: {error?.response?.data?.detail || 'Network error'}
         </div>
      )}

      {mlSensorData && (
        <Card className={`glass-card border-${getStatusColor(mlSensorData.severity).split('-')[1]}/50`}>
          <CardHeader>
            <CardTitle className={getStatusColor(mlSensorData.severity)}>
              Anomaly Detected: {mlSensorData.severity}
            </CardTitle>
            <CardDescription>LSTM Autoencoder Reconstruction Score: {mlSensorData.anomaly_score?.toFixed(4)}</CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { name: 'Core Temp', value: `${currentTemp}°C`, status: severity, icon: ThermometerSun, color: getStatusColor(severity) },
          { name: 'Gas Pressure', value: `${currentPressure} kPa`, status: 'Normal', icon: Wind, color: 'text-primary' },
          { name: 'Humidity', value: '45%', status: 'Normal', icon: Droplets, color: 'text-primary' },
          { name: 'Vibration', value: '0.8 g', status: 'Normal', icon: Gauge, color: 'text-primary' },
        ].map((sensor, index) => (
          <motion.div
            key={sensor.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`glass-card hover-lift relative overflow-hidden group ${sensor.status === 'CRITICAL' ? 'border-destructive/50' : ''}`}>
              {sensor.status === 'CRITICAL' && <div className="absolute top-0 right-0 w-2 h-2 m-4 bg-destructive rounded-full animate-ping" />}
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{sensor.name}</CardTitle>
                <div className={`p-2 rounded-lg bg-muted group-hover:scale-110 transition-transform`}>
                  <sensor.icon className={`w-4 h-4 ${sensor.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{sensor.value}</div>
                <div className={`text-xs mt-1 font-medium ${sensor.color}`}>
                  Status: {sensor.status}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Temperature Timeline (Zone 3)</CardTitle>
            <CardDescription>Continuous monitoring with AI anomaly overlay.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    />
                    <Line type="monotone" dataKey="temp" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--background))", strokeWidth: 2 }} activeDot={{ r: 6, fill: "hsl(var(--primary))" }} />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Pressure Variance (Zone 3)</CardTitle>
            <CardDescription>Correlated with temperature spikes.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    />
                    <Bar dataKey="pressure" fill="hsl(var(--secondary-foreground))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}