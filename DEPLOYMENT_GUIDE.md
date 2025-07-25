# 🚀 Hướng dẫn Deploy QueFarm Application

## 📋 Tổng quan
Dự án QueFarm bao gồm:
- **Backend**: ASP.NET Core 9.0 API Server  
- **Frontend**: React + Vite client
- **Database**: SQL Server
- **Architecture**: SPA (Single Page Application)

---

## 🛠️ Các bước chuẩn bị Deploy

### 1. Chuẩn bị Environment Variables

#### Backend (QueFarm.Server)
Tạo file `appsettings.Production.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Your-Production-SQL-Server-Connection-String"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-production-key-with-at-least-32-characters",
    "Issuer": "QueFarm",
    "Audience": "QueFarmUsers", 
    "ExpirationInMinutes": 60
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "your-domain.com"
}
```

#### Frontend (quefarm.client)
Tạo file `.env.production`:

```bash
VITE_API_BASE_URL=https://your-api-domain.com
```

### 2. Cấu hình Database
```sql
-- Tạo database trên production server
CREATE DATABASE QueFarmDb;

-- Chạy migrations
dotnet ef database update --project QueFarm.Server
```

---

## 🌐 Phương pháp Deploy

## Phương pháp 1: Deploy lên IIS (Windows Server)

### Bước 1: Build ứng dụng
```bash
# Build client 
cd quefarm.client
npm run build

# Build server
cd ../QueFarm.Server  
dotnet publish -c Release -o ./publish
```

### Bước 2: Cấu hình IIS
1. Cài đặt **ASP.NET Core Runtime** trên server
2. Tạo Application Pool với .NET CLR Version = **No Managed Code**
3. Deploy thư mục `publish` lên IIS
4. Cấu hình Static Files để serve React build

### Bước 3: Cấu hình web.config
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
    </handlers>
    <aspNetCore processPath="dotnet" arguments=".\QueFarm.Server.dll" stdoutLogEnabled="false" />
  </system.webServer>
</configuration>
```

---

## Phương pháp 2: Deploy lên Azure App Service

### Bước 1: Tạo Azure Resources
```bash
# Azure CLI commands
az group create --name QueFarmResourceGroup --location "Southeast Asia"
az appservice plan create --name QueFarmPlan --resource-group QueFarmResourceGroup --sku B1
az webapp create --name QueFarmApp --resource-group QueFarmResourceGroup --plan QueFarmPlan
az sql server create --name quefarmserver --resource-group QueFarmResourceGroup --admin-user sqladmin --admin-password YourPassword123!
az sql db create --name QueFarmDb --server quefarmserver --resource-group QueFarmResourceGroup
```

### Bước 2: Deploy từ Visual Studio
1. Right-click **QueFarm.Server** project → **Publish**
2. Chọn **Azure App Service**
3. Cấu hình Connection String trong Azure Portal
4. Set Environment = **Production**

### Bước 3: Cấu hình Azure App Settings
```bash
# Application Settings
ASPNETCORE_ENVIRONMENT=Production
WEBSITE_NODE_DEFAULT_VERSION=18.17.0

# Connection Strings
DefaultConnection=Server=tcp:quefarmserver.database.windows.net,1433;Database=QueFarmDb;User ID=sqladmin;Password=YourPassword123!;
```

---

## Phương pháp 3: Deploy với Docker

### Bước 1: Tạo Dockerfile cho Backend
```dockerfile
# QueFarm.Server/Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["QueFarm.Server/QueFarm.Server.csproj", "QueFarm.Server/"]
COPY ["quefarm.client/quefarm.client.esproj", "quefarm.client/"]
RUN dotnet restore "QueFarm.Server/QueFarm.Server.csproj"

# Install Node.js for building client
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs

