using System;

namespace DuongNhan.Server.Entities
{
    public class Appointment
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid CustomerId { get; set; } // ID của User đóng vai trò Khách hàng
        public Guid DoctorId { get; set; } // ID của User đóng vai trò Bác sĩ
        public DateTime AppointmentDate { get; set; } // Ngày giờ tư vấn
        public string Status { get; set; } = "Pending"; // Pending, Confirmed, Completed, Cancelled
        public string? Notes { get; set; } // Ghi chú tình trạng da hoặc câu hỏi của khách
        public string? MeetingLink { get; set; } // Link Google Meet/Zoom để tư vấn online
        public decimal Price { get; set; } // Phí tư vấn (Doanh thu kết nối bác sĩ)
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User Customer { get; set; } = null!;
        public virtual User Doctor { get; set; } = null!;
    }
}