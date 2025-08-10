using QueFarm.Server.Core.DTOs;

namespace QueFarm.Server.Core.Services
{
    public interface IOrderService
    {
        Task<PriceCartResponse> PriceCartAsync(PriceCartRequest request);
        Task<int> CreateOrderAsync(CreateOrderRequest request);
        Task<PagedOrderResultDto> GetOrdersAsync(int pageNumber, int pageSize, string? status, string? search);
        Task<OrderDetailDto?> GetOrderByIdAsync(int id);
        Task<bool> UpdateOrderStatusAsync(int id, string status);
    }
}