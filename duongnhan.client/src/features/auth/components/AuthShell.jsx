import { Link } from "react-router-dom";
import { FaArrowLeft, FaUserDoctor } from "react-icons/fa6";
import ScoreGauge from "../../../shared/components/ScoreGauge";
import { ROUTES } from "../../../router/routes";

/**
 * Khung dùng chung cho cả 5 trang Auth — KHÔNG bọc PublicLayout (theo
 * roadmap Phase 3: "Standalone pages"). Bố cục 2 cột trên desktop: panel
 * thương hiệu bên trái (ẩn ở mobile) + form bên phải. Luôn có nút
 * "← Về trang chủ" phía trên form.
 */
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="d-flex min-vh-100">
      {/* Panel thương hiệu — chỉ hiện từ lg trở lên */}
      <div className="d-none d-lg-flex col-lg-5 bg-ink text-white flex-column justify-content-between p-5">
        <Link to={ROUTES.HOME} className="d-flex align-items-center gap-2 text-decoration-none text-white">
          <span className="d-flex align-items-center justify-content-center rounded-circle bg-coral" style={{ width: 32, height: 32 }}>
            <FaUserDoctor size={15} color="#fff" />
          </span>
          <span className="ss-display fs-5 fw-semibold">Duong Nhan</span>
        </Link>

        <div>
          <h2 className="ss-display fw-semibold mb-4" style={{ fontSize: "2rem", lineHeight: 1.15 }}>
            Làn da khoẻ mạnh bắt đầu từ dữ liệu chính xác.
          </h2>
          <div className="d-flex align-items-center gap-4">
            <div style={{ "--line": "rgba(255,255,255,.18)", "--teal": "#FF6B47" }}>
              <ScoreGauge score={92} size={140} label="Skin Score" />
            </div>
            <p className="text-white-50 small mb-0" style={{ maxWidth: 220 }}>
              Theo dõi điểm số da của bạn sau mỗi lần phân tích, thấy rõ tiến bộ theo thời gian.
            </p>
          </div>
        </div>

        <p className="text-white-50 small mb-0">© 2026 Duong Nhan AI Platform</p>
      </div>

      {/* Panel form */}
      <div className="col-12 col-lg-7 bg-white d-flex align-items-center justify-content-center p-4 py-5">
        <div style={{ maxWidth: 400, width: "100%" }}>
          <Link to={ROUTES.HOME} className="d-inline-flex align-items-center gap-2 text-muted-ss small text-decoration-none mb-4">
            <FaArrowLeft size={12} /> Về trang chủ
          </Link>

          <h1 className="ss-display fw-semibold mb-2" style={{ fontSize: "1.8rem" }}>{title}</h1>
          {subtitle && <p className="text-muted-ss mb-4">{subtitle}</p>}

          {children}

          {footer && <div className="mt-4 text-center small">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
