using Scalar.AspNetCore;

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
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers(); // // Registers services needed for MVC controllers so your API endpoints defined in controller classes will work
builder.Services.AddEndpointsApiExplorer(); // // Adds services that generate API documentation metadata, which helps tools like Swagger understand your API structure

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();

}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

// Use CORS before routing & authorization
app.UseCors("AllowReactApp"); // Applies the CORS policy we defined earlier, allowing your React frontend to make requests to this backend 

app.UseAuthorization(); // Enables authorization checks on endpoints that require authorization, even if you're not using it yet

app.MapControllers(); // Connects your controller classes to the routing system so HTTP requests get directed to the right controller methods

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
