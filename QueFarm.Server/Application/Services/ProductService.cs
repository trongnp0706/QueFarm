using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using QueFarm.Server.Core.Domain.Entities;
using QueFarm.Server.Core.Domain.Interfaces;
using QueFarm.Server.Core.DTOs;
using QueFarm.Server.Core.Services;
using System.IO;

namespace QueFarm.Server.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private const string PRODUCT_IMAGES_FOLDER = "images/products";

        public ProductService(
            IProductRepository productRepository,
            ICategoryRepository categoryRepository,
            IMapper mapper,
            IWebHostEnvironment webHostEnvironment)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
            _mapper = mapper;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<ProductDto> CreateProductAsync(CreateProductDto productDto, IFormFile? mainImage, List<IFormFile>? additionalImages)
        {
            var product = _mapper.Map<Product>(productDto);
            
            // Calculate discount if original price is provided
            if (productDto.OriginalPrice.HasValue && productDto.OriginalPrice > 0)
            {
                var discount = (int)Math.Round((1 - (productDto.Price / productDto.OriginalPrice.Value)) * 100);
                product.DiscountPercentage = discount > 0 ? discount : null;
            }

            // Handle main image upload
            if (mainImage != null)
            {
                product.ImageUrl = await SaveImageAsync(mainImage);
            }

            // Handle additional images upload
            if (additionalImages != null && additionalImages.Any())
            {
                product.AdditionalImages = await SaveImagesAsync(additionalImages);
            }

            var createdProduct = await _productRepository.AddAsync(product);
            await _productRepository.SaveChangesAsync();

            var result = _mapper.Map<ProductDto>(createdProduct);
            
            // Get category name
            var category = await _categoryRepository.GetByIdAsync(createdProduct.CategoryId);
            if (category != null)
            {
                result.CategoryName = category.Name;
            }

            return result;
        }

        public async Task DeleteProductAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                throw new KeyNotFoundException($"Product with id {id} not found");
                
            // Delete associated images
            if (!string.IsNullOrEmpty(product.ImageUrl))
            {
                await DeleteImageAsync(product.ImageUrl);
            }
            
            if (product.AdditionalImages != null && product.AdditionalImages.Any())
            {
                foreach (var imageUrl in product.AdditionalImages)
                {
                    await DeleteImageAsync(imageUrl);
                }
            }

                await _productRepository.DeleteAsync(product);
                await _productRepository.SaveChangesAsync();
        }

        public async Task<PagedProductResultDto> GetAllProductsAsync(int pageNumber = 1, int pageSize = 10, string? searchTerm = null)
        {
            IEnumerable<Product> products;
            
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                products = await _productRepository.GetAllAsync();
            }
            else
            {
                products = await _productRepository.SearchProductsAsync(searchTerm);
            }

            var totalItems = products.Count();
            
            // Apply pagination
            var pagedProducts = products
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();
            
            var productDtos = _mapper.Map<List<ProductDto>>(pagedProducts);
            
            // Set category names
            foreach (var productDto in productDtos)
            {
                var category = await _categoryRepository.GetByIdAsync(productDto.CategoryId);
                if (category != null)
                {
                    productDto.CategoryName = category.Name;
                }
            }

            return new PagedProductResultDto
            {
                Products = productDtos,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<IEnumerable<ProductDto>> GetFeaturedProductsAsync(int count)
        {
            var products = await _productRepository.GetFeaturedProductsAsync(count);
            var productDtos = _mapper.Map<IEnumerable<ProductDto>>(products);
            
            // Set category names
            foreach (var productDto in productDtos)
            {
                var category = await _categoryRepository.GetByIdAsync(productDto.CategoryId);
                if (category != null)
                {
                    productDto.CategoryName = category.Name;
                }
            }

            return productDtos;
        }

        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                return null;

            var productDto = _mapper.Map<ProductDto>(product);
            
            // Get category name
            var category = await _categoryRepository.GetByIdAsync(product.CategoryId);
            if (category != null)
            {
                productDto.CategoryName = category.Name;
            }

            return productDto;
        }

        public async Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(int categoryId)
        {
            var products = await _productRepository.GetProductsByCategoryAsync(categoryId);
            var productDtos = _mapper.Map<IEnumerable<ProductDto>>(products);
            
            // Get category name
            var category = await _categoryRepository.GetByIdAsync(categoryId);
            if (category != null)
            {
                foreach (var productDto in productDtos)
                {
                    productDto.CategoryName = category.Name;
                }
            }

            return productDtos;
        }

        public async Task<IEnumerable<ProductDto>> GetProductsByCategorySlugAsync(string slug)
        {
            var category = await _categoryRepository.GetBySlugAsync(slug);
            if (category == null)
                return Enumerable.Empty<ProductDto>();

            var products = await _productRepository.GetProductsByCategoryAsync(category.Id);
            var productDtos = _mapper.Map<IEnumerable<ProductDto>>(products);
            
            // Set category name
            foreach (var productDto in productDtos)
            {
                productDto.CategoryName = category.Name;
            }

            return productDtos;
        }

        public async Task<IEnumerable<ProductDto>> SearchProductsAsync(string searchTerm)
        {
            var products = await _productRepository.SearchProductsAsync(searchTerm);
            var productDtos = _mapper.Map<IEnumerable<ProductDto>>(products);
            
            // Set category names
            foreach (var productDto in productDtos)
            {
                var category = await _categoryRepository.GetByIdAsync(productDto.CategoryId);
                if (category != null)
                {
                    productDto.CategoryName = category.Name;
                }
            }

            return productDtos;
        }

        public async Task<ProductDto> UpdateProductAsync(UpdateProductDto productDto, IFormFile? mainImage, List<IFormFile>? additionalImages)
        {
            var product = await _productRepository.GetByIdAsync(productDto.Id);
            if (product == null)
                throw new KeyNotFoundException($"Product with id {productDto.Id} not found");

            var oldMainImage = product.ImageUrl;
            var oldAdditionalImages = product.AdditionalImages?.ToList() ?? new List<string>();

            _mapper.Map(productDto, product);
            product.UpdatedAt = DateTime.UtcNow;

            // Calculate discount if original price is provided
            if (productDto.OriginalPrice.HasValue && productDto.OriginalPrice > 0)
            {
                var discount = (int)Math.Round((1 - (productDto.Price / productDto.OriginalPrice.Value)) * 100);
                product.DiscountPercentage = discount > 0 ? discount : null;
            }
            else
            {
                product.DiscountPercentage = null;
            }

            // Handle main image upload if a new one is provided
            if (mainImage != null)
            {
                // Delete old main image if it exists
                if (!string.IsNullOrEmpty(oldMainImage))
                {
                    await DeleteImageAsync(oldMainImage);
                }
                
                product.ImageUrl = await SaveImageAsync(mainImage);
            }

            // Handle additional images upload if new ones are provided
            if (additionalImages != null && additionalImages.Any())
            {
                // Delete old additional images if they exist
                if (oldAdditionalImages.Any())
                {
                    foreach (var oldImageUrl in oldAdditionalImages)
                    {
                        await DeleteImageAsync(oldImageUrl);
                    }
                }
                
                product.AdditionalImages = await SaveImagesAsync(additionalImages);
            }

            await _productRepository.UpdateAsync(product);
            await _productRepository.SaveChangesAsync();

            var result = _mapper.Map<ProductDto>(product);
            
            // Get category name
            var category = await _categoryRepository.GetByIdAsync(product.CategoryId);
            if (category != null)
            {
                result.CategoryName = category.Name;
            }

            return result;
        }

        public async Task<string> SaveImageAsync(IFormFile image)
        {
            // Ensure the directory exists
            var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, PRODUCT_IMAGES_FOLDER);
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Generate a unique filename
            var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(image.FileName)}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Save the file
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }

            // Return the relative path
            return $"/{PRODUCT_IMAGES_FOLDER}/{uniqueFileName}";
        }

        public async Task<List<string>> SaveImagesAsync(List<IFormFile> images)
        {
            var imageUrls = new List<string>();
            
            foreach (var image in images)
            {
                imageUrls.Add(await SaveImageAsync(image));
            }
            
            return imageUrls;
        }

        public async Task DeleteImageAsync(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl))
                return;

            // Convert relative URL to physical path
            try
            {
                var imagePath = Path.Combine(_webHostEnvironment.WebRootPath, imageUrl.TrimStart('/'));
                if (File.Exists(imagePath))
                {
                    File.Delete(imagePath);
                }
            }
            catch (Exception ex)
            {
                // Log the exception but don't throw - we want to continue even if image deletion fails
                Console.WriteLine($"Error deleting image: {ex.Message}");
            }
            
            await Task.CompletedTask;
        }
    }
} 