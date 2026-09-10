using DuongNhan.Server.Data;
using DuongNhan.Server.DTOs.Requests;
using DuongNhan.Server.DTOs.Responses;
using DuongNhan.Server.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace DuongNhan.Server.Services
{
    public class SkinAnalysisService : ISkinAnalysisService
    {
        private readonly DuongNhanDbContext _context;
        private readonly IWebHostEnvironment _environment;

        // Định dạng ảnh hợp lệ và dung lượng tối đa (10MB)
        private readonly string[] _allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        private const long MaxFileSize = 10 * 1024 * 1024;

        public SkinAnalysisService(DuongNhanDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        public async Task<SkinAnalysisResponse> AnalyzeSkinAsync(Guid userId, SkinAnalysisRequest request)
        {
            if (request.ImageFile == null || request.ImageFile.Length == 0)
            {
                throw new ArgumentException("File ảnh không hợp lệ hoặc rỗng.");
            }

            if (request.ImageFile.Length > MaxFileSize)
            {
                throw new ArgumentException("Kích thước ảnh vượt quá giới hạn cho phép (tối đa 10MB).");
            }

            var extension = Path.GetExtension(request.ImageFile.FileName).ToLowerInvariant();
            if (!_allowedExtensions.Contains(extension))
            {
                throw new ArgumentException("Định dạng file không được hỗ trợ. Vui lòng tải lên ảnh .jpg, .jpeg, .png hoặc .webp.");
            }

            // 1. Lưu file ảnh vào thư mục wwwroot/uploads/analyses
            var webRootPath = _environment.WebRootPath;
            if (string.IsNullOrEmpty(webRootPath))
            {
                webRootPath = Path.Combine(_environment.ContentRootPath, "wwwroot");
            }

            var uploadsFolder = Path.Combine(webRootPath, "uploads", "analyses");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await request.ImageFile.CopyToAsync(stream);
            }

            var imageUrl = $"/uploads/analyses/{uniqueFileName}";

            // 2. Logic giả lập phân tích AI (Mock AI Response chuẩn cấu trúc thực tế)
            var (overallScore, skinType, conditionsMock, rawAiJson) = GenerateMockAiAnalysis(uniqueFileName);

            // 3. Khởi tạo thực thể SkinAnalysis
            var skinAnalysis = new SkinAnalysis
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ImageUrl = imageUrl,
                ImageThumbnailUrl = imageUrl,
                OverallScore = overallScore,
                AIModelVersion = "SkinAI-Vision-v2.1",
                RawAIResponse = rawAiJson,
                IsVerifiedByDoctor = false,
                DoctorNote = null,
                AnalysedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            // 4. Khởi tạo danh sách SkinCondition liên kết với SkinAnalysis
            var skinConditions = conditionsMock.Select(c => new SkinCondition
            {
                Id = Guid.NewGuid(),
                AnalysisId = skinAnalysis.Id,
                ConditionType = c.ConditionType,
                SeverityScore = c.SeverityScore,
                Zone = c.Zone,
                ConfidenceScore = c.ConfidenceScore,
                RecommendationNote = c.RecommendationNote
            }).ToList();

            // 5. Lưu vào cơ sở dữ liệu
            _context.SkinAnalyses.Add(skinAnalysis);
            _context.SkinConditions.AddRange(skinConditions);

            // Cập nhật hoặc tạo mới SkinProfile cho người dùng
            var profile = await _context.SkinProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile != null)
            {
                profile.SkinType = skinType.ToLowerInvariant();
                profile.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                _context.SkinProfiles.Add(new SkinProfile
                {
                    UserId = userId,
                    SkinType = skinType.ToLowerInvariant(),
                    UpdatedAt = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();

            // 6. Map kết quả trả về cho client
            return MapToResponse(skinAnalysis, skinConditions, skinType);
        }

        public async Task<SkinAnalysisResponse?> GetAnalysisByIdAsync(Guid analysisId, Guid userId)
        {
            var analysis = await _context.SkinAnalyses
                .Include(a => a.SkinConditions)
                .FirstOrDefaultAsync(a => a.Id == analysisId && a.UserId == userId);

            if (analysis == null) return null;

            var profile = await _context.SkinProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            var skinType = profile?.SkinType ?? "combination";

            return MapToResponse(analysis, analysis.SkinConditions.ToList(), skinType);
        }

        public async Task<List<SkinAnalysisResponse>> GetUserAnalysesHistoryAsync(Guid userId)
        {
            var analyses = await _context.SkinAnalyses
                .Include(a => a.SkinConditions)
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.AnalysedAt)
                .ToListAsync();

            var profile = await _context.SkinProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            var skinType = profile?.SkinType ?? "combination";

            return analyses.Select(a => MapToResponse(a, a.SkinConditions.ToList(), skinType)).ToList();
        }

        #region Helper Methods

        private (decimal overallScore, string skinType, List<MockConditionItem> conditions, string rawAiJson) GenerateMockAiAnalysis(string fileName)
        {
            // Các giá trị giả lập ngẫu nhiên nhưng nằm trong dải thực tế của AI soi da
            var random = new Random();
            var overallScore = Math.Round((decimal)(78 + random.NextDouble() * 12), 1); // 78.0 - 90.0
            var skinTypes = new[] { "combination", "oily", "dry", "normal", "sensitive" };
            var skinType = skinTypes[random.Next(skinTypes.Length)];

            var conditions = new List<MockConditionItem>
            {
                new MockConditionItem
                {
                    ConditionType = "acne",
                    SeverityScore = Math.Round((decimal)(2.0 + random.NextDouble() * 3.5), 1),
                    Zone = "forehead",
                    ConfidenceScore = 93.5m,
                    RecommendationNote = "Mụn li ti vùng trán, khuyến nghị làm sạch sâu với Salicylic Acid (BHA 2%)."
                },
                new MockConditionItem
                {
                    ConditionType = "pore",
                    SeverityScore = Math.Round((decimal)(3.5 + random.NextDouble() * 2.5), 1),
                    Zone = "nose",
                    ConfidenceScore = 96.0m,
                    RecommendationNote = "Lỗ chân lông vùng cánh mũi nở rộng do tiết dầu, nên bổ sung Niacinamide 10%."
                },
                new MockConditionItem
                {
                    ConditionType = "oiliness",
                    SeverityScore = Math.Round((decimal)(4.0 + random.NextDouble() * 3.0), 1),
                    Zone = "full_face",
                    ConfidenceScore = 91.2m,
                    RecommendationNote = "Độ tiết dầu tập trung vùng chữ T, sử dụng dưỡng ẩm dạng gel mỏng nhẹ để kiềm dầu."
                },
                new MockConditionItem
                {
                    ConditionType = "hyperpigmentation",
                    SeverityScore = Math.Round((decimal)(1.8 + random.NextDouble() * 2.2), 1),
                    Zone = "cheek_left",
                    ConfidenceScore = 88.0m,
                    RecommendationNote = "Vết thâm mụn nhẹ ở má trái, ưu tiên serum Vitamin C hoặc Tranexamic Acid."
                },
                new MockConditionItem
                {
                    ConditionType = "wrinkle",
                    SeverityScore = Math.Round((decimal)(1.0 + random.NextDouble() * 1.5), 1),
                    Zone = "eye_area",
                    ConfidenceScore = 85.5m,
                    RecommendationNote = "Nếp nhăn li ti vùng đuôi mắt, duy trì kem dưỡng mắt cấp ẩm và chống nắng kỹ."
                }
            };

            var rawAiPayload = new
            {
                model = "SkinAI-Vision-v2.1",
                timestamp = DateTime.UtcNow,
                image = fileName,
                metrics = new
                {
                    overall_score = overallScore,
                    skin_type = skinType,
                    acne_risk = "mild",
                    barrier_health = "good"
                },
                detected_conditions = conditions.Select(c => new
                {
                    type = c.ConditionType,
                    severity = c.SeverityScore,
                    zone = c.Zone,
                    confidence = c.ConfidenceScore
                })
            };

            var rawJson = JsonSerializer.Serialize(rawAiPayload, new JsonSerializerOptions { WriteIndented = true });
            return (overallScore, skinType, conditions, rawJson);
        }

        private SkinAnalysisResponse MapToResponse(SkinAnalysis analysis, List<SkinCondition> conditions, string skinType)
        {
            var conditionResponses = conditions.Select(c => new SkinConditionResponse
            {
                Id = c.Id,
                ConditionType = c.ConditionType,
                ConditionName = GetConditionDisplayName(c.ConditionType),
                SeverityScore = c.SeverityScore,
                Zone = c.Zone,
                ZoneName = GetZoneDisplayName(c.Zone),
                ConfidenceScore = c.ConfidenceScore,
                RecommendationNote = c.RecommendationNote
            }).ToList();

            var summary = $"Làn da được đánh giá ở mức {analysis.OverallScore}/100. Tình trạng da chính là {GetSkinTypeDisplayName(skinType)}, các vấn đề cần lưu ý là mụn li ti và lỗ chân lông vùng chữ T.";

            return new SkinAnalysisResponse
            {
                Id = analysis.Id,
                UserId = analysis.UserId,
                ImageUrl = analysis.ImageUrl,
                ImageThumbnailUrl = analysis.ImageThumbnailUrl,
                OverallScore = analysis.OverallScore ?? 80,
                SkinType = skinType,
                Summary = summary,
                AIModelVersion = analysis.AIModelVersion,
                RawAIResponse = analysis.RawAIResponse,
                IsVerifiedByDoctor = analysis.IsVerifiedByDoctor,
                DoctorNote = analysis.DoctorNote,
                AnalysedAt = analysis.AnalysedAt,
                Conditions = conditionResponses
            };
        }

        private static string GetConditionDisplayName(string conditionType) => conditionType switch
        {
            "acne" => "Mụn trứng cá & Mụn viêm",
            "blackhead" => "Mụn đầu đen",
            "whitehead" => "Mụn đầu trắng",
            "hyperpigmentation" => "Thâm mụn & Tăng sắc tố",
            "melasma" => "Nám da",
            "pore" => "Lỗ chân lông to",
            "oiliness" => "Tiết dầu nhờn",
            "dryness" => "Khô ráp & Bong tróc",
            "wrinkle" => "Nếp nhăn lão hóa",
            "redness" => "Đỏ ửng & Kích ứng",
            "dark_circle" => "Quầng thâm mắt",
            "sensitivity" => "Nhạy cảm",
            _ => conditionType
        };

        private static string GetZoneDisplayName(string? zone) => zone switch
        {
            "forehead" => "Vùng trán",
            "cheek_left" => "Má trái",
            "cheek_right" => "Má phải",
            "nose" => "Vùng mũi",
            "chin" => "Vùng cằm",
            "eye_area" => "Vùng mắt",
            "jawline" => "Quai hàm",
            "full_face" => "Toàn bộ khuôn mặt",
            _ => zone ?? "Toàn mặt"
        };

        private static string GetSkinTypeDisplayName(string skinType) => skinType.ToLowerInvariant() switch
        {
            "oily" => "Da dầu",
            "dry" => "Da khô",
            "combination" => "Da hỗn hợp",
            "sensitive" => "Da nhạy cảm",
            "normal" => "Da thường",
            _ => skinType
        };

        private class MockConditionItem
        {
            public string ConditionType { get; set; } = null!;
            public decimal SeverityScore { get; set; }
            public string? Zone { get; set; }
            public decimal? ConfidenceScore { get; set; }
            public string? RecommendationNote { get; set; }
        }

        #endregion
    }
}
