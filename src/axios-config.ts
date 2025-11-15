// frontend-ionic/src/axios-config.ts

import axios from 'axios';

// Ganti baseURL sesuai dengan alamat backend Anda
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Interceptor: Menambahkan token sebelum setiap request dikirim
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    // Menambahkan header Authorization: Bearer <token>
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;