-- ============================================================
--  SKINCARE AI PLATFORM — Database Script
--  SQL Server 2022
--  Tác giả  : Skincare AI Team
--  Ngày tạo : 2025
--  Mô tả    : Nền tảng phân tích da bằng AI, gợi ý sản phẩm
--              affiliate, kết nối bác sĩ / phòng khám uy tín
-- ============================================================

USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'SkincareAI')
    CREATE DATABASE SkincareAI COLLATE Vietnamese_CI_AS;
GO

USE SkincareAI;
GO

-- ============================================================
-- DROP các bảng theo thứ tự tránh lỗi FK
-- ============================================================

DROP TABLE IF EXISTS dbo.Notifications;
DROP TABLE IF EXISTS dbo.MembershipPoints;
DROP TABLE IF EXISTS dbo.OrderItems;
DROP TABLE IF EXISTS dbo.Orders;
DROP TABLE IF EXISTS dbo.UserSubscriptions;
DROP TABLE IF EXISTS dbo.SubscriptionPlans;
DROP TABLE IF EXISTS dbo.Appointments;
DROP TABLE IF EXISTS dbo.DoctorClinics;
DROP TABLE IF EXISTS dbo.Clinics;
DROP TABLE IF EXISTS dbo.Doctors;
DROP TABLE IF EXISTS dbo.ProductRecommendations;
DROP TABLE IF EXISTS dbo.AffiliateLinks;
DROP TABLE IF EXISTS dbo.Products;
DROP TABLE IF EXISTS dbo.Brands;
DROP TABLE IF EXISTS dbo.SkinConditions;
DROP TABLE IF EXISTS dbo.SkinAnalyses;
DROP TABLE IF EXISTS dbo.SkinProfiles;
DROP TABLE IF EXISTS dbo.Users;
GO

-- ============================================================
-- 1. USERS — Tài khoản người dùng
-- ============================================================

CREATE TABLE dbo.Users (
    Id             UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    Email          NVARCHAR(256)    NOT NULL,
    PasswordHash   NVARCHAR(512)    NOT NULL,
    FullName       NVARCHAR(150)    NOT NULL,
    Phone          NVARCHAR(20)     NULL,
    AvatarUrl      NVARCHAR(1000)   NULL,
    Role           NVARCHAR(20)     NOT NULL DEFAULT 'user'
                       CONSTRAINT CK_Users_Role CHECK (Role IN ('user','admin','doctor')),
    IsVerified     BIT              NOT NULL DEFAULT 0,
    RefreshToken   NVARCHAR(512)    NULL,
    TokenExpiresAt DATETIME2        NULL,
    CreatedAt      DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt      DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    IsDeleted      BIT              NOT NULL DEFAULT 0,
    CONSTRAINT PK_Users       PRIMARY KEY (Id),
    CONSTRAINT UQ_Users_Email UNIQUE (Email)
);
GO

-- ============================================================
-- 2. SKINPROFILES — Hồ sơ da cá nhân của người dùng
-- ============================================================

CREATE TABLE dbo.SkinProfiles (
    Id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    UserId          UNIQUEIDENTIFIER NOT NULL,
    SkinType        NVARCHAR(30)     NOT NULL DEFAULT 'normal'
                        CONSTRAINT CK_SkinProfiles_SkinType
                        CHECK (SkinType IN ('oily','dry','combination','sensitive','normal')),
    KnownConditions NVARCHAR(1000)   NULL,  -- JSON: ["acne","hyperpigmentation"]
    Allergens       NVARCHAR(500)    NULL,  -- JSON: thành phần dị ứng
    SkinGoals       NVARCHAR(500)    NULL,  -- JSON: ["brighten","anti-aging"]
    UpdatedAt       DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_SkinProfiles        PRIMARY KEY (Id),
    CONSTRAINT UQ_SkinProfiles_UserId UNIQUE (UserId),
    CONSTRAINT FK_SkinProfiles_Users  FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE
);
GO

-- ============================================================
-- 3. SKINANALYSES — Mỗi lần quét / phân tích khuôn mặt
-- ============================================================

