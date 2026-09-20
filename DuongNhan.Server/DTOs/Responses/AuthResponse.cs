namespace DTOs.Responses;

public sealed record AuthResponse
(
    string Token,
    UserData User
);

public sealed record UserData
(
    Guid Id,
    string FullName,
    string Email,
    string Role,
    bool IsPremium
);