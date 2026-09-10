using System;
using System.Collections.Generic;

namespace DuongNhan.Server.DTOs.Responses
{
    public class SkinAnalysisResponse
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string ImageUrl { get; set; } = null!;
        public string? ImageThumbnailUrl { get; set; }
        public decimal OverallScore { get; set; }
        public string SkinType { get; set; } = null!;
        public string Summary { get; set; } = null!;
        public string? AIModelVersion { get; set; }
        public string? RawAIResponse { get; set; }
        public bool IsVerifiedByDoctor { get; set; }
        public string? DoctorNote { get; set; }
        public DateTime AnalysedAt { get; set; }
        public List<SkinConditionResponse> Conditions { get; set; } = new List<SkinConditionResponse>();
    }

    public class SkinConditionResponse
    {
        public Guid Id { get; set; }
        public string ConditionType { get; set; } = null!; // acne, melasma, pore, wrinkle, oiliness...
        public string ConditionName { get; set; } = null!; // Tên hiển thị tiếng Việt
        public decimal SeverityScore { get; set; } // 0.00 – 10.00
        public string? Zone { get; set; } // forehead, cheek_left, cheek_right, nose, chin, eye_area, full_face
        public string? ZoneName { get; set; } // Tên vùng mặt tiếng Việt
        public decimal? ConfidenceScore { get; set; } // 0 – 100
        public string? RecommendationNote { get; set; }
    }
}
