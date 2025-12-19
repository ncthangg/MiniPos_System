# POS Backend API

## Tổng quan

Đây là một hệ thống Backend API cho ứng dụng Point of Sale (POS) được xây dựng bằng **ASP.NET Core 8.0**.

## Kiến trúc dự án

Dự án được tổ chức theo mô hình **Clean Architecture** với 4 project chính:

```
POS.BE/
├── API/                    # Presentation Layer - Web API Controllers
├── Service/                # Application Layer - Business Logic & Services  
├── Data/                   # Infrastructure Layer - Database & Repositories
└── Shared/                 # Shared Layer - DTOs, Enums, Constants
```

### Chi tiết các Layer:

#### 🎯 **API Layer** (Presentation)
- **Controllers**: `ProductsController`, `OrdersController`
- **SignalR Hub**: Real-time notifications
- **Dependency Injection**: Cấu hình services và middleware
- **Swagger**: API documentation

#### 🏗️ **Service Layer** (Application)
- **Services**: `ProductService`, `OrderService`
- **Interfaces**: `IProductService`, `IOrderService`
- **SignalR**: Real-time communication service

#### 💾 **Data Layer** (Infrastructure)
- **Models**: `Product`, `Order`, `OrderItem`
- **DbContext**: Entity Framework Core configuration
- **Repositories**: Generic Repository pattern với Unit of Work
- **Migrations**: Database schema management
- **Seed Data**: Dữ liệu mẫu cho sản phẩm

#### 📦 **Shared Layer**
- **DTOs**: Request/Response models
- **Enums**: `OrderStatus`
- **Constants**: Response codes
- **Base Classes**: Common base entities và response models

## Tính năng chính

### 🛍️ **Quản lý Sản phẩm**
- Lấy danh sách tất cả sản phẩm có sẵn
- Hỗ trợ hình ảnh sản phẩm

### 📋 **Quản lý Đơn hàng**
- Tạo đơn hàng mới với nhiều sản phẩm
- Xem danh sách đơn hàng với phân trang
- Tìm kiếm và sắp xếp đơn hàng
- Xem chi tiết đơn hàng
- Validation tổng tiền và số lượng
- Transaction handling đảm bảo tính toàn vẹn dữ liệu

### 🔔 **Real-time Notifications**
- SignalR Hub để thông báo real-time
- Tự động thông báo khi có đơn hàng mới
- Group-based messaging cho các trang khác nhau

## Công nghệ sử dụng

- **Framework**: ASP.NET Core 8.0
- **Database**: SQL Server với Entity Framework Core
- **ORM**: Entity Framework Core
- **Real-time**: SignalR
- **Documentation**: Swagger/OpenAPI
- **Architecture Pattern**: Repository Pattern + Unit of Work
- **Dependency Injection**: Built-in ASP.NET Core DI Container

## Cấu hình Database

### Connection String
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=(local);Initial Catalog=MiniPos;Persist Security Info=True;User ID=sa;Password=12345;TrustServerCertificate=True;Encrypt=false;",
    "Redis": "localhost:6379,abortConnect=false"
  }
}
```

### Database Schema

#### Products Table
- `Id` (string, PK)
- `Name` (string, unique)
- `Price` (decimal)
- `ImageUrl` (string, nullable)
- Base audit fields (CreatedAt, CreatedBy, etc.)

#### Orders Table
- `Id` (string, PK)
- `TotalAmount` (decimal)
- `OrderStatus` (enum: pending, success, fail)
- Base audit fields

#### OrderItems Table
- `Id` (string, PK)
- `OrderId` (string, FK)
- `ProductId` (string, FK)
- `Quantity` (int)
- `UnitPrice` (decimal)

## API Endpoints

### Products API
```http
GET /api/products
```
Lấy danh sách tất cả sản phẩm có sẵn.

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "name": "Cà phê đen",
      "price": 20000,
      "imageUrl": "https://...",
      "createdAt": "2024-01-01T00:00:00Z",
      "createdBy": "seed"
    }
  ],
  "statusCode": 200,
  "code": "SUCCESS"
}
```

### Orders API

#### Lấy danh sách đơn hàng (có phân trang)
```http
GET /api/orders?pageNumber=1&pageSize=10&sortField=CreatedAt&sortDirection=desc&searchValue=
```

#### Lấy chi tiết đơn hàng
```http
GET /api/orders/{orderId}
```

#### Tạo đơn hàng mới
```http
POST /api/orders
Content-Type: application/json

{
  "totalAmount": 65000,
  "totalItem": 3,
  "items": [
    {
      "productId": "product-id-1",
      "quantity": 2
    },
    {
      "productId": "product-id-2", 
      "quantity": 1
    }
  ]
}
```

## SignalR Hub

### Connection
```
/api/notificationHub
```

### Events
- **OrderCreated**: Thông báo khi có đơn hàng mới được tạo
- **JoinGroup/LeaveGroup**: Tham gia/rời khỏi group notifications

### Group Names
- `page:order:list` - Nhận thông báo cho trang danh sách đơn hàng
- `detail:order:{orderId}` - Nhận thông báo cho trang chi tiết đơn hàng

## Cài đặt và Chạy dự án

### Yêu cầu hệ thống
- .NET 8.0 SDK
- SQL Server
- Visual Studio 2022 hoặc VS Code

### Seed Data

Hệ thống tự động seed dữ liệu mẫu cho sản phẩm khi khởi động, bao gồm:
- Dữ liệu từ file product.json
- Hình ảnh từ Unsplash


### Các bước cài đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd POS.BE
```

2. **Restore packages**
```bash
dotnet restore
```

3. **Cập nhật Connection String**
   - Mở `API/appsettings.json`
   - Cập nhật `DefaultConnection` với thông tin SQL Server của bạn

4. **Chạy Migration**
```bash
cd Data
dotnet ef database update
```

5. **Chạy ứng dụng**
```bash
cd API
dotnet run
```

6. **Truy cập Swagger UI**
   - Mở browser và truy cập: `https://localhost:7xxx/swagger`
   - Hoặc `http://localhost:5xxx/swagger`
