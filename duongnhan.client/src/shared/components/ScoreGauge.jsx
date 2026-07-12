import { useEffect, useState } from "react";

/**
 * Signature UI element of Skin Sensi: an animated radial "skin score" gauge.
 * Plain SVG + CSS transition — no chart library needed.
 * Reused across HeroSection, DashboardPage and SkinHistoryPage (Phase 4/8).
 */
export default function ScoreGauge({ score = 82, size = 200, label = "Overall Score" }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 200);
    return () => clearTimeout(t);
  }, [score]);

  const r = 64;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animated / 100) * circ;

  return (
    <div className="position-relative d-flex align-items-center justify-content-center mx-auto" style={{ width: size, height: size }}>
      <svg viewBox="0 0 160 160" width="100%" height="100%" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="80" cy="80" r={r} fill="none" stroke="var(--line)" strokeWidth="12" />
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="var(--teal)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div className="position-absolute d-flex flex-column align-items-center">
        <span className="ss-mono fw-semibold" style={{ fontSize: "2.1rem", color: "var(--teal)" }}>{animated}</span>
        <span className="text-muted-ss" style={{ fontSize: ".75rem" }}>{label}</span>
      </div>
    </div>
  );
}
