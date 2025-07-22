using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
<<<<<<< HEAD
using Microsoft.EntityFrameworkCore;
using QueFarm.Server.Data;
using QueFarm.Server.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using System;
using System.Collections.Generic;
using System.Linq;
=======
using QueFarm.Server.Core.DTOs;
using QueFarm.Server.Core.Services;
using System.ComponentModel.DataAnnotations;
>>>>>>> dev-base

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
<<<<<<< HEAD
        public async Task<IActionResult> GetAll([FromQuery] int? categoryId)
        {
            IQueryable<Product> query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images.OrderBy(img => img.Order));

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId.Value);
            }

            var products = await query.ToListAsync();
=======
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
>>>>>>> dev-base
            return Ok(products);
        }

        // GET: api/product/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
<<<<<<< HEAD
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images.OrderBy(img => img.Order))
                .FirstOrDefaultAsync(p => p.Id == id);
=======
            var product = await _productService.GetProductByIdAsync(id);
>>>>>>> dev-base
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
<<<<<<< HEAD
        [Authorize]
        public async Task<IActionResult> Create([FromForm] string name, [FromForm] decimal price, [FromForm] string? description, [FromForm] decimal rating, [FromForm] int categoryId, [FromForm] List<IFormFile>? images, [FromForm] List<int>? imageOrders)
        {
            var product = new Product
            {
                Name = name,
                Price = price,
                Description = description,
                Rating = rating,
                CategoryId = categoryId
            };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            if (images != null && images.Count > 0)
            {
                var productFolder = Path.Combine("wwwroot", "images", "products", $"product-{product.Id}");
                if (!Directory.Exists(productFolder))
                    Directory.CreateDirectory(productFolder);
                for (int i = 0; i < images.Count; i++)
                {
                    var image = images[i];
                    var ext = Path.GetExtension(image.FileName);
                    var fileName = $"{Guid.NewGuid()}{ext}";
                    var filePath = Path.Combine(productFolder, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }
                    var order = (imageOrders != null && imageOrders.Count > i) ? imageOrders[i] : i;
                    var imageUrl = $"/images/products/product-{product.Id}/{fileName}";
                    _context.ProductImages.Add(new ProductImage
                    {
                        ProductId = product.Id,
                        ImageUrl = imageUrl,
                        Order = order
                    });
                }
                await _context.SaveChangesAsync();
            }

            // Lấy lại sản phẩm kèm ảnh
            var result = await _context.Products.Include(p => p.Images.OrderBy(img => img.Order)).FirstOrDefaultAsync(p => p.Id == product.Id);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, result);
        }

        // PUT: api/product/{id} (Admin)
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromForm] string name, [FromForm] decimal price, [FromForm] string? description, [FromForm] decimal rating, [FromForm] int categoryId, [FromForm] List<IFormFile>? newImages, [FromForm] List<int>? imageOrders, [FromForm] List<int>? keepImageIds)
        {
            // Fix: đảm bảo không null
            keepImageIds = keepImageIds ?? new List<int>();
            imageOrders = imageOrders ?? new List<int>();
            newImages = newImages ?? new List<IFormFile>();
            var product = await _context.Products.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return NotFound();
            product.Name = name;
            product.Price = price;
            product.Description = description;
            product.Rating = rating;
            product.CategoryId = categoryId;

            // Xóa ảnh không còn giữ lại
            if (keepImageIds != null)
            {
                var toRemove = product.Images.Where(img => !keepImageIds.Contains(img.Id)).ToList();
                foreach (var img in toRemove)
                {
                    var filePath = Path.Combine("wwwroot", img.ImageUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
                    if (System.IO.File.Exists(filePath))
                        System.IO.File.Delete(filePath);
                    _context.ProductImages.Remove(img);
                }
            }

            // Thêm ảnh mới
            var newImageEntities = new List<ProductImage>();
            if (newImages != null && newImages.Count > 0)
            {
                var productFolder = Path.Combine("wwwroot", "images", "products", $"product-{product.Id}");
                if (!Directory.Exists(productFolder))
                    Directory.CreateDirectory(productFolder);
                for (int i = 0; i < newImages.Count; i++)
                {
                    var image = newImages[i];
                    var ext = Path.GetExtension(image.FileName);
                    var fileName = $"{Guid.NewGuid()}{ext}";
                    var filePath = Path.Combine(productFolder, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }
                    var imageUrl = $"/images/products/product-{product.Id}/{fileName}";
                    var imgEntity = new ProductImage
                    {
                        ProductId = product.Id,
                        ImageUrl = imageUrl,
                        Order = 0 // sẽ cập nhật lại bên dưới
                    };
                    _context.ProductImages.Add(imgEntity);
                    newImageEntities.Add(imgEntity);
                }
            }

            await _context.SaveChangesAsync(); // Đảm bảo các ảnh mới có Id

            // Cập nhật lại thứ tự ảnh (cả cũ còn giữ lại và mới)
            if (imageOrders != null)
            {
                // Lấy lại toàn bộ ảnh (cũ còn giữ lại + mới)
                var allImages = _context.ProductImages.Where(img => img.ProductId == product.Id).ToList();
                for (int i = 0; i < imageOrders.Count; i++)
                {
                    // imageOrders[i] là thứ tự, images trên frontend đã đúng thứ tự, nên lấy theo vị trí
                    // Tìm id ảnh tương ứng: keepImageIds + id ảnh mới (theo thứ tự gửi lên)
                    // Để đơn giản, frontend nên gửi id ảnh cũ trước, rồi đến ảnh mới (id=null)
                    if (i < (keepImageIds?.Count ?? 0))
                    {
                        var imgId = keepImageIds[i];
                        var img = allImages.FirstOrDefault(x => x.Id == imgId);
                        if (img != null) img.Order = i;
                    }
                    else if (i - (keepImageIds?.Count ?? 0) < newImageEntities.Count)
                    {
                        var img = newImageEntities[i - (keepImageIds?.Count ?? 0)];
                        img.Order = i;
                    }
                }
            }

            await _context.SaveChangesAsync();
            var result = await _context.Products.Include(p => p.Images.OrderBy(img => img.Order)).FirstOrDefaultAsync(p => p.Id == product.Id);
            return Ok(result);
=======
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
>>>>>>> dev-base
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