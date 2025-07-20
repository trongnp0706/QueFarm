namespace QueFarm.Server.Core.Domain.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public int? DiscountPercentage { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public decimal Rating { get; set; } = 0;
        public int CategoryId { get; set; }
        public string? Origin { get; set; }
        public string? Weight { get; set; }
        public string? Region { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
} 