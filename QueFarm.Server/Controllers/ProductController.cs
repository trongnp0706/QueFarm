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

        /// <summary>
        /// Create a new product with JSON data only
        /// For image uploads, use the /api/product-files endpoints after creating the product or use the form-data endpoint below
        /// </summary>
        /// <param name="productDto">Product data</param>
        /// <returns>Created product</returns>
        [HttpPost]
        [ProducesResponseType(typeof(ProductDto), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateProductDto productDto)
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
                
                var product = await _productService.CreateProductAsync(productDto, null, null);
                return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    error = "Internal server error", 
                    message = ex.Message
                });
            }
        }

        /// <summary>
        /// Create a new product with form data including image uploads
        /// This endpoint supports both product data and file uploads in a single request
        /// </summary>
        /// <param name="name">Product name</param>
        /// <param name="description">Product description</param>
        /// <param name="price">Product price</param>
        /// <param name="originalPrice">Original price (optional)</param>
        /// <param name="categoryId">Category ID</param>
        /// <param name="stockQuantity">Stock quantity</param>
        /// <param name="origin">Product origin</param>
        /// <param name="weight">Product weight</param>
        /// <param name="region">Product region</param>
        /// <param name="mainImage">Main product image (optional)</param>
        /// <param name="additionalImages">Additional product images (optional)</param>
        /// <returns>Created product</returns>
        [HttpPost("with-images")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(typeof(ProductDto), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        [Authorize]
        public async Task<IActionResult> CreateWithImages(
            [FromForm, Required] string name,
            [FromForm, Required] decimal price,
            [FromForm, Required] int categoryId,
            [FromForm] string? description = null,
            [FromForm] decimal? originalPrice = null,
            [FromForm] int stockQuantity = 0,
            [FromForm] string? origin = null,
            [FromForm] string? weight = null,
            [FromForm] string? region = null,
            [FromForm] IFormFile? mainImage = null,
            [FromForm] List<IFormFile>? additionalImages = null)
        {
            try
            {
                // Validate input data
                if (string.IsNullOrWhiteSpace(name))
                    return BadRequest("Product name is required");
                    
                if (price <= 0)
                    return BadRequest("Price must be greater than 0");
                    
                if (categoryId <= 0)
                    return BadRequest("Valid category ID is required");

                // Validate main image if provided
                if (mainImage != null)
                {
                    var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp", "image/jpg" };
                    if (!allowedTypes.Contains(mainImage.ContentType.ToLower()))
                        return BadRequest("Main image must be JPEG, PNG, or WebP format");
                        
                    if (mainImage.Length > 5 * 1024 * 1024)
                        return BadRequest("Main image size must be less than 5MB");
                }

                // Validate additional images if provided
                if (additionalImages != null && additionalImages.Any())
                {
                    if (additionalImages.Count > 10)
                        return BadRequest("Maximum 10 additional images allowed");

                    var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp", "image/jpg" };
                    foreach (var img in additionalImages)
                    {
                        if (!allowedTypes.Contains(img.ContentType.ToLower()))
                            return BadRequest($"Image {img.FileName} must be JPEG, PNG, or WebP format");
                            
                        if (img.Length > 5 * 1024 * 1024)
                            return BadRequest($"Image {img.FileName} size must be less than 5MB");
                    }
                }

                // Create CreateProductDto from form data
                var productDto = new CreateProductDto
                {
                    Name = name,
                    Description = description,
                    Price = price,
                    OriginalPrice = originalPrice,
                    CategoryId = categoryId,
                    StockQuantity = stockQuantity,
                    Origin = origin,
                    Weight = weight,
                    Region = region
                };

                // Create product with images
                var product = await _productService.CreateProductAsync(productDto, mainImage, additionalImages);
                return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    error = "Internal server error", 
                    message = ex.Message,
                    details = ex.InnerException?.Message
                });
            }
        }



        /// <summary>
        /// Update an existing product with JSON data only
        /// For image uploads, use the /api/product-files endpoints or the form-data endpoint below
        /// </summary>
        /// <param name="id">Product ID</param>
        /// <param name="productDto">Updated product data</param>
        /// <returns>Updated product</returns>
        [HttpPut("{id:int}")]
        [ProducesResponseType(typeof(ProductDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto productDto)
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
                
                var product = await _productService.UpdateProductAsync(productDto, null, null);
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

        /// <summary>
        /// Update an existing product with form data including image uploads
        /// This endpoint supports both product data and file uploads in a single request
        /// </summary>
        /// <param name="id">Product ID</param>
        /// <param name="name">Product name</param>
        /// <param name="description">Product description</param>
        /// <param name="price">Product price</param>
        /// <param name="originalPrice">Original price (optional)</param>
        /// <param name="categoryId">Category ID</param>
        /// <param name="stockQuantity">Stock quantity</param>
        /// <param name="origin">Product origin</param>
        /// <param name="weight">Product weight</param>
        /// <param name="region">Product region</param>
        /// <param name="isActive">Is product active</param>
        /// <param name="mainImage">Main product image (optional)</param>
        /// <param name="additionalImages">Additional product images (optional)</param>
        /// <returns>Updated product</returns>
        [HttpPut("{id:int}/with-images")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(typeof(ProductDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        [Authorize]
        public async Task<IActionResult> UpdateWithImages(
            int id,
            [FromForm, Required] string name,
            [FromForm, Required] decimal price,
            [FromForm, Required] int categoryId,
            [FromForm] string? description = null,
            [FromForm] decimal? originalPrice = null,
            [FromForm] int stockQuantity = 0,
            [FromForm] string? origin = null,
            [FromForm] string? weight = null,
            [FromForm] string? region = null,
            [FromForm] bool isActive = true,
            [FromForm] IFormFile? mainImage = null,
            [FromForm] List<IFormFile>? additionalImages = null)
        {
            try
            {
                // Validate input data
                if (string.IsNullOrWhiteSpace(name))
                    return BadRequest("Product name is required");
                    
                if (price <= 0)
                    return BadRequest("Price must be greater than 0");
                    
                if (categoryId <= 0)
                    return BadRequest("Valid category ID is required");

                // Validate main image if provided
                if (mainImage != null)
                {
                    var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp", "image/jpg" };
                    if (!allowedTypes.Contains(mainImage.ContentType.ToLower()))
                        return BadRequest("Main image must be JPEG, PNG, or WebP format");
                        
                    if (mainImage.Length > 5 * 1024 * 1024)
                        return BadRequest("Main image size must be less than 5MB");
                }

                // Validate additional images if provided
                if (additionalImages != null && additionalImages.Any())
                {
                    if (additionalImages.Count > 10)
                        return BadRequest("Maximum 10 additional images allowed");

                    var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp", "image/jpg" };
                    foreach (var img in additionalImages)
                    {
                        if (!allowedTypes.Contains(img.ContentType.ToLower()))
                            return BadRequest($"Image {img.FileName} must be JPEG, PNG, or WebP format");
                            
                        if (img.Length > 5 * 1024 * 1024)
                            return BadRequest($"Image {img.FileName} size must be less than 5MB");
                    }
                }

                // Create UpdateProductDto from form data
                var productDto = new UpdateProductDto
                {
                    Id = id,
                    Name = name,
                    Description = description,
                    Price = price,
                    OriginalPrice = originalPrice,
                    CategoryId = categoryId,
                    StockQuantity = stockQuantity,
                    Origin = origin,
                    Weight = weight,
                    Region = region,
                    IsActive = isActive
                };

                // Update product with images
                var product = await _productService.UpdateProductAsync(productDto, mainImage, additionalImages);
                return Ok(product);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    error = "Internal server error", 
                    message = ex.Message,
                    details = ex.InnerException?.Message
                });
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
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
} 