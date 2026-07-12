import { useNavigate } from "react-router-dom";
import { Upload, ArrowRight } from "lucide-react";
import ScoreGauge from "../../../shared/components/ScoreGauge";
import { ROUTES } from "../../../router/routes";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="px-3 pt-5 pb-5">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-12 col-md-6">
            <span className="badge bg-peach text-coral fw-semibold px-3 py-2 r-pill mb-3">AI DERMATOLOGY · BETA</span>
            <h1 className="ss-display fw-semibold mb-3" style={{ fontSize: "3rem", lineHeight: 1.05 }}>
              Hiểu làn da của bạn,<br /><span className="text-teal">bằng AI.</span>
            </h1>
            <p className="text-muted-ss mb-4" style={{ maxWidth: 440, fontSize: "1.05rem" }}>
              Chụp một bức ảnh, nhận điểm số da tức thì và đề xuất sản phẩm, bác sĩ phù hợp với chính làn da
              của bạn — không đoán mò, không phỏng đoán.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <button onClick={() => navigate(ROUTES.REGISTER)} className="btn btn-coral r-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2">
                <Upload size={16} /> Phân tích da ngay
              </button>
              <button onClick={() => navigate(ROUTES.DOCTORS)} className="btn btn-outline-ink r-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2">
                Xem bác sĩ <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="col-12 col-md-6 d-flex justify-content-center">
            <div className="bg-white r-2xl p-4 shadow" style={{ maxWidth: 360, width: "100%" }}>
              <p className="text-muted-ss text-uppercase fw-semibold mb-2" style={{ fontSize: ".7rem", letterSpacing: ".04em" }}>
                Kết quả phân tích mẫu
              </p>
              <ScoreGauge score={82} />
              <div className="row g-2 mt-2">
                {[["Mụn", "12%"], ["Độ dầu", "34%"], ["Độ ẩm", "68%"], ["Sắc tố", "21%"]].map(([k, v]) => (
                  <div key={k} className="col-6">
                    <div className="bg-soft r-lg px-3 py-2">
                      <p className="text-muted-ss mb-0" style={{ fontSize: ".7rem" }}>{k}</p>
                      <p className="ss-mono fw-semibold mb-0" style={{ fontSize: ".9rem" }}>{v}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
