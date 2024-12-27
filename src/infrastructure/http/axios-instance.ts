import axios from 'axios';

let instance = axios.create();

export const resetAxiosInstance = (token?: string) => {
  instance = axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Add interceptor to handle token updates
  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// Initialize instance with interceptor
resetAxiosInstance();

export const axiosInstance = instance;