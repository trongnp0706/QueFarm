namespace QueFarm.Server.Core.DTOs
{
    public class CartItemRequestDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class PriceCartRequest
    {
        public List<CartItemRequestDto> Items { get; set; } = new();
        public string? VoucherCode { get; set; }
    }

    public class PricedCartItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal? OriginalPrice { get; set; }
        public int? DiscountPercentage { get; set; }
        public int Quantity { get; set; }
        public decimal LineTotal { get; set; }
    }

    public class PriceCartResponse
    {
        public List<PricedCartItemDto> Items { get; set; } = new();
        public decimal Subtotal { get; set; }
        public decimal DiscountTotal { get; set; }
        public decimal Shipping { get; set; }
        public decimal Tax { get; set; }
        public decimal Total { get; set; }
        public string? VoucherCode { get; set; }
        public string? Message { get; set; }
    }

    public class CreateOrderRequest
    {
        public string CustomerName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Notes { get; set; }
        public string? VoucherCode { get; set; }
        public List<CartItemRequestDto> OrderItems { get; set; } = new();
    }

    public class OrderSummaryDto
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public int ItemsCount { get; set; }
    }

    public class OrderItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal { get; set; }
    }

    public class OrderDetailDto
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string Address { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public List<OrderItemDto> OrderItems { get; set; } = new();
    }

    public class PagedOrderResultDto
    {
        public List<OrderSummaryDto> Orders { get; set; } = new();
        public int TotalItems { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling(TotalItems / (double)PageSize);
    }

    public class UpdateOrderStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }
}

