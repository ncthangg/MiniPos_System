# =========================
# Build stage
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj của API và các project phụ
COPY API/API.csproj API/
COPY Service/*.csproj Service/
COPY Data/*.csproj Data/
COPY Shared/*.csproj Shared/

# Restore đúng project entry point
RUN dotnet restore API/API.csproj

# Copy toàn bộ source
COPY . .

# Publish
RUN dotnet publish API/API.csproj -c Release -o /app/out

# =========================
# Runtime stage
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy thư mục publish ra runtime
COPY --from=build /app/out .

# Cấu hình port và entrypoint
EXPOSE 8080
ENTRYPOINT ["dotnet", "API.dll"]
