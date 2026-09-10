using System;

namespace DuongNhan.Server.Entities
{
    public class SkinProfile
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public string SkinType { get; set; } = "normal"; // oily, dry, combination, sensitive, normal
        public string? KnownConditions { get; set; } // JSON: ["acne","hyperpigmentation"]
        public string? Allergens { get; set; } // JSON: thành phần dị ứng
        public string? SkinGoals { get; set; } // JSON: ["brighten","anti-aging"]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        public virtual User User { get; set; } = null!;
    }
}
