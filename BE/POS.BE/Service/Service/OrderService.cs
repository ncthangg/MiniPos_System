using Data.Interfaces;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using Service.IService;
using Service.SignalR;
using Services.Responses.Base;
using Shared;
using Shared.DTOs.Req;
using Shared.DTOs.Res;
using System.Data;
using System.Linq.Dynamic.Core;

namespace Service.Service
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISignalRDispatcherService _signalRDispatcherService;

        public OrderService(IUnitOfWork unitOfWork, ISignalRDispatcherService signalRDispatcherService)
        {
            _unitOfWork = unitOfWork;
            _signalRDispatcherService = signalRDispatcherService;
        }
        public async Task<PagingVM<GetOrderRes>> GetOrdersAsync(int pageNumber, int pageSize, string? sortField, string? sortDirection, string? searchValue)
        {
            var query = _unitOfWork.GetRepository<Order>().Entities;

            if (!string.IsNullOrWhiteSpace(searchValue))
            {
                searchValue = searchValue.ToLower();
                query = query.Where(b =>
                    (b.Id != null && EF.Functions.Collate(b.Id, "Latin1_General_CI_AI").Contains(searchValue))
                );
            }

            var validSortDirection = sortDirection?.ToLower() == "asc" ? "ascending" : "descending";
            var validSortField = !string.IsNullOrEmpty(sortField) ? sortField : "CreatedAt";
            var sortString = $"{validSortField} {validSortDirection}";

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var result = await query
                .OrderBy(sortString)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new GetOrderRes
                {
                    Id = o.Id,
                    TotalAmount = o.TotalAmount,
                    TotalItem = o.OrderItems.Sum(oi => oi.Quantity),
                    OrderStatus = o.OrderStatus,
                    CreatedAt = o.CreatedAt,
                    CreatedBy = o.CreatedBy
                })
                .ToListAsync();

            return new PagingVM<GetOrderRes>
            {
                List = result,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = totalPages,
                TotalItems = totalItems,
            };
        }
        public async Task<GetOrderRes> GetByIdAsync(string orderId)
        {
            var item = await _unitOfWork.GetRepository<Order>().Entities
                 .Select(o => new GetOrderRes
                 {
                     Id = o.Id,
                     TotalAmount = o.TotalAmount,
                     TotalItem = o.OrderItems.Sum(oi => oi.Quantity),
                     Items = o.OrderItems.Select(oi => new OrderItemRes
                     {
                         Name = oi.Product.Name,
                         Quantity = oi.Quantity,
                         UnitPrice = oi.UnitPrice,
                     }).ToList(),
                     OrderStatus = o.OrderStatus,
                     CreatedAt = o.CreatedAt,
                     CreatedBy = o.CreatedBy,
                 })
                 .FirstOrDefaultAsync(x => x.Id == orderId) 
                 ?? new GetOrderRes();
            return item;
        }
        public async Task<GetOrderRes> PostOrderAsync(PostOrderReq request)
        {
            var _orderRepository = _unitOfWork.GetRepository<Order>();
            var _orderItemRepository = _unitOfWork.GetRepository<OrderItem>(); 
            var _productRepository = _unitOfWork.GetRepository<Product>();

            #region getProduct
            var productIds = request.Items
                        .Select(x => x.ProductId)
                        .Distinct()
                        .ToList();

            var products = await _productRepository.Entities
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync();

            var productDict = products.ToDictionary(p => p.Id);
            #endregion

            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var order = new Order
                {
                    OrderStatus = OrderStatus.success,
                    CreatedAt = DateTime.UtcNow
                };

                await _orderRepository.AddAsync(order);

                var orderItems = request.Items.Select(item =>
                {
                    if (!productDict.TryGetValue(item.ProductId, out var product))
                        throw new Exception($"Sản phẩm với ID: {item.ProductId} không tìm thấy");

                    return new OrderItem
                    {
                        Id = Guid.NewGuid().ToString("N"),
                        OrderId = order.Id,
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price
                    };
                }).ToList();

                var totalQuantity = request.Items.Sum(x => x.Quantity);
                if (totalQuantity != request.TotalItem)
                    throw new Exception("Đơn hàng có sai sót về số lượng! Xin hãy thử lại sau..");

                await _orderItemRepository.AddRangeAsync(orderItems);

                order.TotalAmount = orderItems.Sum(x => x.Quantity * x.UnitPrice);
                
                if(order.TotalAmount != request.TotalAmount)
                    throw new Exception($"Đơn hàng có sai sót về giá! Xin hãy thử lại sau..");

                await _unitOfWork.SaveAsync();
                await _unitOfWork.CommitTransactionAsync();

                var response = new GetOrderRes
                {
                    Id = order.Id,
                    TotalAmount = order.TotalAmount,
                    TotalItem = totalQuantity,
                    OrderStatus = OrderStatus.success,
                    CreatedAt = order.CreatedAt,
                    CreatedBy = order.CreatedBy
                };

                await _signalRDispatcherService.SendToEntityPageAsync("order",
                                                                      "list",
                                                                      "OrderCreated",
                                                                      response);
                return response;
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

    }
}
