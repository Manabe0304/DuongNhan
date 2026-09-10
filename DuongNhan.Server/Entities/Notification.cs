using System;

namespace DuongNhan.Server.Entities
{
    public class Notification
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public string Title { get; set; } = null!;
        public string Body { get; set; } = null!;
        public string Type { get; set; } = "general"; // general, analysis_ready, appointment_confirm, appointment_reminder, promotion, checkup_reminder, subscription_expiry, order_update
        public string? ActionUrl { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        public virtual User User { get; set; } = null!;
    }
}
