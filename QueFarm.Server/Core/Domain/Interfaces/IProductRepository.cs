using QueFarm.Server.Core.Domain.Entities;

namespace QueFarm.Server.Core.Domain.Interfaces
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId);
        Task<IEnumerable<Product>> GetFeaturedProductsAsync(int count);
        Task<IEnumerable<Product>> SearchProductsAsync(string searchTerm);
    }
} 