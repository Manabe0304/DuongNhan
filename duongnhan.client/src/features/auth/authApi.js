import { api } from "../../services/api";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function fakeToken(prefix) {
  return `${prefix}.${Math.random().toString(36).slice(2)}.${Date.now()}`;
}

function makeUser({ name, email, isNewUser = false, avatar = null, role = "Customer", isPremium = false }) {
  return {
    id: `usr_${Math.random().toString(36).slice(2, 10)}`,
    name,
    fullName: name,
    email,
    avatar: avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name || "User")}`,
    role,
    membership: isPremium ? "Premium" : "Free",
    isPremium,
    isNewUser,
  };
}

/**
 * Chuẩn hóa đối tượng user trả về từ backend API
 */
function normalizeUser(rawUser) {
  if (!rawUser) return null;
  const fullName = rawUser.fullName || rawUser.name || "Khách hàng";
  return {
    id: rawUser.id,
    name: fullName,
    fullName: fullName,
    email: rawUser.email,
    role: rawUser.role || "Customer",
    isPremium: Boolean(rawUser.isPremium),
    membership: rawUser.isPremium ? "Premium" : "Free",
    avatar: rawUser.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
    isNewUser: false,
  };
}

/**
 * POST /api/auth/login
 * Đăng nhập qua Backend ASP.NET Core
 */
export async function login({ email, password }) {
  try {
    const response = await api.post("/auth/login", {
      email: email.trim(),
      password: password,
    });

    const data = response.data;
    return {
      token: data.token,
      refreshToken: null,
      user: normalizeUser(data.user),
    };
  } catch (err) {
    const message =
      err.response?.data?.message ||
      (err.code === "ERR_NETWORK"
        ? "Không thể kết nối tới Backend server (hãy chắc chắn DuongNhan.Server đang chạy)."
        : err.message || "Đăng nhập thất bại.");
    throw new Error(message);
  }
}

/**
 * POST /api/auth/register
 * Đăng ký tài khoản qua Backend ASP.NET Core
 */
export async function register({ name, email, password, phoneNumber }) {
  try {
    await api.post("/auth/register", {
      fullName: name.trim(),
      email: email.trim(),
      password: password,
      phoneNumber: phoneNumber || null,
    });

    // Tự động đăng nhập lấy token ngay sau khi đăng ký thành công
    return await login({ email, password });
  } catch (err) {
    const message =
      err.response?.data?.message ||
      (err.code === "ERR_NETWORK"
        ? "Không thể kết nối tới Backend server (hãy chắc chắn DuongNhan.Server đang chạy)."
        : err.message || "Đăng ký thất bại.");
    throw new Error(message);
  }
}

/**
 * POST /api/auth/google
 * Giữ giả lập hoặc tích hợp khi có Google OAuth backend endpoint
 */
export async function googleLogin(idToken) {
  await delay(800);
  if (!idToken) throw new Error("Không lấy được thông tin từ Google.");

  const seenKey = "ss_google_seen";
  const isNewUser = !window.localStorage.getItem(seenKey);
  window.localStorage.setItem(seenKey, "1");

  return {
    token: fakeToken("jwt"),
    refreshToken: fakeToken("rt"),
    user: makeUser({
      name: "Google User",
      email: "google.user@gmail.com",
      isNewUser,
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Google%20User",
    }),
  };
}

/**
 * Quên mật khẩu (mock)
 */
export async function forgotPassword(email) {
  await delay(800);
  if (!email) throw new Error("Vui lòng nhập email.");
  return { message: "Đã gửi email khôi phục nếu địa chỉ này tồn tại." };
}

/**
 * Đặt lại mật khẩu (mock)
 */
export async function resetPassword({ token, password }) {
  await delay(800);
  if (!token) throw new Error("Liên kết đặt lại mật khẩu không hợp lệ.");
  if (password.length < 6) throw new Error("Mật khẩu phải có ít nhất 6 ký tự.");
  return { message: "Đặt lại mật khẩu thành công." };
}

/**
 * Hoàn tất hồ sơ sau Google login (mock)
 */
export async function completeProfile(data) {
  await delay(600);
  return { ...data, isNewUser: false };
}
