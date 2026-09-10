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

        // 18 bảng theo thiết kế cơ sở dữ liệu
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<SkinProfile> SkinProfiles { get; set; } = null!;
        public DbSet<SkinAnalysis> SkinAnalyses { get; set; } = null!;
        public DbSet<SkinCondition> SkinConditions { get; set; } = null!;
        public DbSet<Brand> Brands { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<AffiliateLink> AffiliateLinks { get; set; } = null!;
        public DbSet<ProductRecommendation> ProductRecommendations { get; set; } = null!;
        public DbSet<Doctor> Doctors { get; set; } = null!;
        public DbSet<Clinic> Clinics { get; set; } = null!;
        public DbSet<DoctorClinic> DoctorClinics { get; set; } = null!;
        public DbSet<Appointment> Appointments { get; set; } = null!;
        public DbSet<SubscriptionPlan> SubscriptionPlans { get; set; } = null!;
        public DbSet<UserSubscription> UserSubscriptions { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderItem> OrderItems { get; set; } = null!;
        public DbSet<MembershipPoint> MembershipPoints { get; set; } = null!;
        public DbSet<Notification> Notifications { get; set; } = null!;

        // Bảng tương thích ngược phiên bản cũ
        public DbSet<DoctorProfile> DoctorProfiles { get; set; } = null!;
        public DbSet<SkinAnalysisHistory> SkinAnalysisHistories { get; set; } = null!;

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