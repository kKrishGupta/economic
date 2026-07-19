import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../providers/AuthProvider';
import { 
  Activity, ShieldAlert, AlertTriangle, CheckCircle2, 
  TrendingUp, Users, Clock, ThermometerSun, FileText
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

const safetyData = [
  { time: '08:00', score: 98, incidents: 0 },
  { time: '09:00', score: 95, incidents: 1 },
  { time: '10:00', score: 96, incidents: 0 },
  { time: '11:00', score: 88, incidents: 3 },
  { time: '12:00', score: 92, incidents: 1 },
  { time: '13:00', score: 97, incidents: 0 },
  { time: '14:00', score: 99, incidents: 0 },
];

const anomalyData = [
  { name: 'Mon', count: 4 },
  { name: 'Tue', count: 2 },
  { name: 'Wed', count: 7 },
  { name: 'Thu', count: 1 },
  { name: 'Fri', count: 3 },
  { name: 'Sat', count: 0 },
  { name: 'Sun', count: 0 },
];

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role !== 'ADMIN') {
    return <UserDashboardView user={user} />;
  }

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-2">Real-time insights and system health status.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-border/50 shadow-sm overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Plant Safety Score</CardTitle>
              <ShieldAlert className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 text-success mr-1" />
                <span className="text-success">+2.1%</span> from last week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-border/50 shadow-sm overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-warning/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="w-4 h-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">3</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-border/50 shadow-sm overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                Across 4 active zones
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-border/50 shadow-sm overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Temp (Zone B)</CardTitle>
              <ThermometerSun className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">84°C</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 text-destructive mr-1" />
                <span className="text-destructive">+4°C</span> above normal
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 border-border/50">
          <CardHeader>
            <CardTitle>Safety Score Trend</CardTitle>
            <CardDescription>Real-time AI evaluation of overall plant safety over the last 8 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={safetyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[80, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-border/50">
          <CardHeader>
            <CardTitle>Recent Anomalies</CardTitle>
            <CardDescription>Detected incidents requiring review.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { type: 'Gas Leak Detected', zone: 'Sector 4', time: '10 mins ago', level: 'High', color: 'text-destructive', bg: 'bg-destructive/10' },
                { type: 'PPE Missing', zone: 'Main Entrance', time: '1 hour ago', level: 'Medium', color: 'text-warning', bg: 'bg-warning/10' },
                { type: 'Temperature Spike', zone: 'Boiler Room', time: '2 hours ago', level: 'Medium', color: 'text-warning', bg: 'bg-warning/10' },
                { type: 'Unauthorized Access', zone: 'Server Room', time: '5 hours ago', level: 'Low', color: 'text-muted-foreground', bg: 'bg-muted' },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className={`mt-1 rounded-full p-2 ${item.bg}`}>
                    <Activity className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{item.type}</p>
                    <p className="text-xs text-muted-foreground">{item.zone}</p>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UserDashboardView({ user }) {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome, {user?.username || 'User'}!</h2>
        <p className="text-muted-foreground mt-2">Here is your daily summary and quick links.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-border/50 shadow-sm overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Your Active Permits</CardTitle>
              <FileText className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground mt-1">
                Hot work permit valid until 17:00
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-border/50 shadow-sm overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Zone Safety</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">Optimal</div>
              <p className="text-xs text-muted-foreground mt-1">
                No active hazards in your assigned area
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-border/50 shadow-sm overflow-hidden relative group h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-info/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Next Break</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12:30 PM</div>
              <p className="text-xs text-muted-foreground mt-1">
                In about 2 hours
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <Card className="border-border/50 mt-6">
        <CardHeader>
          <CardTitle>Safety Reminders</CardTitle>
          <CardDescription>General guidelines for your current shift.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="mt-1 mr-3 flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium">Always wear your hard hat and safety glasses</p>
                <p className="text-xs text-muted-foreground">Required in all active work zones.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="mt-1 mr-3 flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium">Report any unusual smells or sounds immediately</p>
                <p className="text-xs text-muted-foreground">Use the quick report feature or notify your supervisor.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="mt-1 mr-3 flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium">Stay hydrated</p>
                <p className="text-xs text-muted-foreground">Water stations are located in sectors A and C.</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}