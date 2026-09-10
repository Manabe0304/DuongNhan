using System;
using System.Collections.Generic;

namespace DuongNhan.Server.Entities
{
    public class AffiliateLink
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid? ProductId { get; set; }
        public Guid? BrandId { get; set; }
        public string DestinationUrl { get; set; } = null!;
        public string? TrackingUrl { get; set; }
        public decimal CommissionRate { get; set; } = 0;
        public int ClickCount { get; set; } = 0;
        public int ConversionCount { get; set; } = 0;
        public string? Platform { get; set; } // shopee|lazada|tiki|brand_website
        public DateTime? ExpiresAt { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual Product? Product { get; set; }
        public virtual Brand? Brand { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
