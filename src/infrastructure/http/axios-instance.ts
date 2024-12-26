import axios from 'axios';

export const axiosInstance = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.SOURCE_BEARER_TOKEN}`
  }
});