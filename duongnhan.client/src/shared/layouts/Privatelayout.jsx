import { useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import {
  FaBars,
  FaXmark,
  FaUserDoctor,
  FaHouse,
  FaCalendarCheck,
  FaPumpSoap,
  FaWandMagicSparkles,
  FaArrowRightFromBracket,
  FaCrown,
  FaArrowLeft,
  FaShieldHalved,
  FaCamera,
  FaUser,
} from "react-icons/fa6";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../../router/routes";

export default function PrivateLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const navItems = [
    { to: ROUTES.DASHBOARD, label: "Tổng quan", icon: FaHouse, end: true },
    { to: ROUTES.SCAN, label: "Soi da AI", icon: FaCamera },
    { to: ROUTES.PROFILE, label: "Hồ sơ cá nhân", icon: FaUser },
    { to: ROUTES.DOCTORS, label: "Bác sĩ da liễu", icon: FaUserDoctor },
    { to: ROUTES.PRODUCTS, label: "Sản phẩm gợi ý", icon: FaPumpSoap },
    { to: ROUTES.PRICING, label: "Gói dịch vụ", icon: FaCrown },
    { to: ROUTES.CONTACT, label: "Hỗ trợ & Liên hệ", icon: FaShieldHalved },
  ];

  const sidebarContent = (
    <div className="d-flex flex-column h-100 p-3">
      {/* Brand Header */}
      <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom border-line">
        <Link to={ROUTES.HOME} className="d-flex align-items-center gap-2 text-decoration-none">
          <span
            className="d-flex align-items-center justify-content-center rounded-circle bg-teal text-white shadow-sm"
            style={{ width: 36, height: 36 }}
          >
            <FaUserDoctor size={18} />
          </span>
          <div>
            <span className="ss-display fs-5 fw-bold text-body d-block lh-1">Dưỡng Nhan</span>
            <span className="text-muted-ss" style={{ fontSize: "0.72rem" }}>Chăm sóc da thông minh</span>
          </div>
        </Link>
        <button
          className="btn btn-sm btn-link text-muted-ss d-md-none p-1"
          onClick={() => setSidebarOpen(false)}
          aria-label="Đóng menu"
        >
          <FaXmark size={18} />
        </button>
      </div>

      {/* User Info Card */}
      <Link
        to={ROUTES.PROFILE}
        onClick={() => setSidebarOpen(false)}
        className="bg-white border border-line r-lg p-3 mb-4 shadow-sm text-decoration-none text-body hover-bg-cream transition-all d-block"
      >
        <div className="d-flex align-items-center gap-2">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || "User"}
              className="rounded-circle border border-line"
              width={42}
              height={42}
            />
          ) : (
            <span
              className="d-flex align-items-center justify-content-center rounded-circle bg-coral text-white fw-bold"
              style={{ width: 42, height: 42, fontSize: "1rem" }}
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </span>
          )}
          <div className="overflow-hidden">
            <div className="fw-semibold text-truncate" style={{ fontSize: "0.92rem" }}>
              {user?.name || user?.fullName || "Khách hàng"}
            </div>
            <div className="d-flex align-items-center gap-1 mt-1">
              <span className={`badge ${user?.isPremium ? "bg-coral text-white" : "bg-mint text-teal"} fw-medium`} style={{ fontSize: "0.68rem" }}>
                {user?.membership || (user?.isPremium ? "Premium" : "Free")}
              </span>
              <span className="badge bg-soft text-muted-ss border border-line" style={{ fontSize: "0.68rem" }}>
                {user?.role || "Customer"}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="nav flex-column gap-1 flex-grow-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none fw-medium transition-all ${
                  isActive
                    ? "bg-ink text-white shadow-sm"
                    : "text-body hover-bg-soft"
                }`
              }
              style={{ fontSize: "0.92rem" }}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="pt-3 border-top border-line d-flex flex-column gap-2">
        <Link
          to={ROUTES.HOME}
          className="d-flex align-items-center gap-2 text-muted-ss text-decoration-none px-3 py-2 rounded-3 small hover-bg-soft"
        >
          <FaArrowLeft size={13} />
          <span>Về trang chủ</span>
        </Link>
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger btn-sm r-pill d-flex align-items-center justify-content-center gap-2 py-2 fw-medium"
        >
          <FaArrowRightFromBracket size={13} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="d-flex min-vh-100 bg-cream">
      {/* Desktop Sidebar */}
      <aside
        className="d-none d-md-block border-end border-line bg-white position-sticky top-0 h-100"
        style={{ width: 260, minWidth: 260, height: "100vh", zIndex: 1020 }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
          style={{ zIndex: 1040 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`position-fixed top-0 start-0 h-100 bg-white border-end border-line d-md-none transition-transform ${
          sidebarOpen ? "translate-middle-x-0" : ""
        }`}
        style={{
          width: 280,
          zIndex: 1050,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease-in-out",
        }}
      >
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <div className="d-flex flex-column flex-grow-1 min-vw-0">
        {/* Top Navbar */}
        <header
          className="bg-white border-bottom border-line px-3 px-md-4 py-2 d-flex align-items-center justify-content-between position-sticky top-0"
          style={{ height: 64, zIndex: 1010 }}
        >
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-outline-ink btn-sm d-md-none r-lg p-2 d-flex align-items-center justify-content-center"
              onClick={() => setSidebarOpen(true)}
              aria-label="Mở menu"
            >
              <FaBars size={16} />
            </button>
            <div className="d-none d-sm-block">
              <span className="text-muted-ss small">Cổng thông tin khách hàng</span>
              <h2 className="ss-display fs-6 fw-bold mb-0 text-body">Bảng điều khiển</h2>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link
              to={ROUTES.DOCTORS}
              className="btn btn-coral btn-sm r-pill d-none d-sm-inline-flex align-items-center gap-2 px-3 fw-medium shadow-sm"
            >
              <FaCalendarCheck size={13} />
              <span>Đặt lịch khám</span>
            </Link>

            <Link
              to={ROUTES.PROFILE}
              className="d-flex align-items-center gap-2 ms-2 ps-2 border-start border-line text-decoration-none hover-opacity"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || "Avatar"}
                  className="rounded-circle border"
                  width={36}
                  height={36}
                />
              ) : (
                <span
                  className="d-flex align-items-center justify-content-center rounded-circle bg-coral text-white fw-bold"
                  style={{ width: 36, height: 36, fontSize: "0.85rem" }}
                >
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              )}
              <span className="d-none d-lg-inline small fw-semibold text-body">
                {user?.name || user?.fullName || "Tài khoản"}
              </span>
            </Link>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="p-3 p-md-4 flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
