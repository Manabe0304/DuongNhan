import { Link } from "react-router-dom";
import { ScanFace } from "lucide-react";
import { IconFacebook, IconInstagram, IconYoutube } from "./SocialIcons";
import { ROUTES } from "../../router/routes";

const SOCIALS = [
  { Icon: IconFacebook, label: "Facebook" },
  { Icon: IconInstagram, label: "Instagram" },
  { Icon: IconYoutube, label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="ss-footer bg-ink text-white-50 pt-5 pb-4 px-3">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="d-flex align-items-center justify-content-center rounded-circle bg-coral" style={{ width: 32, height: 32 }}>
                <ScanFace size={17} color="#fff" />
              </span>
              <span className="ss-display fs-5 fw-semibold text-white">Skin Sensi</span>
            </div>
            <p className="small mb-3" style={{ maxWidth: 320 }}>
              Nền tảng AI phân tích da và kết nối bác sĩ da liễu, giúp bạn hiểu làn da của chính mình.
            </p>
            <div className="d-flex gap-2">
              {SOCIALS.map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label} className="ss-social"><Icon size={15} color="#fff" /></a>
              ))}
            </div>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="text-white fw-semibold mb-3">Sản phẩm</h6>
            <Link to={ROUTES.HOME} className="d-block small mb-2">Trang chủ</Link>
            <Link to={ROUTES.DOCTORS} className="d-block small mb-2">Bác sĩ</Link>
            <Link to={ROUTES.PRODUCTS} className="d-block small mb-2">Sản phẩm</Link>
            <Link to={ROUTES.PRICING} className="d-block small mb-2">Bảng giá</Link>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="text-white fw-semibold mb-3">Hỗ trợ</h6>
            {["FAQ", "Bảo mật", "Điều khoản"].map((t) => (
              <a key={t} href="#" className="d-block small mb-2">{t}</a>
            ))}
          </div>

          <div className="col-12 col-md-3">
            <h6 className="text-white fw-semibold mb-3">Liên hệ</h6>
            <Link to={ROUTES.CONTACT} className="d-block small mb-2">Gửi liên hệ</Link>
            <p className="small">hello@skinsensi.ai</p>
          </div>
        </div>
        <div className="pt-3 border-top border-secondary text-center small">
          © 2026 Skin Sensi AI Platform. Bảo lưu mọi quyền.
        </div>
      </div>
    </footer>
  );
}
