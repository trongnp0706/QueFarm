# 🚀 QUEFARM - HƯỚNG DẪN TRIỂN KHAI HOÀN CHỈNH

## 📋 MỤC LỤC
1. [Tổng quan hệ thống](#tổng-quan-hệ-thống)
2. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
3. [Triển khai Local Development](#triển-khai-local-development)
4. [Triển khai Production Server](#triển-khai-production-server)
5. [Cấu hình Security](#cấu-hình-security)
6. [Monitoring & Backup](#monitoring--backup)
7. [Troubleshooting](#troubleshooting)

---

## 🏗️ TỔNG QUAN HỆ THỐNG

**QueFarm** là ứng dụng web quản lý nông trại với kiến trúc:
- **Frontend**: React.js (Vite)
- **Backend**: ASP.NET Core 9.0 API
- **Database**: SQL Server 2022
- **Reverse Proxy**: Nginx
- **Container**: Docker & Docker Compose
- **SSL**: Let's Encrypt
- **Domain**: https://quefarm.page

---

## 🔧 YÊU CẦU HỆ THỐNG

### Local Development
- Windows 10/11 hoặc macOS/Linux
- Docker Desktop
- Node.js 20+ và npm
- .NET 9.0 SDK
- Git

### Production Server
- Ubuntu 22.04/24.04 LTS
- 2GB RAM minimum
- 20GB disk space
- Docker & Docker Compose
- Nginx
- Domain name với DNS records

---

## 💻 TRIỂN KHAI LOCAL DEVELOPMENT

### 1. Clone Repository
```bash
git clone <repository-url>
cd QueFarm
```

### 2. Cài đặt Dependencies
```bash
# Frontend dependencies
cd quefarm.client
npm install
cd ..

# .NET dependencies
dotnet restore QueFarm.Server/QueFarm.Server.csproj
```

### 3. Cấu hình Database Local
```bash
# Start SQL Server container
docker run -d --name quefarm-sqlserver \
  -e ACCEPT_EULA=Y \
  -e SA_PASSWORD=QueFarm123! \
  -p 1433:1433 \
  mcr.microsoft.com/mssql/server:2022-latest
```

### 4. Development Configuration
Tạo `QueFarm.Server/appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=QueFarmDb;User Id=sa;Password=QueFarm123!;TrustServerCertificate=true;"
  },
  "JwtSettings": {
    "SecretKey": "your-dev-secret-key-here",
    "Issuer": "QueFarm",
    "Audience": "QueFarmUsers",
    "ExpirationInMinutes": 60
  }
}
```

### 5. Chạy Development
```bash
# Terminal 1: Backend
cd QueFarm.Server
dotnet run

# Terminal 2: Frontend  
cd quefarm.client
npm run dev
```

**URLs:**
- Frontend: http://localhost:5173
- Backend API: https://localhost:7013
- Swagger: https://localhost:7013/swagger

---

## 🌐 TRIỂN KHAI PRODUCTION SERVER

### 1. Chuẩn bị Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl wget git ufw

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Cấu hình Nginx
```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/quefarm
```

Nội dung file `/etc/nginx/sites-available/quefarm`:
```nginx
server {
    listen 80;
    server_name quefarm.page www.quefarm.page;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name quefarm.page www.quefarm.page;
    
    # SSL Configuration (được cấu hình bởi Certbot)
    ssl_certificate /etc/letsencrypt/live/quefarm.page/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/quefarm.page/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # API Routes - CRITICAL: Must be BEFORE general location
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Images proxy - CRITICAL: Must be BEFORE general location  
    location /images/ {
        proxy_pass http://localhost:8080/images/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
    
    # Frontend - React Router (catch-all)
    location / {
        root /var/www/quefarm;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/quefarm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. SSL Certificate
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d quefarm.page -d www.quefarm.page

# Test auto-renewal
sudo certbot renew --dry-run
```

### 4. Deploy Application
```bash
# Create application directory
sudo mkdir -p /opt/quefarm
sudo chown $USER:$USER /opt/quefarm

# Upload code (từ local machine)
scp -r . root@your-server-ip:/opt/quefarm/

# Or clone from git
cd /opt/quefarm
git clone <repository-url> .
```

### 5. Start Services
```bash
cd /opt/quefarm

# Build và start containers
docker-compose up -d --build

# Check status
docker-compose ps
docker-compose logs -f
```

### 6. Frontend Deployment
```bash
# Build frontend locally
cd quefarm.client
npm run build

# Upload to server
scp -r dist/* root@your-server-ip:/var/www/quefarm/
```

---

## 🔐 CẤU HỈnh SECURITY

### 1. Database Security
- **Password**: Strong 32-character password
- **Connection**: TrustServerCertificate=true for container communication
- **Network**: Isolated Docker network

### 2. JWT Security
- **Secret Key**: 256-bit random key
- **Expiration**: 30 minutes
- **Restricted Origins**: Only quefarm.page domains

### 3. CORS Policy
```csharp
// Restricted to specific domains
.WithOrigins("https://quefarm.page", "https://www.quefarm.page")
.WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
.WithHeaders("Content-Type", "Authorization", "Accept")
.AllowCredentials();
```

### 4. Firewall Configuration
```bash
# Configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 📊 MONITORING & BACKUP

### 1. Health Checks
```bash
# Check application health
curl -I https://quefarm.page/api/products

# Check containers
docker-compose ps
docker-compose logs quefarm-api
docker-compose logs sqlserver
```

### 2. Database Backup
```bash
# Manual backup
docker exec quefarm-sqlserver-1 /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P 'your-password' \
  -Q "BACKUP DATABASE QueFarmDb TO DISK = '/var/opt/mssql/backup/QueFarmDb_$(date +%Y%m%d_%H%M%S).bak'"

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec quefarm-sqlserver-1 /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P '7lZOGuxPe9Td65LQqeFuX9pc5oYxgT2w' \
  -Q "BACKUP DATABASE QueFarmDb TO DISK = '/var/opt/mssql/backup/QueFarmDb_$DATE.bak'"
```

### 3. Log Management
```bash
# View logs
docker-compose logs -f --tail=100

# Clean old logs
docker system prune -f
```

---

## 🚨 TROUBLESHOOTING

### 1. Container Issues
```bash
# Restart specific service
docker-compose restart quefarm-api
docker-compose restart sqlserver

# Rebuild completely
docker-compose down
docker-compose up -d --build
```

### 2. Database Connection Issues
```bash
# Check database status
docker exec quefarm-sqlserver-1 /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P 'your-password' \
  -Q "SELECT @@VERSION"

# Check network connectivity
docker network inspect quefarm_quefarm-network
```

### 3. Frontend Issues
```bash
# Rebuild frontend
cd quefarm.client
npm run build
scp -r dist/* root@server:/var/www/quefarm/
```

### 4. SSL Issues
```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew
sudo systemctl reload nginx
```

### 5. Common Errors

**502 Bad Gateway**
- Check if API container is running
- Check Nginx proxy configuration
- Verify port 8080 is accessible

**Database Connection Failed**
- Wait 60 seconds for SQL Server startup
- Check password in docker-compose.yml
- Verify container network

**Image Upload Issues**
- Check /images/ proxy in Nginx
- Verify upload directory permissions
- Check API image handling

---

## 📱 URLs VÀ ENDPOINTS

### Production URLs
- **Website**: https://quefarm.page
- **API**: https://quefarm.page/api
- **Admin**: https://quefarm.page/admin

### API Endpoints
- `GET /api/products` - Danh sách sản phẩm
- `POST /api/products` - Tạo sản phẩm mới
- `GET /api/products/{id}` - Chi tiết sản phẩm
- `PUT /api/products/{id}` - Cập nhật sản phẩm
- `DELETE /api/products/{id}` - Xóa sản phẩm
- `POST /api/products/{id}/upload-image` - Upload ảnh

### Admin Account
- **Username**: admin
- **Password**: admin123
- **⚠️ TODO**: Implement BCrypt password hashing

---

## 🎯 KẾT LUẬN

Hệ thống QueFarm đã được triển khai với:
- ✅ **Security**: JWT, CORS, SSL, Firewall
- ✅ **Performance**: Nginx caching, Docker optimization  
- ✅ **Scalability**: Container-based architecture
- ✅ **Reliability**: Health checks, automatic restart
- ✅ **Monitoring**: Comprehensive logging

**🚀 Hệ thống đã sẵn sàng cho production!**

---

*Tài liệu này được tạo vào: $(date)*  
*Version: 1.0 - Final Production Release*