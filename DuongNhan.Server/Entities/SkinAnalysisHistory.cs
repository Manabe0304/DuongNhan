using System;

namespace DuongNhan.Server.Entities
{
    public class SkinAnalysisHistory
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public string ImageUrl { get; set; } = null!;

        // Các chỉ số AI phân tích
        public double AcneScore { get; set; }
        public double PigmentScore { get; set; }
        public double WrinkleScore { get; set; }
        public double PoreScore { get; set; }
        public string SkinType { get; set; } = null!; // Oily, Dry, Normal, Combination

        public string? RawAiResponse { get; set; } // Lưu JSON gốc từ AI API
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public virtual User User { get; set; } = null!;
    }
}