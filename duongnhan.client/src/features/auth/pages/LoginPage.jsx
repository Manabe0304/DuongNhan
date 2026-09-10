import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa6";
import AuthShell from "../components/AuthShell";
import { useAuth } from "../../../shared/hooks/useAuth";
import * as authApi from "../authApi";
import { ROUTES } from "../../../router/routes";

/**
 * LoginPage — Route: /login (auth/pages/LoginPage.jsx)
 * Email + Password + Remember Me + nút Google + link quên mật khẩu.
 * POST /api/auth/login (mock hiện tại — xem authApi.js).
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCredentials } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectAfterLogin = (user) => {
    const from = location.state?.from?.pathname;
    if (user.isNewUser) return navigate(ROUTES.COMPLETE_PROFILE, { replace: true });
    navigate(from || ROUTES.DASHBOARD, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, refreshToken, user } = await authApi.login(form);
      setCredentials({ token, refreshToken, user, remember });
      toast.success(`Chào mừng trở lại, ${user.name}!`);
      redirectAfterLogin(user);
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      const { token, refreshToken, user } = await authApi.googleLogin(credentialResponse.credential);
      setCredentials({ token, refreshToken, user, remember: true });
      toast.success(`Chào mừng, ${user.name}!`);
      redirectAfterLogin(user);
    } catch (err) {
      setError(err.message || "Đăng nhập với Google thất bại.");
    } finally {
      setLoading(false);
    }
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
      {error && <div className="alert alert-danger py-2 small r-lg mb-3">{error}</div>}

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
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <div className="d-flex align-items-center gap-3 my-4">
        <hr className="flex-grow-1" /><span className="text-muted-ss small">hoặc</span><hr className="flex-grow-1" />
      </div>

      <div className="d-flex justify-content-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Đăng nhập với Google thất bại.")}
          theme="outline"
          shape="pill"
          text="signin_with"
          locale="vi"
        />
      </div>
    </AuthShell>
  );
}
