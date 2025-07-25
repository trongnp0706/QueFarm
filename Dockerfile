FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Install Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Copy project files
COPY ["QueFarm.Server/QueFarm.Server.csproj", "QueFarm.Server/"]
COPY ["quefarm.client/quefarm.client.esproj", "quefarm.client/"]
COPY ["quefarm.client/package*.json", "quefarm.client/"]

# Restore .NET dependencies
RUN dotnet restore "QueFarm.Server/QueFarm.Server.csproj"

# Copy all source code
COPY . .

# Build client first
WORKDIR "/src/quefarm.client"
RUN npm ci
RUN npm run build

# Build server
WORKDIR "/src/QueFarm.Server"
RUN dotnet build "QueFarm.Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "QueFarm.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create directory for uploaded images
RUN mkdir -p /app/wwwroot/images

ENTRYPOINT ["dotnet", "QueFarm.Server.dll"]
