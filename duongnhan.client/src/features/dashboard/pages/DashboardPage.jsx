import { FaArrowRightFromBracket } from "react-icons/fa6";
import { useAuth } from "../../../shared/hooks/useAuth";

/**
 * DashboardPage — PLACEHOLDER.
 * Bản đầy đủ (welcome card, skin score stats, recent analysis, lịch hẹn,
 * quick actions...) sẽ làm ở Phase 4, bên trong PrivateLayout (Sidebar +
 * TopNavbar). Trang này chỉ để chứng minh luồng Auth (login/register/Google
 * -> redirect) hoạt động trọn vẹn.
 */
export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="container py-5" style={{ maxWidth: 560 }}>
      <div className="bg-white border border-line r-xl p-4 p-md-5 text-center">
        {user?.avatar && (
          <img src={user.avatar} alt={user.name} className="rounded-circle mb-3" width={64} height={64} />
        )}
        <h1 className="ss-display fw-semibold mb-2" style={{ fontSize: "1.6rem" }}>
          Xin chào, {user?.name || "bạn"} 👋
        </h1>
        <p className="text-muted-ss mb-1">{user?.email}</p>
        <span className="badge bg-mint text-teal fw-semibold mb-4">Gói {user?.membership || "Free"}</span>

        <div className="alert alert-info small r-lg text-start">
          Đây là trang Dashboard tạm thời — xác nhận đăng nhập/đăng ký/Google OAuth đã hoạt động đúng.
          Dashboard đầy đủ (Sidebar + TopNavbar + thống kê da) sẽ được xây ở Phase 4.
        </div>

        <button onClick={logout} className="btn btn-outline-ink r-pill fw-semibold px-4 d-inline-flex align-items-center gap-2">
          <FaArrowRightFromBracket size={13} /> Đăng xuất
        </button>
      </div>
    </div>
  );
}
