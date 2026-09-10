import { Link } from "react-router-dom";
import {
  FaRotateLeft,
  FaPumpSoap,
  FaUserDoctor,
  FaCircleCheck,
  FaTriangleExclamation,
  FaShieldHalved,
} from "react-icons/fa6";
import ScoreGauge from "../../../shared/components/ScoreGauge";
import { ROUTES } from "../../../router/routes";

export default function ScanResult({ result, onReset }) {
  if (!result) return null;

  const {
    overallScore = 80,
    skinType = "combination",
    summary = "",
    imageUrl,
    conditions = [],
    analysedAt,
  } = result;

  const getSeverityBadge = (score) => {
    if (score <= 3.0) {
      return { text: "Nhẹ", bg: "bg-mint text-teal", barBg: "bg-success" };
    }
    if (score <= 6.0) {
      return { text: "Trung bình", bg: "bg-warning bg-opacity-25 text-dark", barBg: "bg-warning" };
    }
    return { text: "Cần lưu ý", bg: "bg-danger bg-opacity-25 text-danger", barBg: "bg-danger" };
  };

  const getSkinTypeBadgeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "oily":
      case "da dầu":
        return "bg-warning bg-opacity-25 text-dark";
      case "dry":
      case "da khô":
        return "bg-info bg-opacity-25 text-primary";
      case "sensitive":
      case "da nhạy cảm":
        return "bg-danger bg-opacity-25 text-danger";
      default:
        return "bg-mint text-teal";
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* 1. Header Card: Score & Overview */}
      <div className="bg-white border border-line r-xl p-4 p-md-5 shadow-sm">
        <div className="row align-items-center g-4">
          <div className="col-lg-4 text-center">
            <div className="p-3 bg-cream r-xl border border-line d-inline-block shadow-sm">
              <ScoreGauge score={Math.round(overallScore)} size={160} label="Chỉ số da" />
              <div className="mt-2">
                <span className={`badge ${getSkinTypeBadgeColor(skinType)} fw-semibold px-3 py-1`} style={{ fontSize: "0.85rem" }}>
                  Loại da: {skinType}
                </span>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-soft text-muted-ss border border-line">
                <FaShieldHalved className="me-1" /> Phân tích AI hoàn tất
              </span>
              <span className="text-muted-ss small">
                {analysedAt ? new Date(analysedAt).toLocaleString("vi-VN") : "Vừa xong"}
              </span>
            </div>

            <h2 className="ss-display fw-bold mb-2 text-body" style={{ fontSize: "1.75rem" }}>
              Báo cáo Sức khỏe Làn da
            </h2>

            <p className="text-muted-ss mb-3" style={{ fontSize: "0.95rem" }}>
              {summary || "Làn da của bạn đã được phân tích chi tiết. Dưới đây là các chỉ số cụ thể theo từng vùng trên khuôn mặt."}
            </p>

            <div className="d-flex flex-wrap gap-2 pt-1">
              <button
                onClick={onReset}
                className="btn btn-outline-ink r-pill px-3 py-2 fw-medium d-inline-flex align-items-center gap-2"
              >
                <FaRotateLeft size={13} />
                <span>Soi lại ảnh khác</span>
              </button>
              <Link
                to={ROUTES.PRODUCTS}
                className="btn btn-coral r-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
              >
                <FaPumpSoap size={13} />
                <span>Xem sản phẩm gợi ý</span>
              </Link>
              <Link
                to={ROUTES.DOCTORS}
                className="btn btn-outline-ink r-pill px-3 py-2 fw-medium d-inline-flex align-items-center gap-2"
              >
                <FaUserDoctor size={13} />
                <span>Tư vấn bác sĩ</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Detected Conditions Detail */}
      <div className="bg-white border border-line r-xl p-4 shadow-sm">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="ss-display fs-5 fw-bold mb-1">Chi tiết các vấn đề phát hiện</h3>
            <p className="text-muted-ss small mb-0">Thống kê mức độ nghiêm trọng và vị trí từng vùng mặt</p>
          </div>
          <span className="badge bg-soft text-muted-ss border border-line px-3 py-1">
            {conditions.length} vùng ghi nhận
          </span>
        </div>

        <div className="row g-3">
          {conditions.map((item, idx) => {
            const badge = getSeverityBadge(item.severityScore);
            return (
              <div key={item.id || idx} className="col-md-6">
                <div className="p-3 bg-cream border border-line rounded-3 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="fw-semibold text-body" style={{ fontSize: "0.95rem" }}>
                        {item.conditionName || item.conditionType}
                      </div>
                      <span className={`badge ${badge.bg} fw-semibold`}>
                        {badge.text} ({item.severityScore}/10)
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2 text-muted-ss small mb-2">
                      <span>Vị trí: <strong>{item.zoneName || item.zone || "Toàn mặt"}</strong></span>
                      {item.confidenceScore && (
                        <span>• Độ tin cậy AI: <strong>{Math.round(item.confidenceScore)}%</strong></span>
                      )}
                    </div>

                    {/* Severity Progress Bar */}
                    <div className="progress mb-3" style={{ height: 6 }}>
                      <div
                        className={`progress-bar ${badge.barBg}`}
                        role="progressbar"
                        style={{ width: `${Math.min(item.severityScore * 10, 100)}%` }}
                        aria-valuenow={item.severityScore}
                        aria-valuemin="0"
                        aria-valuemax="10"
                      />
                    </div>
                  </div>

                  {item.recommendationNote && (
                    <div className="p-2 bg-white rounded border border-line small text-muted-ss d-flex align-items-start gap-2">
                      <FaCircleCheck className="text-teal mt-1 flex-shrink-0" size={13} />
                      <span>{item.recommendationNote}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
