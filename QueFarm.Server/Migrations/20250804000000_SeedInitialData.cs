using Microsoft.EntityFrameworkCore.Migrations;
using System;

#nullable disable

namespace QueFarm.Server.Migrations
{
    /// <inheritdoc />
    public partial class SeedInitialData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Seed Categories
            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Name", "Slug", "Description", "ImageUrl", "IsActive", "CreatedAt" },
                values: new object[,]
                {
                    { "Rau Sạch", "rau-sach", "Các loại rau sạch tươi ngon từ nông trại hữu cơ", "/images/categories/rau-sach.jpg", true, DateTime.UtcNow },
                    { "Trái Cây", "trai-cay", "Trái cây tươi ngọt, an toàn cho sức khỏe", "/images/categories/trai-cay.jpg", true, DateTime.UtcNow },
                    { "Thảo Mộc", "thao-moc", "Các loại thảo mộc hữu cơ tốt cho sức khỏe", "/images/categories/thao-moc.jpg", true, DateTime.UtcNow },
                    { "Nấm", "nam", "Nấm tươi các loại được trồng sạch", "/images/categories/nam.jpg", true, DateTime.UtcNow }
                });

            // Seed Products
            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Name", "Price", "OriginalPrice", "Description", "ImageUrl", "StockQuantity", "Rating", "CategoryId", "Origin", "Weight", "Region", "IsActive", "CreatedAt" },
                values: new object[,]
                {
                    // Rau Sạch (CategoryId = 1)
                    { "Rau Cải Xanh Hữu Cơ", 25000m, 30000m, "Rau cải xanh được trồng hoàn toàn hữu cơ, không thuốc trừ sâu. Giàu vitamin A, C và canxi.", "/images/products/rau-cai-xanh.jpg", 100, 4.5m, 1, "Đà Lạt", "500g", "Lâm Đồng", true, DateTime.UtcNow },
                    { "Cà Chua Cherry", 45000m, 50000m, "Cà chua cherry ngọt tự nhiên, giàu vitamin C và lycopene tốt cho sức khỏe.", "/images/products/ca-chua-cherry.jpg", 80, 4.8m, 1, "Đà Lạt", "250g", "Lâm Đồng", true, DateTime.UtcNow },
                    { "Xà Lách Tươi", 20000m, 25000m, "Xà lách tươi giòn, lá xanh đậm, perfect cho salad và bánh mì.", "/images/products/xa-lach.jpg", 150, 4.3m, 1, "Đà Lạt", "300g", "Lâm Đồng", true, DateTime.UtcNow },
                    { "Cần Tây", 35000m, null, "Cần tây tươi, thân giòn, lá xanh. Tốt cho hệ tiêu hóa và giảm cân.", "/images/products/can-tay.jpg", 60, 4.2m, 1, "Hà Nội", "400g", "Hà Tây", true, DateTime.UtcNow },

                    // Trái Cây (CategoryId = 2)
                    { "Táo Fuji Nhật", 120000m, 140000m, "Táo Fuji nhập khẩu từ Nhật Bản, giòn ngọt, vỏ đỏ bóng đẹp.", "/images/products/tao-fuji.jpg", 50, 4.9m, 2, "Nhật Bản", "1kg", "Aomori", true, DateTime.UtcNow },
                    { "Cam Sành Hà Giang", 65000m, 75000m, "Cam sành Hà Giang ngọt thanh, nhiều nước, giàu vitamin C.", "/images/products/cam-sanh.jpg", 100, 4.6m, 2, "Hà Giang", "1kg", "Hà Giang", true, DateTime.UtcNow },
                    { "Nho Xanh Úc", 180000m, 200000m, "Nho xanh không hạt nhập khẩu từ Úc, vị ngọt dịu, thơm tự nhiên.", "/images/products/nho-xanh.jpg", 30, 4.7m, 2, "Úc", "500g", "Victoria", true, DateTime.UtcNow },

                    // Thảo Mộc (CategoryId = 3)
                    { "Lá Húng Quế", 15000m, null, "Lá húng quế tươi thơm, dùng pha trà hoặc nấu canh, tốt cho hệ hô hấp.", "/images/products/hung-que.jpg", 200, 4.4m, 3, "Vinh Long", "100g", "Đồng bằng sông Cửu Long", true, DateTime.UtcNow },
                    { "Rau Răm", 12000m, null, "Rau răm tươi, vị cay nhẹ, thường dùng ăn kèm với các món nướng.", "/images/products/rau-ram.jpg", 180, 4.1m, 3, "An Giang", "150g", "Đồng bằng sông Cửu Long", true, DateTime.UtcNow },

                    // Nấm (CategoryId = 4)
                    { "Nấm Shiitake Nhật", 95000m, 110000m, "Nấm shiitake tươi nhập khẩu từ Nhật, thơm ngon và bổ dưỡng.", "/images/products/nam-shiitake.jpg", 40, 4.8m, 4, "Nhật Bản", "200g", "Shizuoka", true, DateTime.UtcNow },
                    { "Nấm Bào Ngư", 85000m, 95000m, "Nấm bào ngư to béo, thịt dày, vị ngọt thanh tự nhiên.", "/images/products/nam-bao-ngu.jpg", 70, 4.5m, 4, "Đà Lạt", "300g", "Lâm Đồng", true, DateTime.UtcNow }
                });

            // Seed Admin User (password: admin123)
            // Hash for "admin123" using BCrypt
            string adminPasswordHash = "$2a$11$rOqJ.8Ea5z8/kLlFW.W5S.6nQqNDLZhFjdg7xgXGJqGZhDw.s6L9e";
            
            migrationBuilder.InsertData(
                table: "AdminUsers",
                columns: new[] { "Username", "Email", "PasswordHash", "FirstName", "LastName", "IsActive", "CreatedAt" },
                values: new object[] { "admin", "admin@quefarm.page", adminPasswordHash, "Admin", "QueFarm", true, DateTime.UtcNow });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove seed data
            migrationBuilder.DeleteData(table: "Products", keyColumn: "Name", keyValue: "Rau Cải Xanh Hữu Cơ");
            migrationBuilder.DeleteData(table: "Products", keyColumn: "Name", keyValue: "Cà Chua Cherry");
            migrationBuilder.DeleteData(table: "Products", keyColumn: "Name", keyValue: "Xà Lách Tươi");
            migrationBuilder.DeleteData(table: "Products", keyColumn: "Name", keyValue: "Cần Tây");
            migrationBuilder.DeleteData(table: "Products", keyColumn: "Name", keyValue: "Táo Fuji Nhật");
            migrationBuilder.DeleteData(table: "Products", keyColumn: "Name", keyValue: "Cam Sành Hà Giang");
            migrationBuilder.DeleteData(table: "Products", keyColumn: "Name", keyValue: "Nho Xanh Úc");
            migrationBuilder.DeleteData(table: "Products", keyColumn: "Name", keyValue: "Lá Húng Quế");
            migrationBuilder.DeleteData(table: "Products", keyColumn: "Name", keyValue: "Rau Răm");
            migrationBuilder.DeleteData(table: "Products", keyColumn: "Name", keyValue: "Nấm Shiitake Nhật");
            migrationBuilder.DeleteData(table: "Products", keyColumn: "Name", keyValue: "Nấm Bào Ngư");

            migrationBuilder.DeleteData(table: "Categories", keyColumn: "Name", keyValue: "Rau Sạch");
            migrationBuilder.DeleteData(table: "Categories", keyColumn: "Name", keyValue: "Trái Cây");
            migrationBuilder.DeleteData(table: "Categories", keyColumn: "Name", keyValue: "Thảo Mộc");
            migrationBuilder.DeleteData(table: "Categories", keyColumn: "Name", keyValue: "Nấm");

            migrationBuilder.DeleteData(table: "AdminUsers", keyColumn: "Username", keyValue: "admin");
        }
    }
} 