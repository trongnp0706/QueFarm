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
            
            // UpdateProductDto to Product mapping - EXCLUDE images to prevent overwriting
            CreateMap<UpdateProductDto, Product>()
                .ForMember(dest => dest.ImageUrl, opt => opt.Ignore())
                .ForMember(dest => dest.AdditionalImages, opt => opt.Ignore());
            
            // Add more mappings for other entities as needed
        }
    }
} 