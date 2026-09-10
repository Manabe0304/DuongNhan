using System;
using System.Collections.Generic;

namespace DuongNhan.Server.Entities
{
    public class Product
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BrandId { get; set; }
        public string Name { get; set; } = null!;
        public string? SKU { get; set; }
        public string Slug { get; set; } = null!;
        public string? Description { get; set; }
        public string? Ingredients { get; set; }
        public decimal Price { get; set; } = 0;
        public string Currency { get; set; } = "VND";
        public string? ImageUrl { get; set; }
        public string? Category { get; set; }
        public string? TargetConditions { get; set; } // JSON array
        public string SkinTypeFit { get; set; } = "all"; // all, oily, dry, combination, sensitive, normal
        public decimal? Rating { get; set; }
        public int ReviewCount { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Thuộc tính tiện ích tương thích
        public string? AffiliateUrl { get; set; }
        public string? TargetSkinType { get => SkinTypeFit; set => SkinTypeFit = value ?? "all"; }
        public string? TargetIssue { get => TargetConditions; set => TargetConditions = value; }

        // Navigation Properties
        public virtual Brand Brand { get; set; } = null!;
        public virtual ICollection<AffiliateLink> AffiliateLinks { get; set; } = new List<AffiliateLink>();
        public virtual ICollection<ProductRecommendation> ProductRecommendations { get; set; } = new List<ProductRecommendation>();
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}