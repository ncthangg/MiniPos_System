using Services.Responses.Base;
using Shared.DTOs.Req;
using Shared.DTOs.Res;

namespace Service.IService
{
    public interface IOrderService
    {
        Task<PagingVM<GetOrderRes>> GetOrdersAsync(int pageNumber = 1, int pageSize = 10, string? sortField = null, string? sortDirection = null, string? searchValue = null);
        Task<GetOrderRes> GetByIdAsync(string orderId);
        Task<GetOrderRes> PostOrderAsync(PostOrderReq request);
    }

}
