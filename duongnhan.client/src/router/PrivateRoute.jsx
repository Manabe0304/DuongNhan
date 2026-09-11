import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import { ROUTES } from "./routes";
import toast from "react-hot-toast";
import { useEffect } from "react";

/**
 * Component bảo vệ tuyến đường và kiểm tra quyền theo vai trò (Role-based Authorization):
 * - Chưa đăng nhập -> Điều hướng về /login kèm lưu lại location hiện tại
 * - Đã đăng nhập nhưng Role không nằm trong allowedRoles -> Thông báo lỗi và điều hướng về /dashboard
 * - Vai trò hỗ trợ: "customer" / "user", "doctor", "admin" (Admin có quyền truy cập toàn bộ)
 *
 * @param {Array<string>} [allowedRoles] - Danh sách vai trò được phép truy cập (tuỳ chọn)
 */
export default function PrivateRoute({ allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Nếu có danh sách quyền yêu cầu cụ thể
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (user?.role || "customer").toLowerCase();
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

    const hasPermission =
      userRole === "admin" ||
      normalizedAllowed.includes(userRole) ||
      (userRole === "customer" && normalizedAllowed.includes("user")) ||
      (userRole === "user" && normalizedAllowed.includes("customer"));

    if (!hasPermission) {
      return <AccessDenied fallbackRoute={ROUTES.DASHBOARD} requiredRoles={allowedRoles} userRole={userRole} />;
    }
  }

  return <Outlet />;
}

function AccessDenied({ fallbackRoute, requiredRoles, userRole }) {
  useEffect(() => {
    toast.error(`Bạn không có quyền truy cập chức năng này (Quyền hiện tại: ${userRole}).`);
  }, [userRole]);

  return <Navigate to={fallbackRoute} replace />;
}
