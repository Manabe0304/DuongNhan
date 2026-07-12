import { Star } from "lucide-react";

const ITEMS = [
  { text: "Chỉ sau 2 tuần dùng sản phẩm được Dưỡng Nhan gợi ý, da mình giảm dầu rõ rệt.", author: "Thu Hà, 24 tuổi" },
  { text: "Lần đầu thấy một app chấm điểm da mà còn cho đặt lịch bác sĩ luôn, rất tiện.", author: "Minh Quân, 29 tuổi" },
  { text: "Biểu đồ theo dõi da theo thời gian giúp mình biết sản phẩm nào thật sự hợp.", author: "Bảo Ngọc, 22 tuổi" },
];

export default function TestimonialSection() {
  return (
    <section className="px-3 py-5 bg-soft">
      <div className="container">
        <h2 className="ss-display fw-semibold mb-4 text-center">Người dùng nói gì</h2>
        <div className="row g-3">
          {ITEMS.map((t) => (
            <div key={t.author} className="col-12 col-md-4">
              <div className="bg-white border border-line r-xl p-4 h-100">
                <div className="d-flex gap-1 mb-2 text-coral">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="var(--coral)" />)}
                </div>
                <p className="small mb-3">"{t.text}"</p>
                <p className="text-muted-ss small fw-semibold mb-0">{t.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
