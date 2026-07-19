import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/api/admin.api';

export function useAdminUsers(page = 0, size = 20) {
  return useQuery({
    queryKey: ['adminUsers', page, size],
    queryFn: () => adminApi.getUsers(page, size),
    keepPreviousData: true,
  });
}

export function useAdminLogs(page = 0, size = 20) {
  return useQuery({
    queryKey: ['adminLogs', page, size],
    queryFn: () => adminApi.getLogs(page, size),
    keepPreviousData: true,
  });
}

export function useAdminMetrics() {
  return useQuery({
    queryKey: ['adminMetrics'],
    queryFn: () => adminApi.getMetrics(),
  });
}
