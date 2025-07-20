using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QueFarm.Server.Core.DTOs;
using QueFarm.Server.Core.Services;

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
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAllProductsAsync();
            return Ok(products);
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
        [Authorize]
        public async Task<IActionResult> Create(CreateProductDto productDto)
        {
            var product = await _productService.CreateProductAsync(productDto);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        // PUT: api/product/{id} (Admin)
        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, UpdateProductDto productDto)
        {
            if (id != productDto.Id) return BadRequest("ID mismatch");

            try
            {
                var product = await _productService.UpdateProductAsync(productDto);
                return Ok(product);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        // DELETE: api/product/{id} (Admin)
        [HttpDelete("{id:int}")]
        [Authorize]
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
        }
    }
} 