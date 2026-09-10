using System;

namespace DuongNhan.Server.Entities
{
    public class MembershipPoint
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public int TotalPoints { get; set; } = 0;
        public int RedeemedPoints { get; set; } = 0;
        public int ExpiredPoints { get; set; } = 0;
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        // Navigation Property
        public virtual User User { get; set; } = null!;
    }
}
