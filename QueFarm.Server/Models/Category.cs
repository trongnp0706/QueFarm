using System.ComponentModel.DataAnnotations;

namespace QueFarm.Server.Models
{
    public class Category
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        // Navigation properties
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
} 