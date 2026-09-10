import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMagnifyingGlass,
  FaStar,
  FaLocationDot,
  FaCalendarCheck,
  FaVideo,
  FaHospital,
  FaClock,
  FaCircleCheck,
  FaXmark,
  FaUserDoctor,
  FaPhone,
} from "react-icons/fa6";
import { mockDoctors } from "../data/mockDoctors";
import { useAuth } from "../../../shared/hooks/useAuth";
import { ROUTES } from "../../../router/routes";
import toast from "react-hot-toast";

export default function DoctorsPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Tất cả");

  // State cho Booking Modal
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [bookingSlot, setBookingSlot] = useState("");
  const [consultType, setConsultType] = useState("online"); // 'online' | 'offline'
  const [note, setNote] = useState("");
  const [phone, setPhone] = useState(user?.phoneNumber || "0987654321");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bộ lọc bác sĩ
  const filtered = mockDoctors.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.spec.toLowerCase().includes(query.toLowerCase()) ||
      d.clinicName.toLowerCase().includes(query.toLowerCase());

    const filterMap = {
      "TP.HCM": d.city === "TP.HCM",
      "Hà Nội": d.city === "Hà Nội",
      "Đà Nẵng": d.city === "Đà Nẵng",
      "Rating cao": d.rating >= 4.8,
    };

    const matchFilter = filter === "Tất cả" ? true : filterMap[filter] ?? true;
    return matchSearch && matchFilter;
  });

  const handleOpenBooking = (doctor) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để đặt lịch hẹn với bác sĩ!");
      navigate(ROUTES.LOGIN);
      return;
    }
    setSelectedDoctor(doctor);
    setBookingSlot(doctor.availableSlots?.[0] || "09:00");
    setNote("");
  };

  const handleCloseBooking = () => {
    setSelectedDoctor(null);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!bookingSlot) {
      toast.error("Vui lòng chọn khung giờ khám!");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const fee =
        consultType === "online"
          ? selectedDoctor.consultFeeOnline
          : selectedDoctor.consultFeeOffline;

      toast.success(
        `Đặt lịch khám thành công với ${selectedDoctor.name} vào ${bookingSlot} ngày ${bookingDate}!`,
        { duration: 5000 }
      );

      handleCloseBooking();
      navigate(ROUTES.DASHBOARD);
    }, 800);
  };

  return (
    <div className="container px-3 py-4 py-md-5">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="badge bg-mint text-teal fw-semibold">Đội ngũ chuyên gia Da liễu</span>
          <span className="badge bg-soft text-muted-ss border border-line">Tư vấn 1:1 trực tiếp</span>
        </div>
        <h1 className="ss-display fw-bold mb-2 text-body" style={{ fontSize: "2rem" }}>
          Tìm & Đặt lịch bác sĩ da liễu
        </h1>
        <p className="text-muted-ss" style={{ maxWidth: 580 }}>
          Kết nối trực tiếp cùng các Bác sĩ Chuyên khoa Da liễu đầu ngành. Thăm khám trực tuyến qua video call hoặc trực tiếp tại phòng khám.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="bg-white border border-line r-xl p-3 p-md-4 mb-4 shadow-sm">
        <div className="row g-3 align-items-center">
          <div className="col-md-6 col-lg-5">
            <div className="d-flex align-items-center gap-2 bg-cream border border-line r-pill px-3 py-2">
              <FaMagnifyingGlass size={14} className="text-muted-ss" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm theo tên bác sĩ, chuyên khoa hoặc phòng khám..."
                className="border-0 bg-transparent small w-100"
                style={{ outline: "none" }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="btn btn-sm btn-link text-muted-ss p-0 text-decoration-none"
                  style={{ fontSize: "0.8rem" }}
                >
                  Xóa
                </button>
              )}
            </div>
          </div>

          <div className="col-md-6 col-lg-7">
            <div className="d-flex gap-2 flex-wrap align-items-center justify-content-md-end">
              <span className="text-muted-ss small d-none d-lg-inline">Khu vực / Đánh giá:</span>
              {["Tất cả", "TP.HCM", "Hà Nội", "Đà Nẵng", "Rating cao"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  className={`btn btn-sm r-pill px-3 fw-medium border border-line ${
                    filter === c ? "bg-ink text-white shadow-sm" : "bg-soft text-body hover-bg-cream"
                  }`}
                  style={{ fontSize: "0.82rem" }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="row g-4">
        {filtered.map((d) => (
          <div key={d.id} className="col-md-6 col-lg-6">
            <div className="ss-card ss-hover-card r-xl overflow-hidden bg-white border border-line p-4 shadow-sm h-100 d-flex flex-column">
              <div className="d-flex flex-column flex-sm-row gap-3">
                {/* Doctor Avatar */}
                <div className="position-relative align-self-start">
                  <img
                    src={d.img}
                    alt={d.name}
                    className="rounded-circle border border-line object-fit-cover"
                    width={90}
                    height={90}
                  />
                  <span
                    className="position-absolute bottom-0 end-0 badge bg-teal text-white rounded-circle p-1 border border-white"
                    title="Bác sĩ đã xác minh chứng chỉ hành nghề"
                  >
                    <FaCircleCheck size={12} />
                  </span>
                </div>

                {/* Doctor General Info */}
                <div className="flex-grow-1">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-1">
                    <h5 className="fw-bold mb-0 text-body">{d.name}</h5>
                    <div className="d-flex align-items-center gap-1 text-warning small">
                      <FaStar size={13} />
                      <span className="fw-bold text-dark">{d.rating}</span>
                      <span className="text-muted-ss">({d.reviews} lượt khám)</span>
                    </div>
                  </div>

                  <p className="text-teal fw-medium small mb-2">{d.spec}</p>

                  <div className="d-flex flex-column gap-1 text-muted-ss small mb-2" style={{ fontSize: "0.82rem" }}>
                    <div className="d-flex align-items-center gap-2">
                      <FaHospital className="text-muted-ss" size={13} />
                      <span>{d.clinicName}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaLocationDot className="text-muted-ss" size={13} />
                      <span className="text-truncate">{d.address}</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge bg-mint text-teal fw-normal" style={{ fontSize: "0.72rem" }}>
                      {d.experienceYears} năm kinh nghiệm
                    </span>
                    <span className="badge bg-soft text-muted-ss border border-line" style={{ fontSize: "0.72rem" }}>
                      Khu vực: {d.city}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio summary */}
              <p className="text-muted-ss small mt-3 mb-3" style={{ lineHeight: 1.6, fontSize: "0.84rem" }}>
                {d.bio}
              </p>

              {/* Pricing & CTA */}
              <div className="mt-auto pt-3 border-top border-line d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                  <div className="text-muted-ss" style={{ fontSize: "0.72rem" }}>Phí tư vấn từ</div>
                  <span className="ss-mono fs-5 fw-bold text-coral">{d.price}</span>
                  <span className="text-muted-ss small"> / lượt</span>
                </div>

                <button
                  onClick={() => handleOpenBooking(d)}
                  className="btn btn-coral r-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
                >
                  <FaCalendarCheck size={14} />
                  <span>Đặt lịch hẹn</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="bg-white border border-line r-xl p-5 text-center my-4">
          <FaUserDoctor size={36} className="text-muted-ss mb-3" />
          <h4 className="ss-display fw-bold mb-2">Không tìm thấy bác sĩ phù hợp</h4>
          <p className="text-muted-ss small mb-3">
            Vui lòng thử tìm kiếm theo từ khóa khác hoặc chuyển sang khu vực "Tất cả".
          </p>
          <button onClick={() => { setQuery(""); setFilter("Tất cả"); }} className="btn btn-outline-ink btn-sm r-pill px-4">
            Đặt lại bộ lọc
          </button>
        </div>
      )}

      {/* BOOKING MODAL (Pure Bootstrap Responsive Backdrop & Modal) */}
      {selectedDoctor && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{
            zIndex: 1060,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="bg-white rounded-4 shadow-lg border border-line w-100 overflow-hidden"
            style={{ maxWidth: 540, maxHeight: "90vh", display: "flex", flexDirection: "column" }}
          >
            {/* Modal Header */}
            <div className="p-3 px-4 border-bottom border-line d-flex align-items-center justify-content-between bg-cream">
              <div className="d-flex align-items-center gap-2">
                <FaCalendarCheck className="text-coral" size={18} />
                <h5 className="ss-display fw-bold mb-0 text-body">Đặt lịch tư vấn da liễu</h5>
              </div>
              <button
                type="button"
                onClick={handleCloseBooking}
                className="btn btn-sm btn-link text-muted-ss p-1 text-decoration-none"
                aria-label="Đóng modal"
              >
                <FaXmark size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto" style={{ flexGrow: 1 }}>
              {/* Doctor Quick View */}
              <div className="d-flex align-items-center gap-3 p-3 bg-cream rounded-3 border border-line mb-4">
                <img
                  src={selectedDoctor.img}
                  alt={selectedDoctor.name}
                  className="rounded-circle border"
                  width={50}
                  height={50}
                />
                <div>
                  <h6 className="fw-bold mb-0 text-body">{selectedDoctor.name}</h6>
                  <div className="text-teal small">{selectedDoctor.spec}</div>
                  <div className="text-muted-ss" style={{ fontSize: "0.75rem" }}>
                    {selectedDoctor.clinicName}
                  </div>
                </div>
              </div>

              <form onSubmit={handleConfirmBooking}>
                {/* 1. Chọn hình thức khám */}
                <div className="mb-3">
                  <label className="form-label fw-bold small text-body">1. HÌNH THỨC TƯ VẤN:</label>
                  <div className="row g-2">
                    <div className="col-6">
                      <div
                        onClick={() => setConsultType("online")}
                        className={`p-3 rounded-3 border text-center cursor-pointer transition-all ${
                          consultType === "online"
                            ? "border-teal bg-mint text-teal fw-semibold shadow-sm"
                            : "border-line bg-white text-muted-ss"
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        <FaVideo size={20} className="mb-1 d-block mx-auto" />
                        <span className="small d-block">Khám Online (Meet)</span>
                        <span className="ss-mono fw-bold small d-block mt-1">
                          {selectedDoctor.consultFeeOnline.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>

                    <div className="col-6">
                      <div
                        onClick={() => setConsultType("offline")}
                        className={`p-3 rounded-3 border text-center cursor-pointer transition-all ${
                          consultType === "offline"
                            ? "border-teal bg-mint text-teal fw-semibold shadow-sm"
                            : "border-line bg-white text-muted-ss"
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        <FaHospital size={20} className="mb-1 d-block mx-auto" />
                        <span className="small d-block">Tại phòng khám</span>
                        <span className="ss-mono fw-bold small d-block mt-1">
                          {selectedDoctor.consultFeeOffline.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Chọn ngày & giờ khám */}
                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label className="form-label fw-bold small text-body">2. CHỌN NGÀY HẸN:</label>
                    <input
                      type="date"
                      value={bookingDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="form-control form-control-sm r-lg border border-line"
                      required
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label fw-bold small text-body">3. KHUNG GIỜ CÒN TRỐNG:</label>
                    <div className="d-flex flex-wrap gap-1">
                      {selectedDoctor.availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setBookingSlot(slot)}
                          className={`btn btn-sm r-pill px-2 py-1 small ${
                            bookingSlot === slot
                              ? "bg-ink text-white"
                              : "btn-outline-secondary"
                          }`}
                          style={{ fontSize: "0.78rem" }}
                        >
                          <FaClock size={10} className="me-1" />
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Số điện thoại liên hệ */}
                <div className="mb-3">
                  <label className="form-label fw-bold small text-body">4. SỐ ĐIỆN THOẠI BÁC SĨ LIÊN HỆ:</label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-cream border-line">
                      <FaPhone size={12} className="text-muted-ss" />
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0987xxxxxx"
                      className="form-control border-line"
                      required
                    />
                  </div>
                </div>

                {/* 4. Ghi chú tình trạng da */}
                <div className="mb-4">
                  <label className="form-label fw-bold small text-body">5. MÔ TẢ VẤN ĐỀ DA HOẶC CÂU HỎI:</label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ví dụ: Da xuất hiện mụn bọc vùng quai hàm 2 tuần nay, đã dùng BHA nhưng hơi châm chích..."
                    className="form-control form-control-sm r-lg border border-line"
                  />
                </div>

                {/* Phí & Submit CTA */}
                <div className="p-3 bg-cream rounded-3 border border-line mb-3 d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-muted-ss small" style={{ fontSize: "0.75rem" }}>Tổng phí tư vấn dự kiến</div>
                    <span className="ss-mono fs-5 fw-bold text-coral">
                      {(consultType === "online"
                        ? selectedDoctor.consultFeeOnline
                        : selectedDoctor.consultFeeOffline
                      ).toLocaleString("vi-VN")}
                      đ
                    </span>
                  </div>

                  <span className="badge bg-mint text-teal small">Thanh toán sau khi xác nhận</span>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={handleCloseBooking}
                    className="btn btn-outline-secondary r-pill flex-grow-1"
                    disabled={isSubmitting}
                  >
                    Hủy bỏ
                  </button>

                  <button
                    type="submit"
                    className="btn btn-coral r-pill px-4 flex-grow-1 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <FaCalendarCheck size={14} />
                        <span>Xác nhận đặt hẹn</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
