import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NX_API_URL || 'http://localhost:3000';

// Create axios instance with base URL and credentials support
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common responses
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    // Handle common error responses
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      
      if (status === 401) {
        // Handle unauthorized access (e.g., redirect to login)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
      
      return Promise.reject({
        status,
        message: (data as any)?.message || 'An error occurred',
        errors: (data as any)?.errors,
      });
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject({
        status: 500,
        message: 'No response from server. Please try again later.',
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject({
        status: 500,
        message: error.message || 'An error occurred',
      });
    }
  }
);

export default apiClient;