CREATE TABLE dbo.SkinAnalyses (
    Id                  UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    UserId              UNIQUEIDENTIFIER NOT NULL,
    ImageUrl            NVARCHAR(1000)   NOT NULL,
    ImageThumbnailUrl   NVARCHAR(1000)   NULL,
    OverallScore        DECIMAL(5,2)     NULL,        -- 0.00 – 100.00
    AIModelVersion      NVARCHAR(50)     NULL,
    RawAIResponse       NVARCHAR(MAX)    NULL,        -- JSON gốc từ AI service
    IsVerifiedByDoctor  BIT              NOT NULL DEFAULT 0,
    VerifiedByDoctorId  UNIQUEIDENTIFIER NULL,
    VerifiedAt          DATETIME2        NULL,
    DoctorNote          NVARCHAR(2000)   NULL,
    AnalysedAt          DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CreatedAt           DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_SkinAnalyses       PRIMARY KEY (Id),
    CONSTRAINT FK_SkinAnalyses_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE
);
GO

-- ============================================================
-- 4. SKINCONDITIONS — Tình trạng da phát hiện trong mỗi lần scan
-- ============================================================

CREATE TABLE dbo.SkinConditions (
    Id                 UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    AnalysisId         UNIQUEIDENTIFIER NOT NULL,
    ConditionType      NVARCHAR(50)     NOT NULL
                           CONSTRAINT CK_SkinConditions_Type CHECK (ConditionType IN (
                               'acne','blackhead','whitehead','hyperpigmentation',
                               'melasma','aging','wrinkle','pore','oiliness',
                               'dryness','redness','dark_circle','sensitivity')),
    SeverityScore      DECIMAL(5,2)     NOT NULL,    -- 0.00 – 10.00
    Zone               NVARCHAR(50)     NULL
                           CONSTRAINT CK_SkinConditions_Zone CHECK (Zone IN (
                               'forehead','cheek_left','cheek_right','nose',
                               'chin','eye_area','jawline','full_face')),
    ConfidenceScore    DECIMAL(5,2)     NULL,        -- độ tin cậy AI 0–100
    RecommendationNote NVARCHAR(1000)   NULL,
    CONSTRAINT PK_SkinConditions          PRIMARY KEY (Id),
    CONSTRAINT FK_SkinConditions_Analyses FOREIGN KEY (AnalysisId) REFERENCES dbo.SkinAnalyses(Id) ON DELETE CASCADE
);
GO

-- ============================================================
-- 5. BRANDS — Nhãn hàng mỹ phẩm / đối tác affiliate
-- ============================================================

CREATE TABLE dbo.Brands (
    Id            UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    Name          NVARCHAR(150)    NOT NULL,
    Slug          NVARCHAR(150)    NOT NULL,
    LogoUrl       NVARCHAR(1000)   NULL,
    WebsiteUrl    NVARCHAR(1000)   NULL,
    Description   NVARCHAR(2000)   NULL,
    IsAffiliate   BIT              NOT NULL DEFAULT 0,
    AffiliateCode NVARCHAR(100)    NULL,
    IsActive      BIT              NOT NULL DEFAULT 1,
    CreatedAt     DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Brands      PRIMARY KEY (Id),
    CONSTRAINT UQ_Brands_Slug UNIQUE (Slug)
);
GO

-- ============================================================
-- 6. PRODUCTS — Sản phẩm skincare được gợi ý
-- ============================================================

CREATE TABLE dbo.Products (
    Id               UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    BrandId          UNIQUEIDENTIFIER NOT NULL,
    Name             NVARCHAR(300)    NOT NULL,
    SKU              NVARCHAR(100)    NULL,
    Slug             NVARCHAR(300)    NOT NULL,
    Description      NVARCHAR(MAX)    NULL,
    Ingredients      NVARCHAR(MAX)    NULL,
    Price            DECIMAL(12,2)    NOT NULL DEFAULT 0,
    Currency         NVARCHAR(10)     NOT NULL DEFAULT 'VND',
    ImageUrl         NVARCHAR(1000)   NULL,
    Category         NVARCHAR(80)     NULL,
    TargetConditions NVARCHAR(500)    NULL,  -- JSON array
    SkinTypeFit      NVARCHAR(30)     NOT NULL DEFAULT 'all'
                         CONSTRAINT CK_Products_SkinTypeFit
                         CHECK (SkinTypeFit IN ('all','oily','dry','combination','sensitive','normal')),
    Rating           DECIMAL(3,2)     NULL,
    ReviewCount      INT              NOT NULL DEFAULT 0,
    IsActive         BIT              NOT NULL DEFAULT 1,
    CreatedAt        DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt        DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Products        PRIMARY KEY (Id),
    CONSTRAINT UQ_Products_Slug   UNIQUE (Slug),
    CONSTRAINT FK_Products_Brands FOREIGN KEY (BrandId) REFERENCES dbo.Brands(Id) ON DELETE CASCADE
);
GO

