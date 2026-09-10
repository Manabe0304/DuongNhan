import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaCheck } from "react-icons/fa6";
import AuthShell from "../components/AuthShell";
import * as authApi from "../authApi";
import { ROUTES } from "../../../router/routes";

/**
 * ForgotPasswordPage — Route: /forgot-password
 * Nhập email -> POST /api/auth/forgot-password -> "Kiểm tra hộp thư".
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra, thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthShell
        title="Kiểm tra hộp thư"
        footer={
          <Link to={ROUTES.LOGIN} className="text-coral fw-semibold text-decoration-none">← Quay lại đăng nhập</Link>
        }
      >
        <div className="text-center py-3">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-mint mb-3" style={{ width: 56, height: 56 }}>
            <FaCheck size={22} color="var(--teal)" />
          </div>
          <p className="text-muted-ss mb-0">
            Nếu <strong>{email}</strong> tồn tại trong hệ thống, Dưỡng Nhan đã gửi một email hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra cả hộp thư rác (spam).
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Quên mật khẩu?"
      subtitle="Nhập email đã đăng ký, Dưỡng Nhan sẽ gửi liên kết đặt lại mật khẩu."
      footer={
        <span className="text-muted-ss">
          Nhớ ra mật khẩu rồi?{" "}
          <Link to={ROUTES.LOGIN} className="text-coral fw-semibold text-decoration-none">Đăng nhập</Link>
        </span>
      }
    >
      {error && <div className="alert alert-danger py-2 small r-lg mb-3">{error}</div>}

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <div>
          <label className="form-label small fw-semibold text-muted-ss">Email</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaEnvelope size={13} className="text-muted-ss" /></span>
            <input required type="email" className="form-control border-start-0 ps-0" placeholder="ban@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-coral r-pill fw-semibold py-2">
          {loading ? "Đang gửi..." : "Gửi liên kết khôi phục"}
        </button>
      </form>
    </AuthShell>
  );
}