COPY . .
WORKDIR "/src/QueFarm.Server"
RUN dotnet build "QueFarm.Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "QueFarm.Server.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "QueFarm.Server.dll"]
```

### Bước 2: Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  quefarm-api:
    build: .
    ports:
      - "8080:80"
      - "8443:443"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Server=sqlserver;Database=QueFarmDb;User Id=sa;Password=YourPassword123!;
    depends_on:
      - sqlserver
      
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourPassword123!
    ports:
      - "1433:1433"
    volumes:
      - sqlserver_data:/var/opt/mssql

volumes:
  sqlserver_data:
```

### Bước 3: Deploy Docker
```bash
# Build và chạy
docker-compose up -d

# Hoặc build riêng
docker build -t quefarm-app .
docker run -p 8080:80 quefarm-app
```

---

## Phương pháp 4: Deploy lên Vercel (Frontend) + Railway/Heroku (Backend)

### Frontend lên Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd quefarm.client
vercel --prod

# Cấu hình environment variables trong Vercel dashboard
VITE_API_BASE_URL=https://your-backend-url.com
```

### Backend lên Railway
```bash
# Install Railway CLI  
npm i -g @railway/cli

# Login và deploy
railway login
railway link
railway up
```

---

## 🔧 Cấu hình bổ sung cho Production

### 1. CORS Configuration
```csharp
// Program.cs
app.UseCors(options =>
{
    options.WithOrigins("https://your-frontend-domain.com")
           .AllowAnyMethod()
           .AllowAnyHeader()
           .AllowCredentials();
});
```

### 2. HTTPS Redirection
```csharp
// Program.cs - Đã có sẵn
app.UseHttpsRedirection();
```

### 3. Static Files cho SPA
```csharp
// Program.cs
app.UseStaticFiles();
app.UseSpaStaticFiles();

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "../quefarm.client";
    if (!app.Environment.IsDevelopment())
    {
        spa.UseStaticFiles();
    }
});
```

---

## 📊 Checklist trước khi Deploy

### Backend Checklist
- [ ] Cấu hình `appsettings.Production.json`
- [ ] Connection string production database
- [ ] JWT secret key mạnh
- [ ] Logging level phù hợp 
- [ ] CORS configuration
- [ ] Database migrations đã chạy
- [ ] Static files configuration

### Frontend Checklist  
- [ ] Cấu hình `.env.production`
- [ ] API base URL production
- [ ] Build thành công (`npm run build`)
- [ ] Test routing trên production
- [ ] Images và assets paths đúng

### Database Checklist
- [ ] SQL Server instance running
- [ ] Database created
- [ ] Migrations applied
- [ ] Connection string accessible
- [ ] Firewall rules configured

### Security Checklist
- [ ] HTTPS enabled
- [ ] Strong JWT secret
- [ ] Database credentials secure  
- [ ] CORS properly configured
- [ ] Environment variables not exposed

---

## 🚨 Troubleshooting

### Lỗi thường gặp:

**1. 500 Internal Server Error**
- Kiểm tra connection string database
- Xem logs trong Event Viewer hoặc console
- Đảm bảo appsettings.Production.json tồn tại

**2. 404 Not Found cho React routes**
- Cấu hình URL Rewrite cho SPA
- Đảm bảo UseStaticFiles() và UseSpa() được cấu hình đúng

**3. CORS errors**
- Cấu hình CORS với domain frontend chính xác
- Kiểm tra AllowCredentials nếu cần cookies

**4. Database connection fails**
- Kiểm tra firewall SQL Server
- Xác nhận connection string
- Test connection từ server

**5. Images không load**
- Kiểm tra VITE_API_BASE_URL
- Đảm bảo static files middleware hoạt động
- Verify image paths

---

## 📞 Hỗ trợ

Nếu gặp vấn đề trong quá trình deploy, hãy kiểm tra:
1. **Logs**: Application logs, IIS logs, Docker logs
2. **Network**: Firewall, security groups, DNS
3. **Configuration**: Environment variables, connection strings
4. **Dependencies**: Runtime versions, packages

---

*Tài liệu này được tạo cho dự án QueFarm - Ứng dụng Đặc sản Vùng Miền*
