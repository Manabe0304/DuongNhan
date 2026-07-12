import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "../shared/layouts/PublicLayout";
import HomePage from "../features/public/pages/HomePage";
import DoctorsPage from "../features/public/pages/DoctorsPage";
import ProductsPage from "../features/public/pages/ProductsPage";
import PricingPage from "../features/public/pages/PricingPage";
import ContactPage from "../features/public/pages/ContactPage";
import { ROUTES } from "./routes";

/**
 * Phase 2 router: only the PUBLIC zone is wired here.
 * AUTH routes (standalone, no layout) and PRIVATE routes (PrivateLayout +
 * PrivateRoute guard) get appended in Phase 3 / Phase 4 following the same
 * roadmap — see skincare_frontend_roadmap_v2.docx.
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
]);
