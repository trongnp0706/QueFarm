using QueFarm.Server.Models;

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
                    new Category { Name = "Rau củ quả", Description = "Các loại rau củ quả tươi" },
                    new Category { Name = "Thịt cá", Description = "Thịt và cá tươi" },
                    new Category { Name = "Gia vị", Description = "Các loại gia vị" },
                    new Category { Name = "Đồ khô", Description = "Các loại đồ khô" }
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
                        Name = "Rau cải bó xôi", 
                        Price = 25000, 
                        Description = "Rau cải bó xôi tươi ngon", 
                        ImageUrl = "https://via.placeholder.com/300x200?text=Rau+Cai+Bo+Xoi",
                        Rating = 4.5m,
                        CategoryId = 1 
                    },
                    new Product { 
                        Name = "Cà chua", 
                        Price = 15000, 
                        Description = "Cà chua tươi ngon", 
                        ImageUrl = "https://via.placeholder.com/300x200?text=Ca+Chua",
                        Rating = 4.2m,
                        CategoryId = 1 
                    },
                    new Product { 
                        Name = "Thịt heo", 
                        Price = 120000, 
                        Description = "Thịt heo tươi", 
                        ImageUrl = "https://via.placeholder.com/300x200?text=Thit+Heo",
                        Rating = 4.8m,
                        CategoryId = 2 
                    },
                    new Product { 
                        Name = "Cá basa", 
                        Price = 80000, 
                        Description = "Cá basa tươi", 
                        ImageUrl = "https://via.placeholder.com/300x200?text=Ca+Basa",
                        Rating = 4.6m,
                        CategoryId = 2 
                    },
                    new Product { 
                        Name = "Hành lá", 
                        Price = 10000, 
                        Description = "Hành lá tươi", 
                        ImageUrl = "https://via.placeholder.com/300x200?text=Hanh+La",
                        Rating = 4.0m,
                        CategoryId = 3 
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
                    FullName = "Administrator",
                    Email = "admin@quefarm.com"
                };

                context.AdminUsers.Add(adminUser);
                context.SaveChanges();
            }
        }
    }
} 