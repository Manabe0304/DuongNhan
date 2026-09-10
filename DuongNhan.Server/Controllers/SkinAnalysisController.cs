using DuongNhan.Server.DTOs.Requests;
using DuongNhan.Server.DTOs.Responses;
using DuongNhan.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DuongNhan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SkinAnalysisController : ControllerBase
    {
        private readonly ISkinAnalysisService _skinAnalysisService;

        public SkinAnalysisController(ISkinAnalysisService skinAnalysisService)
        {
            _skinAnalysisService = skinAnalysisService;
        }

        /// <summary>
        /// POST /api/skinanalysis/analyze
        /// Upload ảnh khuôn mặt và thực hiện phân tích da bằng AI (Yêu cầu JWT Bearer Token)
        /// </summary>
        [HttpPost("analyze")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Analyze([FromForm] SkinAnalysisRequest request)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            {
                return Unauthorized(new { message = "Không thể xác thực danh tính người dùng từ Token." });
            }

            try
            {
                var result = await _skinAnalysisService.AnalyzeSkinAsync(userId, request);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Có lỗi xảy ra trong quá trình phân tích da.",
                    detail = ex.Message
                });
            }
        }

        /// <summary>
        /// GET /api/skinanalysis/history
        /// Lấy toàn bộ lịch sử soi da của người dùng hiện tại
        /// </summary>
        [HttpGet("history")]
        public async Task<IActionResult> GetHistory()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            {
                return Unauthorized(new { message = "Không thể xác thực danh tính người dùng từ Token." });
            }

            var history = await _skinAnalysisService.GetUserAnalysesHistoryAsync(userId);
            return Ok(history);
        }

        /// <summary>
        /// GET /api/skinanalysis/{id}
        /// Lấy chi tiết một lần phân tích da cụ thể
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            {
                return Unauthorized(new { message = "Không thể xác thực danh tính người dùng từ Token." });
            }

            var result = await _skinAnalysisService.GetAnalysisByIdAsync(id, userId);
            if (result == null)
            {
                return NotFound(new { message = "Không tìm thấy kết quả phân tích da yêu cầu." });
            }

            return Ok(result);
        }
    }
}
