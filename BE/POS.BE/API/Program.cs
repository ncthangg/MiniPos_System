using API.DependencyInjection;
using API.SignalR.Hubs;
using Data.DbContext;
using Data.Interfaces;
using Data.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using RentEase.Data.DBContext;
using Service.IService;
using Service.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Add(builder.Configuration);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DBContext>();
    db.Database.Migrate();
}


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DBContext>();
    await DbInitializer.SeedAsync(db);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");

app.MapHub<NotificationHub>("/api/notificationHub");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
