using QueFarm.Server.Core.Domain.Entities;

namespace QueFarm.Server.Data
{
    public static class DbInitializer
    {
        public static void Initialize(QueFarmDbContext context)
        {
            context.Database.EnsureCreated();

            // Seed Categories
            if (!context.Categories.Any())
            {
                var categories = new Category[]
                {
                    new Category { 
                        Name = "Đặc sản miền Bắc", 
                        Description = "Các món đặc sản truyền thống của miền Bắc",
                        Slug = "dac-san-mien-bac",
                        IsActive = true
                    },
                    new Category { 
                        Name = "Đặc sản miền Trung", 
                        Description = "Các món đặc sản truyền thống của miền Trung",
                        Slug = "dac-san-mien-trung",
                        IsActive = true
                    },
                    new Category { 
                        Name = "Đặc sản miền Nam", 
                        Description = "Các món đặc sản truyền thống của miền Nam",
                        Slug = "dac-san-mien-nam",
                        IsActive = true
                    },
                    new Category { 
                        Name = "Lạp xưởng tươi", 
                        Description = "Các loại lạp xưởng tươi ngon",
                        Slug = "lap-xuong-tuoi",
                        IsActive = true
                    },
                    new Category { 
                        Name = "Bánh kẹo truyền thống", 
                        Description = "Các loại bánh kẹo truyền thống",
                        Slug = "banh-keo-truyen-thong",
                        IsActive = true
                    },
                    new Category { 
                        Name = "Đặc sản Tây Ninh", 
                        Description = "Các món đặc sản của Tây Ninh",
                        Slug = "dac-san-tay-ninh",
                        IsActive = true
                    },
                    new Category { 
                        Name = "Combo quà tặng", 
                        Description = "Các combo quà tặng đặc biệt",
                        Slug = "combo-qua-tang",
                        IsActive = true
                    }
                };

                context.Categories.AddRange(categories);
                context.SaveChanges();
            }

            // Seed Products
            if (!context.Products.Any())
            {
                var products = new Product[]
                {
                    new Product { 
                        Name = "Lạp xưởng tươi tôm - Gói 250gr", 
                        Price = 66700, 
                        OriginalPrice = 80040,
                        DiscountPercentage = 17,
                        Description = "Lạp xưởng tươi tôm được chế biến từ tôm tươi ngon, đảm bảo vệ sinh an toàn thực phẩm", 
                        ImageUrl = "/images/products/lap-xuong-tom-250gr.jpg",
                        Rating = 4.8m,
                        CategoryId = 4,
                        StockQuantity = 50,
                        Origin = "Long An",
                        Weight = "250gr",
                        Region = "Miền Nam",
                        IsActive = true
                    },
                    new Product { 
                        Name = "Lạp xưởng tươi tôm - Gói 500gr", 
                        Price = 138500, 
                        OriginalPrice = 166200,
                        DiscountPercentage = 17,
                        Description = "Lạp xưởng tươi tôm được chế biến từ tôm tươi ngon, đảm bảo vệ sinh an toàn thực phẩm", 
                        ImageUrl = "/images/products/lap-xuong-tom-500gr.jpg",
                        Rating = 4.5m,
                        CategoryId = 4,
                        StockQuantity = 30,
                        Origin = "Long An",
                        Weight = "500gr",
                        Region = "Miền Nam",
                        IsActive = true
                    },
                    new Product { 
                        Name = "Lạp xưởng tươi bò - Gói 250gr", 
                        Price = 62200, 
                        OriginalPrice = 74640,
                        DiscountPercentage = 17,
                        Description = "Lạp xưởng tươi bò được chế biến từ thịt bò tươi ngon, hương vị đậm đà", 
                        ImageUrl = "/images/products/lap-xuong-bo-250gr.jpg",
                        Rating = 4.9m,
                        CategoryId = 4,
                        StockQuantity = 40,
                        Origin = "Long An",
                        Weight = "250gr",
                        Region = "Miền Nam",
                        IsActive = true
                    },
                    new Product { 
                        Name = "Lạp xưởng tươi bò - Gói 500gr", 
                        Price = 124500, 
                        OriginalPrice = 149400,
                        DiscountPercentage = 17,
                        Description = "Lạp xưởng tươi bò được chế biến từ thịt bò tươi ngon, hương vị đậm đà", 
                        ImageUrl = "/images/products/lap-xuong-bo-500gr.jpg",
                        Rating = 4.7m,
                        CategoryId = 4,
                        StockQuantity = 25,
                        Origin = "Long An",
                        Weight = "500gr",
                        Region = "Miền Nam",
                        IsActive = true
                    },
                    new Product { 
                        Name = "Bánh gai - Gói 250gr", 
                        Price = 36500, 
                        OriginalPrice = 40150,
                        DiscountPercentage = 9,
                        Description = "Bánh gai truyền thống với hương vị thơm ngon đặc trưng", 
                        ImageUrl = "/images/products/banh-gai-250gr.jpg",
                        Rating = 4.6m,
                        CategoryId = 5,
                        StockQuantity = 60,
                        Origin = "Hà Nội",
                        Weight = "250gr",
                        Region = "Miền Bắc",
                        IsActive = true
                    },
                    new Product { 
                        Name = "Bánh đậu xanh nướng 250gr", 
                        Price = 48000, 
                        OriginalPrice = 55200,
                        DiscountPercentage = 13,
                        Description = "Bánh đậu xanh nướng thơm ngon, bùi bùi", 
                        ImageUrl = "/images/products/banh-dau-xanh-250gr.jpg",
                        Rating = 4.8m,
                        CategoryId = 5,
                        StockQuantity = 45,
                        Origin = "Hải Dương",
                        Weight = "250gr",
                        Region = "Miền Bắc",
                        IsActive = true
                    },
                    new Product { 
                        Name = "Bánh ống kem - Gói 360gr", 
                        Price = 45500, 
                        OriginalPrice = 50050,
                        DiscountPercentage = 9,
                        Description = "Bánh ống kem giòn tan, ngọt ngào", 
                        ImageUrl = "/images/products/banh-ong-kem-360gr.jpg",
                        Rating = 4.4m,
                        CategoryId = 5,
                        StockQuantity = 35,
                        Origin = "TP.HCM",
                        Weight = "360gr",
                        Region = "Miền Nam",
                        IsActive = true
                    },
                    new Product { 
                        Name = "Bánh kẹp mè - Gói 200gr", 
                        Price = 31500, 
                        OriginalPrice = 34650,
                        DiscountPercentage = 9,
                        Description = "Bánh kẹp mè thơm bùi, giòn tan", 
                        ImageUrl = "/images/products/banh-kep-me-200gr.jpg",
                        Rating = 4.3m,
                        CategoryId = 5,
                        StockQuantity = 55,
                        Origin = "An Giang",
                        Weight = "200gr",
                        Region = "Miền Nam",
                        IsActive = true
                    },
                    new Product { 
                        Name = "Nem chua Thanh Hóa - Gói 300gr", 
                        Price = 42000, 
                        OriginalPrice = 48000,
                        DiscountPercentage = 12,
                        Description = "Nem chua Thanh Hóa chua ngọt đặc trưng", 
                        ImageUrl = "/images/products/nem-chua-thanh-hoa-300gr.jpg",
                        Rating = 4.7m,
                        CategoryId = 2,
                        StockQuantity = 30,
                        Origin = "Thanh Hóa",
                        Weight = "300gr",
                        Region = "Miền Trung",
                        IsActive = true
                    },
                    new Product { 
                        Name = "Mắm ruốc Huế - Hũ 200gr", 
                        Price = 65000, 
                        OriginalPrice = 72000,
                        DiscountPercentage = 10,
                        Description = "Mắm ruốc Huế đậm đà hương vị xứ Huế", 
                        ImageUrl = "/images/products/mam-ruoc-hue-200gr.jpg",
                        Rating = 4.6m,
                        CategoryId = 2,
                        StockQuantity = 25,
                        Origin = "Huế",
                        Weight = "200gr",
                        Region = "Miền Trung",
                        IsActive = true
                    }
                };

                context.Products.AddRange(products);
                context.SaveChanges();
            }

            // Seed Admin User
            if (!context.AdminUsers.Any())
            {
                var adminUser = new AdminUser
                {
                    Username = "admin",
                    PasswordHash = "admin123", // TODO: Hash password in production
                    FirstName = "System",
                    LastName = "Administrator",
                    Email = "admin@quefarm.com"
                };

                context.AdminUsers.Add(adminUser);
                context.SaveChanges();
            }
        }
    }
} 