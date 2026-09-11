import { useSelector, useDispatch } from "react-redux";
import {
  setCredentials,
  updateUser,
  logout,
  loginUser,
  registerUser,
  fetchCurrentUser,
  clearError,
} from "../../features/auth/authSlice";

/**
 * Hook trung tâm để đọc/ghi trạng thái đăng nhập từ mọi component,
 * hỗ trợ đầy đủ dispatch các Redux Thunks: loginUser, registerUser, fetchCurrentUser...
 */
export function useAuth() {
  const { user, token, isAuthenticated, loading, error } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const userRole = (user?.role || "customer").toLowerCase();

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    role: userRole,
    isAdmin: userRole === "admin",
    isDoctor: userRole === "doctor",
    isCustomer: userRole === "customer" || userRole === "user",
    setCredentials: (payload) => dispatch(setCredentials(payload)),
    updateUser: (payload) => dispatch(updateUser(payload)),
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
    loginUser: (credentials) => dispatch(loginUser(credentials)),
    registerUser: (userData) => dispatch(registerUser(userData)),
    fetchCurrentUser: () => dispatch(fetchCurrentUser()),
  };
}
