import { useState } from "react";
import { Check } from "lucide-react";
import { plans } from "../data/plans";

/**
 * PricingPage — Route: "/pricing" (own URL, per roadmap 2.2)
 * Compares Free / Premium / VIP with a monthly/yearly toggle.
 */
export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="container px-3 py-5">
      <div className="text-center mb-5">
        <h1 className="ss-display fw-semibold mb-2">Chọn gói phù hợp với bạn</h1>
        <p className="text-muted-ss mb-4">Nâng cấp bất cứ lúc nào, huỷ bất cứ lúc nào.</p>
        <div className="d-inline-flex bg-white border border-line r-pill p-1">
          <button onClick={() => setYearly(false)} className={`btn btn-sm r-pill fw-semibold ${!yearly ? "bg-ink text-white" : "text-dark"}`}>
            Hàng tháng
          </button>
          <button onClick={() => setYearly(true)} className={`btn btn-sm r-pill fw-semibold ${yearly ? "bg-ink text-white" : "text-dark"}`}>
            Hàng năm <span className="text-coral">-15%</span>
          </button>
        </div>
      </div>

      <div className="row g-3">
        {plans.map((p) => (
          <div key={p.name} className="col-12 col-md-4">
            <div className={`r-xl p-4 h-100 d-flex flex-column border ${p.highlight ? "border-coral" : "border-line"}`} style={{ background: p.highlight ? "#FFF8F5" : "#fff" }}>
              {p.highlight && <span className="badge bg-coral text-black align-self-start mb-2" style={{ fontSize: ".65rem" }}>PHỔ BIẾN NHẤT</span>}
              <h5 className="fw-semibold mb-1">{p.name}</h5>
              <p className="text-muted-ss small mb-3">{p.tagline}</p>
              <p className="ss-mono fw-semibold mb-3" style={{ fontSize: "1.8rem" }}>
                {(yearly ? p.yearly : p.monthly) === 0 ? "0đ" : `${(yearly ? p.yearly : p.monthly).toLocaleString("vi-VN")}đ`}
                <span className="text-muted-ss fw-normal" style={{ fontSize: ".7rem" }}>/{yearly ? "năm" : "tháng"}</span>
              </p>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-4 flex-grow-1">
                {p.features.map((f) => (
                  <li key={f} className="d-flex align-items-start gap-2 small">
                    <Check size={15} className="flex-shrink-0 mt-1" color="var(--teal)" /> {f}
                  </li>
                ))}
              </ul>
              <button className={`btn w-100 r-pill fw-semibold ${p.highlight ? "btn-coral" : "btn-outline-ink"}`}>{p.cta}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
