using API.SignalR.Hubs;
using Data.DbContext;
using Data.Interfaces;
using Data.Repositories;
using Microsoft.EntityFrameworkCore;
using RentEase.Data.DBContext;
using Service.IService;
using Service.Service;
using Service.SignalR;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace API.DependencyInjection
{
    public static class DependencyInjection
    {

        public static void Add(this IServiceCollection services, IConfiguration configuration)
        {
            services.ConfigSignalR();
            services.ConfigCors();
            services.ConfigRoute();
            services.ConfigController();
            services.ConfigService();
            services.ConfigDbContext(configuration);
            services.ConfigJsonOption();
        }
        public static void ConfigSignalR(this IServiceCollection services)
        {
            services.AddSignalR()
                .AddHubOptions<NotificationHub>(options =>
                {
                    options.EnableDetailedErrors = true;
                })
                .AddJsonProtocol(options =>
                {
                    options.PayloadSerializerOptions.Converters.Add(
                        new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)
                    );
                });
        }
        public static void ConfigCors(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builder =>
                {
                    builder.WithOrigins("https://localhost:5173", "http://localhost:5173", "https://localhost:3000", "http://localhost:3000")
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           .AllowCredentials();
                });
            });
        }
        public static void ConfigRoute(this IServiceCollection services)
        {
            services.Configure<RouteOptions>(options =>
            {
                options.LowercaseUrls = true;
            });
        }
        public static void ConfigController(this IServiceCollection services)
        {
            services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });
        }
        public static void ConfigService(this IServiceCollection services)
        {
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped<ISignalRDispatcherService, SignalRDispatcherService>();
        }
        public static void ConfigDbContext(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<DBContext>(options =>
                                            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"))
                                            );
        }
        public static void ConfigJsonOption(this IServiceCollection services)
        {
            services.AddControllers()
                    .AddJsonOptions(opt =>
                    {
                        opt.JsonSerializerOptions.Converters.Add(
                            new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)
                        );
                    });
        }


    }
}
