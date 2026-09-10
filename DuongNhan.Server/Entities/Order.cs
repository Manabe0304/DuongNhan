using System;
using System.Collections.Generic;

namespace DuongNhan.Server.Entities
{
    public class Order
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public decimal TotalAmount { get; set; } = 0;
        public decimal PlatformCommission { get; set; } = 0;
        public string Currency { get; set; } = "VND";
        public string Status { get; set; } = "pending"; // pending, paid, processing, shipped, delivered, cancelled, refunded
        public string? PaymentMethod { get; set; }
        public string? PaymentRef { get; set; }
        public string? ShippingAddress { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual User User { get; set; } = null!;
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
