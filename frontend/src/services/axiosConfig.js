import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // if using react-router

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, // if you rely on cookies or session
});

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // If Unauthorized or token expired
      if (error.response.status === 401) {
        // Clear token and redirect to login page
        localStorage.removeItem('token');
        // Use window.location if outside React component
        window.location.href = '/login';
        // Or if you are inside a React component context, use useNavigate from react-router
        // const navigate = useNavigate();
        // navigate('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
