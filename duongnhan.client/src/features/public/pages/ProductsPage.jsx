import { useState } from "react";
import { Sparkles } from "lucide-react";
import { mockProducts } from "../data/mockProducts";

/**
 * ProductsPage — Route: "/products"
 * Public preview: category filter + product grid. MatchScore badge is shown
 * with mock values here; real % comes from analysisSlice once logged in.
 */
export default function ProductsPage() {
  const [cat, setCat] = useState("Tất cả");
  const cats = ["Tất cả", "Serum", "Chống nắng", "Làm sạch", "Toner"];
  const filtered = cat === "Tất cả" ? mockProducts : mockProducts.filter((p) => p.cat === cat);

  return (
    <div className="container px-3 py-5">
      <div className="mb-4">
        <h1 className="ss-display fw-semibold mb-2">Sản phẩm gợi ý</h1>
        <p className="text-muted-ss" style={{ maxWidth: 460 }}>
          Xem trước danh mục sản phẩm. Đăng nhập và phân tích da để thấy điểm phù hợp AI (MatchScore) riêng cho bạn.
        </p>
      </div>

      <div className="bg-peach r-xl px-4 py-3 mb-4 d-flex align-items-center gap-2 small" style={{ color: "#B4471F" }}>
        <Sparkles size={16} /> Đăng nhập để xem đề xuất AI theo loại da của bạn
      </div>

      <div className="d-flex gap-2 flex-wrap mb-4">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`btn btn-sm r-pill border border-line ${cat === c ? "bg-ink text-white" : "bg-white text-dark"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="row g-3">
        {filtered.map((p) => (
          <div key={p.id} className="col-6 col-lg-3">
            <div className="ss-card ss-hover-card r-xl overflow-hidden h-100">
              <img src={p.img} alt={p.name} className="w-100" style={{ height: 160, objectFit: "cover" }} />
              <div className="p-3">
                <span className="badge bg-mint text-teal fw-semibold" style={{ fontSize: ".65rem" }}>Match {p.match}%</span>
                <h6 className="fw-semibold small mt-2 mb-1">{p.name}</h6>
                <p className="text-muted-ss mb-2" style={{ fontSize: ".8rem" }}>{p.cat}</p>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="ss-mono fw-semibold small">{p.price}</span>
                  <button className="btn btn-coral btn-sm r-pill">Chi tiết</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
