import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ScanFace } from "lucide-react";
import { ROUTES } from "../../router/routes";

const LINKS = [
  { to: ROUTES.HOME, label: "Trang chủ" },
  { to: ROUTES.DOCTORS, label: "Bác sĩ" },
  { to: ROUTES.PRODUCTS, label: "Sản phẩm" },
  { to: ROUTES.PRICING, label: "Bảng giá" },
  { to: ROUTES.CONTACT, label: "Liên hệ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = ({ isActive }) => `ss-navlink ${isActive ? "active" : ""}`;

  return (
    <header className={`ss-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container h-100 d-flex align-items-center justify-content-between">
        <NavLink to={ROUTES.HOME} className="d-flex align-items-center gap-2 text-decoration-none">
          <span className="d-flex align-items-center justify-content-center rounded-circle bg-teal" style={{ width: 32, height: 32 }}>
            <ScanFace size={17} color="#fff" />
          </span>
          <span className="ss-display fs-5 fw-semibold text-body">Dưỡng Nhan</span>
        </NavLink>

        <nav className="d-none d-md-flex align-items-center gap-4">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === ROUTES.HOME}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="d-none d-md-flex align-items-center gap-2">
          <button onClick={() => navigate(ROUTES.LOGIN)} className="btn btn-outline-ink r-pill btn-sm px-3">Đăng nhập</button>
          <button onClick={() => navigate(ROUTES.REGISTER)} className="btn btn-coral r-pill btn-sm px-3 fw-semibold">Đăng ký</button>
        </div>

        <button className="btn d-md-none border-0" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="d-md-none bg-white border-top border-line px-3 py-3">
          <div className="d-flex flex-column gap-2 mb-3">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)} end={l.to === ROUTES.HOME}>
                {l.label}
              </NavLink>
            ))}
          </div>
          <div className="d-flex gap-2">
            <button onClick={() => navigate(ROUTES.LOGIN)} className="btn btn-outline-ink r-pill btn-sm flex-fill">Đăng nhập</button>
            <button onClick={() => navigate(ROUTES.REGISTER)} className="btn btn-coral r-pill btn-sm flex-fill fw-semibold">Đăng ký</button>
          </div>
        </div>
      )}
    </header>
  );
}
