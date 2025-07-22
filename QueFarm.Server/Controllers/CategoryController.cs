using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QueFarm.Server.Core.Domain.Entities;
using QueFarm.Server.Core.Services;

namespace QueFarm.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET: api/category
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(categories);
        }

        // GET: api/category/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);
            if (category == null) return NotFound();
            return Ok(category);
        }

        // GET: api/category/slug/{slug}
        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var category = await _categoryService.GetCategoryBySlugAsync(slug);
            if (category == null) return NotFound();
            return Ok(category);
        }

        // POST: api/category (Admin)
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(Category category)
        {
            var createdCategory = await _categoryService.CreateCategoryAsync(category);
            return CreatedAtAction(nameof(GetById), new { id = createdCategory.Id }, createdCategory);
        }

        // PUT: api/category/{id} (Admin)
        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, Category category)
        {
            if (id != category.Id) return BadRequest("ID mismatch");
            
            try
            {
                var updatedCategory = await _categoryService.UpdateCategoryAsync(category);
                return Ok(updatedCategory);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        // DELETE: api/category/{id} (Admin)
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _categoryService.DeleteCategoryAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
} 