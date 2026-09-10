import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaWandMagicSparkles,
  FaCalendarCheck,
  FaVideo,
  FaCircleCheck,
  FaArrowRight,
  FaClock,
  FaSun,
  FaMoon,
  FaPumpSoap,
  FaArrowUpRightFromSquare,
  FaCamera,
  FaShieldCat,
  FaHeartPulse,
} from "react-icons/fa6";
import { useAuth } from "../../../shared/hooks/useAuth";
import ScoreGauge from "../../../shared/components/ScoreGauge";
import { ROUTES } from "../../../router/routes";
import { mockProducts } from "../../public/data/mockProducts";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("morning");
  const [analyzing, setAnalyzing] = useState(false);

  const handleSimulateScan = () => {
    setAnalyzing(true);
    toast.loading("Đang kết nối camera và AI phân tích da...", { id: "scan-toast" });
    setTimeout(() => {
      setAnalyzing(false);
      toast.success("Phân tích hoàn tất! Điểm sức khỏe làn da đạt 84/100 (+2 điểm so với tuần trước)", { id: "scan-toast" });
    }, 2000);
  };

  const displayName = user?.name || user?.fullName || "bạn";

  const metrics = [
    { label: "Kiểm soát Mụn & Viêm", score: 88, status: "Tốt", change: "+4%", color: "text-teal", bg: "bg-mint" },
    { label: "Sắc tố & Thâm nám", score: 76, status: "Trung bình", change: "-2%", color: "text-warning", bg: "bg-light" },
    { label: "Độ ẩm & Cân bằng dầu", score: 82, status: "Tốt", change: "+6%", color: "text-teal", bg: "bg-mint" },
    { label: "Lão hóa & Nếp nhăn", score: 85, status: "Rất tốt", change: "Ổn định", color: "text-teal", bg: "bg-mint" },
  ];

  const morningRoutine = [
    { step: 1, name: "Sữa rửa mặt dịu nhẹ pH 5.5", desc: "Làm sạch bụi bẩn và dầu thừa ban đêm", time: "2 phút" },
    { step: 2, name: "Toner hoa cúc làm dịu", desc: "Cân bằng độ ẩm pH tự nhiên", time: "1 phút" },
    { step: 3, name: "Serum Vitamin C / Phục hồi", desc: "Chống oxy hóa và làm sáng da", time: "2 phút" },
    { step: 4, name: "Kem chống nắng phổ rộng SPF 50+", desc: "Bảo vệ toàn diện trước tia UVA/UVB", time: "1 phút" },
  ];

  const eveningRoutine = [
    { step: 1, name: "Tẩy trang dầu dừa micellar", desc: "Làm sạch sâu lớp kem chống nắng & bụi mịn", time: "3 phút" },
    { step: 2, name: "Sữa rửa mặt tạo bọt dịu nhẹ", desc: "Làm sạch sâu lỗ chân lông", time: "2 phút" },
    { step: 3, name: "Serum Niacinamide 10% / B5", desc: "Phục hồi hàng rào bảo vệ da qua đêm", time: "2 phút" },
    { step: 4, name: "Kem dưỡng ẩm tái tạo da", desc: "Khóa ẩm sâu ngừa mất nước", time: "1 phút" },
  ];

  const recentHistory = [
    { date: "Hôm nay, 14:30", note: "Soi da định kỳ - Da giảm viêm 15%", score: 82, type: "Soi da AI" },
    { date: "07/09/2026", note: "Tư vấn 1-1 với BS. Ngô Thanh Trúc", score: 80, type: "Bác sĩ" },
    { date: "01/09/2026", note: "Bắt đầu liệu trình phục hồi sau mụn", score: 75, type: "Soi da AI" },
  ];

  return (
    <div className="container-fluid px-0">
      {/* 1. Welcome Card & Quick Scan CTA */}
      <div className="bg-white border border-line r-xl p-4 p-md-5 mb-4 shadow-sm">
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-soft text-muted-ss border border-line">Dưỡng Nhan Workspace</span>
              <span className="badge bg-mint text-teal fw-semibold">
                Gói {user?.membership || (user?.isPremium ? "Premium" : "Free")}
              </span>
            </div>
            <h1 className="ss-display fw-bold mb-2 text-body" style={{ fontSize: "1.85rem" }}>
              Xin chào, {displayName} 👋
            </h1>
            <p className="text-muted-ss mb-3" style={{ maxWidth: 620 }}>
              Làn da của bạn hôm nay đang ở trạng thái <strong>Hỗn hợp thiên dầu</strong>. Chỉ số sức khỏe tổng thể đạt <strong>82/100</strong>, độ ẩm được duy trì rất ổn định.
            </p>
            <div className="d-flex flex-wrap gap-2 pt-1">
              <button
                onClick={handleSimulateScan}
                disabled={analyzing}
                className="btn btn-coral r-pill px-4 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
              >
                <FaCamera size={15} />
                <span>{analyzing ? "Đang quét..." : "Soi da AI ngay"}</span>
              </button>
              <Link
                to={ROUTES.DOCTORS}
                className="btn btn-outline-ink r-pill px-4 fw-semibold d-inline-flex align-items-center gap-2"
              >
                <FaCalendarCheck size={14} />
                <span>Đặt hẹn tư vấn bác sĩ</span>
              </Link>
            </div>
          </div>

          <div className="col-lg-4 text-center">
            <div className="p-3 bg-cream r-xl border border-line d-inline-block shadow-sm">
              <ScoreGauge score={82} size={150} label="Chỉ số da" />
              <div className="mt-2 small fw-semibold text-teal">
                <FaCircleCheck className="me-1" /> Sức khỏe da: Khá tốt
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="row g-3 mb-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="col-sm-6 col-xl-3">
            <div className="bg-white border border-line r-xl p-3 h-100 shadow-sm">
              <div className="text-muted-ss small mb-1">{m.label}</div>
              <div className="d-flex align-items-baseline justify-content-between mb-2">
                <span className="ss-mono fs-3 fw-bold text-body">{m.score}</span>
                <span className={`badge ${m.bg} ${m.color} fw-semibold`}>{m.status}</span>
              </div>
              <div className="progress" style={{ height: 6 }}>
                <div
                  className="progress-bar bg-teal"
                  role="progressbar"
                  style={{ width: `${m.score}%` }}
                  aria-valuenow={m.score}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
              <div className="d-flex justify-content-between text-muted-ss small mt-2" style={{ fontSize: "0.75rem" }}>
                <span>Tiến triển: {m.change}</span>
                <span>Mục tiêu: 90+</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main 2-Column Section */}
      <div className="row g-4 mb-4">
        {/* Left Column: Skincare Routine + Products */}
        <div className="col-lg-8">
          {/* Routine Card */}
          <div className="bg-white border border-line r-xl p-4 mb-4 shadow-sm">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
              <div>
                <h3 className="ss-display fs-5 fw-bold mb-1">Chu trình chăm sóc hôm nay</h3>
                <p className="text-muted-ss small mb-0">Cá nhân hóa tự động theo kết quả soi da gần nhất</p>
              </div>
              <div className="btn-group r-pill p-1 bg-soft border border-line" role="group">
                <button
                  type="button"
                  onClick={() => setActiveTab("morning")}
                  className={`btn btn-sm r-pill px-3 fw-medium border-0 d-flex align-items-center gap-2 ${
                    activeTab === "morning" ? "bg-white text-body shadow-sm" : "text-muted-ss"
                  }`}
                >
                  <FaSun size={13} className="text-warning" /> Buổi sáng
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("evening")}
                  className={`btn btn-sm r-pill px-3 fw-medium border-0 d-flex align-items-center gap-2 ${
                    activeTab === "evening" ? "bg-white text-body shadow-sm" : "text-muted-ss"
                  }`}
                >
                  <FaMoon size={13} className="text-teal" /> Buổi tối
                </button>
              </div>
            </div>

            <div className="d-flex flex-column gap-3">
              {(activeTab === "morning" ? morningRoutine : eveningRoutine).map((step) => (
                <div
                  key={step.step}
                  className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-cream border border-line"
                >
                  <div className="d-flex align-items-center gap-3">
                    <span
                      className="d-flex align-items-center justify-content-center rounded-circle bg-white border border-line fw-bold text-teal"
                      style={{ width: 34, height: 34, minWidth: 34 }}
                    >
                      {step.step}
                    </span>
                    <div>
                      <div className="fw-semibold text-body" style={{ fontSize: "0.95rem" }}>
                        {step.name}
                      </div>
                      <div className="text-muted-ss small">{step.desc}</div>
                    </div>
                  </div>
                  <span className="badge bg-white text-muted-ss border border-line d-none d-sm-inline-flex align-items-center gap-1">
                    <FaClock size={11} /> {step.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Products */}
          <div className="bg-white border border-line r-xl p-4 shadow-sm">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h3 className="ss-display fs-5 fw-bold mb-1">Sản phẩm tương thích cao</h3>
                <p className="text-muted-ss small mb-0">Liên kết chính hãng Shopee / Lazada có chiết khấu</p>
              </div>
              <Link to={ROUTES.PRODUCTS} className="btn btn-link text-coral text-decoration-none small fw-semibold p-0">
                Xem tất cả ({mockProducts.length}) <FaArrowRight size={11} />
              </Link>
            </div>

            <div className="row g-3">
              {mockProducts.slice(0, 2).map((p) => (
                <div key={p.id} className="col-md-6">
                  <div className="border border-line rounded-3 p-3 bg-cream d-flex gap-3 align-items-center">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="rounded-3 object-fit-cover"
                      width={64}
                      height={64}
                    />
                    <div className="flex-grow-1 overflow-hidden">
                      <span className="badge bg-mint text-teal fw-semibold mb-1" style={{ fontSize: "0.7rem" }}>
                        Độ hợp: {p.match}%
                      </span>
                      <div className="fw-semibold text-truncate small text-body">{p.name}</div>
                      <div className="text-coral fw-bold small">{p.price}</div>
                    </div>
                    <a
                      href="https://shopee.vn"
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-ink btn-sm r-pill p-2"
                      title="Xem trên sàn thương mại điện tử"
                    >
                      <FaArrowUpRightFromSquare size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Next Appointment & History */}
        <div className="col-lg-4">
          {/* Upcoming Appointment Card */}
          <div className="bg-white border border-line r-xl p-4 mb-4 shadow-sm">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="ss-display fs-6 fw-bold mb-0">Lịch hẹn tư vấn</h3>
              <span className="badge bg-mint text-teal fw-semibold">Đã xác nhận</span>
            </div>

            <div className="p-3 bg-cream rounded-3 border border-line mb-3">
              <div className="d-flex align-items-center gap-3 mb-3">
                <img
                  src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=120&h=120&fit=crop"
                  alt="BS. Ngô Thanh Trúc"
                  className="rounded-circle border"
                  width={48}
                  height={48}
                />
                <div>
                  <div className="fw-bold text-body">BS. Ngô Thanh Trúc</div>
                  <div className="text-muted-ss small">Chuyên khoa Da liễu thẩm mỹ</div>
                </div>
              </div>

              <div className="d-flex flex-column gap-2 small text-muted-ss border-top border-line pt-2">
                <div className="d-flex justify-content-between">
                  <span>Thời gian:</span>
                  <span className="fw-semibold text-body">15:00 - Thứ Sáu, 12/09</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Hình thức:</span>
                  <span className="fw-semibold text-teal">Online qua Google Meet</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Phí tư vấn:</span>
                  <span className="fw-semibold text-coral">300.000đ (Đã thanh toán)</span>
                </div>
              </div>
            </div>

            <a
              href="https://meet.google.com"
              target="_blank"
              rel="noreferrer"
              className="btn btn-coral w-100 r-pill fw-semibold d-flex align-items-center justify-content-center gap-2 py-2 shadow-sm"
            >
              <FaVideo size={14} />
              <span>Vào phòng tư vấn (Meet)</span>
            </a>
          </div>

          {/* Activity Log / Skin Timeline */}
          <div className="bg-white border border-line r-xl p-4 shadow-sm">
            <h3 className="ss-display fs-6 fw-bold mb-3">Nhật ký theo dõi da</h3>
            <div className="d-flex flex-column gap-3">
              {recentHistory.map((item, idx) => (
                <div key={idx} className="d-flex align-items-start gap-3 pb-3 border-bottom border-line last-border-none">
                  <span
                    className="d-flex align-items-center justify-content-center rounded-circle bg-mint text-teal fw-bold"
                    style={{ width: 32, height: 32, minWidth: 32, fontSize: "0.75rem" }}
                  >
                    {item.score}
                  </span>
                  <div>
                    <div className="fw-semibold text-body small">{item.note}</div>
                    <div className="text-muted-ss" style={{ fontSize: "0.75rem" }}>
                      {item.date} · <span className="badge bg-soft text-muted-ss">{item.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSimulateScan}
              className="btn btn-outline-ink btn-sm r-pill w-100 mt-3 fw-medium"
            >
              + Thêm ghi nhận soi da mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
