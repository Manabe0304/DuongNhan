using System;
using System.Collections.Generic;

namespace DuongNhan.Server.Entities
{
    public class SkinAnalysis
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public string ImageUrl { get; set; } = null!;
        public string? ImageThumbnailUrl { get; set; }
        public decimal? OverallScore { get; set; }
        public string? AIModelVersion { get; set; }
        public string? RawAIResponse { get; set; }
        public bool IsVerifiedByDoctor { get; set; } = false;
        public Guid? VerifiedByDoctorId { get; set; }
        public DateTime? VerifiedAt { get; set; }
        public string? DoctorNote { get; set; }
        public DateTime AnalysedAt { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual User User { get; set; } = null!;
        public virtual Doctor? VerifiedByDoctor { get; set; }
        public virtual ICollection<SkinCondition> SkinConditions { get; set; } = new List<SkinCondition>();
        public virtual ICollection<ProductRecommendation> ProductRecommendations { get; set; } = new List<ProductRecommendation>();
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}
