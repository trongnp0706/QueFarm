using Microsoft.EntityFrameworkCore;
using QueFarm.Server.Core.Domain.Entities;
using QueFarm.Server.Core.Services;
using QueFarm.Server.Data;
using System.Text.RegularExpressions;

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
            return await _context.Categories.FirstOrDefaultAsync(c => c.Slug == slug.ToLower());
        }

        public async Task<Category> CreateCategoryAsync(Category category)
        {
            // Generate basic slug from name if needed
            if (string.IsNullOrEmpty(category.Slug))
            {
                category.Slug = category.Name.ToLower().Replace(" ", "-");
            }
            
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<Category> UpdateCategoryAsync(Category category)
        {
            var existingCategory = await _context.Categories.FindAsync(category.Id);
            if (existingCategory == null)
            {
                throw new KeyNotFoundException($"Category with id {category.Id} not found");
            }

            // Update fields
            existingCategory.Name = category.Name;
            existingCategory.Description = category.Description;
            existingCategory.Slug = category.Name.ToLower().Replace(" ", "-");

            _context.Entry(existingCategory).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return existingCategory;
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