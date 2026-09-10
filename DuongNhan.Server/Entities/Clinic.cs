using System;
using System.Collections.Generic;

namespace DuongNhan.Server.Entities
{
    public class Clinic
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string? District { get; set; }
        public string City { get; set; } = null!;
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? WebsiteUrl { get; set; }
        public string? LogoUrl { get; set; }
        public string? OpenHours { get; set; } // JSON: {"mon":"08:00-17:00",...}
        public decimal? Rating { get; set; } = 0;
        public bool IsVerified { get; set; } = false;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual ICollection<DoctorClinic> DoctorClinics { get; set; } = new List<DoctorClinic>();
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}
