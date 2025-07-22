using AutoMapper;
using QueFarm.Server.Core.Domain.Entities;
using QueFarm.Server.Core.DTOs;

namespace QueFarm.Server.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Product mappings
            CreateMap<Product, ProductDto>();
            CreateMap<CreateProductDto, Product>();
            CreateMap<UpdateProductDto, Product>();
            
            // Add more mappings for other entities as needed
        }
    }
} 