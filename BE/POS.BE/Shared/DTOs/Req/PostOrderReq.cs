using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTOs.Req
{
    public class PostOrderReq
    {
        public decimal TotalAmount { get; set; }
        public int TotalItem { get; set; }
        public List<PostOrderItemReq> Items { get; set; } = new();
    }

    public class PostOrderItemReq
    {
        public required string ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
