using Microsoft.EntityFrameworkCore;
using QueFarm.Server.Core.Domain.Entities;
using QueFarm.Server.Core.DTOs;
using QueFarm.Server.Core.Services;
using QueFarm.Server.Data;
using Microsoft.Extensions.Options;
using System.Net;

namespace QueFarm.Server.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly QueFarmDbContext _db;
        private readonly IEmailService _emailService;
        private readonly EmailSettings _emailSettings;

        public OrderService(QueFarmDbContext db, IEmailService emailService, IOptions<EmailSettings> emailOptions)
        {
            _db = db;
            _emailService = emailService;
            _emailSettings = emailOptions.Value;
        }

        public async Task<PriceCartResponse> PriceCartAsync(PriceCartRequest request)
        {
            var response = new PriceCartResponse
            {
                VoucherCode = request.VoucherCode
            };

            if (request.Items == null || request.Items.Count == 0)
            {
                return response;
            }

            var productIds = request.Items.Select(i => i.ProductId).ToList();
            var products = await _db.Products
                .Where(p => productIds.Contains(p.Id) && p.IsActive)
                .ToListAsync();

            var productMap = products.ToDictionary(p => p.Id);

            foreach (var item in request.Items)
            {
                if (!productMap.TryGetValue(item.ProductId, out var product) || item.Quantity <= 0)
                {
                    continue;
                }

                var unitPrice = product.Price; // current effective price from DB
                var lineTotal = unitPrice * item.Quantity;

                response.Items.Add(new PricedCartItemDto
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    ImageUrl = product.ImageUrl,
                    UnitPrice = unitPrice,
                    OriginalPrice = product.OriginalPrice,
                    DiscountPercentage = product.DiscountPercentage,
                    Quantity = item.Quantity,
                    LineTotal = lineTotal
                });
            }

            response.Subtotal = response.Items.Sum(i => i.LineTotal);

            // Voucher demo: 10% off with code SAVE10
            if (!string.IsNullOrWhiteSpace(request.VoucherCode) && request.VoucherCode.Equals("SAVE10", StringComparison.OrdinalIgnoreCase))
            {
                response.DiscountTotal = Math.Round(response.Subtotal * 0.10m, 2);
                response.Message = "Áp dụng mã SAVE10: giảm 10%";
            }

            // Shipping demo: free over 300k, else 30k
            response.Shipping = response.Subtotal - response.DiscountTotal >= 300_000m ? 0m : 30_000m;

            // Tax demo: included VAT 0% explicit for now
            response.Tax = 0m;

            response.Total = Math.Max(0, response.Subtotal - response.DiscountTotal) + response.Shipping + response.Tax;
            return response;
        }

        public async Task<int> CreateOrderAsync(CreateOrderRequest request)
        {
            // Re-price server-side to ensure integrity
            var pricing = await PriceCartAsync(new PriceCartRequest
            {
                Items = request.OrderItems,
                VoucherCode = request.VoucherCode
            });

            if (pricing.Items.Count == 0)
            {
                throw new InvalidOperationException("Giỏ hàng trống hoặc không hợp lệ");
            }

            var order = new Order
            {
                CustomerName = request.CustomerName,
                Phone = request.Phone,
                Address = request.Address,
                Email = request.Email,
                Notes = request.Notes,
                Status = "Pending",
                OrderDate = DateTime.UtcNow,
                TotalAmount = pricing.Total
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            var orderItems = pricing.Items.Select(i => new OrderItem
            {
                OrderId = order.Id,
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                ImageUrl = i.ImageUrl,
                Price = i.UnitPrice,
                Quantity = i.Quantity,
                Subtotal = i.LineTotal
            }).ToList();

            _db.OrderItems.AddRange(orderItems);
            await _db.SaveChangesAsync();

            try
            {
                var adminEmail = string.IsNullOrWhiteSpace(_emailSettings.ToAdmin) ? "quefarmfood@gmail.com" : _emailSettings.ToAdmin;
                var subject = $"[QueFarm] Đơn hàng mới #{order.Id} - {order.CustomerName}";
                var itemsRows = string.Join("", orderItems.Select(i => $"<tr><td style='padding:6px 8px;border:1px solid #ddd'>{WebUtility.HtmlEncode(i.ProductName)}</td><td style='padding:6px 8px;border:1px solid #ddd;text-align:right'>{i.Quantity}</td><td style='padding:6px 8px;border:1px solid #ddd;text-align:right'>{i.Price:N0}</td><td style='padding:6px 8px;border:1px solid #ddd;text-align:right'>{i.Subtotal:N0}</td></tr>"));
                var body = $@"<div style='font-family:Arial,Helvetica,sans-serif'>
                    <h2>Đơn hàng mới #{order.Id}</h2>
                    <p><strong>Khách hàng:</strong> {WebUtility.HtmlEncode(order.CustomerName)}</p>
                    <p><strong>SĐT:</strong> {WebUtility.HtmlEncode(order.Phone)}</p>
                    <p><strong>Địa chỉ:</strong> {WebUtility.HtmlEncode(order.Address)}</p>
                    {(string.IsNullOrWhiteSpace(order.Email) ? string.Empty : $"<p><strong>Email:</strong> {WebUtility.HtmlEncode(order.Email)}</p>")}
                    {(string.IsNullOrWhiteSpace(order.Notes) ? string.Empty : $"<p><strong>Ghi chú:</strong> {WebUtility.HtmlEncode(order.Notes!)}</p>")}
                    <p><strong>Thời gian:</strong> {order.OrderDate:yyyy-MM-dd HH:mm:ss} UTC</p>
                    <table style='border-collapse:collapse;margin-top:12px'>
                        <thead>
                            <tr>
                                <th style='padding:6px 8px;border:1px solid #ddd;text-align:left'>Sản phẩm</th>
                                <th style='padding:6px 8px;border:1px solid #ddd;text-align:right'>SL</th>
                                <th style='padding:6px 8px;border:1px solid #ddd;text-align:right'>Đơn giá</th>
                                <th style='padding:6px 8px;border:1px solid #ddd;text-align:right'>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>{itemsRows}</tbody>
                        <tfoot>
                            <tr>
                                <td colspan='3' style='padding:6px 8px;border:1px solid #ddd;text-align:right'><strong>Tổng cộng</strong></td>
                                <td style='padding:6px 8px;border:1px solid #ddd;text-align:right'><strong>{pricing.Total:N0}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>";
                
                await _emailService.SendAsync(adminEmail, subject, body);
            }
            catch (Exception ex)
            {
                // Log error but don't block order creation
                Console.WriteLine($"[EmailError] Failed to send order notification: {ex.Message}");
            }

            return order.Id;
        }

        public async Task<PagedOrderResultDto> GetOrdersAsync(int pageNumber, int pageSize, string? status, string? search)
        {
            var query = _db.Orders.AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(o => o.Status == status);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim();
                query = query.Where(o => o.CustomerName.Contains(s) || o.Phone.Contains(s));
            }

            var totalItems = await query.CountAsync();
            var orders = await query
                .OrderByDescending(o => o.OrderDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new OrderSummaryDto
                {
                    Id = o.Id,
                    CustomerName = o.CustomerName,
                    Phone = o.Phone,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    OrderDate = o.OrderDate,
                    ItemsCount = o.OrderItems.Count
                })
                .ToListAsync();

            return new PagedOrderResultDto
            {
                Orders = orders,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<OrderDetailDto?> GetOrderByIdAsync(int id)
        {
            var order = await _db.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return null;

            return new OrderDetailDto
            {
                Id = order.Id,
                CustomerName = order.CustomerName,
                Phone = order.Phone,
                Email = order.Email,
                Address = order.Address,
                Notes = order.Notes,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                OrderDate = order.OrderDate,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductName = oi.ProductName,
                    ImageUrl = oi.ImageUrl,
                    Price = oi.Price,
                    Quantity = oi.Quantity,
                    Subtotal = oi.Subtotal
                }).ToList()
            };
        }

        private static readonly string[] AllowedStatuses = new[] { "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled" };

        private static bool IsTransitionAllowed(string oldStatus, string newStatus)
        {
            if (!AllowedStatuses.Contains(newStatus)) return false;
            if (oldStatus == newStatus) return false;

            // Simple workflow: Pending -> Confirmed -> Shipped -> Delivered
            // Cancelled only allowed from Pending or Confirmed
            return (oldStatus, newStatus) switch
            {
                ("Pending", "Confirmed") => true,
                ("Confirmed", "Shipped") => true,
                ("Shipped", "Delivered") => true,
                ("Pending", "Cancelled") => true,
                ("Confirmed", "Cancelled") => true,
                _ => false
            };
        }

        public async Task<bool> UpdateOrderStatusAsync(int id, string status)
        {
            var order = await _db.Orders.FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return false;
            var old = order.Status;
            if (!IsTransitionAllowed(old, status))
            {
                return false;
            }
            order.Status = status;
            await _db.SaveChangesAsync();
            return true;
        }
    }
} 