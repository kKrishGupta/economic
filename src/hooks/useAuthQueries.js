import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/AuthService';
import { simulatorApi } from '../services/api/simulator.api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Set the user query data manually if needed, or clear queries
      queryClient.setQueryData(['user'], data);
      
      if (data.role !== 'ADMIN') {
        simulatorApi.updateMode({ simulationMode: 'NORMAL', zoneId: 'ZONE_3' }).catch(() => {});
      }
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
    }
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) => authService.register(userData),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
      
      if (data.role !== 'ADMIN') {
        simulatorApi.updateMode({ simulationMode: 'NORMAL', zoneId: 'ZONE_3' }).catch(() => {});
      }
      toast.success('Registration successful! Welcome.');
      navigate('/dashboard');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    }
  });
}
