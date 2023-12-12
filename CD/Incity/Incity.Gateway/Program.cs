using Incity.Gateway.Extensions;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsAllowed", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddOcelot();

builder.Services.ConfigureJwt(builder.Configuration);

var app = builder.Build();

app.UseCors("CorsAllowed");
await app.UseOcelot();

app.Run();
