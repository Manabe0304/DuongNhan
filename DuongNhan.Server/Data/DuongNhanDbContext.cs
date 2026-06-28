using DuongNhan.Server.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace DuongNhan.Server.Data
{
    public class DuongNhanDbContext : DbContext
    {
        public DuongNhanDbContext(DbContextOptions<DuongNhanDbContext> options) : base(options)
        {
        }

        // Đầy đủ 5 bảng cốt lõi cho dự án
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<DoctorProfile> DoctorProfiles { get; set; } = null!;
        public DbSet<SkinAnalysisHistory> SkinAnalysisHistories { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Appointment> Appointments { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Cấu hình Email là duy nhất
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // 2. Cấu hình mối quan hệ 1-1 giữa User và DoctorProfile
            modelBuilder.Entity<User>()
                .HasOne(u => u.DoctorProfile)
                .WithOne(d => d.User)
                .HasForeignKey<DoctorProfile>(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // 3. Cấu hình mối quan hệ giữa Appointment với Customer và Doctor
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Customer)
                .WithMany()
                .HasForeignKey(a => a.CustomerId)
                .OnDelete(DeleteBehavior.Restrict); // Tránh vòng lặp Cascade khi xóa

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany()
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}