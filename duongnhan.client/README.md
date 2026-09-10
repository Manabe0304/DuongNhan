# Skin Sensi — Phase 2 + Phase 3 Frontend

React 19 · Vite 6 · React Router v7 · Redux Toolkit · Bootstrap 5 · react-icons

Triển khai theo `skincare_frontend_roadmap_v2.docx`:
- **Phase 2 — Public Zone**: PublicLayout (Navbar + Footer) + 5 trang public.
- **Phase 3 — Auth Zone**: 5 trang Auth standalone (không PublicLayout), Google OAuth 2.0, JWT lưu qua Redux + localStorage/sessionStorage.

## Stack

- **React 19** + Vite 6. Không dùng `import React from "react"` — không cần thiết với JSX runtime tự động.
- **React Router v7** — `createBrowserRouter` / `RouterProvider`.
- **Redux Toolkit + react-redux** — `authSlice` quản lý `{ user, token, refreshToken, isAuthenticated }`.
- **axios** — instance dùng chung ở `services/api.js` (interceptor tự đính JWT + tự đăng xuất khi 401), sẵn sàng cho khi có backend thật.
- **react-hot-toast** — thông báo thành công/lỗi (`<Toaster/>` đặt ở `App.jsx`).
- **@react-oauth/google** — nút "Đăng nhập với Google" ở `LoginPage`, dùng component `<GoogleLogin>` (trả về `credential` = ID token, đúng với hợp đồng `POST /api/auth/google { id_token }` trong roadmap).
- **Bootstrap 5** cho layout/spacing/form. `src/index.css` chỉ thêm biến màu thương hiệu + vài class bổ trợ.
- **react-icons/fa6** cho toàn bộ icon.

## Cấu trúc mới (Phase 3)

```
src/
  features/
    auth/
      pages/
        LoginPage.jsx             /login — email+password, remember me, Google, quên mật khẩu
        RegisterPage.jsx          /register — họ tên, email, password, confirm, điều khoản
        CompleteProfilePage.jsx   /complete-profile — chỉ hiện khi user.isNewUser (Google login lần đầu)
        ForgotPasswordPage.jsx    /forgot-password — nhập email -> "kiểm tra hộp thư"
        ResetPasswordPage.jsx     /reset-password?token=... — mật khẩu mới
      components/
        AuthShell.jsx             layout dùng chung 5 trang: panel thương hiệu trái + form phải,
                                   nút "← Về trang chủ", tái dùng ScoreGauge làm điểm nhấn hình ảnh
      authSlice.js                Redux slice: setCredentials / updateUser / logout
      authApi.js                  MOCK (chưa có backend) — cùng cách tiếp cận với public/data/*.js;
                                   đã ghi chú rõ endpoint thật để thay khi có backend
    dashboard/
      pages/DashboardPage.jsx     PLACEHOLDER — chỉ để chứng minh luồng auth -> redirect hoạt động.
                                   Bản đầy đủ (Sidebar+TopNavbar, thống kê da...) làm ở Phase 4.
  shared/
    hooks/useAuth.js              hook đọc/ghi authSlice từ mọi component
  store/index.js                  configureStore({ auth })
  services/api.js                 axios instance + interceptor JWT (cho khi có backend)
  utils/authStorage.js            lưu/đọc phiên đăng nhập theo "remember me" (local vs sessionStorage)
  router/
    routes.js                     + ROUTES.LOGIN/REGISTER/COMPLETE_PROFILE/FORGOT_PASSWORD/RESET_PASSWORD/DASHBOARD
    PrivateRoute.jsx               guard: chưa đăng nhập -> redirect /login (kèm state.from)
    index.jsx                      PUBLIC (PublicLayout) + AUTH (standalone) + PRIVATE (placeholder)
```

`Navbar.jsx` đã nối với `useAuth()`: chưa đăng nhập hiện **[Đăng nhập] [Đăng ký]**, đã đăng nhập hiện **[Dashboard] + Avatar + Đăng xuất** — đúng spec PublicLayout ở roadmap.

## Luồng Google OAuth (theo roadmap)

1. `App.jsx` bọc `<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>`.
2. `LoginPage` dùng `<GoogleLogin onSuccess={...} />` → nhận `credentialResponse.credential` (ID token).
3. Gọi `authApi.googleLogin(idToken)` → (mock) trả về `{ token, refreshToken, user }`, `user.isNewUser` = `true` cho lần đăng nhập Google đầu tiên trên trình duyệt (để demo được cả 2 nhánh điều hướng).
4. `setCredentials(...)` lưu vào Redux + `localStorage`.
5. `isNewUser === true` → `/complete-profile`; ngược lại → `/dashboard`.

## Chạy thử

```bash
npm install
cp .env.example .env   # rồi điền VITE_GOOGLE_CLIENT_ID thật nếu muốn test nút Google
npm run dev
```

> Chưa có `VITE_GOOGLE_CLIENT_ID` hợp lệ thì nút Google vẫn hiển thị nhưng bấm vào sẽ báo lỗi từ phía Google — đây là hành vi đúng, cần điền Client ID thật (Google Cloud Console) để test.

Đăng nhập/đăng ký bằng form thường (không qua Google) hoạt động ngay không cần cấu hình gì — `authApi.js` đang mock hoàn toàn ở phía client.

## Vì sao không có `import React from "react"` nữa?

(Xem giải thích chi tiết đã gửi ở lượt chat trước — JSX runtime tự động của React 17+, Vite dùng theo mặc định.)

## Bước tiếp theo (theo roadmap)

- **Phase 4**: `PrivateLayout.jsx` (Sidebar thu gọn + TopNavbar) + `DashboardPage.jsx` đầy đủ, thay thế placeholder hiện tại.
- **Phase 5+**: Skin Analysis, Products, Doctors, Profile/Orders/Subscription.
- Khi backend sẵn sàng: thay phần thân các hàm trong `authApi.js` bằng lời gọi qua `services/api.js` theo đúng endpoint đã ghi chú trong từng hàm — chữ ký hàm giữ nguyên nên các trang gọi `authApi.xxx()` không cần sửa.
