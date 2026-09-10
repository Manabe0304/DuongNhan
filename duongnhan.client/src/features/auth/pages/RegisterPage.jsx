import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa6";
import AuthShell from "../components/AuthShell";
import { useAuth } from "../../../shared/hooks/useAuth";
import * as authApi from "../authApi";
import { ROUTES } from "../../../router/routes";

/**
 * RegisterPage — Route: /register (auth/pages/RegisterPage.jsx)
 * Họ tên · Email · Password · Confirm · Điều khoản · POST /api/auth/register.
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const { setCredentials } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (!agree) {
      setError("Bạn cần đồng ý với Điều khoản dịch vụ để tiếp tục.");
      return;
    }

    setLoading(true);
    try {
      const { token, refreshToken, user } = await authApi.register(form);
      setCredentials({ token, refreshToken, user, remember: true });
      toast.success("Tạo tài khoản thành công!");
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setError(err.message || "Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Tạo tài khoản"
      subtitle="Bắt đầu hành trình chăm sóc da cùng Dưỡng Nhan."
      footer={
        <span className="text-muted-ss">
          Đã có tài khoản?{" "}
          <Link to={ROUTES.LOGIN} className="text-coral fw-semibold text-decoration-none">Đăng nhập</Link>
        </span>
      }
    >
      {error && <div className="alert alert-danger py-2 small r-lg mb-3">{error}</div>}

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <div>
          <label className="form-label small fw-semibold text-muted-ss">Họ và tên</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaUser size={13} className="text-muted-ss" /></span>
            <input required className="form-control border-start-0 ps-0" placeholder="Nguyễn Văn A" value={form.name} onChange={set("name")} />
          </div>
        </div>

        <div>
          <label className="form-label small fw-semibold text-muted-ss">Email</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaEnvelope size={13} className="text-muted-ss" /></span>
            <input required type="email" className="form-control border-start-0 ps-0" placeholder="ban@email.com" value={form.email} onChange={set("email")} />
          </div>
        </div>

        <div>
          <label className="form-label small fw-semibold text-muted-ss">Mật khẩu</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaLock size={13} className="text-muted-ss" /></span>
            <input required type="password" minLength={6} className="form-control border-start-0 ps-0" placeholder="Tối thiểu 6 ký tự" value={form.password} onChange={set("password")} />
          </div>
        </div>

        <div>
          <label className="form-label small fw-semibold text-muted-ss">Xác nhận mật khẩu</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaLock size={13} className="text-muted-ss" /></span>
            <input required type="password" minLength={6} className="form-control border-start-0 ps-0" placeholder="Nhập lại mật khẩu" value={form.confirm} onChange={set("confirm")} />
          </div>
        </div>

        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="agree" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <label className="form-check-label small text-muted-ss" htmlFor="agree">
            Tôi đồng ý với <a href="#" className="text-coral text-decoration-none">Điều khoản dịch vụ</a> và{" "}
            <a href="#" className="text-coral text-decoration-none">Chính sách bảo mật</a>
          </label>
        </div>

        <button type="submit" disabled={loading} className="btn btn-coral r-pill fw-semibold py-2">
          {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
        </button>
      </form>
    </AuthShell>
  );
}
