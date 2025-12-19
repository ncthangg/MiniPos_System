using Services.Responses.Base;

namespace Shared.DTOs.Res
{
    public class GetOrderRes : BaseGetRes
    {
        public decimal TotalAmount { get; set; }
        public int TotalItem { get; set; }
        public OrderStatus OrderStatus { get; set; }
        public List<OrderItemRes>? Items { get; set; }
    }

    public class OrderItemRes : BaseGetRes
    {
        public string Name { get; set; } = string.Empty;
        public int Quantity { get; set; } 
        public decimal UnitPrice { get; set; }
    }
}
