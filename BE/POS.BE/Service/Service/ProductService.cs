using Data.Interfaces;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using Service.IService;
using Shared.DTOs.Res;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Service
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<GetProductRes>> GetProductsAsync()
        {
            var items = await _unitOfWork.GetRepository<Product>().Entities
                .Where(p => p.Status == true)
                .Select(p => new GetProductRes
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl
                })
                .ToListAsync();

            return items;
        }
    }
}
