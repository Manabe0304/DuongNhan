import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../router/routes";

export default function CTABanner() {
  const navigate = useNavigate();
  return (
    <section className="px-3 py-5">
      <div className="container">
        <div className="bg-ink r-2xl px-4 py-5 text-center">
          <h2 className="ss-display fw-semibold text-white mb-2" style={{ fontSize: "2rem" }}>Bắt đầu miễn phí hôm nay</h2>
          <p className="text-white-50 mb-4 mx-auto" style={{ maxWidth: 380 }}>Không cần thẻ thanh toán. Lượt phân tích da đầu tiên hoàn toàn miễn phí.</p>
          <button onClick={() => navigate(ROUTES.REGISTER)} className="btn btn-coral r-pill px-4 py-2 fw-semibold">Tạo tài khoản miễn phí</button>
        </div>
      </div>
    </section>
  );
}
