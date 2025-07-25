import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor untuk menangani response error secara global
api.interceptors.response.use(
  (response) => response, // Jika sukses, langsung teruskan response
  (error) => {
    // Cek jika ada response error dari server
    if (error.response && error.response.status === 403) {
      // Jika statusnya 403 (Forbidden), redirect ke halaman unauthorized
      // Kita gunakan window.location agar state aplikasi di-reset.
      window.location.href = "/unauthorized";
    }
    // Kembalikan error agar bisa ditangani lebih lanjut oleh blok catch di komponen
    return Promise.reject(error);
  },
);

export default api;
