using Microsoft.AspNetCore.Mvc;
using Service.IService;
using Services.Responses.Base;
using Shared;
using Shared.DTOs.Req;
using Shared.DTOs.Res;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController(IOrderService orderService) : Controller
    {
        private readonly IOrderService _orderService = orderService;

        [HttpGet]
        public async Task<IActionResult> Get(int pageNumber = 1, int pageSize = 10, string? sortField = null, string? sortDirection = null, string? searchValue = null)
        {
            PagingVM<GetOrderRes> result = await _orderService.GetOrdersAsync(pageNumber, pageSize, sortField, sortDirection, searchValue);
            return Ok(new BaseResponseModel<PagingVM<GetOrderRes>>(
                           statusCode: StatusCodes.Status200OK,
                           code: ResponseCodeConstants.SUCCESS,
                           data: result,
                           message: null));
        }
        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetById(string orderId)
        {
            GetOrderRes result = await _orderService.GetByIdAsync(orderId);
            return Ok(new BaseResponseModel<GetOrderRes>(
                          statusCode: StatusCodes.Status200OK,
                          code: ResponseCodeConstants.SUCCESS,
                          data: result,
                          message: null));
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] PostOrderReq request)
        {
            var result = await _orderService.PostOrderAsync(request);
            return Ok(new BaseResponseModel<GetOrderRes>(
                           statusCode: StatusCodes.Status200OK,
                           code: ResponseCodeConstants.SUCCESS,
                           data: result,
                           message: "Tạo order thành công"));
        }
    }
}
