using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.IService;
using Services.Responses.Base;
using Shared;
using Shared.DTOs.Res;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController(IProductService productService) : Controller
    {
        private readonly IProductService _productService = productService;

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            List<GetProductRes> result = await _productService.GetProductsAsync();
            return Ok(new BaseResponseModel<List<GetProductRes>>(
                statusCode: StatusCodes.Status200OK,
                code: ResponseCodeConstants.SUCCESS,
                data: result,
                message: null));
        }
    }
}
