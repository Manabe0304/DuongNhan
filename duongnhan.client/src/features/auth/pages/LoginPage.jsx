import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa6";
import AuthShell from "../components/AuthShell";
import { loginUser, clearError, setCredentials } from "../authSlice";
import * as authApi from "../authApi";
import { ROUTES } from "../../../router/routes";

/**
 * LoginPage — Route: /login (auth/pages/LoginPage.jsx)
 * Tích hợp Redux Thunk `loginUser` gọi API /api/auth/login,
 * lưu token vào LocalStorage và cập nhật Auth State.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading, error: authError } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const redirectAfterLogin = (user) => {
    const from = location.state?.from?.pathname;
    if (user?.isNewUser) return navigate(ROUTES.COMPLETE_PROFILE, { replace: true });
    navigate(from || ROUTES.DASHBOARD, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    dispatch(clearError());

    try {
      const result = await dispatch(
        loginUser({
          email: form.email,
          password: form.password,
          remember,
        })
      ).unwrap();

      toast.success(`Chào mừng trở lại, ${result.user?.name || "bạn"}!`);
      redirectAfterLogin(result.user);
    } catch (err) {
      const errorMsg = typeof err === "string" ? err : err?.message || "Đăng nhập thất bại.";
      setLocalError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLocalError("");
    dispatch(clearError());
    try {
      const { token, refreshToken, user } = await authApi.googleLogin(credentialResponse.credential);
      dispatch(setCredentials({ token, refreshToken, user, remember: true }));
      toast.success(`Chào mừng, ${user.name}!`);
      redirectAfterLogin(user);
    } catch (err) {
      const errorMsg = err.message || "Đăng nhập với Google thất bại.";
      setLocalError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const activeError = localError || authError;

  const hasGoogleClientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID &&
    !import.meta.env.VITE_GOOGLE_CLIENT_ID.startsWith("000000000000");

  const fillDemoAccount = () => {
    setForm({
      email: "demo@duongnhan.vn",
      password: "Password123!",
    });
    toast.success("Đã điền tài khoản mẫu (demo@duongnhan.vn)!");
  };

  return (
    <AuthShell
      title="Đăng nhập"
      subtitle="Chào mừng bạn quay lại Dưỡng Nhan."
      footer={
        <span className="text-muted-ss">
          Chưa có tài khoản?{" "}
          <Link to={ROUTES.REGISTER} className="text-coral fw-semibold text-decoration-none">Đăng ký</Link>
        </span>
      }
    >
      {activeError && <div className="alert alert-danger py-2 small r-lg mb-3">{activeError}</div>}

      {/* Demo Account Box */}
      <div className="p-3 bg-light border border-line rounded mb-3">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="fw-semibold small text-dark">Tài khoản dùng thử (Demo):</span>
          <button
            type="button"
            onClick={fillDemoAccount}
            className="btn btn-sm btn-outline-secondary py-0 px-2 small"
            style={{ fontSize: "12px" }}
          >
            Điền nhanh
          </button>
        </div>
        <div className="text-muted small" style={{ fontSize: "12px" }}>
          Email: <code className="text-dark">demo@duongnhan.vn</code> | Mật khẩu: <code className="text-dark">Password123!</code>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <div>
          <label className="form-label small fw-semibold text-muted-ss">Email</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaEnvelope size={13} className="text-muted-ss" /></span>
            <input
              required
              type="email"
              className="form-control border-start-0 ps-0"
              placeholder="ban@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <div className="d-flex justify-content-between align-items-center">
            <label className="form-label small fw-semibold text-muted-ss">Mật khẩu</label>
            <Link to={ROUTES.FORGOT_PASSWORD} className="small text-coral text-decoration-none">Quên mật khẩu?</Link>
          </div>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaLock size={13} className="text-muted-ss" /></span>
            <input
              required
              type={showPassword ? "text" : "password"}
              className="form-control border-start-0 border-end-0 ps-0"
              placeholder="••••••••"
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="button" className="input-group-text bg-white border-start-0" onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? <FaEyeSlash size={13} className="text-muted-ss" /> : <FaEye size={13} className="text-muted-ss" />}
            </button>
          </div>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="remember"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label className="form-check-label small text-muted-ss" htmlFor="remember">Ghi nhớ đăng nhập</label>
        </div>

        <button type="submit" disabled={loading} className="btn btn-coral r-pill fw-semibold py-2">
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>

      <div className="d-flex align-items-center gap-3 my-4">
        <hr className="flex-grow-1" /><span className="text-muted-ss small">hoặc</span><hr className="flex-grow-1" />
      </div>

      <div className="d-flex flex-column align-items-center justify-content-center w-100">
        {hasGoogleClientId ? (
          <>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                setLocalError(
                  `"Đăng nhập Google thất bại. Vui lòng thử lại."`
                )
              }
              theme="outline"
              shape="pill"
              text="signin_with"
              locale="vi"
            />
            {localError && localError.includes("Google Cloud Console") && (
              <button
                type="button"
                onClick={async () => {
                  setLocalError("");
                  try {
                    const res = await authApi.googleLogin("mock_google_token");
                    dispatch(setCredentials({ ...res, remember: true }));
                    toast.success(`Chào mừng (Demo Google), ${res.user.name}!`);
                    redirectAfterLogin(res.user);
                  } catch (e) {
                    toast.error(e.message);
                  }
                }}
                className="btn btn-sm btn-outline-danger r-pill mt-3 px-3 py-2"
              >
                🚀 Đăng nhập bằng Google
              </button>
            )}
          </>
        ) : (
          <div className="text-center w-100">
            <button
              type="button"
              onClick={() =>
                toast("Chưa cấu hình Google. Vui lòng dùng tài khoản Demo!", {
                  icon: "ℹ️",
                })
              }
              className="btn btn-outline-ink w-100 r-pill py-2 small d-flex align-items-center justify-content-center gap-2"
            >
              <span>Đăng nhập với Google</span>
            </button>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
