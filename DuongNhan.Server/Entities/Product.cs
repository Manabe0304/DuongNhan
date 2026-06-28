using System;

namespace DuongNhan.Server.Entities
{
    public class Product
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = null!; // Tên sản phẩm
        public string Brand { get; set; } = null!; // Thương hiệu chính hãng đối tác
        public string Category { get; set; } = null!; // Loại (Cleanser, Toner, Serum...)
        public string TargetSkinType { get; set; } = null!; // Phù hợp loại da nào (Oily, Dry...)
        public string TargetIssue { get; set; } = null!; // Giải quyết vấn đề gì (Acne, DarkSpots...)
        public string AffiliateUrl { get; set; } = null!; // Link Shopee/Lazada/TikTok Shop kiếm hoa hồng
        public string? ImageUrl { get; set; } // Ảnh sản phẩm hiển thị trên giao diện
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}