import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPhone, FaCalendarDays } from "react-icons/fa6";
import AuthShell from "../components/AuthShell";
import { useAuth } from "../../../shared/hooks/useAuth";
import * as authApi from "../authApi";
import { ROUTES } from "../../../router/routes";

const SKIN_TYPES = ["Da dầu", "Da khô", "Da hỗn hợp", "Da thường", "Da nhạy cảm"];

/**
 * CompleteProfilePage — Route: /complete-profile
 * Chỉ hiện SAU khi Google login lần đầu (user.isNewUser === true).
 * SĐT · Ngày sinh · Giới tính · Loại da · [Hoàn tất] -> PATCH /api/auth/complete-profile
 */
export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [form, setForm] = useState({ phone: "", dob: "", gender: "", skinType: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Chưa đăng nhập -> không có gì để hoàn tất hồ sơ
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  // Đã hoàn tất từ trước -> không cần vào lại trang này
  if (user && !user.isNewUser) return <Navigate to={ROUTES.DASHBOARD} replace />;

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const updated = await authApi.completeProfile(form);
      updateUser(updated);
      toast.success("Hồ sơ đã hoàn tất!");
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setError(err.message || "Không thể lưu hồ sơ, thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Hoàn tất hồ sơ"
      subtitle={`Chào ${user?.name || "bạn"}! Cho Dưỡng Nhan biết thêm một chút về bạn để cá nhân hoá trải nghiệm.`}
    >
      {error && <div className="alert alert-danger py-2 small r-lg mb-3">{error}</div>}

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <div>
          <label className="form-label small fw-semibold text-muted-ss">Số điện thoại</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaPhone size={13} className="text-muted-ss" /></span>
            <input required type="tel" className="form-control border-start-0 ps-0" placeholder="09xx xxx xxx" value={form.phone} onChange={set("phone")} />
          </div>
        </div>

        <div>
          <label className="form-label small fw-semibold text-muted-ss">Ngày sinh</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaCalendarDays size={13} className="text-muted-ss" /></span>
            <input required type="date" className="form-control border-start-0 ps-0" value={form.dob} onChange={set("dob")} />
          </div>
        </div>

        <div>
          <label className="form-label small fw-semibold text-muted-ss d-block mb-2">Giới tính</label>
          <div className="d-flex gap-3">
            {["Nam", "Nữ", "Khác"].map((g) => (
              <div key={g} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id={`gender-${g}`}
                  value={g}
                  checked={form.gender === g}
                  onChange={set("gender")}
                  required
                />
                <label className="form-check-label small" htmlFor={`gender-${g}`}>{g}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="form-label small fw-semibold text-muted-ss">Loại da</label>
          <select required className="form-select" value={form.skinType} onChange={set("skinType")}>
            <option value="" disabled>Chọn loại da của bạn</option>
            {SKIN_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <button type="submit" disabled={loading} className="btn btn-coral r-pill fw-semibold py-2 mt-2">
          {loading ? "Đang lưu..." : "Hoàn tất"}
        </button>
      </form>
    </AuthShell>
  );
}
