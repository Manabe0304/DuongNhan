import { useState } from "react";
import { Search, Star, MapPin } from "lucide-react";
import { mockDoctors } from "../data/mockDoctors";

export default function DoctorsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Tất cả");

  const filtered = mockDoctors.filter((d) => {
    // Tìm kiếm
    const matchSearch =
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.spec.toLowerCase().includes(query.toLowerCase());

    // Bộ lọc
    const filterMap = {
      "TP.HCM": d.city === "TP.HCM",
      "Hà Nội": d.city === "Hà Nội",
      "Rating cao": d.rating >= 4.8,
    };

    const matchFilter =
      filter === "Tất cả"
        ? true
        : filterMap[filter] ?? true;

    return matchSearch && matchFilter;
  });

  return (
    <div className="container px-3 py-5">
      <div className="mb-4">
        <h1 className="ss-display fw-semibold mb-2">
          Tìm bác sĩ da liễu
        </h1>

        <p
          className="text-muted-ss"
          style={{ maxWidth: 460 }}
        >
          Danh sách bác sĩ đối tác của Dưỡng Nhan. Đăng nhập để xem
          lịch trống và đặt hẹn.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3 mb-4">

        {/* Search */}
        <div
          className="d-flex align-items-center gap-2 bg-white border border-line rounded-pill px-3 py-2"
          style={{ maxWidth: 340 }}
        >
          <Search size={16} className="text-muted-ss" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên hoặc chuyên khoa..."
            className="border-0 w-100 bg-transparent"
            style={{ outline: "none" }}
          />
        </div>

        {/* Filter Buttons */}
        <div className="d-flex flex-wrap gap-2">

          {["Tất cả", "TP.HCM", "Hà Nội", "Rating cao"].map((item) => (

            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`btn rounded-pill px-3 d-flex align-items-center justify-content-center ${
                filter === item
                  ? "btn-dark"
                  : "btn-outline-secondary"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      {/* Doctor List */}
      <div className="row g-3">

        {filtered.map((d) => (

          <div
            key={d.id}
            className="col-12 col-sm-6 col-lg-3"
          >
            <div className="ss-card ss-hover-card r-xl overflow-hidden h-100">

              <img
                src={d.img}
                alt={d.name}
                className="w-100"
                style={{
                  height: 170,
                  objectFit: "cover",
                }}
              />

              <div className="p-3">

                <h6 className="fw-semibold mb-1">
                  {d.name}
                </h6>

                <p
                  className="text-muted-ss mb-2"
                  style={{ fontSize: ".85rem" }}
                >
                  {d.spec}
                </p>

                <div className="d-flex align-items-center gap-1 mb-2">
                  <Star
                    size={14}
                    fill="#f5a623"
                    color="#f5a623"
                  />

                  <small>
                    {d.rating} ({d.reviews} đánh giá)
                  </small>
                </div>

                <div className="d-flex align-items-center gap-1 text-muted mb-3">
                  <MapPin size={14} />
                  <small>{d.city}</small>
                </div>

                <button
                  className="btn btn-outline-secondary btn-sm w-100 rounded-pill"
                  disabled
                >
                  Đăng nhập để đặt lịch
                </button>

              </div>

            </div>
          </div>

        ))}

      </div>

      {filtered.length === 0 && (
        <div className="text-center py-5 text-muted">
          Không tìm thấy bác sĩ phù hợp.
        </div>
      )}
    </div>
  );
}