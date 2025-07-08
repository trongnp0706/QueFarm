using Microsoft.EntityFrameworkCore;
using QueFarm.Server.Models;

namespace QueFarm.Server.Data
{
    public class QueFarmDbContext : DbContext
    {
        public QueFarmDbContext(DbContextOptions<QueFarmDbContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<AdminUser> AdminUsers { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Các cấu hình quan hệ nếu cần
        }
    }
} 