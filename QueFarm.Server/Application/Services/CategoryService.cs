using Microsoft.EntityFrameworkCore;
using QueFarm.Server.Core.Domain.Entities;
using QueFarm.Server.Core.Services;
using QueFarm.Server.Data;

namespace QueFarm.Server.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly QueFarmDbContext _context;

        public CategoryService(QueFarmDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await _context.Categories.FindAsync(id);
        }

        public async Task<Category?> GetCategoryBySlugAsync(string slug)
        {
            return await _context.Categories.FirstOrDefaultAsync(c => c.Name.ToLower().Replace(" ", "-") == slug.ToLower());
        }

        public async Task<Category> CreateCategoryAsync(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<Category> UpdateCategoryAsync(Category category)
        {
            _context.Entry(category).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task DeleteCategoryAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                throw new KeyNotFoundException($"Category with id {id} not found");
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
        }
    }
} 