import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // Crucial for cookie-based authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent infinite loops of token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor to handle Refresh Token Rotation on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 and we haven't retried this request yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      
      // If it's a login or signup request, don't try to refresh
      if (originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/signup')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Request token refresh
        await api.post('/auth/refresh');
        
        // Refresh succeeded
        isRefreshing = false;
        processQueue(null);
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed (e.g. refresh token expired)
        isRefreshing = false;
        processQueue(refreshError, null);
        
        // Optional: clear state or redirect to login. We will let AuthContext handle this 
        // by detecting that API requests are failing with 401.
        
        // Redirecting or resetting auth state should be driven by the app's auth handler
        if (window.handleAuthFailure) {
          window.handleAuthFailure();
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
