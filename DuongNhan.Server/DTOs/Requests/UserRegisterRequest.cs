namespace DTOs.Requests;

public sealed record UserRegisterRequest
(
    string FullName,
    string Email,
    string Password,
    string? PhoneNumber
);