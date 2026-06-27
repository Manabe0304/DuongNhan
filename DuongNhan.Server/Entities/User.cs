using System;
using System.Collections.Generic;

namespace DuongNhan.Server.Entities
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public string Role { get; set; } = "Customer"; // Customer, Doctor, Admin
        public bool IsPremium { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual DoctorProfile? DoctorProfile { get; set; }
        public virtual ICollection<SkinAnalysisHistory> AnalysisHistories { get; set; } = new List<SkinAnalysisHistory>();
    }
}