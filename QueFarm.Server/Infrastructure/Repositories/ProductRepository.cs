using Microsoft.EntityFrameworkCore;
using QueFarm.Server.Core.Domain.Entities;
using QueFarm.Server.Core.Domain.Interfaces;
using QueFarm.Server.Data;

namespace QueFarm.Server.Infrastructure.Repositories
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(QueFarmDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId)
        {
            return await _dbSet
                .Where(p => p.CategoryId == categoryId && p.IsActive)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetFeaturedProductsAsync(int count)
        {
            return await _dbSet
                .Where(p => p.IsActive)
                .OrderByDescending(p => p.Rating)
                .Take(count)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> SearchProductsAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return await GetAllAsync();

            return await _dbSet
                .Where(p => p.Name.Contains(searchTerm) || 
                            (p.Description != null && p.Description.Contains(searchTerm)) && 
                            p.IsActive)
                .ToListAsync();
        }

        // Override to include Category
        public override async Task<Product?> GetByIdAsync(int id)
        {
            return await _dbSet
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        // Override to return only active products
        public override async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _dbSet
                .Where(p => p.IsActive)
                .ToListAsync();
        }
    }
} 