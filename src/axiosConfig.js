import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5173', // Base URL for the API
  withCredentials: true, // To include cookies in requests
});

export default axiosInstance;