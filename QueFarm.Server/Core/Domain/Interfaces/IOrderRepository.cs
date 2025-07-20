using QueFarm.Server.Core.Domain.Entities;

namespace QueFarm.Server.Core.Domain.Interfaces
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<IEnumerable<Order>> GetOrdersByStatusAsync(string status);
        Task<IEnumerable<Order>> GetOrdersByEmailAsync(string email);
        Task<IEnumerable<Order>> GetOrdersByPhoneAsync(string phone);
    }
} 