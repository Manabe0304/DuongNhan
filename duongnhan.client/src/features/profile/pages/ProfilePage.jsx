import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaCrown,
  FaCoins,
  FaShieldHalved,
  FaPenToSquare,
  FaFloppyDisk,
  FaCamera,
  FaCalendarDays,
  FaGift,
  FaCircleCheck,
  FaArrowRight,
  FaPhone,
  FaEnvelope,
  FaIdBadge,
} from "react-icons/fa6";
import { useAuth } from "../../../shared/hooks/useAuth";
import { ROUTES } from "../../../router/routes";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || "Khách hàng Dưỡng Nhan",
    phoneNumber: user?.phoneNumber || "0987654321",
    email: user?.email || "user@duongnhan.vn",
  });

  const [pointsHistory] = useState([
    { id: 1, action: "Đăng ký tài khoản thành viên mới", points: "+100", date: "01/09/2026", type: "welcome" },
    { id: 2, action: "Hoàn tất bài soi da AI định kỳ", points: "+20", date: "05/09/2026", type: "scan" },
    { id: 3, action: "Mua sản phẩm Serum Hyalu B5 (Affiliate)", points: "+50", date: "08/09/2026", type: "shop" },
    { id: 4, action: "Đánh giá buổi tư vấn cùng BS. Ngô Thanh Trúc", points: "+30", date: "10/09/2026", type: "review" },
  ]);

  const totalPoints = 200;
  const nextTierPoints = 500;
  const progressPercent = Math.round((totalPoints / nextTierPoints) * 100);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error("Họ và tên không được để trống!");
      return;
    }

    updateUser({
      name: formData.fullName,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
    });

    setIsEditing(false);
    toast.success("Đã cập nhật thông tin cá nhân thành công!");
  };

  return (
    <div className="container-fluid px-0">
      {/* Header Banner */}
      <div className="bg-white border border-line r-xl p-4 p-md-5 mb-4 shadow-sm">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
          <div className="d-flex align-items-center gap-3 gap-md-4">
            {/* User Avatar */}
            <div className="position-relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={formData.fullName}
                  className="rounded-circle border border-line object-fit-cover shadow-sm"
                  width={80}
                  height={80}
                />
              ) : (
                <span
                  className="d-flex align-items-center justify-content-center rounded-circle bg-coral text-white fw-bold shadow-sm"
                  style={{ width: 80, height: 80, fontSize: "1.8rem" }}
                >
                  {formData.fullName[0]?.toUpperCase() || "U"}
                </span>
              )}
              <span
                className="position-absolute bottom-0 end-0 badge bg-teal text-white rounded-circle p-1 border border-white"
                title="Tài khoản đã kích hoạt"
              >
                <FaCircleCheck size={13} />
              </span>
            </div>

            {/* Profile Info */}
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <h1 className="ss-display fs-4 fw-bold text-body mb-0">{formData.fullName}</h1>
                <span className={`badge ${user?.isPremium ? "bg-coral text-white" : "bg-mint text-teal"} fw-semibold`}>
                  {user?.membership || (user?.isPremium ? "Hội viên Premium" : "Thành viên Free")}
                </span>
              </div>
              <div className="text-muted-ss small d-flex flex-wrap align-items-center gap-3">
                <span>
                  <FaEnvelope className="me-1" /> {user?.email}
                </span>
                <span>
                  <FaPhone className="me-1" /> {formData.phoneNumber}
                </span>
                <span>
                  <FaIdBadge className="me-1" /> Vai trò: {user?.role || "Khách hàng"}
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn btn-outline-ink r-pill px-4 fw-medium d-inline-flex align-items-center gap-2"
              >
                <FaPenToSquare size={13} />
                <span>Sửa thông tin</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-outline-secondary r-pill px-4 fw-medium"
              >
                Hủy
              </button>
            )}

            <Link
              to={ROUTES.PRICING}
              className="btn btn-coral r-pill px-4 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
            >
              <FaCrown size={14} />
              <span>Nâng cấp VIP</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Left Column: Form Info & Membership Details */}
        <div className="col-lg-7">
          {/* Personal Information Form */}
          <div className="bg-white border border-line r-xl p-4 mb-4 shadow-sm">
            <h3 className="ss-display fs-5 fw-bold mb-3 d-flex align-items-center gap-2 text-body">
              <FaUser className="text-teal" size={16} />
              <span>Thông tin tài khoản</span>
            </h3>

            <form onSubmit={handleSaveProfile}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted-ss">HỌ VÀ TÊN</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`form-control form-control-sm r-lg ${!isEditing ? "bg-cream" : ""}`}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted-ss">SỐ ĐIỆN THOẠI</label>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className={`form-control form-control-sm r-lg ${!isEditing ? "bg-cream" : ""}`}
                  />
                </div>

                <div className="col-md-12">
                  <label className="form-label small fw-bold text-muted-ss">ĐỊA CHỈ EMAIL (KHÔNG THỂ THAY ĐỔI)</label>
                  <input
                    type="email"
                    disabled
                    value={formData.email}
                    className="form-control form-control-sm r-lg bg-cream"
                  />
                  <div className="form-text small text-muted-ss" style={{ fontSize: "0.75rem" }}>
                    Email dùng để nhận thông báo phân tích da và lịch hẹn bác sĩ.
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="d-flex justify-content-end gap-2 pt-2 border-top border-line">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-outline-secondary btn-sm r-pill px-3"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="btn btn-coral btn-sm r-pill px-4 fw-semibold d-inline-flex align-items-center gap-2"
                  >
                    <FaFloppyDisk size={12} />
                    <span>Lưu thay đổi</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Membership Tier & Loyalty Points */}
          <div className="bg-white border border-line r-xl p-4 shadow-sm">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="ss-display fs-5 fw-bold mb-0 d-flex align-items-center gap-2 text-body">
                <FaCoins className="text-warning" size={18} />
                <span>Điểm thành viên & Thứ hạng</span>
              </h3>
              <span className="badge bg-mint text-teal fw-semibold">Hạng Bạc (Silver)</span>
            </div>

            <div className="p-3 bg-cream rounded-3 border border-line mb-4">
              <div className="d-flex align-items-baseline justify-content-between mb-2">
                <div>
                  <span className="ss-mono fs-2 fw-bold text-coral">{totalPoints}</span>
                  <span className="text-muted-ss small"> / {nextTierPoints} điểm nâng hạng Vàng</span>
                </div>
                <span className="badge bg-white border border-line text-muted-ss small">Còn 300 điểm nữa</span>
              </div>

              <div className="progress mb-2" style={{ height: 8 }}>
                <div
                  className="progress-bar bg-coral"
                  role="progressbar"
                  style={{ width: `${progressPercent}%` }}
                  aria-valuenow={progressPercent}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
              <div className="d-flex justify-content-between text-muted-ss small" style={{ fontSize: "0.75rem" }}>
                <span>Thành viên Bạc</span>
                <span>Thành viên Vàng (Gold Member)</span>
              </div>
            </div>

            <h5 className="fw-bold fs-6 text-body mb-3">Lịch sử tích lũy điểm thưởng</h5>
            <div className="d-flex flex-column gap-2">
              {pointsHistory.map((item) => (
                <div
                  key={item.id}
                  className="d-flex align-items-center justify-content-between p-2 px-3 rounded-3 bg-white border border-line"
                >
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="d-flex align-items-center justify-content-center rounded-circle bg-soft text-teal"
                      style={{ width: 28, height: 28 }}
                    >
                      <FaGift size={12} />
                    </span>
                    <div>
                      <div className="fw-semibold text-body small">{item.action}</div>
                      <div className="text-muted-ss" style={{ fontSize: "0.72rem" }}>
                        {item.date}
                      </div>
                    </div>
                  </div>
                  <span className="ss-mono fw-bold text-teal small">{item.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Subscription Package & Security */}
        <div className="col-lg-5">
          {/* Subscription Card */}
          <div className="bg-white border border-line r-xl p-4 mb-4 shadow-sm">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="ss-display fs-6 fw-bold mb-0 d-flex align-items-center gap-2 text-body">
                <FaCrown className="text-coral" size={16} />
                <span>Gói đăng ký hiện tại</span>
              </h3>
              <span className={`badge ${user?.isPremium ? "bg-coral text-white" : "bg-mint text-teal"}`}>
                {user?.membership || (user?.isPremium ? "Premium Plan" : "Gói Miễn Phí")}
              </span>
            </div>

            <div className="p-3 bg-cream rounded-3 border border-line mb-3">
              <div className="fw-bold text-body mb-1">
                {user?.isPremium ? "Gói Dưỡng Nhan Chuyên Sâu" : "Gói Trải Nghiệm Tiêu Chuẩn"}
              </div>
              <p className="text-muted-ss small mb-3">
                {user?.isPremium
                  ? "Bạn đang tận hưởng toàn quyền soi da AI không giới hạn, kèm ưu đãi giảm 20% phí khám bác sĩ da liễu."
                  : "Gói miễn phí cho phép soi da cơ bản 3 lần/tháng và xem danh mục sản phẩm gợi ý chuẩn y khoa."}
              </p>

              <div className="d-flex flex-column gap-2 small text-muted-ss border-top border-line pt-2">
                <div className="d-flex justify-content-between">
                  <span>Lượt soi da AI tháng này:</span>
                  <span className="fw-bold text-body">{user?.isPremium ? "Không giới hạn" : "2 / 3 lượt"}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Hạn sử dụng gói:</span>
                  <span className="fw-bold text-teal">{user?.isPremium ? "31/12/2026" : "Vĩnh viễn"}</span>
                </div>
              </div>
            </div>

            <Link
              to={ROUTES.PRICING}
              className="btn btn-outline-ink r-pill w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 py-2"
            >
              <span>Xem bảng giá & Nâng cấp</span>
              <FaArrowRight size={12} />
            </Link>
          </div>

          {/* Security & Quick Shortcuts */}
          <div className="bg-white border border-line r-xl p-4 shadow-sm">
            <h3 className="ss-display fs-6 fw-bold mb-3 d-flex align-items-center gap-2 text-body">
              <FaShieldHalved className="text-teal" size={16} />
              <span>Bảo mật & Quyền riêng tư</span>
            </h3>

            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center justify-content-between p-2 px-3 rounded-3 bg-cream border border-line">
                <div>
                  <div className="fw-semibold small text-body">Mật khẩu tài khoản</div>
                  <div className="text-muted-ss" style={{ fontSize: "0.72rem" }}>Đổi lần cuối: 01/09/2026</div>
                </div>
                <Link to={ROUTES.FORGOT_PASSWORD} className="btn btn-sm btn-link text-coral text-decoration-none fw-semibold p-0">
                  Đổi mật khẩu
                </Link>
              </div>

              <div className="d-flex align-items-center justify-content-between p-2 px-3 rounded-3 bg-cream border border-line">
                <div>
                  <div className="fw-semibold small text-body">Xác thực 2 lớp (2FA)</div>
                  <div className="text-muted-ss" style={{ fontSize: "0.72rem" }}>Bảo vệ thông tin bệnh án</div>
                </div>
                <span className="badge bg-soft text-muted-ss border border-line">Sắp ra mắt</span>
              </div>

              <div className="d-flex align-items-center justify-content-between p-2 px-3 rounded-3 bg-cream border border-line">
                <div>
                  <div className="fw-semibold small text-body">Dữ liệu ảnh soi da</div>
                  <div className="text-muted-ss" style={{ fontSize: "0.72rem" }}>Mã hóa chuẩn bảo mật y tế</div>
                </div>
                <span className="badge bg-mint text-teal">Đã bật</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
