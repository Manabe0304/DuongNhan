import axios from "axios";
import { loadAuth, clearAuth } from "../utils/authStorage";

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) return "/api";
  const trimmed = envUrl.trim().replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

/**
 * Axios instance dùng chung cho toàn bộ ứng dụng.
 * Tự động gắn tiền tố /api và bắt lỗi timeout sau 15s.
 */
export const api = axios.create({
  baseURL: getBaseUrl(),
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

/**
 * Gọi API lấy thông tin người dùng hiện tại: GET /api/auth/me (Yêu cầu JWT Bearer Token)
 * @returns {Promise<Object>} Thông tin chi tiết user
 */
export const getMeApi = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

/**
 * Gọi API Phân tích da AI: POST /api/skinanalysis/analyze
 * @param {FormData} formData - Chứa ImageFile (ảnh chân dung) và UserNote (tuỳ chọn)
 * @returns {Promise<Object>} Kết quả phân tích da SkinAnalysisResponse
 */
export const analyzeSkin = async (formData) => {
  const auth = loadAuth();
  const response = await api.post("/skinanalysis/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}),
    },
  });
  return response.data;
};

export default api;
