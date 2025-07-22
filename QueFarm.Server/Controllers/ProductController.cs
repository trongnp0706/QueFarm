using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QueFarm.Server.Core.DTOs;
using QueFarm.Server.Core.Services;
using System.ComponentModel.DataAnnotations;

namespace QueFarm.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        // GET: api/product
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int pageNumber = 1, 
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null)
        {
            if (pageNumber < 1) 
                return BadRequest("Page number must be greater than 0");
                
            if (pageSize < 1 || pageSize > 50)
                return BadRequest("Page size must be between 1 and 50");
                
            var pagedProducts = await _productService.GetAllProductsAsync(pageNumber, pageSize, search);
            return Ok(pagedProducts);
        }

        // GET: api/product/featured/{count}
        [HttpGet("featured/{count:int}")]
        public async Task<IActionResult> GetFeatured(int count)
        {
            var products = await _productService.GetFeaturedProductsAsync(count);
            return Ok(products);
        }

        // GET: api/product/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        // GET: api/product/category/{categoryId}
        [HttpGet("category/{categoryId:int}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var products = await _productService.GetProductsByCategoryAsync(categoryId);
            return Ok(products);
        }

        // GET: api/product/category-slug/{slug}
        [HttpGet("category-slug/{slug}")]
        public async Task<IActionResult> GetByCategorySlug(string slug)
        {
            var products = await _productService.GetProductsByCategorySlugAsync(slug);
            return Ok(products);
        }

        // GET: api/product/search
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Search query cannot be empty");

            var products = await _productService.SearchProductsAsync(query);
            return Ok(products);
        }

        // POST: api/product (Admin)
        [HttpPost]
        // [Authorize] // Temporarily disabled for testing
        public async Task<IActionResult> Create([FromForm] CreateProductDto productDto, [FromForm] IFormFile? mainImage, [FromForm] List<IFormFile>? additionalImages)
        {
            try
            {
                // Validate product data
                if (string.IsNullOrWhiteSpace(productDto.Name))
                    return BadRequest("Product name is required");
                    
                if (productDto.Price <= 0)
                    return BadRequest("Price must be greater than 0");
                    
                if (productDto.CategoryId <= 0)
                    return BadRequest("Valid category ID is required");
                
                var product = await _productService.CreateProductAsync(productDto, mainImage, additionalImages);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/product/{id} (Admin)
        [HttpPut("{id:int}")]
        // [Authorize] // Temporarily disabled for testing
        public async Task<IActionResult> Update(int id, [FromForm] UpdateProductDto productDto, [FromForm] IFormFile? mainImage, [FromForm] List<IFormFile>? additionalImages)
        {
            if (id != productDto.Id) 
                return BadRequest("ID mismatch");

            try
            {
                // Validate product data
                if (string.IsNullOrWhiteSpace(productDto.Name))
                    return BadRequest("Product name is required");
                    
                if (productDto.Price <= 0)
                    return BadRequest("Price must be greater than 0");
                    
                if (productDto.CategoryId <= 0)
                    return BadRequest("Valid category ID is required");
                
                var product = await _productService.UpdateProductAsync(productDto, mainImage, additionalImages);
                return Ok(product);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/product/{id} (Admin)
        [HttpDelete("{id:int}")]
        // [Authorize] // Temporarily disabled for testing
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _productService.DeleteProductAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
} 