using System;
using System.Collections.Generic;

namespace DuongNhan.Server.Entities
{
    public class SubscriptionPlan
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = null!;
        public string Tier { get; set; } = null!; // free, monthly, quarterly, annual, premium
        public decimal Price { get; set; } = 0;
        public string Currency { get; set; } = "VND";
        public int DurationDays { get; set; } = 30;
        public int AnalysisLimit { get; set; } = 3; // -1 = không giới hạn
        public bool HasProgressTracking { get; set; } = false;
        public bool HasPriorityConsult { get; set; } = false;
        public bool HasAIDetailedReport { get; set; } = false;
        public string? FeaturesJson { get; set; }
        public bool IsActive { get; set; } = true;
        public int SortOrder { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual ICollection<UserSubscription> UserSubscriptions { get; set; } = new List<UserSubscription>();
    }
}
