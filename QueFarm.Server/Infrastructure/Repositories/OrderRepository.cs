using Microsoft.EntityFrameworkCore;
using QueFarm.Server.Core.Domain.Entities;
using QueFarm.Server.Core.Domain.Interfaces;
using QueFarm.Server.Data;

namespace QueFarm.Server.Infrastructure.Repositories
{
    public class OrderRepository : Repository<Order>, IOrderRepository
    {
        public OrderRepository(QueFarmDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Order>> GetOrdersByEmailAsync(string email)
        {
            return await _dbSet
                .Where(o => o.Email == email)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetOrdersByPhoneAsync(string phone)
        {
            return await _dbSet
                .Where(o => o.Phone == phone)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetOrdersByStatusAsync(string status)
        {
            return await _dbSet
                .Where(o => o.Status == status)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }
    }
} 