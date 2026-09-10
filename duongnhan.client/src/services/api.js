import axios from "axios";
import { loadAuth, clearAuth } from "../utils/authStorage";

/**
 * axios instance dùng chung cho toàn app khi backend đã sẵn sàng.
 * features/auth/authApi.js hiện dùng dữ liệu mock (chưa có backend thật —
 * cùng cách tiếp cận với public/data/*.js ở Phase 2). Khi backend xong, chỉ
 * cần đổi phần thân các hàm trong authApi.js sang gọi qua `api` bên dưới,
 * phần interceptor JWT đã sẵn sàng.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
});

// Tự đính JWT vào mọi request nếu đã đăng nhập
api.interceptors.request.use((config) => {
  const auth = loadAuth();
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

// 401 -> phiên hết hạn: xoá auth, đẩy về /login
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

export default api;
