import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import { ROUTES } from "./routes";

/**
 * Bọc quanh các route riêng tư (Phase 4+). Chưa có token -> đá về /login,
 * kèm state.from để LoginPage có thể điều hướng lại đúng trang sau khi
 * đăng nhập thành công.
 */
export default function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  return <Outlet />;
}
