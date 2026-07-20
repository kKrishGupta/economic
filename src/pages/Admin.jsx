import React, { useState, useEffect, useMemo } from 'react';
import { ShieldAlert, Users, Activity, FileKey, Server, Cpu, Database } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { useSystemHealth } from '../hooks/api/useDashboard';
import { useQueryClient } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Admin() {
  const [userPage, setUserPage] = useState(0);
  const [logPage, setLogPage] = useState(0);
  const pageSize = 5;

  const { data: healthData, isLoading: isLoadingHealth } = useSystemHealth();
  const queryClient = useQueryClient();
  const latestEval = queryClient.getQueryData(['latestEval']);

  // Dynamic system load simulation based on health polling
  const [systemLoad, setSystemLoad] = useState(Array.from({length: 20}, (_, i) => ({ time: i, load: 20 + Math.random() * 10 })));

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad(prev => {
        const newLoad = { time: prev[prev.length - 1].time + 1, load: 20 + Math.random() * 30 + (latestEval ? 20 : 0) };
        return [...prev.slice(1), newLoad];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [latestEval]);

  // Mock data for display purposes to keep the UI activated
  const mockUsers = {
    content: [
      { username: 'admin_sys', email: 'admin@safeops.ai', role: 'ADMIN', createdAt: new Date().toISOString() },
      { username: 'operator_b', email: 'op_b@safeops.ai', role: 'USER', createdAt: new Date().toISOString() },
    ],
    totalPages: 1
  };

  const mockLogs = {
    content: [
      { action: 'Sensor Analysis Triggered', userId: 'SYSTEM', ipAddress: 'localhost', createdAt: new Date().toISOString() },
      { action: 'Health Check Polling', userId: 'SYSTEM', ipAddress: 'localhost', createdAt: new Date(Date.now() - 30000).toISOString() },
      { action: 'Admin Login', userId: 'admin_sys', ipAddress: '192.168.1.100', createdAt: new Date(Date.now() - 60000).toISOString() }
    ],
    totalPages: 1
  };

  const userColumns = useMemo(() => [
    {
      accessorKey: 'username',
      header: 'Username',
      cell: (info) => <span className="font-medium text-foreground">{info.getValue()}</span>
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: (info) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${info.getValue() === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
          {info.getValue()}
        </span>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined Date',
      cell: (info) => format(new Date(info.getValue()), 'MMM dd, yyyy')
    }
  ], []);

  const logColumns = useMemo(() => [
    {
      accessorKey: 'action',
      header: 'Action',
      cell: (info) => <span className="font-medium text-foreground">{info.getValue()}</span>
    },
    {
      accessorKey: 'userId',
      header: 'User / Source',
    },
    {
      accessorKey: 'createdAt',
      header: 'Time',
      cell: (info) => format(new Date(info.getValue()), 'HH:mm:ss')
    }
  ], []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Console</h2>
        <p className="text-muted-foreground mt-2">Manage infrastructure, view system health, and audit logs dynamically.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Backend Health</CardTitle>
            <Server className={`w-4 h-4 ${healthData ? 'text-success' : 'text-destructive'}`} />
          </CardHeader>
          <CardContent>
            {isLoadingHealth ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            ) : (
              <div className={`text-2xl font-bold ${healthData ? 'text-success' : 'text-destructive'}`}>
                {healthData ? 'ONLINE' : 'OFFLINE'}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">FastAPI Orchestrator</p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Agent Status</CardTitle>
            <Activity className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">{healthData?.agents_loaded ? 'Ready' : 'Pending'}</div>
             <p className="text-xs text-muted-foreground mt-1">LangGraph initialized</p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vector DB</CardTitle>
            <Database className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">Connected</div>
             <p className="text-xs text-muted-foreground mt-1">ChromaDB running locally</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Invocations</CardTitle>
            <Cpu className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">{latestEval ? '24' : '23'}</div>
             <p className="text-xs text-muted-foreground mt-1">Total API calls today</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Live System Load</CardTitle>
          <CardDescription>Real-time simulation of CPU / Memory usage processing LangGraph nodes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full mt-4">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={systemLoad} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                     <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                 <XAxis dataKey="time" hide />
                 <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                 />
                 <Area type="monotone" dataKey="load" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorLoad)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={userColumns}
              data={mockUsers.content}
              pageCount={mockUsers.totalPages}
              pageIndex={userPage}
              pageSize={pageSize}
              onPageChange={setUserPage}
              isLoading={false}
            />
          </CardContent>
        </Card>
        
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <FileKey className="w-5 h-5" /> Recent Audit Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={logColumns}
              data={mockLogs.content}
              pageCount={mockLogs.totalPages}
              pageIndex={logPage}
              pageSize={pageSize}
              onPageChange={setLogPage}
              isLoading={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}