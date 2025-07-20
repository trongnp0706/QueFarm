using AutoMapper;
using QueFarm.Server.Core.Domain.Entities;
using QueFarm.Server.Core.Domain.Interfaces;
using QueFarm.Server.Core.DTOs;
using QueFarm.Server.Core.Services;

namespace QueFarm.Server.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public ProductService(
            IProductRepository productRepository,
            ICategoryRepository categoryRepository,
            IMapper mapper)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<ProductDto> CreateProductAsync(CreateProductDto productDto)
        {
            var product = _mapper.Map<Product>(productDto);
            
            // Calculate discount if original price is provided
            if (productDto.OriginalPrice.HasValue && productDto.OriginalPrice > 0)
            {
                var discount = (int)Math.Round((1 - (productDto.Price / productDto.OriginalPrice.Value)) * 100);
                product.DiscountPercentage = discount > 0 ? discount : null;
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
            if (product != null)
            {
                await _productRepository.DeleteAsync(product);
                await _productRepository.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _productRepository.GetAllAsync();
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

        public async Task<ProductDto> UpdateProductAsync(UpdateProductDto productDto)
        {
            var product = await _productRepository.GetByIdAsync(productDto.Id);
            if (product == null)
                throw new KeyNotFoundException($"Product with id {productDto.Id} not found");

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
    }
} 