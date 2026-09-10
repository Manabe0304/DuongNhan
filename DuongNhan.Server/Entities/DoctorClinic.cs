using System;

namespace DuongNhan.Server.Entities
{
    public class DoctorClinic
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid DoctorId { get; set; }
        public Guid ClinicId { get; set; }
        public string? ScheduleJson { get; set; }
        public decimal? ConsultationFee { get; set; }
        public bool IsMainClinic { get; set; } = false;
        public bool IsActive { get; set; } = true;

        // Navigation Properties
        public virtual Doctor Doctor { get; set; } = null!;
        public virtual Clinic Clinic { get; set; } = null!;
    }
}
