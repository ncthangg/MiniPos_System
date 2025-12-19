# Simple POS System

Hệ thống MINI POS:
- POS Screen (Frontend)
- RestfulAPI (BackEnd)
- Realtime Order Screen

## Tech Stack
- Backend: ASP.NET
- Frontend: React
- Realtime: WebSocket / SignalR
- Database: SQL Server
- Docker Desktop

## Cách chạy bằng LOCAL
- Tải project từ github
- Đảm bảo trên máy có VisualCode, VisualStudio và SQLServer
- Cấu hình lại các tham số:
+ BE: appseting.json
++ Cấu hình ConnectionStrings như sau 
    ```"DefaultConnection": "Data Source=(local);Initial Catalog=POS_DB;Persist Security Info=True;User ID=sa;Password=12345;TrustServerCertificate=True;Encrypt=false;"```
+ FE: .env
++ Cấu hình URL của BE như sau ```VITE_API_BASE_URL=https://localhost:8080/api```
- Build lại
+ BE: Chọn Set Startup project là "API", Build Solution -> Run
+ FE:
++ install package: ```npm i```
++ run FE: ```npm run dev```


## Cách chạy bằng DOCKER DESKTOP
- Tải project từ github
- Đảm bảo Docker Desktop đã được cài đặt và chạy
- Cấu hình lại các tham số:
+ BE: appseting.json
++ Cấu hình ConnectionStrings như sau 
    ```"DefaultConnection": "Data Source=sqlserver,1433;Initial Catalog=POS_DB;Persist Security Info=True;User ID=sa;Password=StrongPassword@123;TrustServerCertificate=True;Encrypt=false;"```
+ FE: .env
++ Cấu hình URL của BE như sau ```VITE_API_BASE_URL=http://localhost:8080/api```
+ Nếu cần thay đổi cấu hình database hoặc API URL, chỉnh sửa file docker-compose.yml hoặc file .env tương ứng
- Chạy lệnh để build và khởi động các container
+ Mở terminal trong thư mục project
+ Chạy: ```docker-compose up --build```