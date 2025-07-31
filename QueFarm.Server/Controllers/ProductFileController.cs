using Microsoft.AspNetCore.Mvc;
using QueFarm.Server.Core.Services;
using QueFarm.Server.Core.DTOs;
using System.Linq;

namespace QueFarm.Server.Controllers
{
    /// <summary>
    /// Dedicated controller for product file upload operations
    /// Provides clean multipart/form-data endpoints separate from main Product API
    /// </summary>
    [ApiController]
    [Route("api/product-files")]
    [Consumes("multipart/form-data")]
    [Tags("Product File Management")]
    public class ProductFileController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ILogger<ProductFileController> _logger;

        public ProductFileController(IProductService productService, ILogger<ProductFileController> logger)
        {
            _productService = productService;
            _logger = logger;
        }

        /// <summary>
        /// Upload or update the main image for a product
        /// </summary>
        /// <param name="productId">Product ID</param>
        /// <param name="file">Image file to upload (JPEG, PNG, WebP supported)</param>
        /// <returns>Upload result with image URL</returns>
        [HttpPost("{productId:int}/main-image")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> UploadMainImage(int productId, IFormFile file)
        {
            try
            {
                // Validate file
                if (file == null || file.Length == 0)
                    return BadRequest("No file provided");

                // Validate file type
                var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp", "image/jpg" };
                if (!allowedTypes.Contains(file.ContentType.ToLower()))
                    return BadRequest("Only JPEG, PNG, and WebP images are allowed");

                // Validate file size (max 5MB)
                if (file.Length > 5 * 1024 * 1024)
                    return BadRequest("File size must be less than 5MB");

                // Check if product exists
                var existingProduct = await _productService.GetProductByIdAsync(productId);
                if (existingProduct == null)
                    return NotFound($"Product with ID {productId} not found");

                // Save the image file
                var imageUrl = await _productService.SaveImageAsync(file);
                _logger.LogInformation("Image uploaded successfully for product {ProductId}: {ImageUrl}", productId, imageUrl);
                
                // Update the product with the new image URL
                var product = await _productService.GetProductByIdAsync(productId);
                if (product != null)
                {
                    // Create an update DTO to save the new image URL to database
                    var updateDto = new UpdateProductDto 
                    {
                        Id = productId,
                        Name = product.Name,
                        Description = product.Description,
                        Price = product.Price,
                        OriginalPrice = product.OriginalPrice,
                        CategoryId = product.CategoryId,
                        StockQuantity = product.StockQuantity,
                        Origin = product.Origin,
                        Weight = product.Weight,
                        Region = product.Region,
                        IsActive = product.IsActive,
                        ImageUrl = imageUrl // Set the new image URL
                    };
                    
                    await _productService.UpdateProductAsync(updateDto, null, null);
                    _logger.LogInformation("Product {ProductId} updated with new main image", productId);
                }
                
                return Ok(new { 
                    success = true,
                    imageUrl = imageUrl,
                    productId = productId,
                    fileName = file.FileName,
                    fileSize = file.Length,
                    contentType = file.ContentType
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading main image for product {ProductId}", productId);
                return StatusCode(500, new { 
                    success = false,
                    error = "Error uploading image",
                    details = ex.Message 
                });
            }
        }

        /// <summary>
        /// Upload multiple additional images for a product
        /// </summary>
        /// <param name="productId">Product ID</param>
        /// <param name="files">Image files to upload (max 10 files, 5MB each)</param>
        /// <returns>Upload results with image URLs</returns>
        [HttpPost("{productId:int}/additional-images")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> UploadAdditionalImages(int productId, [FromForm] UploadFilesRequest request)
        {
            try
            {
                // Validate files
                if (request.Files == null || !request.Files.Any())
                    return BadRequest("No files provided");

                if (request.Files.Count > 10)
                    return BadRequest("Maximum 10 files allowed");

                // Check if product exists
                var existingProduct = await _productService.GetProductByIdAsync(productId);
                if (existingProduct == null)
                    return NotFound($"Product with ID {productId} not found");

                // Validate each file
                var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp", "image/jpg" };
                var validationErrors = new List<string>();

                foreach (var file in request.Files.Select((f, i) => new { File = f, Index = i }))
                {
                    if (file.File.Length == 0)
                        validationErrors.Add($"File {file.Index + 1}: Empty file");
                    else if (!allowedTypes.Contains(file.File.ContentType.ToLower()))
                        validationErrors.Add($"File {file.Index + 1}: Invalid file type ({file.File.ContentType})");
                    else if (file.File.Length > 5 * 1024 * 1024)
                        validationErrors.Add($"File {file.Index + 1}: File size exceeds 5MB");
                }

                if (validationErrors.Any())
                    return BadRequest(new { errors = validationErrors });

                var imageUrls = await _productService.SaveImagesAsync(request.Files);
                _logger.LogInformation("Uploaded {Count} additional images for product {ProductId}", imageUrls.Count, productId);
                
                // Update the product with the new additional images
                var product = await _productService.GetProductByIdAsync(productId);
                if (product != null)
                {
                    // Merge with existing additional images
                    var existingImages = product.AdditionalImages ?? new List<string>();
                    var allAdditionalImages = existingImages.Concat(imageUrls).ToList();
                    
                    // Create an update DTO to save additional images to database
                    var updateDto = new UpdateProductDto 
                    {
                        Id = productId,
                        Name = product.Name,
                        Description = product.Description,
                        Price = product.Price,
                        OriginalPrice = product.OriginalPrice,
                        CategoryId = product.CategoryId,
                        StockQuantity = product.StockQuantity,
                        Origin = product.Origin,
                        Weight = product.Weight,
                        Region = product.Region,
                        IsActive = product.IsActive,
                        ImageUrl = product.ImageUrl,
                        AdditionalImages = allAdditionalImages
                    };
                    
                    await _productService.UpdateProductAsync(updateDto, null, null);
                    _logger.LogInformation("Product {ProductId} updated with {Count} additional images", productId, imageUrls.Count);
                }
                
                return Ok(new { 
                    success = true,
                    productId = productId,
                    uploadedCount = imageUrls.Count,
                    imageUrls = imageUrls,
                    files = request.Files.Select((f, i) => new {
                        index = i,
                        fileName = f.FileName,
                        fileSize = f.Length,
                        contentType = f.ContentType,
                        url = imageUrls.ElementAtOrDefault(i)
                    })
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading additional images for product {ProductId}", productId);
                return StatusCode(500, new { 
                    success = false,
                    error = "Error uploading images",
                    details = ex.Message 
                });
            }
        }

        /// <summary>
        /// Delete a product image by URL
        /// </summary>
        /// <param name="productId">Product ID</param>
        /// <param name="imageUrl">Image URL to delete</param>
        /// <returns>Deletion result</returns>
        [HttpDelete("{productId:int}/image")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> DeleteImage(int productId, [FromQuery] string imageUrl)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(imageUrl))
                    return BadRequest("Image URL is required");

                // Check if product exists
                var existingProduct = await _productService.GetProductByIdAsync(productId);
                if (existingProduct == null)
                    return NotFound($"Product with ID {productId} not found");

                await _productService.DeleteImageAsync(imageUrl);
                
                return Ok(new { 
                    success = true,
                    message = "Image deleted successfully",
                    deletedImageUrl = imageUrl
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false,
                    error = "Error deleting image",
                    details = ex.Message 
                });
            }
        }
    }
}