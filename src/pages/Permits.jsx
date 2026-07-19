import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldAlert, CheckCircle2, AlertTriangle, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const mockPermits = [
  { id: 'PT-2023-104', type: 'Hot Work', zone: 'Sector 4', applicant: 'John Smith', risk: 'High', status: 'Pending Conflict Check' },
  { id: 'PT-2023-103', type: 'Confined Space', zone: 'Tank 2', applicant: 'Sarah Connor', risk: 'Extreme', status: 'Approved' },
  { id: 'PT-2023-102', type: 'Electrical', zone: 'Substation B', applicant: 'Mike Tyson', risk: 'Medium', status: 'Active' },
  { id: 'PT-2023-101', type: 'Excavation', zone: 'North Yard', applicant: 'Bruce Wayne', risk: 'Low', status: 'Completed' },
];

export default function Permits() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPermits = mockPermits.filter(p => 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Permit to Work</h2>
          <p className="text-muted-foreground mt-2">Manage permits and detect spatial/temporal conflicts using AI.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> New Permit
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/50">
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search permits..." 
                  className="pl-9 bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">Permit ID</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Zone</th>
                    <th className="px-6 py-4 font-medium">Applicant</th>
                    <th className="px-6 py-4 font-medium">Risk Level</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPermits.map((permit, idx) => (
                    <motion.tr 
                      key={permit.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-card border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">{permit.id}</td>
                      <td className="px-6 py-4">{permit.type}</td>
                      <td className="px-6 py-4">{permit.zone}</td>
                      <td className="px-6 py-4">{permit.applicant}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          permit.risk === 'High' || permit.risk === 'Extreme' ? 'bg-destructive/10 text-destructive' :
                          permit.risk === 'Medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                        }`}>
                          {permit.risk}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{permit.status}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-warning/50 bg-warning/5">
            <CardHeader>
              <CardTitle className="text-warning flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> AI Conflict Detection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-background border border-border/50 rounded-lg">
                <h4 className="font-semibold text-sm mb-2 text-foreground">Conflict Found</h4>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">PT-2023-104 (Hot Work)</strong> in Sector 4 conflicts with a scheduled <strong className="text-foreground">Chemical Delivery</strong> in the adjacent loading bay at 14:00.
                </p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="w-full text-xs">View Details</Button>
                  <Button variant="destructive" size="sm" className="w-full text-xs">Reject Permit</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" /> AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  Reschedule Hot Work PT-2023-104 to 16:00 when loading bay is clear.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  Mandate additional fire watch for PT-2023-104 due to dry conditions.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}