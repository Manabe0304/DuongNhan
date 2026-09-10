using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace DuongNhan.Server.DTOs.Requests
{
    public class SkinAnalysisRequest
    {
        [Required(ErrorMessage = "Vui lòng chọn ảnh khuôn mặt để phân tích.")]
        public IFormFile ImageFile { get; set; } = null!;

        public string? UserNote { get; set; }
    }
}
