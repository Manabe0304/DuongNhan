import { useState } from "react";
import { FaMagnifyingGlass, FaStar, FaLocationDot } from "react-icons/fa6";
import { mockDoctors } from "../data/mockDoctors";

export default function DoctorsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Tất cả");

  // Function chọn bộ lọc
  const handleFilter = (theFilter) => {
    setFilter(theFilter);
  };

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
          Danh sách bác sĩ đối tác của Dưỡng Nhan. Đăng nhập để xem lịch trống và đặt hẹn.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="d-flex flex-column flex-sm-row gap-2 mb-4">
        {/* Search */}
        <div
          className="d-flex align-items-center gap-2 bg-white border border-line r-pill px-3 py-2"
          style={{ maxWidth: 340 }}
        >
          <FaMagnifyingGlass
            size={14}
            className="text-muted-ss"
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên hoặc chuyên khoa..."
            className="border-0 small w-500"
            style={{ outline: "none" }}
          />
        </div>

        {/* Filter Buttons */}
        <div
          className="d-flex gap-2 flex-wrap align-items-center w-100"
        >
          {["Tất cả", "TP.HCM", "Hà Nội", "Rating cao"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleFilter(c)}
              className={`badge r-pill px-3 py-2 fw-medium border border-line ${
                filter === c
                  ? "bg-ink text-white"
                  : "bg-white text-dark"
              }`}
              style={{ cursor: "pointer" }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor List */}
      <div className="row g-3">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="col-6 col-lg-3"
          >
            <div className="ss-card ss-hover-card r-xl overflow-hidden h-100">
              <img
                src={d.img}
                alt={d.name}
                className="w-100"
                style={{
                  height: 150,
                  objectFit: "cover",
                }}
              />

              <div className="p-3">
                <h6 className="fw-semibold small mb-1">
                  {d.name}
                </h6>

                <p
                  className="text-muted-ss mb-2"
                  style={{ fontSize: ".8rem" }}
                >
                  {d.spec}
                </p>

                <div
                  className="d-flex align-items-center gap-1 mb-1 text-coral"
                  style={{ fontSize: ".8rem" }}
                >
                  <FaStar size={11} />
                  <span className="text-dark">
                    {d.rating} ({d.reviews})
                  </span>
                </div>

                <div
                  className="d-flex align-items-center gap-1 text-muted-ss mb-3"
                  style={{ fontSize: ".8rem" }}
                >
                  <FaLocationDot size={11} />
                  {d.city}
                </div>

                <button
                  className="btn btn-outline-secondary btn-sm w-100 r-pill"
                  disabled
                >
                  Đăng nhập để đặt lịch
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Không có kết quả */}
      {filtered.length === 0 && (
        <div className="text-center py-5 text-muted">
          Không tìm thấy bác sĩ phù hợp.
        </div>
      )}
    </div>
  );
}

