using System;
using System.Collections.Generic;

namespace DuongNhan.Server.Entities
{
    public class Doctor
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid? UserId { get; set; }
        public string FullName { get; set; } = null!;
        public string? Specialization { get; set; }
        public string LicenseNumber { get; set; } = null!;
        public int ExperienceYears { get; set; } = 0;
        public string? Degree { get; set; }
        public string? Hospital { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Bio { get; set; }
        public decimal? Rating { get; set; } = 0;
        public int ReviewCount { get; set; } = 0;
        public decimal? ConsultFeeOnline { get; set; }
        public bool IsVerified { get; set; } = false;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual User? User { get; set; }
        public virtual ICollection<DoctorClinic> DoctorClinics { get; set; } = new List<DoctorClinic>();
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}
