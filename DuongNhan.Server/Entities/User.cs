using System;
using System.Collections.Generic;

namespace DuongNhan.Server.Entities
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string? Phone { get; set; }
        public string? AvatarUrl { get; set; }
        public string Role { get; set; } = "user"; // user, admin, doctor
        public bool IsVerified { get; set; } = false;
        public string? RefreshToken { get; set; }
        public DateTime? TokenExpiresAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;

        // Thuộc tính tiện ích tương thích với AuthController
        public string? PhoneNumber { get => Phone; set => Phone = value; }
        public bool IsPremium { get; set; } = false;

        // Navigation Properties (18 bảng)
        public virtual SkinProfile? SkinProfile { get; set; }
        public virtual ICollection<SkinAnalysis> SkinAnalyses { get; set; } = new List<SkinAnalysis>();
        public virtual Doctor? Doctor { get; set; }
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public virtual ICollection<UserSubscription> UserSubscriptions { get; set; } = new List<UserSubscription>();
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
        public virtual MembershipPoint? MembershipPoint { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

        // Navigation properties tương thích phiên bản cũ trong DbContext
        public virtual DoctorProfile? DoctorProfile { get; set; }
        public virtual ICollection<SkinAnalysisHistory> AnalysisHistories { get; set; } = new List<SkinAnalysisHistory>();
    }
}