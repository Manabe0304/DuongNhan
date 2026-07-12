const STEPS = [
  { n: "01", title: "Tải ảnh lên", desc: "Chụp hoặc tải lên một bức ảnh khuôn mặt rõ nét, không trang điểm." },
  { n: "02", title: "AI phân tích", desc: "Mô hình AI xử lý và chấm điểm mụn, dầu, độ ẩm, sắc tố trong vài giây." },
  { n: "03", title: "Nhận đề xuất", desc: "Xem điểm số, sản phẩm phù hợp và đặt lịch bác sĩ nếu cần." },
];

export default function HowItWorksSection() {
  return (
    <section className="px-3 py-5 bg-soft">
      <div className="container">
        <h2 className="ss-display fw-semibold mb-5 text-center">3 bước đến làn da khoẻ hơn</h2>
        <div className="row g-4">
          {STEPS.map((s) => (
            <div key={s.n} className="col-12 col-md-4">
              <span className="ss-mono fw-semibold d-block" style={{ fontSize: "2.6rem", color: "var(--line)" }}>{s.n}</span>
              <h6 className="fw-semibold mt-1 mb-2">{s.title}</h6>
              <p className="text-muted-ss small mb-0">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
