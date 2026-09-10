import axios from "axios";
import { loadAuth, clearAuth } from "../utils/authStorage";

/**
 * Axios instance dùng chung cho toàn bộ ứng dụng.
 * Tự động gắn tiền tố /api và bắt lỗi timeout sau 15s.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
});

// Interceptor Request: Tự động đính kèm JWT Bearer Token nếu đã đăng nhập
api.interceptors.request.use(
  (config) => {
    const auth = loadAuth();
    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor Response: Khi nhận mã 401 (Unauthorized), dọn dẹp session và chuyển về trang login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Gọi API Đăng nhập: POST /api/auth/login
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} Phản hồi từ Backend { token, user: { id, fullName, email, role, isPremium } }
 */
export const loginApi = async ({ email, password }) => {
  const response = await api.post("/auth/login", {
    email: email.trim(),
    password: password,
  });
  return response.data;
};

/**
 * Gọi API Đăng ký: POST /api/auth/register
 * @param {Object} userData - { fullName, name, email, password, phoneNumber }
 * @returns {Promise<Object>} Phản hồi từ Backend { message }
 */
export const registerApi = async ({ fullName, name, email, password, phoneNumber }) => {
  const response = await api.post("/auth/register", {
    fullName: (fullName || name || "").trim(),
    email: email.trim(),
    password: password,
    phoneNumber: phoneNumber || null,
  });
  return response.data;
};

export default api;
