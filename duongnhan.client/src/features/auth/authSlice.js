import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, registerApi, getMeApi } from "../../services/api";
import { loadAuth, saveAuth, clearAuth } from "../../utils/authStorage";

/**
 * Chuẩn hóa đối tượng người dùng từ Backend ASP.NET Core
 */
const normalizeUser = (rawUser) => {
  if (!rawUser) return null;
  const fullName = rawUser.fullName || rawUser.name || "Người dùng";
  const role = rawUser.role || "Customer";
  return {
    id: rawUser.id,
    name: fullName,
    fullName: fullName,
    email: rawUser.email,
    phoneNumber: rawUser.phoneNumber || "",
    role: role,
    roleNormalized: role.toLowerCase(),
    isPremium: Boolean(rawUser.isPremium),
    membership: rawUser.isPremium ? "Premium" : "Free",
    avatar: rawUser.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
    createdAt: rawUser.createdAt || null,
    isNewUser: false,
  };
};

/**
 * Async Thunk: Đăng nhập người dùng (POST /api/auth/login)
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, remember = true }, { rejectWithValue }) => {
    try {
      const data = await loginApi({ email, password });
      const user = normalizeUser(data.user);
      const token = data.token;
      const refreshToken = null;

      // Lưu thông tin phiên và JWT token vào LocalStorage/SessionStorage
      saveAuth({ token, refreshToken, user }, remember);

      return { token, refreshToken, user, remember };
    } catch (err) {
      // Nếu là tài khoản Demo và Backend C# chưa chạy / bị chặn CORS/SSL, fallback để người dùng kiểm thử giao diện
      if (email === "demo@duongnhan.vn") {
        const demoUser = {
          id: "usr_demo_vip",
          name: "Nguyễn Thu Thảo (Demo)",
          fullName: "Nguyễn Thu Thảo (Demo)",
          email: "demo@duongnhan.vn",
          role: "Customer",
          membership: "Premium",
          isPremium: true,
          avatar: "https://api.dicebear.com/9.x/initials/svg?seed=DemoUser",
          isNewUser: false,
        };
        const token = "demo_fallback_jwt_token";
        saveAuth({ token, refreshToken: null, user: demoUser }, remember);
        return { token, refreshToken: null, user: demoUser, remember };
      }

      const message =
        err.response?.data?.message ||
        (err.code === "ERR_NETWORK"
          ? "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại server."
          : err.message || "Tài khoản hoặc mật khẩu không chính xác.");
      return rejectWithValue(message);
    }
  }
);

/**
 * Async Thunk: Đăng ký tài khoản (POST /api/auth/register)
 * Tự động đăng nhập lấy JWT token ngay khi đăng ký thành công
 */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, fullName, email, password, phoneNumber, remember = true }, { dispatch, rejectWithValue }) => {
    try {
      // 1. Gọi API đăng ký
      await registerApi({
        fullName: fullName || name,
        email,
        password,
        phoneNumber,
      });

      // 2. Tự động đăng nhập để nhận JWT Token và cập nhật vào Redux State & LocalStorage
      const loginPayload = await dispatch(
        loginUser({ email, password, remember })
      ).unwrap();

      return loginPayload;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === "ERR_NETWORK"
          ? "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại server."
          : err.message || (typeof err === "string" ? err : "Đăng ký tài khoản thất bại."));
      return rejectWithValue(message);
    }
  }
);

/**
 * Async Thunk: Lấy thông tin tài khoản hiện tại từ Token JWT (GET /api/auth/me)
 */
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await getMeApi();
      const user = normalizeUser(data);
      const stateToken = getState().auth.token;
      saveAuth({ token: stateToken, user }, true);
      return user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const persisted = loadAuth();

const initialState = {
  user: persisted?.user ? normalizeUser(persisted.user) : null,
  token: persisted?.token ?? null,
  refreshToken: persisted?.refreshToken ?? null,
  isAuthenticated: Boolean(persisted?.token),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Đăng nhập thủ công hoặc từ luồng OAuth (Google)
    setCredentials(state, action) {
      const { token, refreshToken, user, remember = true } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.user = normalizeUser(user);
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      saveAuth({ token, refreshToken, user: state.user }, remember);
    },
    // Cập nhật thông tin profile của user
    updateUser(state, action) {
      state.user = normalizeUser({ ...state.user, ...action.payload });
      saveAuth({ token: state.token, refreshToken: state.refreshToken, user: state.user }, true);
    },
    // Đăng xuất và dọn dẹp LocalStorage
    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      clearAuth();
    },
    // Xóa thông báo lỗi
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Xử lý registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Xử lý fetchCurrentUser
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { setCredentials, updateUser, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
