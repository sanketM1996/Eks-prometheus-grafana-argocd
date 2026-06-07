import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',
});

// Optional: Add interceptors for auth tokens / error logging
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
