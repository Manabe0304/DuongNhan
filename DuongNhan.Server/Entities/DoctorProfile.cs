using System;

namespace DuongNhan.Server.Entities
{
    public class DoctorProfile
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; } // Liên kết 1-1 với bảng Users
        public string Specialty { get; set; } = null!; // Chuyên khoa (Trị mụn, Nám, Lão hóa...)
        public string ClinicName { get; set; } = null!; // Phòng khám đối tác uy tín
        public string ClinicAddress { get; set; } = null!;
        public int ExperienceYears { get; set; }
        public string? Bio { get; set; } // Giới thiệu bản thân ngắn gọn

        // Navigation property liên kết ngược lại User
        public virtual User User { get; set; } = null!;
    }
}