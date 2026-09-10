using System;

namespace DuongNhan.Server.Entities
{
    public class UserSubscription
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public Guid PlanId { get; set; }
        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiresAt { get; set; }
        public string Status { get; set; } = "active"; // active, expired, cancelled, paused
        public string? PaymentRef { get; set; }
        public string? PaymentMethod { get; set; }
        public bool AutoRenew { get; set; } = false;
        public int AnalysisUsed { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual User User { get; set; } = null!;
        public virtual SubscriptionPlan Plan { get; set; } = null!;
    }
}