-- ============================================================
-- 7. AFFILIATELINKS — Link affiliate theo sản phẩm / nhãn hàng
-- ============================================================

CREATE TABLE dbo.AffiliateLinks (
    Id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    ProductId       UNIQUEIDENTIFIER NULL,
    BrandId         UNIQUEIDENTIFIER NULL,
    DestinationUrl  NVARCHAR(2000)   NOT NULL,
    TrackingUrl     NVARCHAR(2000)   NULL,
    CommissionRate  DECIMAL(5,2)     NOT NULL DEFAULT 0,
    ClickCount      INT              NOT NULL DEFAULT 0,
    ConversionCount INT              NOT NULL DEFAULT 0,
    Platform        NVARCHAR(50)     NULL,  -- shopee|lazada|tiki|brand_website
    ExpiresAt       DATETIME2        NULL,
    IsActive        BIT              NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_AffiliateLinks    PRIMARY KEY (Id),
    CONSTRAINT FK_AffLinks_Products FOREIGN KEY (ProductId) REFERENCES dbo.Products(Id) ON DELETE SET NULL,
    CONSTRAINT FK_AffLinks_Brands   FOREIGN KEY (BrandId)   REFERENCES dbo.Brands(Id)   ON DELETE NO ACTION
);
GO

-- ============================================================
-- 8. PRODUCTRECOMMENDATIONS — AI gợi ý sản phẩm sau phân tích da
-- ============================================================

CREATE TABLE dbo.ProductRecommendations (
    Id           UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    AnalysisId   UNIQUEIDENTIFIER NOT NULL,
    ProductId    UNIQUEIDENTIFIER NOT NULL,
    MatchScore   DECIMAL(5,2)     NOT NULL,    -- 0.00 – 100.00
    Reason       NVARCHAR(1000)   NULL,        -- lý do AI gợi ý
    DisplayOrder INT              NOT NULL DEFAULT 0,
    IsClicked    BIT              NOT NULL DEFAULT 0,
    ClickedAt    DATETIME2        NULL,
    CreatedAt    DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_ProductRecommendations  PRIMARY KEY (Id),
    CONSTRAINT FK_ProdRec_SkinAnalyses    FOREIGN KEY (AnalysisId) REFERENCES dbo.SkinAnalyses(Id) ON DELETE CASCADE,
    CONSTRAINT FK_ProdRec_Products        FOREIGN KEY (ProductId)  REFERENCES dbo.Products(Id)     ON DELETE NO ACTION,
    CONSTRAINT UQ_ProdRec_AnalysisProduct UNIQUE (AnalysisId, ProductId)
);
GO

-- ============================================================
-- 9. DOCTORS — Bác sĩ da liễu uy tín trên nền tảng
-- ============================================================

CREATE TABLE dbo.Doctors (
    Id               UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    UserId           UNIQUEIDENTIFIER NULL,
    FullName         NVARCHAR(150)    NOT NULL,
    Specialization   NVARCHAR(200)    NULL,
    LicenseNumber    NVARCHAR(100)    NOT NULL,
    ExperienceYears  INT              NOT NULL DEFAULT 0,
    Degree           NVARCHAR(200)    NULL,
    Hospital         NVARCHAR(300)    NULL,
    AvatarUrl        NVARCHAR(1000)   NULL,
    Bio              NVARCHAR(2000)   NULL,
    Rating           DECIMAL(3,2)     NULL DEFAULT 0,
    ReviewCount      INT              NOT NULL DEFAULT 0,
    ConsultFeeOnline DECIMAL(12,2)    NULL,
    IsVerified       BIT              NOT NULL DEFAULT 0,
    IsActive         BIT              NOT NULL DEFAULT 1,
    CreatedAt        DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Doctors         PRIMARY KEY (Id),
    CONSTRAINT UQ_Doctors_License UNIQUE (LicenseNumber),
    CONSTRAINT FK_Doctors_Users   FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE SET NULL
);
GO

