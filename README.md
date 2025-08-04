# 🌾 QueFarm - Farm Management System

A modern web application for farm management built with React.js frontend and ASP.NET Core backend.

## 🏗️ Architecture

- **Frontend**: React.js with Vite
- **Backend**: ASP.NET Core 9.0 Web API
- **Database**: SQL Server 2022
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt
- **Domain**: https://quefarm.page

## 🚀 Quick Start

### Prerequisites

- Docker Desktop
- Node.js 20+
- .NET 9.0 SDK
- Git

### Local Development

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd QueFarm
   ```

2. **Start Database**
   ```bash
   docker run -d --name quefarm-sqlserver \
     -e ACCEPT_EULA=Y \
     -e SA_PASSWORD=QueFarm123! \
     -p 1433:1433 \
     mcr.microsoft.com/mssql/server:2022-latest
   ```

3. **Install Dependencies**
   ```bash
   # Frontend
   cd quefarm.client
   npm install
   cd ..
   
   # Backend
   dotnet restore QueFarm.Server/QueFarm.Server.csproj
   ```

4. **Run Application**
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

### Production Deployment

For complete production deployment instructions, see [FINAL_DEPLOYMENT_GUIDE.md](FINAL_DEPLOYMENT_GUIDE.md).

## 📁 Project Structure

```
QueFarm/
├── 🐳 Dockerfile                    # Backend container
├── 🐳 docker-compose.yml           # Production orchestration
├── 📖 FINAL_DEPLOYMENT_GUIDE.md    # Complete deployment guide
├── 🌐 nginx-quefarm-final.conf     # Nginx configuration
├── ⚙️ QueFarm.Server/              # Backend .NET API
├── 🎨 quefarm.client/              # Frontend React app
└── 📋 QueFarm.sln                  # Solution file
```

## 🔐 Security Features

- ✅ JWT Authentication with secure keys
- ✅ CORS policy restricted to specific domains
- ✅ SSL/TLS encryption
- ✅ Firewall configuration
- ✅ Database security with strong passwords
- ✅ Swagger disabled in production

## 📊 Database

- **SQL Server 2022** with secure configuration
- **Connection String**: `Server=sqlserver;Database=QueFarmDb;User Id=sa;Password=<secure-password>;TrustServerCertificate=true;`
- **Migrations**: Entity Framework Core with automatic migrations

## 🎯 Features

- **Product Management**: CRUD operations for farm products
- **Image Upload**: Product image handling with fallback
- **Admin Panel**: Secure admin interface
- **Responsive Design**: Mobile-friendly UI
- **Real-time Updates**: Live data synchronization

## 🔧 Configuration

### Environment Variables

```bash
# Database
ConnectionStrings__DefaultConnection=Server=sqlserver;Database=QueFarmDb;User Id=sa;Password=<password>;TrustServerCertificate=true;

# JWT Settings
JwtSettings__SecretKey=<256-bit-key>
JwtSettings__Issuer=QueFarm
JwtSettings__Audience=QueFarmUsers
JwtSettings__ExpirationInMinutes=30

# Environment
ASPNETCORE_ENVIRONMENT=Production
```

### Admin Account

- **Username**: admin
- **Password**: admin123
- **⚠️ Note**: Implement BCrypt password hashing for production

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Wait 60 seconds for SQL Server startup
   - Check password in configuration
   - Verify container network

2. **Image Upload Issues**
   - Check Nginx proxy configuration
   - Verify upload directory permissions
   - Check API image handling

3. **502 Bad Gateway**
   - Check if API container is running
   - Verify Nginx proxy configuration
   - Check port 8080 accessibility

For detailed troubleshooting, see [FINAL_DEPLOYMENT_GUIDE.md](FINAL_DEPLOYMENT_GUIDE.md).

## 📈 Monitoring

### Health Checks

```bash
# Application health
curl -I https://quefarm.page/api/products

# Container status
docker-compose ps

# Database logs
docker-compose logs sqlserver
```

### Backup

```bash
# Manual database backup
docker exec quefarm-sqlserver-1 /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P '<password>' \
  -Q "BACKUP DATABASE QueFarmDb TO DISK = '/var/opt/mssql/backup/QueFarmDb_$(date +%Y%m%d_%H%M%S).bak'"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For deployment and configuration support, refer to [FINAL_DEPLOYMENT_GUIDE.md](FINAL_DEPLOYMENT_GUIDE.md).

---

**🚀 QueFarm - Modern Farm Management System** 