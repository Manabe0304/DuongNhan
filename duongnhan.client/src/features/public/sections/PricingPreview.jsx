import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { plans } from "../data/plans";
import { ROUTES } from "../../../router/routes";

export default function PricingPreview() {
  const navigate = useNavigate();
  return (
    <section className="px-3 py-5 bg-white">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
          <div>
            <h2 className="ss-display fw-semibold mb-2">Gói phù hợp cho mọi nhu cầu</h2>
            <p className="text-muted-ss mb-0">Từ dùng thử miễn phí đến chăm sóc toàn diện cùng bác sĩ riêng.</p>
          </div>
          <button onClick={() => navigate(ROUTES.PRICING)} className="btn btn-link text-coral fw-semibold text-decoration-none d-flex align-items-center gap-1 p-0">
            Xem chi tiết <ArrowRight size={15} />
          </button>
        </div>
        <div className="row g-3">
          {plans.map((p) => (
            <div key={p.name} className="col-12 col-md-4">
              <div className={`r-xl p-4 h-100 border ${p.highlight ? "border-coral" : "border-line"}`} style={{ background: p.highlight ? "#FFF8F5" : "#fff" }}>
                <h6 className="fw-semibold mb-1">{p.name}</h6>
                <p className="text-muted-ss small mb-3">{p.tagline}</p>
                <p className="ss-mono fw-semibold mb-3" style={{ fontSize: "1.4rem" }}>
                  {p.monthly === 0 ? "0đ" : `${p.monthly.toLocaleString("vi-VN")}đ`}
                  <span className="text-muted-ss fw-normal" style={{ fontSize: ".7rem" }}>/tháng</span>
                </p>
                <button onClick={() => navigate(ROUTES.PRICING)} className={`btn w-100 r-pill fw-semibold ${p.highlight ? "btn-coral" : "btn-outline-ink"}`}>
                  {p.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
