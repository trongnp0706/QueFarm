using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QueFarm.Server.Core.DTOs;
using QueFarm.Server.Core.Services;
using QueFarm.Server.Data;
using QueFarm.Server.Core.Domain.Entities;

namespace QueFarm.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly QueFarmDbContext _context;
        private readonly IOrderService _orderService;
        public OrderController(QueFarmDbContext context, IOrderService orderService)
        {
            _context = context;
            _orderService = orderService;
        }

        // POST: api/order/price-cart (khách) - định giá giỏ hàng
        [HttpPost("price-cart")]
        [AllowAnonymous]
        public async Task<ActionResult<PriceCartResponse>> PriceCart([FromBody] PriceCartRequest request)
        {
            var result = await _orderService.PriceCartAsync(request);
            return Ok(result);
        }

        // POST: api/order (khách) - tạo đơn, tính giá server-side
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Create([FromBody] CreateOrderRequest request)
        {
            try
            {
                var orderId = await _orderService.CreateOrderAsync(request);
                var created = await _context.Orders
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.Id == orderId);
                return Ok(created);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET: api/order (admin) - phân trang + lọc
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<PagedOrderResultDto>> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string? status = null, [FromQuery] string? search = null)
        {
            var result = await _orderService.GetOrdersAsync(pageNumber, pageSize, status, search);
            return Ok(result);
        }

        // GET: api/order/{id} (admin)
        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<ActionResult<OrderDetailDto>> GetById(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null) return NotFound();
            return Ok(order);
        }

        // PUT: api/order/{id}/status (admin)
        [HttpPut("{id:int}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Status)) return BadRequest("Trạng thái không hợp lệ");
            var ok = await _orderService.UpdateOrderStatusAsync(id, request.Status);
            if (!ok) return BadRequest("Chuyển trạng thái không hợp lệ hoặc đơn không tồn tại");
            return NoContent();
        }
    }
} 