using Microsoft.EntityFrameworkCore;
using InvestmentPortfolio.API.Data;
using InvestmentPortfolio.API.Repositories;
using InvestmentPortfolio.API.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add CORS service
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// Add services to the container.
builder.Services.AddControllers(); // Registers services needed for MVC controllers so your API endpoints defined in controller classes will work
builder.Services.AddEndpointsApiExplorer(); // Adds services that generate API documentation metadata, which helps tools like Swagger understand your API structure
builder.Services.AddSwaggerGen();

// Add Auth0 Authentication and Authorization
builder.Services.AddAuth0Authentication(builder.Configuration);

// Add DbContext Service
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Repositories
builder.Services.AddScoped<IPortfolioRepository, PortfolioRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp"); // Applies the CORS policy we defined earlier, allowing your React frontend to make requests to this backend 

app.UseAuthentication(); // Authentication Must be called before authorization in the pipeline

app.UseAuthorization(); // Enables authorization checks on endpoints that require authorization, even if you're not using it yet

app.MapControllers(); // Connects your controller classes to the routing system so HTTP requests get directed to the right controller methods

app.Run();