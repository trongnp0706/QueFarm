using Microsoft.AspNetCore.Http;

namespace QueFarm.Server.Core.DTOs
{
    public class ProductImportRequest
    {
        public IFormFile ExcelFile { get; set; } = null!;
        public bool OverwriteExisting { get; set; } = false;
    }

    public class ProductImportResponse
    {
        public int TotalRows { get; set; }
        public int SuccessCount { get; set; }
        public int ErrorCount { get; set; }
        public List<ProductImportError> Errors { get; set; } = new();
        public List<ProductDto> ImportedProducts { get; set; } = new();
    }

    public class ProductImportError
    {
        public int Row { get; set; }
        public string Field { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Error { get; set; } = string.Empty;
    }

    public class ProductExcelRow
    {
        public int Row { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal? Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public string? Description { get; set; }
        public int? StockQuantity { get; set; }
        public string? CategoryName { get; set; }
        public string? Origin { get; set; }
        public string? Weight { get; set; }
        public string? Region { get; set; }
        public string? ImageUrl { get; set; }
        public bool? IsActive { get; set; }
    }
}

