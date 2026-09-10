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
  FaHospital,
  FaEllipsisVertical,
  FaLocationDot,
  FaUserDoctor,
} from "react-icons/fa6";
import { useAuth } from "../../../shared/hooks/useAuth";
import ScoreGauge from "../../../shared/components/ScoreGauge";
import { ROUTES } from "../../../router/routes";
import { mockProducts } from "../../public/data/mockProducts";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("morning");

  const displayName = user?.fullName || user?.name || "bạn";

  const metrics = [
    { label: "Kiểm soát Mụn & Viêm", score: 88, status: "Tốt", change: "+4%", color: "text-teal", bg: "bg-mint" },
    { label: "Sắc tố & Thâm nám", score: 76, status: "Trung bình", change: "-2%", color: "text-warning", bg: "bg-light" },
    { label: "Độ ẩm & Cân bằng dầu", score: 82, status: "Tốt", change: "+6%", color: "text-teal", bg: "bg-mint" },
    { label: "Lão hóa & Nếp nhăn", score: 85, status: "Rất tốt", change: "Ổn định", color: "text-teal", bg: "bg-mint" },
  ];

  const morningRoutine = [
    { step: 1, name: "Sữa rửa mặt dịu nhẹ pH 5.5", desc: "Làm sạch bụi bẩn và dầu thừa ban đêm", time: "2 phút" },
    { step: 2, name: "Toner hoa cúc làm dịu", desc: "Cân bằng độ ẩm pH tự nhiên", time: "1 phút" },
    { step: 3, name: "Serum Vitamin C / Phục hồi B5", desc: "Chống oxy hóa và làm sáng da", time: "2 phút" },
    { step: 4, name: "Kem chống nắng phổ rộng SPF 50+", desc: "Bảo vệ toàn diện trước tia UVA/UVB", time: "1 phút" },
  ];

  const eveningRoutine = [
    { step: 1, name: "Tẩy trang dầu dừa micellar", desc: "Làm sạch sâu lớp kem chống nắng & bụi mịn", time: "3 phút" },
    { step: 2, name: "Sữa rửa mặt tạo bọt dịu nhẹ", desc: "Làm sạch sâu lỗ chân lông", time: "2 phút" },
    { step: 3, name: "Serum Niacinamide 10% / BHA", desc: "Phục hồi hàng rào bảo vệ da qua đêm", time: "2 phút" },
    { step: 4, name: "Kem dưỡng ẩm tái tạo da", desc: "Khóa ẩm sâu ngừa mất nước", time: "1 phút" },
  ];

  // Danh sách lịch hẹn sắp tới
  const [appointments] = useState([
    {
      id: 1,
      doctorName: "BS. CKII Ngô Thanh Trúc",
      spec: "Da liễu thẩm mỹ & Trị sẹo",
      clinic: "Phòng khám Da liễu Sài Gòn Skin Clinic",
      avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=120&h=120&fit=crop",
      date: "Thứ Sáu, 12/09/2026",
      time: "15:00 - 15:45",
      type: "online", // 'online' | 'offline'
      meetUrl: "https://meet.google.com/xyz-skin-doc",
      status: "Đã xác nhận",
      fee: "300.000đ",
    },
    {
      id: 2,
      doctorName: "ThS. BS Lê Minh Khôi",
      spec: "Da liễu lâm sàng & Mụn viêm",
      clinic: "Trung tâm Y khoa Thăng Long, Hà Nội",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&h=120&fit=crop",
      date: "Thứ Ba, 16/09/2026",
      time: "10:00 - 10:30",
      type: "offline",
      address: "18 Phố Huế, Q. Hai Bà Trưng, Hà Nội",
      status: "Chờ tái khám",
      fee: "350.000đ",
    },
  ]);

  // Lịch sử soi da gần nhất
  const [scanHistory] = useState([
    {
      id: "SCAN-0910",
      date: "10/09/2026 - 14:30",
      score: 82,
      skinType: "Da hỗn hợp thiên dầu",
      mainIssue: "Lỗ chân lông vùng chữ T và mụn cám nhẹ",
      improvement: "+3 điểm so với tuần trước",
    },
    {
      id: "SCAN-0903",
      date: "03/09/2026 - 09:15",
      score: 79,
      skinType: "Da dầu thiếu nước",
      mainIssue: "Vết thâm mụn mới và bã nhờn cánh mũi",
      improvement: "+5 điểm sau liệu trình cấp ẩm",
    },
    {
      id: "SCAN-0825",
      date: "25/08/2026 - 20:00",
      score: 74,
      skinType: "Da nhạy cảm ửng đỏ",
      mainIssue: "Kích ứng hàng rào bảo vệ mỏng",
      improvement: "Bắt đầu liệu trình Dưỡng Nhan",
    },
  ]);

  const handleCancelAppointment = (id) => {
    toast("Yêu cầu dời/hủy lịch đã được gửi đến bộ phận chăm sóc khách hàng.", { icon: "ℹ️" });
  };

  return (
    <div className="container-fluid px-0">
      {/* 1. Welcome Card & Quick Scan CTA */}
      <div className="bg-white border border-line r-xl p-4 p-md-5 mb-4 shadow-sm">
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-soft text-muted-ss border border-line">Dưỡng Nhan Dashboard</span>
              <span className={`badge ${user?.isPremium ? "bg-coral text-white" : "bg-mint text-teal"} fw-semibold`}>
                Gói {user?.membership || (user?.isPremium ? "Premium" : "Free")}
              </span>
            </div>
            <h1 className="ss-display fw-bold mb-2 text-body" style={{ fontSize: "1.85rem" }}>
              Xin chào, {displayName} 👋
            </h1>
            <p className="text-muted-ss mb-3" style={{ maxWidth: 620 }}>
              Làn da của bạn hôm nay đang ở trạng thái <strong>Hỗn hợp thiên dầu</strong>. Chỉ số sức khỏe tổng thể đạt <strong>82/100</strong>, các nốt viêm đã cải thiện đáng kể so với bài phân tích trước.
            </p>
            <div className="d-flex flex-wrap gap-2 pt-1">
              <Link
                to={ROUTES.SCAN}
                className="btn btn-coral r-pill px-4 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
              >
                <FaCamera size={15} />
                <span>Soi da AI ngay</span>
              </Link>
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
                <FaCircleCheck className="me-1" /> Sức khỏe da: Tốt (Cấp độ 2)
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
        {/* Left Column: Skincare Routine + Recommended Products */}
        <div className="col-lg-7">
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

          {/* Recommended Affiliate Products */}
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
                  <div className="border border-line rounded-3 p-3 bg-cream d-flex gap-3 align-items-center h-100">
                    <Link to={`/products/${p.id}`}>
                      <img
                        src={p.img}
                        alt={p.name}
                        className="rounded-3 object-fit-cover"
                        width={64}
                        height={64}
                      />
                    </Link>
                    <div className="flex-grow-1 overflow-hidden">
                      <span className="badge bg-mint text-teal fw-semibold mb-1" style={{ fontSize: "0.7rem" }}>
                        Độ hợp: {p.match}%
                      </span>
                      <Link to={`/products/${p.id}`} className="fw-semibold text-truncate small text-body d-block text-decoration-none hover-text-coral">
                        {p.name}
                      </Link>
                      <div className="text-coral fw-bold small">{p.price}</div>
                    </div>
                    <a
                      href={p.affiliateUrl || "https://shopee.vn"}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-coral btn-sm r-pill p-2"
                      title="Mua ngay trên Shopee (Affiliate)"
                    >
                      <FaArrowUpRightFromSquare size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Appointments & Recent Skin History */}
        <div className="col-lg-5">
          {/* Upcoming Appointments */}
          <div className="bg-white border border-line r-xl p-4 mb-4 shadow-sm">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="ss-display fs-5 fw-bold mb-0 d-flex align-items-center gap-2 text-body">
                <FaCalendarCheck className="text-coral" size={18} />
                <span>Lịch hẹn tư vấn ({appointments.length})</span>
              </h3>
              <Link to={ROUTES.DOCTORS} className="btn btn-outline-ink btn-sm r-pill px-3" style={{ fontSize: "0.78rem" }}>
                + Đặt lịch mới
              </Link>
            </div>

            <div className="d-flex flex-column gap-3">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-3 bg-cream rounded-3 border border-line">
                  <div className="d-flex align-items-start gap-3 mb-2">
                    <img
                      src={apt.avatar}
                      alt={apt.doctorName}
                      className="rounded-circle border"
                      width={46}
                      height={46}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="fw-bold text-body" style={{ fontSize: "0.92rem" }}>
                          {apt.doctorName}
                        </div>
                        <span className="badge bg-mint text-teal fw-medium" style={{ fontSize: "0.68rem" }}>
                          {apt.status}
                        </span>
                      </div>
                      <div className="text-muted-ss small" style={{ fontSize: "0.78rem" }}>
                        {apt.spec}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-1 small text-muted-ss border-top border-line pt-2 mb-3" style={{ fontSize: "0.8rem" }}>
                    <div className="d-flex justify-content-between">
                      <span>Thời gian:</span>
                      <span className="fw-semibold text-body">{apt.time} · {apt.date}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Hình thức:</span>
                      <span className={`fw-semibold ${apt.type === "online" ? "text-teal" : "text-body"}`}>
                        {apt.type === "online" ? "Online (Google Meet)" : "Tại phòng khám"}
                      </span>
                    </div>
                    {apt.type === "offline" && apt.address && (
                      <div className="d-flex justify-content-between">
                        <span>Địa chỉ:</span>
                        <span className="text-truncate" style={{ maxWidth: 200 }}>{apt.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions for Appointment */}
                  <div className="d-flex gap-2">
                    {apt.type === "online" ? (
                      <a
                        href={apt.meetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-coral btn-sm r-pill flex-grow-1 fw-semibold d-flex align-items-center justify-content-center gap-2 py-2 shadow-sm"
                      >
                        <FaVideo size={13} />
                        <span>Vào phòng Meet</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toast.success(`Đã mở bản đồ chỉ đường tới: ${apt.address}`)}
                        className="btn btn-outline-teal btn-sm r-pill flex-grow-1 fw-semibold d-flex align-items-center justify-content-center gap-2 py-2"
                      >
                        <FaLocationDot size={13} />
                        <span>Xem chỉ đường</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCancelAppointment(apt.id)}
                      className="btn btn-outline-secondary btn-sm r-pill px-3"
                      style={{ fontSize: "0.78rem" }}
                    >
                      Dời lịch
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Skin Analyses History */}
          <div className="bg-white border border-line r-xl p-4 shadow-sm">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="ss-display fs-5 fw-bold mb-0 d-flex align-items-center gap-2 text-body">
                <FaCamera className="text-teal" size={17} />
                <span>Lịch sử phân tích da</span>
              </h3>
              <Link to={ROUTES.SCAN} className="btn btn-link text-coral text-decoration-none small fw-semibold p-0">
                Soi da mới <FaArrowRight size={11} />
              </Link>
            </div>

            <div className="d-flex flex-column gap-3">
              {scanHistory.map((item) => (
                <div
                  key={item.id}
                  className="d-flex align-items-start gap-3 p-3 rounded-3 bg-cream border border-line"
                >
                  <span
                    className="d-flex align-items-center justify-content-center rounded-circle bg-mint text-teal fw-bold"
                    style={{ width: 38, height: 38, minWidth: 38, fontSize: "0.85rem" }}
                  >
                    {item.score}
                  </span>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="badge bg-white text-muted-ss border border-line" style={{ fontSize: "0.68rem" }}>
                        {item.date}
                      </span>
                      <span className="text-teal fw-medium small" style={{ fontSize: "0.72rem" }}>
                        {item.improvement}
                      </span>
                    </div>
                    <div className="fw-bold text-body small">{item.skinType}</div>
                    <div className="text-muted-ss small text-truncate" style={{ fontSize: "0.76rem" }}>
                      {item.mainIssue}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to={ROUTES.SCAN}
              className="btn btn-outline-ink btn-sm r-pill w-100 mt-3 fw-medium d-flex align-items-center justify-content-center gap-2"
            >
              <FaCamera size={12} />
              <span>Thực hiện phân tích da mới với AI</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
