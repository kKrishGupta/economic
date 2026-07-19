import React from 'react';
import { motion } from 'framer-motion';
import { ThermometerSun, Wind, Droplets, Gauge } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

const timeData = [
  { time: '10:00', temp: 65, pressure: 1.2 },
  { time: '10:05', temp: 66, pressure: 1.2 },
  { time: '10:10', temp: 68, pressure: 1.3 },
  { time: '10:15', temp: 85, pressure: 1.8 }, // anomaly
  { time: '10:20', temp: 88, pressure: 2.1 }, // anomaly
  { time: '10:25', temp: 72, pressure: 1.4 },
  { time: '10:30', temp: 67, pressure: 1.2 },
];

const sensors = [
  { name: 'Core Temp', value: '67°C', status: 'Normal', icon: ThermometerSun, color: 'text-primary' },
  { name: 'Gas Pressure', value: '1.2 kPa', status: 'Normal', icon: Wind, color: 'text-primary' },
  { name: 'Humidity', value: '45%', status: 'Normal', icon: Droplets, color: 'text-primary' },
  { name: 'Vibration', value: '0.8 g', status: 'Warning', icon: Gauge, color: 'text-warning' },
];

export default function Sensors() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Live Sensor Telemetry</h2>
        <p className="text-muted-foreground mt-2">Real-time monitoring across all facility zones.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {sensors.map((sensor, index) => (
          <motion.div
            key={sensor.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`border-border/50 relative overflow-hidden group ${sensor.status === 'Warning' ? 'border-warning/50' : ''}`}>
              {sensor.status === 'Warning' && <div className="absolute top-0 right-0 w-2 h-2 m-4 bg-warning rounded-full animate-ping" />}
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{sensor.name}</CardTitle>
                <div className={`p-2 rounded-lg bg-muted group-hover:scale-110 transition-transform`}>
                  <sensor.icon className={`w-4 h-4 ${sensor.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sensor.value}</div>
                <div className={`text-xs mt-1 font-medium ${sensor.status === 'Warning' ? 'text-warning' : 'text-success'}`}>
                  Status: {sensor.status}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Temperature Timeline (Zone Alpha)</CardTitle>
            <CardDescription>Continuous monitoring with AI anomaly overlay.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    />
                    <Line type="monotone" dataKey="temp" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--background))", strokeWidth: 2 }} activeDot={{ r: 6, fill: "hsl(var(--primary))" }} />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Pressure Variance (Zone Alpha)</CardTitle>
            <CardDescription>Correlated with temperature spikes.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
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