namespace DuongNhan.Server.DTOs.Responses
{
    public class AuthResponse
    {
        public string Token { get; set; } = null!;
        public UserData User { get; set; } = null!;
    }

    public class UserData
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;
        public bool IsPremium { get; set; }
    }
}