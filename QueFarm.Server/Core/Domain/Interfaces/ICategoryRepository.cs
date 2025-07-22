using QueFarm.Server.Core.Domain.Entities;

namespace QueFarm.Server.Core.Domain.Interfaces
{
    public interface ICategoryRepository : IRepository<Category>
    {
        Task<Category?> GetBySlugAsync(string slug);
    }
} 