-- ============================================================
-- 10. CLINICS — Phòng khám / bệnh viện đối tác
-- ============================================================

CREATE TABLE dbo.Clinics (
    Id         UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    Name       NVARCHAR(300)    NOT NULL,
    Address    NVARCHAR(500)    NOT NULL,
    District   NVARCHAR(100)    NULL,
    City       NVARCHAR(100)    NOT NULL,
    Latitude   DECIMAL(10,7)    NULL,
    Longitude  DECIMAL(10,7)    NULL,
    Phone      NVARCHAR(30)     NULL,
    Email      NVARCHAR(256)    NULL,
    WebsiteUrl NVARCHAR(1000)   NULL,
    LogoUrl    NVARCHAR(1000)   NULL,
    OpenHours  NVARCHAR(500)    NULL,  -- JSON: {"mon":"08:00-17:00",...}
    Rating     DECIMAL(3,2)     NULL DEFAULT 0,
    IsVerified BIT              NOT NULL DEFAULT 0,
    IsActive   BIT              NOT NULL DEFAULT 1,
    CreatedAt  DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Clinics PRIMARY KEY (Id)
);
GO

-- ============================================================
-- 11. DOCTORCLINICS — Bác sĩ làm việc tại phòng khám (nhiều–nhiều)
-- ============================================================

CREATE TABLE dbo.DoctorClinics (
    Id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    DoctorId        UNIQUEIDENTIFIER NOT NULL,
    ClinicId        UNIQUEIDENTIFIER NOT NULL,
    ScheduleJson    NVARCHAR(1000)   NULL,
    ConsultationFee DECIMAL(12,2)    NULL,
    IsMainClinic    BIT              NOT NULL DEFAULT 0,
    IsActive        BIT              NOT NULL DEFAULT 1,
    CONSTRAINT PK_DoctorClinics         PRIMARY KEY (Id),
    CONSTRAINT UQ_DoctorClinics_Pair    UNIQUE (DoctorId, ClinicId),
    CONSTRAINT FK_DoctorClinics_Doctors FOREIGN KEY (DoctorId) REFERENCES dbo.Doctors(Id) ON DELETE CASCADE,
    CONSTRAINT FK_DoctorClinics_Clinics FOREIGN KEY (ClinicId) REFERENCES dbo.Clinics(Id) ON DELETE CASCADE
);
GO

-- ============================================================
-- 12. APPOINTMENTS — Lịch hẹn người dùng với bác sĩ
-- ============================================================

CREATE TABLE dbo.Appointments (
    Id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    UserId          UNIQUEIDENTIFIER NOT NULL,
    DoctorId        UNIQUEIDENTIFIER NOT NULL,
    ClinicId        UNIQUEIDENTIFIER NULL,
    AnalysisId      UNIQUEIDENTIFIER NULL,
    ScheduledAt     DATETIME2        NOT NULL,
    DurationMinutes INT              NOT NULL DEFAULT 30,
    Type            NVARCHAR(20)     NOT NULL DEFAULT 'offline'
                        CONSTRAINT CK_Appointments_Type CHECK (Type IN ('offline','online')),
    Status          NVARCHAR(20)     NOT NULL DEFAULT 'pending'
                        CONSTRAINT CK_Appointments_Status
                        CHECK (Status IN ('pending','confirmed','completed','cancelled','no_show')),
    UserNotes       NVARCHAR(1000)   NULL,
    DoctorNotes     NVARCHAR(2000)   NULL,
    MeetingUrl      NVARCHAR(1000)   NULL,
    ConsultationFee DECIMAL(12,2)    NULL,
    PlatformFee     DECIMAL(12,2)    NULL,
    PaymentStatus   NVARCHAR(20)     NOT NULL DEFAULT 'unpaid'
                        CONSTRAINT CK_Appointments_PayStatus
                        CHECK (PaymentStatus IN ('unpaid','paid','refunded')),
    CreatedAt       DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt       DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Appointments          PRIMARY KEY (Id),
    CONSTRAINT FK_Appointments_Users    FOREIGN KEY (UserId)     REFERENCES dbo.Users(Id)        ON DELETE NO ACTION,
    CONSTRAINT FK_Appointments_Doctors  FOREIGN KEY (DoctorId)   REFERENCES dbo.Doctors(Id)      ON DELETE NO ACTION,
    CONSTRAINT FK_Appointments_Clinics  FOREIGN KEY (ClinicId)   REFERENCES dbo.Clinics(Id)      ON DELETE SET NULL,
    CONSTRAINT FK_Appointments_Analyses FOREIGN KEY (AnalysisId) REFERENCES dbo.SkinAnalyses(Id) ON DELETE SET NULL
);
GO

