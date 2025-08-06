using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Diagnostics;
using System.Text;
using QueFarm.Server.Core.Services;
using QueFarm.Server.Application.Services;
using QueFarm.Server.Core.Domain.Interfaces;
using QueFarm.Server.Infrastructure.Repositories;
using QueFarm.Server.Application.Mappings;
using QueFarm.Server.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "QueFarm API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new()
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme."
    });
    c.AddSecurityRequirement(new()
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
    
    // Configure Swagger for clean documentation
    c.SupportNonNullableReferenceTypes();
    // c.SwaggerGeneratorOptions.DescribeAllParametersInCamelCase = true;
});

// Add DbContext
builder.Services.AddDbContext<QueFarmDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Register repositories
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// Register services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Add CORS - DEVELOPMENT & PRODUCTION POLICIES
builder.Services.AddCors(options =>
{
    // Development Policy
    options.AddPolicy("DevelopmentPolicy", policy =>
    {
        policy
            .WithOrigins("https://localhost:53355", "http://localhost:53355", "https://localhost:3000", "http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .SetPreflightMaxAge(TimeSpan.FromMinutes(30));
    });

    // Production Policy
    options.AddPolicy("ProductionPolicy", policy =>
    {
        policy
            .WithOrigins("https://quefarm.page", "https://www.quefarm.page")
            .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .WithHeaders("Content-Type", "Authorization", "Accept")
            .AllowCredentials()
            .SetPreflightMaxAge(TimeSpan.FromMinutes(30));
    });
});

// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is required")))
    };
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        // Set cache headers for images
        if (ctx.Context.Request.Path.StartsWithSegments("/images"))
        {
            ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=604800"); // 7 days
        }
    }
}); // Serve static files from wwwroot with caching

// Configure the HTTP request pipeline.
// Global exception handler
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        var exceptionHandlerFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
        
        if (exceptionHandlerFeature != null)
        {
            logger.LogError(exceptionHandlerFeature.Error, "An error occurred: {ErrorMessage}", exceptionHandlerFeature.Error.Message);
            
            var response = new { 
                error = "An error occurred while processing your request.",
                details = app.Environment.IsDevelopment() ? exceptionHandlerFeature.Error.Message : null
            };
            
            await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(response));
        }
    });
});

// Enable Swagger only in Development environment - SECURITY FIX
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "QueFarm API V1");
        c.RoutePrefix = "swagger";
        c.DisplayRequestDuration();
        c.EnableTryItOutByDefault();
        c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
        c.DefaultModelsExpandDepth(-1);
    });
}

app.UseHttpsRedirection();

// Use appropriate CORS policy based on environment
if (app.Environment.IsDevelopment())
{
    app.UseCors("DevelopmentPolicy");
}
else
{
    app.UseCors("ProductionPolicy");
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

// Initialize the database with seed data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<QueFarmDbContext>();
        context.Database.Migrate();
        // Initialize database with seed data
        DbInitializer.Initialize(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating or initializing the database.");
    }
}

app.Run();
