import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaWandMagicSparkles,
  FaMagnifyingGlass,
  FaCartShopping,
  FaStar,
  FaFilter,
  FaRotateLeft,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";
import { mockProducts } from "../data/mockProducts";
import { ROUTES } from "../../../router/routes";
import { useAuth } from "../../../shared/hooks/useAuth";

export default function ProductsPage() {
  const { isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("Tất cả");
  const [selectedSkinType, setSelectedSkinType] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");

  const categories = ["Tất cả", "Serum", "Chống nắng", "Làm sạch", "Toner", "Kem dưỡng"];

  const skinTypes = [
    { value: "all", label: "Mọi loại da" },
    { value: "oily", label: "Da dầu" },
    { value: "dry", label: "Da khô" },
    { value: "combination", label: "Da hỗn hợp" },
    { value: "sensitive", label: "Da nhạy cảm" },
  ];

  const conditions = [
    { value: "all", label: "Tất cả vấn đề" },
    { value: "acne", label: "Mụn & Viêm" },
    { value: "pore", label: "Lỗ chân lông" },
    { value: "hyperpigmentation", label: "Thâm mụn" },
    { value: "melasma", label: "Nám & Tàn nhang" },
    { value: "dryness", label: "Thiếu ẩm, Khô ráp" },
    { value: "wrinkle", label: "Lão hóa, Nếp nhăn" },
  ];

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((p) => {
      // 1. Tìm kiếm theo tên hoặc thương hiệu
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Lọc theo danh mục
      const matchesCat = selectedCat === "Tất cả" || p.cat === selectedCat;

      // 3. Lọc theo loại da
      const matchesSkinType =
        selectedSkinType === "all" ||
        p.skinTypeFit === "all" ||
        p.skinTypeFit === selectedSkinType;

      // 4. Lọc theo tình trạng da
      const matchesCondition =
        selectedCondition === "all" ||
        (p.targetConditions && p.targetConditions.includes(selectedCondition));

      return matchesSearch && matchesCat && matchesSkinType && matchesCondition;
    });
  }, [searchQuery, selectedCat, selectedSkinType, selectedCondition]);

  const handleResetFilter = () => {
    setSearchQuery("");
    setSelectedCat("Tất cả");
    setSelectedSkinType("all");
    setSelectedCondition("all");
  };

  return (
    <div className="container px-3 py-4 py-md-5">
      {/* Page Header */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="badge bg-mint text-teal fw-semibold">Gợi ý AI thông minh</span>
          <span className="badge bg-soft text-muted-ss border border-line">Dược mỹ phẩm chính hãng</span>
        </div>
        <h1 className="ss-display fw-bold mb-2 text-body" style={{ fontSize: "2rem" }}>
          Sản phẩm chăm sóc da phù hợp
        </h1>
        <p className="text-muted-ss" style={{ maxWidth: 640 }}>
          Hệ thống AI tự động phân tích và đối chiếu thành phần dược mỹ phẩm với tình trạng da cá nhân của bạn, giúp tối ưu hiệu quả và tiết kiệm chi phí.
        </p>
      </div>

      {/* Banner AI Callout */}
      {!isAuthenticated ? (
        <div className="bg-peach r-xl px-4 py-3 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-sm" style={{ color: "#B4471F" }}>
          <div className="d-flex align-items-center gap-3">
            <FaWandMagicSparkles size={20} />
            <div>
              <div className="fw-bold">Bạn chưa đăng nhập?</div>
              <div className="small">Đăng nhập và hoàn tất bài soi da AI để xem điểm tương thích MatchScore cá nhân hóa!</div>
            </div>
          </div>
          <Link to={ROUTES.LOGIN} className="btn btn-sm btn-coral r-pill px-3 fw-semibold">
            Đăng nhập ngay
          </Link>
        </div>
      ) : (
        <div className="bg-mint border border-teal r-xl px-4 py-3 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-sm">
          <div className="d-flex align-items-center gap-3">
            <FaWandMagicSparkles className="text-teal" size={20} />
            <div>
              <div className="fw-bold text-teal">Điểm tương thích AI đang hoạt động</div>
              <div className="small text-body">
                Các sản phẩm bên dưới được chấm điểm MatchScore dựa trên dữ liệu phân tích da mới nhất của bạn.
              </div>
            </div>
          </div>
          <Link to={ROUTES.SCAN} className="btn btn-sm btn-outline-teal r-pill px-3 fw-semibold bg-white text-teal">
            Soi da lại
          </Link>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="bg-white border border-line r-xl p-3 p-md-4 mb-4 shadow-sm">
        {/* Search Bar */}
        <div className="row g-3 mb-3">
          <div className="col-lg-6">
            <div className="d-flex align-items-center gap-2 bg-cream border border-line r-pill px-3 py-2 w-100">
              <FaMagnifyingGlass className="text-muted-ss" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên sản phẩm, thương hiệu (La Roche-Posay, CeraVe...)..."
                className="border-0 bg-transparent small w-100"
                style={{ outline: "none" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="btn btn-sm btn-link text-muted-ss p-0 text-decoration-none"
                  style={{ fontSize: "0.8rem" }}
                >
                  Xóa
                </button>
              )}
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <select
              value={selectedSkinType}
              onChange={(e) => setSelectedSkinType(e.target.value)}
              className="form-select form-select-sm r-pill py-2 px-3 border border-line bg-cream"
              aria-label="Lọc theo loại da"
            >
              {skinTypes.map((st) => (
                <option key={st.value} value={st.value}>
                  Loại da: {st.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-sm-6 col-lg-3">
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="form-select form-select-sm r-pill py-2 px-3 border border-line bg-cream"
              aria-label="Lọc theo tình trạng da"
            >
              {conditions.map((cd) => (
                <option key={cd.value} value={cd.value}>
                  Tình trạng: {cd.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills & Reset */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-2 border-top border-line">
          <div className="d-flex gap-1 flex-wrap align-items-center">
            <span className="text-muted-ss small me-2 d-none d-sm-inline">
              <FaFilter size={11} className="me-1" /> Danh mục:
            </span>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCat(c)}
                className={`btn btn-sm r-pill px-3 ${
                  selectedCat === c ? "bg-ink text-white shadow-sm" : "bg-soft text-body hover-bg-cream"
                }`}
                style={{ fontSize: "0.82rem" }}
              >
                {c}
              </button>
            ))}
          </div>

          {(selectedCat !== "Tất cả" || selectedSkinType !== "all" || selectedCondition !== "all" || searchQuery) && (
            <button
              onClick={handleResetFilter}
              className="btn btn-sm btn-link text-coral text-decoration-none d-flex align-items-center gap-1 p-0 small fw-semibold"
            >
              <FaRotateLeft size={11} /> Đặt lại bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="text-muted-ss small">
          Tìm thấy <strong>{filteredProducts.length}</strong> sản phẩm phù hợp
        </span>
        <span className="badge bg-soft text-muted-ss border border-line small">
          Liên kết mua hàng chính hãng Affiliate Shopee / Lazada
        </span>
      </div>

      {/* Product Grid */}
      <div className="row g-3 g-md-4">
        {filteredProducts.map((p) => (
          <div key={p.id} className="col-6 col-md-4 col-lg-3">
            <div className="ss-card ss-hover-card r-xl overflow-hidden h-100 bg-white border border-line d-flex flex-column shadow-sm">
              {/* Image & Match Badge */}
              <div className="position-relative overflow-hidden">
                <Link to={`/products/${p.id}`}>
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-100 object-fit-cover transition-transform"
                    style={{ height: 180 }}
                  />
                </Link>

                <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1">
                  <span className="badge bg-mint text-teal fw-bold shadow-sm" style={{ fontSize: "0.7rem" }}>
                    <FaWandMagicSparkles className="me-1" /> Match {p.match}%
                  </span>
                  <span className="badge bg-white text-muted-ss border border-line fw-normal" style={{ fontSize: "0.65rem" }}>
                    {p.brand}
                  </span>
                </div>

                {/* Affiliate Tag Top Right */}
                <div className="position-absolute top-0 end-0 m-2">
                  <span className="badge bg-coral text-white fw-medium shadow-sm" style={{ fontSize: "0.65rem" }}>
                    Affiliate
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3 d-flex flex-column flex-grow-1">
                <div className="d-flex align-items-center justify-content-between gap-1 mb-1">
                  <span className="text-muted-ss" style={{ fontSize: "0.72rem" }}>
                    {p.cat} · {p.volume}
                  </span>
                  <div className="d-flex align-items-center gap-1 text-warning" style={{ fontSize: "0.72rem" }}>
                    <FaStar size={10} />
                    <span className="fw-semibold text-dark">{p.rating}</span>
                  </div>
                </div>

                <Link
                  to={`/products/${p.id}`}
                  className="fw-semibold text-body text-decoration-none mb-1 text-truncate-2 hover-text-coral"
                  style={{
                    fontSize: "0.88rem",
                    lineHeight: "1.35",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    height: "2.4em",
                  }}
                  title={p.name}
                >
                  {p.name}
                </Link>

                <div className="mb-2">
                  <span className="badge bg-soft text-muted-ss fw-normal" style={{ fontSize: "0.68rem" }}>
                    {p.skinTypeFitLabel}
                  </span>
                </div>

                {/* Price and Actions */}
                <div className="mt-auto pt-2 border-top border-line">
                  <div className="d-flex align-items-baseline gap-2 mb-2">
                    <span className="ss-mono fw-bold text-coral" style={{ fontSize: "0.95rem" }}>
                      {p.price}
                    </span>
                    {p.originalPrice && (
                      <span className="text-muted-ss text-decoration-line-through" style={{ fontSize: "0.72rem" }}>
                        {p.originalPrice}
                      </span>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    <Link
                      to={`/products/${p.id}`}
                      className="btn btn-outline-ink btn-sm r-pill flex-grow-1 py-1 fw-medium"
                      style={{ fontSize: "0.78rem" }}
                    >
                      Chi tiết
                    </Link>
                    <a
                      href={p.affiliateUrl || "https://shopee.vn"}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-coral btn-sm r-pill px-2 py-1 d-flex align-items-center justify-content-center"
                      title="Mua ngay trên Shopee"
                    >
                      <FaCartShopping size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-white border border-line r-xl p-5 text-center my-4">
          <div className="mb-3 text-muted-ss">
            <FaMagnifyingGlass size={36} />
          </div>
          <h4 className="ss-display fw-bold mb-2">Không tìm thấy sản phẩm phù hợp</h4>
          <p className="text-muted-ss mb-3 small">
            Thử thay đổi từ khóa tìm kiếm hoặc chọn lại các tiêu chí lọc loại da / tình trạng da.
          </p>
          <button onClick={handleResetFilter} className="btn btn-outline-ink btn-sm r-pill px-4">
            Xóa toàn bộ bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
