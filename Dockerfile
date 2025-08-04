FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy only backend project file
COPY ["QueFarm.Server/QueFarm.Server.csproj", "QueFarm.Server/"]

# Restore .NET dependencies
RUN dotnet restore "QueFarm.Server/QueFarm.Server.csproj"

# Copy backend source code
COPY QueFarm.Server/ QueFarm.Server/

# Build backend
WORKDIR "/src/QueFarm.Server"
RUN dotnet build "QueFarm.Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "QueFarm.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create directories for uploaded content
RUN mkdir -p /app/wwwroot/images/products

# Set environment for production
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_HTTP_PORTS=80

ENTRYPOINT ["dotnet", "QueFarm.Server.dll"]