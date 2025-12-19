using Data.Models;
using Data.SeedData;
using Microsoft.EntityFrameworkCore;
using RentEase.Data.DBContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Data.DbContext
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(DBContext context)
        {

            var jsonPath = Path.Combine(
                AppContext.BaseDirectory,
                "SeedData",
                "products.json"
            );

            if (!File.Exists(jsonPath))
                throw new FileNotFoundException("products.json not found", jsonPath);

            var json = await File.ReadAllTextAsync(jsonPath);
            var seeds = JsonSerializer.Deserialize<List<ProductSeedDto>>(json)!;

            var dbProducts = await context.Products.ToListAsync();
            var dbDict = dbProducts.ToDictionary(p => p.Name);

            foreach (var seed in seeds)
            {
                if (dbDict.TryGetValue(seed.Name, out var existing))
                {
                    existing.Price = seed.Price;
                }
                else
                {
                    context.Products.Add(new Product
                    {
                        Name = seed.Name,
                        Price = seed.Price,
                        ImageUrl = seed.ImageUrl,
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "seed"
                    });
                }
            }
            await context.SaveChangesAsync();
        }
    }

}