-- ============================================================
-- 13. SUBSCRIPTIONPLANS — Định nghĩa các gói dịch vụ
-- ============================================================

CREATE TABLE dbo.SubscriptionPlans (
    Id                  UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    Name                NVARCHAR(100)    NOT NULL,
    Tier                NVARCHAR(20)     NOT NULL
                            CONSTRAINT CK_SubPlans_Tier
                            CHECK (Tier IN ('free','monthly','quarterly','annual','premium')),
    Price               DECIMAL(12,2)    NOT NULL DEFAULT 0,
    Currency            NVARCHAR(10)     NOT NULL DEFAULT 'VND',
    DurationDays        INT              NOT NULL DEFAULT 30,
    AnalysisLimit       INT              NOT NULL DEFAULT 3,  -- -1 = không giới hạn
    HasProgressTracking BIT              NOT NULL DEFAULT 0,
    HasPriorityConsult  BIT              NOT NULL DEFAULT 0,
    HasAIDetailedReport BIT              NOT NULL DEFAULT 0,
    FeaturesJson        NVARCHAR(MAX)    NULL,
    IsActive            BIT              NOT NULL DEFAULT 1,
    SortOrder           INT              NOT NULL DEFAULT 0,
    CreatedAt           DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_SubscriptionPlans PRIMARY KEY (Id)
);
GO

-- ============================================================
-- 14. USERSUBSCRIPTIONS — Đăng ký gói dịch vụ của người dùng
-- ============================================================

CREATE TABLE dbo.UserSubscriptions (
    Id            UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    UserId        UNIQUEIDENTIFIER NOT NULL,
    PlanId        UNIQUEIDENTIFIER NOT NULL,
    StartedAt     DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    ExpiresAt     DATETIME2        NOT NULL,
    Status        NVARCHAR(20)     NOT NULL DEFAULT 'active'
                      CONSTRAINT CK_UserSubs_Status
                      CHECK (Status IN ('active','expired','cancelled','paused')),
    PaymentRef    NVARCHAR(200)    NULL,
    PaymentMethod NVARCHAR(50)     NULL,
    AutoRenew     BIT              NOT NULL DEFAULT 0,
    AnalysisUsed  INT              NOT NULL DEFAULT 0,
    CreatedAt     DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_UserSubscriptions PRIMARY KEY (Id),
    CONSTRAINT FK_UserSubs_Users    FOREIGN KEY (UserId) REFERENCES dbo.Users(Id)             ON DELETE CASCADE,
    CONSTRAINT FK_UserSubs_Plans    FOREIGN KEY (PlanId) REFERENCES dbo.SubscriptionPlans(Id) ON DELETE NO ACTION
);
GO

-- ============================================================
-- 15. ORDERS — Đơn hàng (qua redirect affiliate)
-- ============================================================

