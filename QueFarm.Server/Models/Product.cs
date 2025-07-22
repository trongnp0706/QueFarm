using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QueFarm.Server.Models
{
    public class Product
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        
        public string? Description { get; set; }
        
        public string? ImageUrl { get; set; }
        
        [Range(0, 5)]
        public decimal Rating { get; set; } = 0;
        
        public int CategoryId { get; set; }
        
        // Navigation properties
        public Category Category { get; set; } = null!;
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    }
} 