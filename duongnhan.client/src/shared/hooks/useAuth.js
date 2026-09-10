import { useSelector, useDispatch } from "react-redux";
import {
  setCredentials,
  updateUser,
  logout,
  loginUser,
  registerUser,
  clearError,
} from "../../features/auth/authSlice";

/**
 * Hook trung tâm để đọc/ghi trạng thái đăng nhập từ mọi component,
 * hỗ trợ đầy đủ dispatch các Redux Thunks: loginUser, registerUser...
 */
export function useAuth() {
  const { user, token, isAuthenticated, loading, error } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    setCredentials: (payload) => dispatch(setCredentials(payload)),
    updateUser: (payload) => dispatch(updateUser(payload)),
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
    loginUser: (credentials) => dispatch(loginUser(credentials)),
    registerUser: (userData) => dispatch(registerUser(userData)),
  };
}
