import { createSlice } from "@reduxjs/toolkit";
import { loadAuth, saveAuth, clearAuth } from "../../utils/authStorage";

const persisted = loadAuth();

const initialState = {
  user: persisted?.user ?? null,
  token: persisted?.token ?? null,
  refreshToken: persisted?.refreshToken ?? null,
  isAuthenticated: Boolean(persisted?.token),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // action.payload: { token, refreshToken, user, remember }
    setCredentials(state, action) {
      const { token, refreshToken, user, remember = true } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.user = user;
      state.isAuthenticated = true;
      saveAuth({ token, refreshToken, user }, remember);
    },
    // Cập nhật user sau CompleteProfilePage, EditProfilePage...
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      saveAuth({ token: state.token, refreshToken: state.refreshToken, user: state.user }, true);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      clearAuth();
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
