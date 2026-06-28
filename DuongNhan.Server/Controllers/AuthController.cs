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
            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
            {
                return BadRequest(new { message = "Email này đã được sử dụng!" });
            }

            var user = new User
            {
                FullName = model.FullName,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                PasswordHash = model.Password, // Tạm thời lưu pass thô để test kết nối JWT
                Role = "Customer"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký tài khoản thành công!" });
        }

        // API ĐĂNG NHẬP
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user == null || user.PasswordHash != model.Password)
            {
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác!" });
            }

            // Tạo Token JWT
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.FullName),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // Trả về dữ liệu theo đúng cấu trúc AuthResponse vừa định nghĩa
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
    }
}