using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QueFarm.Server.Data;
using QueFarm.Server.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using System;
using System.Collections.Generic;
using System.Linq;

namespace QueFarm.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly QueFarmDbContext _context;
        public ProductController(QueFarmDbContext context)
        {
            _context = context;
        }

        // GET: api/product
        [HttpGet]
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
            return Ok(products);
        }

        // GET: api/product/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images.OrderBy(img => img.Order))
                .FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        // POST: api/product (Admin)
        [HttpPost]
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
        }

        // DELETE: api/product/{id} (Admin)
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
} 