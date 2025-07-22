using QueFarm.Server.Core.DTOs;
using Microsoft.AspNetCore.Http;

namespace QueFarm.Server.Core.Services
{
    public interface IProductService
    {
        Task<PagedProductResultDto> GetAllProductsAsync(int pageNumber = 1, int pageSize = 10, string? searchTerm = null);
        Task<ProductDto?> GetProductByIdAsync(int id);
        Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(int categoryId);
        Task<IEnumerable<ProductDto>> GetProductsByCategorySlugAsync(string slug);
        Task<IEnumerable<ProductDto>> SearchProductsAsync(string searchTerm);
        Task<IEnumerable<ProductDto>> GetFeaturedProductsAsync(int count);
        Task<ProductDto> CreateProductAsync(CreateProductDto productDto, IFormFile? mainImage, List<IFormFile>? additionalImages);
        Task<ProductDto> UpdateProductAsync(UpdateProductDto productDto, IFormFile? mainImage, List<IFormFile>? additionalImages);
        Task DeleteProductAsync(int id);
        Task<string> SaveImageAsync(IFormFile image);
        Task<List<string>> SaveImagesAsync(List<IFormFile> images);
        Task DeleteImageAsync(string imageUrl);
    }
} 