CREATE TABLE dbo.Orders (
    Id                 UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    UserId             UNIQUEIDENTIFIER NOT NULL,
    TotalAmount        DECIMAL(14,2)    NOT NULL DEFAULT 0,
    PlatformCommission DECIMAL(14,2)    NOT NULL DEFAULT 0,
    Currency           NVARCHAR(10)     NOT NULL DEFAULT 'VND',
    Status             NVARCHAR(20)     NOT NULL DEFAULT 'pending'
                           CONSTRAINT CK_Orders_Status CHECK (Status IN (
                               'pending','paid','processing','shipped',
                               'delivered','cancelled','refunded')),
    PaymentMethod      NVARCHAR(50)     NULL,
    PaymentRef         NVARCHAR(200)    NULL,
    ShippingAddress    NVARCHAR(1000)   NULL,
    Notes              NVARCHAR(500)    NULL,
    CreatedAt          DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt          DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Orders       PRIMARY KEY (Id),
    CONSTRAINT FK_Orders_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE NO ACTION
);
GO

-- ============================================================
-- 16. ORDERITEMS — Chi tiết từng sản phẩm trong đơn hàng
-- ============================================================

CREATE TABLE dbo.OrderItems (
    Id               UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    OrderId          UNIQUEIDENTIFIER NOT NULL,
    ProductId        UNIQUEIDENTIFIER NOT NULL,
    AffiliateLinkId  UNIQUEIDENTIFIER NULL,
    Quantity         INT              NOT NULL DEFAULT 1,
    UnitPrice        DECIMAL(12,2)    NOT NULL,
    CommissionEarned DECIMAL(12,2)    NOT NULL DEFAULT 0,
    CONSTRAINT PK_OrderItems                PRIMARY KEY (Id),
    CONSTRAINT FK_OrderItems_Orders         FOREIGN KEY (OrderId)        REFERENCES dbo.Orders(Id)        ON DELETE CASCADE,
    CONSTRAINT FK_OrderItems_Products       FOREIGN KEY (ProductId)      REFERENCES dbo.Products(Id)      ON DELETE NO ACTION,
    CONSTRAINT FK_OrderItems_AffiliateLinks FOREIGN KEY (AffiliateLinkId) REFERENCES dbo.AffiliateLinks(Id) ON DELETE SET NULL
);
GO

-- ============================================================
-- 17. MEMBERSHIPPOINTS — Điểm tích lũy / loyalty
-- ============================================================

CREATE TABLE dbo.MembershipPoints (
    Id             UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    UserId         UNIQUEIDENTIFIER NOT NULL,
    TotalPoints    INT              NOT NULL DEFAULT 0,
    RedeemedPoints INT              NOT NULL DEFAULT 0,
    ExpiredPoints  INT              NOT NULL DEFAULT 0,
    LastUpdated    DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_MembershipPoints        PRIMARY KEY (Id),
    CONSTRAINT UQ_MembershipPoints_UserId UNIQUE (UserId),
    CONSTRAINT FK_MembershipPoints_Users  FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE
);
GO

-- ============================================================
-- 18. NOTIFICATIONS — Thông báo đẩy / email / in-app
-- ============================================================

CREATE TABLE dbo.Notifications (
    Id        UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    UserId    UNIQUEIDENTIFIER NOT NULL,
    Title     NVARCHAR(200)    NOT NULL,
    Body      NVARCHAR(1000)   NOT NULL,
    Type      NVARCHAR(40)     NOT NULL DEFAULT 'general'
                  CONSTRAINT CK_Notifications_Type CHECK (Type IN (
                      'general','analysis_ready','appointment_confirm',
                      'appointment_reminder','promotion','checkup_reminder',
                      'subscription_expiry','order_update')),
    ActionUrl NVARCHAR(1000)   NULL,
    IsRead    BIT              NOT NULL DEFAULT 0,
    SentAt    DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Notifications       PRIMARY KEY (Id),
    CONSTRAINT FK_Notifications_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE
);
GO

-- ============================================================
-- INDEXES — Tối ưu các truy vấn thường dùng
-- ============================================================

-- Users
CREATE NONCLUSTERED INDEX IX_Users_Email ON dbo.Users(Email);
CREATE NONCLUSTERED INDEX IX_Users_Role  ON dbo.Users(Role);

-- SkinAnalyses
CREATE NONCLUSTERED INDEX IX_SkinAnalyses_UserId     ON dbo.SkinAnalyses(UserId);
CREATE NONCLUSTERED INDEX IX_SkinAnalyses_AnalysedAt ON dbo.SkinAnalyses(AnalysedAt DESC);

