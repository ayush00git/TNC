import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL; 

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;