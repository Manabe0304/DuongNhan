import { useState } from "react";
import { FaPaperPlane, FaLocationDot, FaClock } from "react-icons/fa6";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: emailApi.send(formData)
    setSent(true);
  };

  return (
    <div className="container px-3 py-5">
      <div className="mb-4">
        <h1 className="ss-display fw-semibold mb-2">Liên hệ với chúng tôi</h1>
        <p className="text-muted-ss" style={{ maxWidth: 460 }}>Có câu hỏi về Dưỡng Nhan? Gửi tin nhắn, đội ngũ sẽ phản hồi trong 24 giờ.</p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-6">
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label className="form-label small fw-semibold text-muted-ss">Họ tên</label>
              <input required className="form-control r-lg" placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label className="form-label small fw-semibold text-muted-ss">Email</label>
              <input required type="email" className="form-control r-lg" placeholder="hello@gmail.com" />
            </div>
            <div>
              <label className="form-label small fw-semibold text-muted-ss">Nội dung</label>
              <textarea required rows={5} className="form-control r-lg" placeholder="Bạn cần hỗ trợ điều gì?" />
            </div>
            <button type="submit" className="btn btn-coral r-pill fw-semibold py-2 d-flex align-items-center justify-content-center gap-2">
              <FaPaperPlane size={14} /> Gửi liên hệ
            </button>
            {sent && <p className="text-teal small text-center mb-0">Cảm ơn bạn! Chúng tôi đã nhận được tin nhắn.</p>}
          </form>
        </div>

        <div className="col-12 col-md-6">
          <div className="bg-soft r-xl d-flex align-items-center justify-content-center mb-3" style={{ height: 200 }}>
            <div className="d-flex flex-column align-items-center text-muted-ss small gap-2">
              <FaLocationDot size={20} /> Bản đồ Google Map (placeholder)
            </div>
          </div>
          <div className="bg-white border border-line r-xl p-3 d-flex flex-column gap-2 small">
            <div className="d-flex align-items-center gap-2"><FaLocationDot size={14} color="var(--coral)" /> 268 Lý Thường Kiệt, P. Cửa Nam, Hà Nội</div>
            <div className="d-flex align-items-center gap-2"><FaClock size={14} color="var(--coral)" /> 8:00 – 18:00, Thứ 2 – Thứ 7</div>
            <div className="d-flex align-items-center gap-2"><FaPaperPlane size={14} color="var(--coral)" /> hello@duongnhan.ai</div>
          </div>
        </div>
      </div>
    </div>
  );
}
