using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QueFarm.Server.Models
{
    public class ProductImage
    {
        public int Id { get; set; }
        [Required]
        public string ImageUrl { get; set; } = string.Empty;
        public int Order { get; set; } = 0;
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
    }
} 