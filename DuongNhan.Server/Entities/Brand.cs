using System;
using System.Collections.Generic;

namespace DuongNhan.Server.Entities
{
    public class Brand
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string? LogoUrl { get; set; }
        public string? WebsiteUrl { get; set; }
        public string? Description { get; set; }
        public bool IsAffiliate { get; set; } = false;
        public string? AffiliateCode { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
        public virtual ICollection<AffiliateLink> AffiliateLinks { get; set; } = new List<AffiliateLink>();
    }
}
