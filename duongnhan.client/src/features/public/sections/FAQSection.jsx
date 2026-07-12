import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "../data/faqs";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section className="px-3 py-5 bg-soft">
      <div className="container" style={{ maxWidth: 640 }}>
        <h2 className="ss-display fw-semibold mb-4 text-center">Câu hỏi thường gặp</h2>
        <div className="d-flex flex-column gap-2">
          {faqs.map((f, i) => (
            <div key={f.q} className="bg-white border border-line r-lg overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                className="btn w-100 d-flex align-items-center justify-content-between px-3 py-3 text-start border-0"
              >
                <span className="fw-medium small">{f.q}</span>
                <ChevronDown size={17} style={{ transform: openIdx === i ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
              </button>
              {openIdx === i && <p className="px-3 pb-3 text-muted-ss small mb-0">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
