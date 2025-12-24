import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(request => {
  console.log('Starting Request', JSON.stringify(request, null, 2));
  console.log('Full URL:', request.baseURL ? request.baseURL + request.url : request.url);
  return request;
});

export default client;