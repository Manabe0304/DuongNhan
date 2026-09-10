using DuongNhan.Server.DTOs.Requests;
using DuongNhan.Server.DTOs.Responses;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DuongNhan.Server.Services
{
    public interface ISkinAnalysisService
    {
        Task<SkinAnalysisResponse> AnalyzeSkinAsync(Guid userId, SkinAnalysisRequest request);
        Task<SkinAnalysisResponse?> GetAnalysisByIdAsync(Guid analysisId, Guid userId);
        Task<List<SkinAnalysisResponse>> GetUserAnalysesHistoryAsync(Guid userId);
    }
}
