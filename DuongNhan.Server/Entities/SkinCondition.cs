using System;

namespace DuongNhan.Server.Entities
{
    public class SkinCondition
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid AnalysisId { get; set; }
        public string ConditionType { get; set; } = null!; // acne, blackhead, whitehead, hyperpigmentation, melasma, aging, wrinkle, pore, oiliness, dryness, redness, dark_circle, sensitivity
        public decimal SeverityScore { get; set; } // 0.00 – 10.00
        public string? Zone { get; set; } // forehead, cheek_left, cheek_right, nose, chin, eye_area, jawline, full_face
        public decimal? ConfidenceScore { get; set; } // 0 – 100
        public string? RecommendationNote { get; set; }

        // Navigation Property
        public virtual SkinAnalysis Analysis { get; set; } = null!;
    }
}
