using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using DuongNhan.Server.Data;
using DuongNhan.Server.Entities;
using DuongNhan.Server.DTOs.Requests;
using DuongNhan.Server.DTOs.Responses;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DuongNhan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DuongNhanDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(DuongNhanDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // API ĐĂNG KÝ
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterRequest model)
        {
            if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password) || string.IsNullOrWhiteSpace(model.FullName))
            {
                return BadRequest(new { message = "Vui lòng điền đầy đủ họ tên, email và mật khẩu!" });
            }

            var email = model.Email.Trim().ToLower();
            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == email))
            {
                return BadRequest(new { message = "Email này đã được sử dụng!" });
            }

            // Mã hóa mật khẩu bằng thư viện BCrypt.Net-Next
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);

            var user = new User
            {
                FullName = model.FullName.Trim(),
                Email = email,
                PhoneNumber = model.PhoneNumber?.Trim(),
                Role = "Customer",
                IsPremium = false,
                CreatedAt = DateTime.UtcNow,
                PasswordHash = passwordHash
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký tài khoản thành công!" });
        }

        // API ĐĂNG NHẬP
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest model)
        {
            if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ email và mật khẩu!" });
            }

            var email = model.Email.Trim().ToLower();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email);

            if (user == null)
            {
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác!" });
            }

            bool isValidPassword = false;

            // 1. Kiểm tra xác thực bằng BCrypt
            try
            {
                if (!string.IsNullOrEmpty(user.PasswordHash) && 
                    (user.PasswordHash.StartsWith("$2a$") || user.PasswordHash.StartsWith("$2b$") || user.PasswordHash.StartsWith("$2y$")))
                {
                    isValidPassword = BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash);
                }
            }
            catch
            {
                isValidPassword = false;
            }

            // 2. Fallback tương thích ngược: Hỗ trợ tài khoản cũ và tự động nâng cấp sang BCrypt
            if (!isValidPassword)
            {
                var identityHasher = new Microsoft.AspNetCore.Identity.PasswordHasher<User>();
                var verifyResult = identityHasher.VerifyHashedPassword(user, user.PasswordHash, model.Password);
                if (verifyResult == Microsoft.AspNetCore.Identity.PasswordVerificationResult.Success ||
                    verifyResult == Microsoft.AspNetCore.Identity.PasswordVerificationResult.SuccessRehashNeeded)
                {
                    isValidPassword = true;
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);
                    await _context.SaveChangesAsync();
                }
                else if (user.PasswordHash == model.Password)
                {
                    isValidPassword = true;
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);
                    await _context.SaveChangesAsync();
                }
            }

            if (!isValidPassword)
            {
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác!" });
            }

            // Tạo Token JWT chứa đầy đủ Claims (NameIdentifier, Email, Role, Name, Jti)
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            var response = new AuthResponse
            {
                Token = tokenString,
                User = new UserData
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Role = user.Role,
                    IsPremium = user.IsPremium
                }
            };

            return Ok(response);
        }

        // API LẤY THÔNG TIN NGƯỜI DÙNG ĐANG ĐĂNG NHẬP
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                              ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Token không hợp lệ hoặc đã hết hạn." });
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy thông tin người dùng trong hệ thống." });
            }

            return Ok(new
            {
                id = user.Id,
                fullName = user.FullName,
                name = user.FullName,
                email = user.Email,
                phoneNumber = user.PhoneNumber,
                role = user.Role,
                isPremium = user.IsPremium,
                createdAt = user.CreatedAt,
                membership = user.IsPremium ? "Premium" : "Free",
                avatar = $"https://api.dicebear.com/9.x/initials/svg?seed={Uri.EscapeDataString(user.FullName)}"
            });
        }
    }
}