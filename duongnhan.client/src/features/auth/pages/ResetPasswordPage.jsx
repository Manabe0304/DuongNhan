import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaLock } from "react-icons/fa6";
import AuthShell from "../components/AuthShell";
import * as authApi from "../authApi";
import { ROUTES } from "../../../router/routes";

/**
 * ResetPasswordPage — Route: /reset-password?token=...
 * Token lấy từ URL email -> New password + Confirm -> POST /api/auth/reset-password.
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({ token, password: form.password });
      toast.success("Đặt lại mật khẩu thành công, mời bạn đăng nhập lại.");
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      setError(err.message || "Không thể đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthShell
        title="Liên kết không hợp lệ"
        footer={<Link to={ROUTES.FORGOT_PASSWORD} className="text-coral fw-semibold text-decoration-none">Gửi lại liên kết mới</Link>}
      >
        <div className="alert alert-warning py-2 small r-lg mb-0">
          Liên kết đặt lại mật khẩu bị thiếu hoặc đã hết hạn. Vui lòng yêu cầu một liên kết mới.
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Đặt lại mật khẩu"
      subtitle="Nhập mật khẩu mới cho tài khoản của bạn."
      footer={
        <Link to={ROUTES.LOGIN} className="text-coral fw-semibold text-decoration-none">← Quay lại đăng nhập</Link>
      }
    >
      {error && <div className="alert alert-danger py-2 small r-lg mb-3">{error}</div>}

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <div>
          <label className="form-label small fw-semibold text-muted-ss">Mật khẩu mới</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaLock size={13} className="text-muted-ss" /></span>
            <input required type="password" minLength={6} className="form-control border-start-0 ps-0" placeholder="Tối thiểu 6 ký tự" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="form-label small fw-semibold text-muted-ss">Xác nhận mật khẩu mới</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaLock size={13} className="text-muted-ss" /></span>
            <input required type="password" minLength={6} className="form-control border-start-0 ps-0" placeholder="Nhập lại mật khẩu mới" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-coral r-pill fw-semibold py-2">
          {loading ? "Đang lưu..." : "Đặt lại mật khẩu"}
        </button>
      </form>
    </AuthShell>
  );
}
