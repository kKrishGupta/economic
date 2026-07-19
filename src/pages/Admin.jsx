import React, { useState, useMemo } from 'react';
import { ShieldAlert, Users, Activity, FileKey, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DataTable } from '../components/ui/DataTable';
import { useAdminUsers, useAdminLogs, useAdminMetrics } from '../hooks/useAdmin';

export default function Admin() {
  const [userPage, setUserPage] = useState(0);
  const [logPage, setLogPage] = useState(0);
  const pageSize = 10;

  const { data: metricsData, isLoading: isLoadingMetrics } = useAdminMetrics();
  const { data: usersData, isLoading: isLoadingUsers } = useAdminUsers(userPage, pageSize);
  const { data: logsData, isLoading: isLoadingLogs } = useAdminLogs(logPage, pageSize);

  const userColumns = useMemo(() => [
    {
      accessorKey: 'username',
      header: 'Username',
      cell: (info) => <span className="font-medium text-foreground">{info.getValue()}</span>
    },
    {
      accessorKey: 'email',
      header: 'Email',
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
      header: 'User ID',
    },
    {
      accessorKey: 'ipAddress',
      header: 'IP Address',
      cell: (info) => <span className="text-muted-foreground">{info.getValue() || 'N/A'}</span>
    },
    {
      accessorKey: 'createdAt',
      header: 'Time',
      cell: (info) => format(new Date(info.getValue()), 'MMM dd, yyyy HH:mm:ss')
    }
  ], []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Console</h2>
        <p className="text-muted-foreground mt-2">Manage users, view system health, and audit logs.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoadingMetrics ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            ) : (
              <div className="text-2xl font-bold">{metricsData?.totalUsers || 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Invocations</CardTitle>
            <Activity className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoadingMetrics ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            ) : (
              <div className="text-2xl font-bold">{metricsData?.totalInvocations || 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Total API calls</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <ShieldAlert className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Optimal</div>
            <p className="text-xs text-muted-foreground mt-1">All services operational</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={userColumns}
            data={usersData?.content || []}
            pageCount={usersData?.totalPages || 0}
            pageIndex={userPage}
            pageSize={pageSize}
            onPageChange={setUserPage}
            isLoading={isLoadingUsers}
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
            data={logsData?.content || []}
            pageCount={logsData?.totalPages || 0}
            pageIndex={logPage}
            pageSize={pageSize}
            onPageChange={setLogPage}
            isLoading={isLoadingLogs}
          />
        </CardContent>
      </Card>
    </div>
  );
}