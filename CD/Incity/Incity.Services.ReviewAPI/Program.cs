using Incity.Services.ReviewAPI.Extensions;
using Incity.Services.ReviewAPI.Middlewares;
using Microsoft.AspNetCore.Builder;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.ConfigureDbContext(builder.Configuration);
builder.Services.ConfigureServices(builder.Configuration);
builder.Services.ConfigureJwt(builder.Configuration);

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseMiddleware<ExceptionsMiddleware>();
}

app.UseOpenApi();
app.UseSwaggerUi3();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
