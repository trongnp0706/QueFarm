using Microsoft.EntityFrameworkCore;
using QueFarm.Server.Core.Domain.Entities;

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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure decimal precision for Product
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18,2)");
                
            modelBuilder.Entity<Product>()
                .Property(p => p.OriginalPrice)
                .HasColumnType("decimal(18,2)");
                
            modelBuilder.Entity<Product>()
                .Property(p => p.Rating)
                .HasColumnType("decimal(3,1)");
                
            // Configure decimal precision for Order
            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasColumnType("decimal(18,2)");
                
            // Configure decimal precision for OrderItem
            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.Price)
                .HasColumnType("decimal(18,2)");
                
            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.Subtotal)
                .HasColumnType("decimal(18,2)");
                
            // Configure relationships
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId);
                
            // Configure AdditionalImages as JSON (EF Core 7+)
            modelBuilder.Entity<Product>()
                .Property(e => e.AdditionalImages)
                .HasConversion(
                    v => v == null ? null : string.Join(';', v),
                    v => v == null ? new List<string>() : v.Split(';', StringSplitOptions.RemoveEmptyEntries).ToList()
                );
                
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId);
                
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany(p => p.OrderItems)
                .HasForeignKey(oi => oi.ProductId);
        }
    }
} 