import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, ShieldAlert, Loader2, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { usePermitAnalysis } from '../hooks/api/usePermits';

export default function Permits() {
  const { mutate: analyzePermit, isPending, data: permitData, isError, error } = usePermitAnalysis();
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Active Work Permits</h2>
          <p className="text-muted-foreground mt-2">Manage PTWs and run SIMOPS conflict detection.</p>
        </div>
        <Button onClick={triggerPermitAnalysis} disabled={isPending} className="whitespace-nowrap">
          {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <PlayCircle className="w-4 h-4 mr-2" />}
          Run SIMOPS Analysis
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by permit ID, zone, or type..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
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
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> 
              SIMOPS Conflicts Detected
            </CardTitle>
            <CardDescription>The Permit Agent detected violations in the current spatial graph.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               {permitData.conflicts.map((conflict, idx) => (
                 <div key={idx} className="p-4 border border-destructive/20 bg-background rounded-lg">
                    <h4 className="font-bold text-destructive">{conflict.conflict_type}</h4>
                    <p className="text-sm mt-1">{conflict.risk_description}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Severity: {conflict.severity} | Zone: {conflict.zones_affected?.join(', ')}
                    </div>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[{
            id: 'PTW-2026-001',
            type: 'Hot Work',
            zone: 'ZONE_3',
            applicant: 'John Smith',
            status: 'Active',
            expiry: '17:00 Today',
            risk: 'High'
          }].map((permit) => (
          <Card key={permit.id} className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium bg-success/10 text-success`}>
                  {permit.status}
                </span>
              </div>
              <CardTitle className="text-lg mt-4">{permit.id}</CardTitle>
              <CardDescription>{permit.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Zone</span>
                  <span className="font-medium">{permit.zone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applicant</span>
                  <span className="font-medium">{permit.applicant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expires</span>
                  <span className="font-medium">{permit.expiry}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}