import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

const API_BASE_URL = process.env.NX_API_URL || 'http://localhost:3000';

// Create axios instance WITHOUT withCredentials temporarily
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: false, // TEMPORARILY REMOVED
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  validateStatus: function (status) {
    // Resolve only if the status code is less than 500
    return status < 500;
  },
});

// Request interceptor to add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
        {
          headers: config.headers,
          data: config.data,
          withCredentials: config.withCredentials,
        }
      );
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common responses
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        {
          status: response.status,
          data: response.data,
        }
      );
    }

    return response.data;
  },
  (error: AxiosError) => {
    // Log error for debugging
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        withCredentials: error.config?.withCredentials,
      },
    });

    // Handle common error responses
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;

      if (status === 401) {
        // Handle unauthorized access (e.g., redirect to login)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          // Only redirect if not already on login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }

      return Promise.reject({
        status,
        message: (data as any)?.message || `HTTP ${status} Error`,
        errors: (data as any)?.errors,
        data: data,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return Promise.reject({
        status: 0,
        message:
          'No response from server. Please check your internet connection.',
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      return Promise.reject({
        status: 500,
        message:
          error.message || 'An error occurred while setting up the request',
      });
    }
  }
);

export default apiClient;
