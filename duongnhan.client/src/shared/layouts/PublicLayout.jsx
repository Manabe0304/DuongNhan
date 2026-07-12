import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/**
 * PublicLayout — wraps every guest-facing route (Phase 2).
 * Sticky white Navbar (64px) + <Outlet/> + Footer.
 */
export default function PublicLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
