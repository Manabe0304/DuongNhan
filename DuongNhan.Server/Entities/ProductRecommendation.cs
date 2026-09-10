using System;

namespace DuongNhan.Server.Entities
{
    public class ProductRecommendation
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid AnalysisId { get; set; }
        public Guid ProductId { get; set; }
        public decimal MatchScore { get; set; } // 0.00 – 100.00
        public string? Reason { get; set; }
        public int DisplayOrder { get; set; } = 0;
        public bool IsClicked { get; set; } = false;
        public DateTime? ClickedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual SkinAnalysis Analysis { get; set; } = null!;
        public virtual Product Product { get; set; } = null!;
    }
}
