namespace DTOs.Responses;

public sealed record SkinAnalysisResponse
(
    Guid Id,
    Guid UserId,
    string ImageUrl,
    string? ImageThumbnailUrl,
    decimal OverallScore,
    string SkinType,
    string Summary,
    string? AIModelVersion,
    string? RawAIResponse,
    bool IsVerifiedByDoctor,
    string? DoctorNote,
    DateTime AnalysedAt,
    List<SkinConditionResponse> Conditions
);

public sealed record SkinConditionResponse
(
    Guid Id,
    string ConditionType,
    string ConditionName,
    decimal SeverityScore,
    string? Zone,
    string? ZoneName,
    decimal? ConfidenceScore,
    string? RecommendationNote
);  