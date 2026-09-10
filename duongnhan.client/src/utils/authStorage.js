/**
 * Đọc/ghi phiên đăng nhập. "Remember me" bật -> lưu localStorage (giữ qua
 * lần đóng trình duyệt). Tắt -> lưu sessionStorage (mất khi đóng tab).
 */
const KEY = "ss_auth";

export function saveAuth({ token, refreshToken, user }, remember = true) {
  const payload = JSON.stringify({ token, refreshToken, user });
  const store = remember ? window.localStorage : window.sessionStorage;
  const other = remember ? window.sessionStorage : window.localStorage;
  store.setItem(KEY, payload);
  other.removeItem(KEY);
}

export function loadAuth() {
  const raw = window.localStorage.getItem(KEY) || window.sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAuth() {
  window.localStorage.removeItem(KEY);
  window.sessionStorage.removeItem(KEY);
}
