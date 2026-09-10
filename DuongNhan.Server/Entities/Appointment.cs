using System;

namespace DuongNhan.Server.Entities
{
    public class Appointment
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public Guid DoctorId { get; set; }
        public Guid? ClinicId { get; set; }
        public Guid? AnalysisId { get; set; }
        public DateTime ScheduledAt { get; set; }
        public int DurationMinutes { get; set; } = 30;
        public string Type { get; set; } = "offline"; // offline, online
        public string Status { get; set; } = "pending"; // pending, confirmed, completed, cancelled, no_show
        public string? UserNotes { get; set; }
        public string? DoctorNotes { get; set; }
        public string? MeetingUrl { get; set; }
        public decimal? ConsultationFee { get; set; }
        public decimal? PlatformFee { get; set; }
        public string PaymentStatus { get; set; } = "unpaid"; // unpaid, paid, refunded
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual User User { get; set; } = null!;
        public virtual Doctor Doctor { get; set; } = null!;
        public virtual Clinic? Clinic { get; set; }
        public virtual SkinAnalysis? Analysis { get; set; }

        // Thuộc tính tiện ích tương thích phiên bản cũ
        public Guid CustomerId { get => UserId; set => UserId = value; }
        public virtual User Customer { get => User; set => User = value; }
        public DateTime AppointmentDate { get => ScheduledAt; set => ScheduledAt = value; }
        public decimal Price { get => ConsultationFee ?? 0; set => ConsultationFee = value; }
        public string? Notes { get => UserNotes; set => UserNotes = value; }
        public string? MeetingLink { get => MeetingUrl; set => MeetingUrl = value; }
    }
}