-- SkinConditions
CREATE NONCLUSTERED INDEX IX_SkinConditions_AnalysisId ON dbo.SkinConditions(AnalysisId);
CREATE NONCLUSTERED INDEX IX_SkinConditions_Type       ON dbo.SkinConditions(ConditionType);

-- Products
CREATE NONCLUSTERED INDEX IX_Products_BrandId     ON dbo.Products(BrandId);
CREATE NONCLUSTERED INDEX IX_Products_Category    ON dbo.Products(Category);
CREATE NONCLUSTERED INDEX IX_Products_SkinTypeFit ON dbo.Products(SkinTypeFit);
CREATE NONCLUSTERED INDEX IX_Products_IsActive    ON dbo.Products(IsActive);

-- AffiliateLinks
CREATE NONCLUSTERED INDEX IX_AffiliateLinks_ProductId ON dbo.AffiliateLinks(ProductId);

-- ProductRecommendations
CREATE NONCLUSTERED INDEX IX_ProdRec_AnalysisId ON dbo.ProductRecommendations(AnalysisId);
CREATE NONCLUSTERED INDEX IX_ProdRec_MatchScore ON dbo.ProductRecommendations(MatchScore DESC);

-- Appointments
CREATE NONCLUSTERED INDEX IX_Appointments_UserId    ON dbo.Appointments(UserId);
CREATE NONCLUSTERED INDEX IX_Appointments_DoctorId  ON dbo.Appointments(DoctorId);
CREATE NONCLUSTERED INDEX IX_Appointments_Scheduled ON dbo.Appointments(ScheduledAt);
CREATE NONCLUSTERED INDEX IX_Appointments_Status    ON dbo.Appointments(Status);

-- UserSubscriptions
CREATE NONCLUSTERED INDEX IX_UserSubs_UserId    ON dbo.UserSubscriptions(UserId);
CREATE NONCLUSTERED INDEX IX_UserSubs_Status    ON dbo.UserSubscriptions(Status);
CREATE NONCLUSTERED INDEX IX_UserSubs_ExpiresAt ON dbo.UserSubscriptions(ExpiresAt);

-- Orders
CREATE NONCLUSTERED INDEX IX_Orders_UserId ON dbo.Orders(UserId);
CREATE NONCLUSTERED INDEX IX_Orders_Status ON dbo.Orders(Status);

-- Notifications
CREATE NONCLUSTERED INDEX IX_Notifications_UserId ON dbo.Notifications(UserId);
CREATE NONCLUSTERED INDEX IX_Notifications_IsRead ON dbo.Notifications(IsRead);
GO

-- ============================================================
-- SEED DATA — Dữ liệu khởi tạo
-- ============================================================

INSERT INTO dbo.SubscriptionPlans
    (Id, Name, Tier, Price, DurationDays, AnalysisLimit,
     HasProgressTracking, HasPriorityConsult, HasAIDetailedReport, SortOrder)
VALUES
    (NEWID(), N'Miễn phí',       'free',      0,      30,  3,  0, 0, 0, 1),
    (NEWID(), N'Cơ bản / Tháng', 'monthly',   99000,  30,  10, 1, 0, 0, 2),
    (NEWID(), N'Quý',            'quarterly', 249000, 90,  30, 1, 0, 1, 3),
    (NEWID(), N'Năm / Premium',  'premium',   799000, 365, -1, 1, 1, 1, 4);

INSERT INTO dbo.Brands (Id, Name, Slug, IsAffiliate, IsActive)
VALUES
    (NEWID(), N'La Roche-Posay', 'la-roche-posay', 1, 1),
    (NEWID(), N'CeraVe',         'cerave',         1, 1),
    (NEWID(), N'The Ordinary',   'the-ordinary',   1, 1),
    (NEWID(), N'Bioderma',       'bioderma',        1, 1),
    (NEWID(), N'Paula''s Choice','paulas-choice',   1, 1);
GO

PRINT N'✅  Database SkincareAI — 18 bảng, indexes và seed data đã khởi tạo thành công.';
GO

