import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, ShieldAlert, Loader2, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { usePermitAnalysis } from '../hooks/api/usePermits';
import { useAuth } from '../providers/AuthProvider';
import { useUsers } from '../hooks/api/useAdmin';

export default function Permits() {
  const { user } = useAuth();
  const { mutate: analyzePermit, isPending, data: permitData, isError, error } = usePermitAnalysis();
  const { data: usersData, isLoading: isUsersLoading } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');

  const triggerPermitAnalysis = () => {
    const payload = {
      permits: [
        {
          permit_id: "HW_042",
          type: "HOT_WORK",
          zone_id: "ZONE_3",
          expiry: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
        }
      ],
      current_time: new Date().toISOString(),
      current_gas: 25.0 // Trigger OISD-105 Clause 4.3 violation
    };
    analyzePermit(payload);
  };

  // Generate mock permits dynamically from actual database users
  const allPermits = useMemo(() => {
    if (!usersData?.content) return [];
    
    // Only map users who have the role 'USER'
    const regularUsers = usersData.content.filter(u => u.role === 'USER');
    
    return regularUsers.map((u, idx) => ({
      id: `PTW-2026-${String(idx + 1).padStart(3, '0')}`,
      type: ['Hot Work', 'Confined Space', 'Electrical Isolation', 'Cold Work'][idx % 4],
      zone: `ZONE_${(idx % 5) + 1}`,
      applicant: u.username,
      status: ['Active', 'Pending', 'Active', 'Closed'][idx % 4],
      expiry: ['17:00 Today', '10:00 Tomorrow', '12:00 Today', 'Expired'][idx % 4],
      risk: ['High', 'Critical', 'Medium', 'Low'][idx % 4]
    }));
  }, [usersData]);

  // If ADMIN, show all (representing all USER roles). If USER, show only their own permit.
  const displayedPermits = user?.role === 'ADMIN' 
    ? allPermits 
    : [{ 
        id: `PTW-2026-USR`, 
        type: 'Hot Work', 
        zone: 'ZONE_3', 
        applicant: user?.username || 'Current User', 
        status: 'Active', 
        expiry: '17:00 Today', 
        risk: 'High' 
      }];

  const filteredPermits = displayedPermits.filter(p => 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Active Work Permits</h2>
          <p className="text-muted-foreground mt-2">Manage PTWs and run SIMOPS conflict detection.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <Button onClick={triggerPermitAnalysis} disabled={isPending} className="whitespace-nowrap shadow-glow">
            {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <PlayCircle className="w-4 h-4 mr-2" />}
            Run SIMOPS Analysis
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by permit ID, applicant, or zone..." 
            className="pl-9 bg-muted/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="glass-card hover-lift">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {isError && (
         <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
           Error running permit analysis: {error?.response?.data?.detail || 'Network error'}
         </div>
      )}

      {permitData && permitData.conflicts?.length > 0 && (
        <Card className="glass-card border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 animate-pulse" /> 
              SIMOPS Conflicts Detected
            </CardTitle>
            <CardDescription>The Permit Agent detected violations in the current spatial graph.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               {permitData.conflicts.map((conflict, idx) => (
                 <div key={idx} className="p-4 border border-destructive/20 bg-destructive/10 rounded-lg backdrop-blur-sm">
                    <h4 className="font-bold text-destructive">{conflict.conflict_type}</h4>
                    <p className="text-sm mt-1 text-foreground">{conflict.risk_description}</p>
                    <div className="mt-2 text-xs text-muted-foreground font-mono">
                      Severity: {conflict.severity} | Zone: {conflict.zones_affected?.join(', ')}
                    </div>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPermits.map((permit, i) => (
          <motion.div
            key={permit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card hover-lift hover:border-primary/50 transition-all h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    permit.status === 'Active' ? 'bg-success/10 text-success' : 
                    permit.status === 'Pending' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                  }`}>
                    {permit.status}
                  </span>
                </div>
                <CardTitle className="text-lg mt-2">{permit.id}</CardTitle>
                <CardDescription className="text-primary/80 font-medium">{permit.type}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="space-y-3 text-sm bg-muted/20 p-4 rounded-xl border border-border/50">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Zone</span>
                    <span className="font-bold text-foreground">{permit.zone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Applicant</span>
                    <span className="font-bold text-foreground truncate max-w-[120px]">{permit.applicant}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Expires</span>
                    <span className="font-bold text-foreground">{permit.expiry}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {filteredPermits.length === 0 && (
        <div className="text-center py-12 glass-card rounded-xl border border-dashed">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No permits found</h3>
          <p className="text-sm text-muted-foreground">Adjust your search filters.</p>
        </div>
      )}
    </div>
  );
}