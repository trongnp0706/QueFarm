using Microsoft.EntityFrameworkCore;
using QueFarm.Server.Core.Domain.Entities;
using QueFarm.Server.Core.Domain.Interfaces;
using QueFarm.Server.Data;

namespace QueFarm.Server.Infrastructure.Repositories
{
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        public CategoryRepository(QueFarmDbContext context) : base(context)
        {
        }

        public async Task<Category?> GetBySlugAsync(string slug)
        {
            return await _dbSet
                .FirstOrDefaultAsync(c => c.Slug == slug && c.IsActive);
        }

        public override async Task<IEnumerable<Category>> GetAllAsync()
        {
            return await _dbSet
                .Where(c => c.IsActive)
                .ToListAsync();
        }
    }
} 