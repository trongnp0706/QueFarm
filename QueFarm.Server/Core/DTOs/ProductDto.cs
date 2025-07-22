using Microsoft.AspNetCore.Http;

namespace QueFarm.Server.Core.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public int? DiscountPercentage { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public List<string>? AdditionalImages { get; set; }
        public int StockQuantity { get; set; }
        public decimal Rating { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string? Origin { get; set; }
        public string? Weight { get; set; }
        public string? Region { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public List<string>? AdditionalImages { get; set; }
        public int StockQuantity { get; set; }
        public int CategoryId { get; set; }
        public string? Origin { get; set; }
        public string? Weight { get; set; }
        public string? Region { get; set; }
    }

    public class UpdateProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public List<string>? AdditionalImages { get; set; }
        public int StockQuantity { get; set; }
        public int CategoryId { get; set; }
        public string? Origin { get; set; }
        public string? Weight { get; set; }
        public string? Region { get; set; }
        public bool IsActive { get; set; }
    }
    
    public class ProductImageUploadDto
    {
        public IFormFile? MainImage { get; set; }
        public List<IFormFile>? AdditionalImages { get; set; }
    }

    public class PagedProductResultDto
    {
        public List<ProductDto> Products { get; set; } = new List<ProductDto>();
        public int TotalItems { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling(TotalItems / (double)PageSize);
    }
} 