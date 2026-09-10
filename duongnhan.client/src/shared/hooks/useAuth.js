import { useSelector, useDispatch } from "react-redux";
import { setCredentials, updateUser, logout } from "../../features/auth/authSlice";

/**
 * Hook trung tâm để đọc/ghi trạng thái đăng nhập từ mọi component,
 * thay vì import trực tiếp authSlice ở khắp nơi.
 */
export function useAuth() {
  const { user, token, isAuthenticated } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  return {
    user,
    token,
    isAuthenticated,
    setCredentials: (payload) => dispatch(setCredentials(payload)),
    updateUser: (payload) => dispatch(updateUser(payload)),
    logout: () => dispatch(logout()),
  };
}
