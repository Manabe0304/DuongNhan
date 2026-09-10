import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // dashboard, skinAnalysis, cart... sẽ thêm ở các Phase sau
  },
});
