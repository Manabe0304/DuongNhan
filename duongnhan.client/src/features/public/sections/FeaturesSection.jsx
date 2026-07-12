import { features } from "../data/features";

export default function FeaturesSection() {
  return (
    <section className="px-3 py-5 bg-white">
      <div className="container">
        <div className="mb-5" style={{ maxWidth: 520 }}>
          <h2 className="ss-display fw-semibold mb-2">Mọi thứ cho làn da, ở một nơi</h2>
          <p className="text-muted-ss mb-0">Từ phân tích AI đến đặt lịch bác sĩ, Dưỡng Nhan gộp cả hành trình chăm sóc da vào một nền tảng.</p>
        </div>
        <div className="row g-0 border border-line r-xl overflow-hidden">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="col-12 col-md-6 p-4"
              style={{
                borderTop: i > 1 ? "1px solid var(--line)" : "none",
                borderLeft: i % 2 === 1 ? "1px solid var(--line)" : "none",
              }}
            >
              <div className="d-flex gap-3">
                <span className={`d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 bg-${f.tint}`} style={{ width: 44, height: 44 }}>
                  <f.icon size={19} color={f.color} />
                </span>
                <div>
                  <h6 className="fw-semibold mb-1">{f.title}</h6>
                  <p className="text-muted-ss small mb-0">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
