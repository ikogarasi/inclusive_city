using Incity.Gateway.Extensions;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

internal class Program
{
    public static async Task Main(string[] args)
    {
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

        builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

        builder.Services.AddOcelot();

        builder.Services.ConfigureJwt(builder.Configuration);

        var app = builder.Build();

        app.UseCors("CorsAllowed");
        await app.UseOcelot();

        app.Run();
    }
}