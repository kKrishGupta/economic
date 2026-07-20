import axios from 'axios';
import toast from 'react-hot-toast';

// Base URL points to the backend (FastAPI default port is 7860)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7860';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout, LLM processing might take a while
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // If we add auth later, we inject token here
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Global error handling
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          toast.error(data.detail || 'Bad Request');
          break;
        case 401:
          toast.error('Unauthorized. Please login again.');
          // handle logout
          break;
        case 403:
          toast.error('Forbidden. You do not have permission.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 422:
          toast.error('Validation Error. Please check your inputs.');
          break;
        case 500:
          toast.error(data.detail || 'Internal Server Error.');
          break;
        default:
          toast.error('An unexpected error occurred.');
      }
    } else if (error.request) {
      toast.error('Network error. Backend might be unreachable.');
    } else {
      toast.error('Error setting up the request.');
    }

    return Promise.reject(error);
  }
);

export default api;
