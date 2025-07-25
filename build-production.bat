# Build script for production deployment
# Run this script before deploying to production

echo "🚀 Building QueFarm Application for Production..."

# Build frontend
echo "📦 Building frontend..."
cd quefarm.client
npm ci
npm run build
cd ..

# Build backend  
echo "🔨 Building backend..."
cd QueFarm.Server
dotnet publish -c Release -o ../publish
cd ..

echo "✅ Build completed successfully!"
echo "📁 Output directory: ./publish"
echo ""
echo "📋 Next steps:"
echo "1. Copy the 'publish' folder to your production server"
echo "2. Configure appsettings.Production.json with your production database"
echo "3. Ensure .NET 9.0 Runtime is installed on the server"
echo "4. Set ASPNETCORE_ENVIRONMENT=Production"
