import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "../shared/layouts/PublicLayout";
import HomePage from "../features/public/pages/HomePage";
import DoctorsPage from "../features/public/pages/DoctorsPage";
import ProductsPage from "../features/public/pages/ProductsPage";
import PricingPage from "../features/public/pages/PricingPage";
import ContactPage from "../features/public/pages/ContactPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import CompleteProfilePage from "../features/auth/pages/CompleteProfilePage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import SkinScanPage from "../features/scan/pages/SkinScanPage";
import PrivateLayout from "../shared/layouts/Privatelayout";
import PrivateRoute from "./PrivateRoute";
import { ROUTES } from "./routes";

/**
 * Router ứng dụng:
 * - Public Zone: Bọc trong PublicLayout (Navbar + Footer)
 * - Auth Zone: Standalone không bọc Layout
 * - Private Zone: Guard bằng PrivateRoute + Layout hoàn chỉnh PrivateLayout (Sidebar + Topbar)
 */
export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.DOCTORS, element: <DoctorsPage /> },
      { path: ROUTES.PRODUCTS, element: <ProductsPage /> },
      { path: ROUTES.PRICING, element: <PricingPage /> },
      { path: ROUTES.CONTACT, element: <ContactPage /> },
    ],
  },
  // AUTH — standalone, không PublicLayout/PrivateLayout
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  { path: ROUTES.REGISTER, element: <RegisterPage /> },
  { path: ROUTES.COMPLETE_PROFILE, element: <CompleteProfilePage /> },
  { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
  { path: ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
  // PRIVATE — Bọc trong PrivateRoute guard và PrivateLayout (Phase 4)
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.SCAN, element: <SkinScanPage /> },
        ],
      },
    ],
  },
]);
