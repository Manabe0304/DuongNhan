import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaStar,
  FaShieldHalved,
  FaTruckFast,
  FaRotateLeft,
  FaWandMagicSparkles,
  FaCartShopping,
  FaArrowUpRightFromSquare,
  FaCircleCheck,
  FaHeart,
  FaShareNodes,
  FaCircleExclamation,
} from "react-icons/fa6";
import { mockProducts } from "../data/mockProducts";
import { ROUTES } from "../../../router/routes";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("desc");

  const product = mockProducts.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <div className="py-5">
          <FaCircleExclamation size={48} className="text-warning mb-3" />
          <h2 className="ss-display fw-bold mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-muted-ss mb-4">Sản phẩm bạn tìm kiếm có thể đã ngưng bán hoặc đường dẫn không đúng.</p>
          <Link to={ROUTES.PRODUCTS} className="btn btn-coral r-pill px-4">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = mockProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Đã sao chép liên kết sản phẩm vào bộ nhớ tạm!");
  };

  const handleSaveRoutine = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast.success(`Đã thêm "${product.name}" vào chu trình cá nhân!`);
    } else {
      toast("Đã bỏ lưu sản phẩm khỏi chu trình.", { icon: "ℹ️" });
    }
  };

  return (
    <div className="container px-3 py-4 py-md-5">
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb align-items-center mb-0">
          <li className="breadcrumb-item">
            <Link to={ROUTES.HOME} className="text-decoration-none text-muted-ss small">
              Trang chủ
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={ROUTES.PRODUCTS} className="text-decoration-none text-muted-ss small">
              Sản phẩm gợi ý
            </Link>
          </li>
          <li className="breadcrumb-item active small text-truncate" style={{ maxWidth: 260 }} aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <button
        onClick={() => navigate(-1)}
        className="btn btn-link text-decoration-none text-muted-ss p-0 mb-4 d-inline-flex align-items-center gap-2 small fw-medium hover-text-coral"
      >
        <FaArrowLeft size={13} /> Quay lại
      </button>

      {/* Main Product Section */}
      <div className="row g-4 g-lg-5 mb-5">
        {/* Left Column: Image */}
        <div className="col-lg-5">
          <div className="position-relative bg-white border border-line r-xl p-3 shadow-sm text-center">
            <img
              src={product.img}
              alt={product.name}
              className="img-fluid r-lg w-100 object-fit-cover"
              style={{ maxHeight: 420, minHeight: 320 }}
            />
            {/* Badges on Image */}
            <div className="position-absolute top-0 start-0 m-4 d-flex flex-column gap-2 align-items-start">
              <span className="badge bg-mint text-teal fw-semibold px-3 py-2 r-pill shadow-sm">
                <FaWandMagicSparkles className="me-1" /> Độ tương thích AI: {product.match}%
              </span>
              <span className="badge bg-ink text-white fw-medium px-3 py-1 r-pill small">
                {product.brand}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-line px-2">
              <button
                type="button"
                onClick={handleSaveRoutine}
                className={`btn btn-sm r-pill d-flex align-items-center gap-2 border ${
                  isLiked ? "btn-danger text-white" : "btn-outline-secondary"
                }`}
              >
                <FaHeart size={13} />
                <span>{isLiked ? "Đã lưu vào chu trình" : "Lưu vào chu trình"}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="btn btn-outline-ink btn-sm r-pill d-flex align-items-center gap-2"
                title="Chia sẻ sản phẩm"
              >
                <FaShareNodes size={13} />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="row g-2 mt-3 text-center">
            <div className="col-4">
              <div className="p-2 bg-cream rounded-3 border border-line h-100">
                <FaShieldHalved className="text-teal mb-1" size={16} />
                <div className="fw-semibold small" style={{ fontSize: "0.75rem" }}>100% Chính hãng</div>
                <div className="text-muted-ss" style={{ fontSize: "0.68rem" }}>Tem phụ phân phối</div>
              </div>
            </div>
            <div className="col-4">
              <div className="p-2 bg-cream rounded-3 border border-line h-100">
                <FaTruckFast className="text-teal mb-1" size={16} />
                <div className="fw-semibold small" style={{ fontSize: "0.75rem" }}>Giao siêu tốc</div>
                <div className="text-muted-ss" style={{ fontSize: "0.68rem" }}>Hỗ trợ hỏa tốc 2h</div>
              </div>
            </div>
            <div className="col-4">
              <div className="p-2 bg-cream rounded-3 border border-line h-100">
                <FaRotateLeft className="text-teal mb-1" size={16} />
                <div className="fw-semibold small" style={{ fontSize: "0.75rem" }}>Đổi trả 7 ngày</div>
                <div className="text-muted-ss" style={{ fontSize: "0.68rem" }}>Nếu da kích ứng</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Purchase */}
        <div className="col-lg-7">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge bg-soft text-muted-ss border border-line">{product.cat}</span>
            <span className="badge bg-peach text-dark fw-medium">Phù hợp: {product.skinTypeFitLabel}</span>
          </div>

          <h1 className="ss-display fw-bold text-body mb-2" style={{ fontSize: "1.75rem" }}>
            {product.name}
          </h1>

          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="d-flex align-items-center gap-1 text-warning small">
              <FaStar size={14} />
              <span className="fw-bold text-dark">{product.rating}</span>
              <span className="text-muted-ss">({product.reviews} đánh giá)</span>
            </div>
            <span className="text-muted-ss">|</span>
            <span className="text-muted-ss small">Dung tích: <strong className="text-body">{product.volume}</strong></span>
            <span className="text-muted-ss">|</span>
            <span className="text-teal small fw-medium">
              <FaCircleCheck size={12} className="me-1" /> Có sẵn hàng
            </span>
          </div>

          {/* Pricing Box */}
          <div className="bg-cream border border-line r-lg p-3 mb-4 d-flex align-items-baseline gap-3">
            <span className="ss-mono fs-2 fw-bold text-coral">{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-muted text-decoration-line-through small">{product.originalPrice}</span>
                <span className="badge bg-danger text-white r-pill small">Giảm giá</span>
              </>
            )}
          </div>

          {/* AI Skin Match Assessment Box */}
          <div className="bg-mint border border-teal r-xl p-3 mb-4 shadow-sm">
            <div className="d-flex align-items-center gap-2 mb-1">
              <FaWandMagicSparkles className="text-teal" size={16} />
              <strong className="text-teal">Đánh giá độ tương thích AI (MatchScore {product.match}%)</strong>
            </div>
            <p className="text-body small mb-2" style={{ lineHeight: 1.5 }}>
              Dựa trên kết quả soi da và hồ sơ da của bạn, sản phẩm chứa các thành phần phục hồi và kiểm soát bã nhờn rất tương thích với tình trạng da hiện tại.
            </p>
            <div className="d-flex flex-wrap gap-2">
              {product.targetConditionLabels?.map((label, idx) => (
                <span key={idx} className="badge bg-white text-teal border border-teal small">
                  ✓ {label}
                </span>
              ))}
            </div>
          </div>

          {/* Target Conditions */}
          <div className="mb-4">
            <label className="form-label text-muted-ss small fw-bold mb-2">VẤN ĐỀ DA TẬP TRUNG:</label>
            <div className="d-flex flex-wrap gap-2">
              {product.targetConditionLabels?.map((item, idx) => (
                <span key={idx} className="badge bg-soft text-body border border-line py-2 px-3 fw-medium">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Affiliate CTA Buttons */}
          <div className="d-flex flex-column flex-sm-row gap-2 mb-3">
            <a
              href={product.affiliateUrl || "https://shopee.vn"}
              target="_blank"
              rel="noreferrer"
              className="btn btn-coral r-pill px-4 py-3 fw-semibold flex-grow-1 d-flex align-items-center justify-content-center gap-2 shadow-sm"
            >
              <FaCartShopping size={16} />
              <span>Mua chính hãng trên Shopee</span>
              <span className="badge bg-white text-coral ms-1 small">Affiliate</span>
            </a>

            <a
              href="https://lazada.vn"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-ink r-pill px-4 py-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
            >
              <span>Mua trên Lazada</span>
              <FaArrowUpRightFromSquare size={13} />
            </a>
          </div>
          <div className="text-muted-ss small text-center text-sm-start" style={{ fontSize: "0.78rem" }}>
            * Sản phẩm được liên kết trực tiếp qua hệ thống Tiếp thị liên kết chính hãng Shopee Mall / LazMall. Dưỡng Nhan cam kết chất lượng sản phẩm chuẩn nhà phân phối.
          </div>
        </div>
      </div>

      {/* Tabs / Detailed Specs */}
      <div className="bg-white border border-line r-xl p-4 p-md-5 mb-5 shadow-sm">
        <ul className="nav nav-pills gap-2 pb-3 mb-4 border-bottom border-line">
          <li className="nav-item">
            <button
              onClick={() => setActiveTab("desc")}
              className={`btn btn-sm r-pill px-4 py-2 fw-medium ${
                activeTab === "desc" ? "bg-ink text-white" : "text-body hover-bg-soft"
              }`}
            >
              Công dụng & Mô tả
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setActiveTab("ingredients")}
              className={`btn btn-sm r-pill px-4 py-2 fw-medium ${
                activeTab === "ingredients" ? "bg-ink text-white" : "text-body hover-bg-soft"
              }`}
            >
              Bảng thành phần
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setActiveTab("usage")}
              className={`btn btn-sm r-pill px-4 py-2 fw-medium ${
                activeTab === "usage" ? "bg-ink text-white" : "text-body hover-bg-soft"
              }`}
            >
              Hướng dẫn sử dụng
            </button>
          </li>
        </ul>

        {activeTab === "desc" && (
          <div>
            <h4 className="ss-display fs-5 fw-bold mb-3">Mô tả sản phẩm</h4>
            <p className="text-body mb-3" style={{ lineHeight: 1.8 }}>
              {product.description}
            </p>
            <div className="row g-3 mt-2">
              <div className="col-md-6">
                <div className="p-3 bg-cream rounded-3 border border-line">
                  <h6 className="fw-bold small text-teal mb-1">Điểm nổi bật</h6>
                  <ul className="mb-0 ps-3 small text-muted-ss" style={{ lineHeight: 1.7 }}>
                    <li>Được các bác sĩ da liễu khuyên dùng trong phác đồ điều trị</li>
                    <li>Công thức không cồn khô, không paraben, an toàn cho da nhạy cảm</li>
                    <li>Hiệu quả được kiểm nghiệm lâm sàng trên hơn 1.000 đối tượng</li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-cream rounded-3 border border-line">
                  <h6 className="fw-bold small text-teal mb-1">Loại da lý tưởng</h6>
                  <p className="small text-muted-ss mb-0" style={{ lineHeight: 1.7 }}>
                    Sản phẩm phù hợp với <strong>{product.skinTypeFitLabel}</strong>, đặc biệt là làn da đang gặp các vấn đề về {product.targetConditionLabels?.join(", ")}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ingredients" && (
          <div>
            <h4 className="ss-display fs-5 fw-bold mb-2">Bảng thành phần chi tiết (Full INCI)</h4>
            <p className="text-muted-ss small mb-3">
              Mọi thành phần đều được công bố minh bạch và kiểm định an toàn theo chuẩn Dược mỹ phẩm Quốc tế.
            </p>
            <div className="p-3 bg-cream rounded-3 border border-line mb-3 ss-mono small text-body" style={{ lineHeight: 1.8 }}>
              {product.ingredients}
            </div>
          </div>
        )}

        {activeTab === "usage" && (
          <div>
            <h4 className="ss-display fs-5 fw-bold mb-2">Hướng dẫn sử dụng chuẩn y khoa</h4>
            <p className="text-body mb-3" style={{ lineHeight: 1.8 }}>
              {product.usage}
            </p>
            <div className="alert alert-warning r-lg border border-warning d-flex align-items-center gap-2 small">
              <FaCircleExclamation size={16} />
              <span>
                <strong>Lưu ý:</strong> Ngưng sử dụng và liên hệ bác sĩ da liễu qua tính năng Đặt lịch tư vấn của Dưỡng Nhan nếu xuất hiện hiện tượng đỏ rát hoặc kích ứng kéo dài trên 48h.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Related Recommended Products */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h3 className="ss-display fs-5 fw-bold mb-1">Sản phẩm cùng chu trình gợi ý</h3>
            <p className="text-muted-ss small mb-0">Các bước bổ trợ giúp tăng hiệu quả chăm sóc làn da</p>
          </div>
          <Link to={ROUTES.PRODUCTS} className="btn btn-outline-ink btn-sm r-pill px-3">
            Xem tất cả
          </Link>
        </div>

        <div className="row g-3">
          {relatedProducts.map((p) => (
            <div key={p.id} className="col-6 col-lg-3">
              <div className="ss-card ss-hover-card r-xl overflow-hidden h-100 bg-white border border-line d-flex flex-column">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-100 object-fit-cover"
                  style={{ height: 160 }}
                />
                <div className="p-3 d-flex flex-column flex-grow-1">
                  <span className="badge bg-mint text-teal fw-semibold align-self-start mb-2" style={{ fontSize: "0.68rem" }}>
                    Match {p.match}%
                  </span>
                  <div className="text-muted-ss small mb-1" style={{ fontSize: "0.75rem" }}>{p.brand}</div>
                  <h6 className="fw-semibold small mb-2 text-truncate" title={p.name}>{p.name}</h6>
                  <div className="mt-auto d-flex align-items-center justify-content-between pt-2 border-top border-line">
                    <span className="ss-mono fw-bold text-coral small">{p.price}</span>
                    <Link to={`/products/${p.id}`} className="btn btn-outline-ink btn-sm r-pill px-2 py-1 small">
                      Chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
