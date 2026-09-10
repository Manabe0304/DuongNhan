/**
 * authApi — MOCK, giống cách public/data/*.js mock ở Phase 2.
 * Chưa có backend nên các hàm dưới đây tự tạo phản hồi giả lập (có delay
 * cho giống mạng thật). Khi backend sẵn sàng, thay phần thân mỗi hàm bằng
 * lời gọi qua `api` (đã có sẵn interceptor JWT ở services/api.js), theo
 * đúng endpoint đã ghi chú — phần code gọi hàm ở component KHÔNG cần đổi.
 */
// import { api } from "../../services/api";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function fakeToken(prefix) {
  return `${prefix}.${Math.random().toString(36).slice(2)}.${Date.now()}`;
}

function makeUser({ name, email, isNewUser = false, avatar = null }) {
  return {
    id: `usr_${Math.random().toString(36).slice(2, 10)}`,
    name,
    email,
    avatar,
    role: "user",
    membership: "Free",
    isNewUser,
  };
}

// POST /api/auth/login
export async function login({ email, password }) {
  await delay(900);
  // Mock: mật khẩu quá ngắn xem như sai để demo được cả trạng thái lỗi
  if (!email || password.length < 6) {
    throw new Error("Email hoặc mật khẩu không đúng.");
  }
  return {
    token: fakeToken("jwt"),
    refreshToken: fakeToken("rt"),
    user: makeUser({ name: email.split("@")[0], email, isNewUser: false }),
  };
}

// POST /api/auth/register
export async function register({ name, email, password }) {
  await delay(1000);
  if (!name || !email || password.length < 6) {
    throw new Error("Vui lòng kiểm tra lại thông tin đăng ký.");
  }
  return {
    token: fakeToken("jwt"),
    refreshToken: fakeToken("rt"),
    // Đăng ký thủ công không cần CompleteProfilePage (chỉ Google login lần
    // đầu mới cần) nên isNewUser=false ngay từ đầu.
    user: makeUser({ name, email, isNewUser: false }),
  };
}

// POST /api/auth/google  { id_token }
export async function googleLogin(idToken) {
  await delay(900);
  if (!idToken) throw new Error("Không lấy được thông tin từ Google.");

  // Demo: coi lần google-login đầu tiên trên trình duyệt này là user mới,
  // để có thể xem cả 2 nhánh điều hướng (complete-profile / dashboard).
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

// POST /api/auth/forgot-password
export async function forgotPassword(email) {
  await delay(900);
  if (!email) throw new Error("Vui lòng nhập email.");
  return { message: "Đã gửi email khôi phục nếu địa chỉ này tồn tại." };
}

// POST /api/auth/reset-password
export async function resetPassword({ token, password }) {
  await delay(900);
  if (!token) throw new Error("Liên kết đặt lại mật khẩu không hợp lệ.");
  if (password.length < 6) throw new Error("Mật khẩu phải có ít nhất 6 ký tự.");
  return { message: "Đặt lại mật khẩu thành công." };
}

// PATCH /api/auth/complete-profile
export async function completeProfile(data) {
  await delay(800);
  return { ...data, isNewUser: false };
}
