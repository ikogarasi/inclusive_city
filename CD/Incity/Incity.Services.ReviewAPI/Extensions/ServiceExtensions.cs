using Incity.Services.ReviewAPI.Configuration;
using Incity.Services.ReviewAPI.Infrastructure;
using Incity.Services.ReviewAPI.RabbitMQSender;
using Incity.Services.ReviewAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer.Update.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NSwag.Generation.Processors.Security;
using NSwag;
using System.Text;

namespace Incity.Services.ReviewAPI.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<RabbitMQConfiguration>(
                configuration.GetSection(nameof(RabbitMQConfiguration)));

            services.AddSingleton<IRabbitMQConfiguration>(i =>
                i.GetRequiredService<IOptions<RabbitMQConfiguration>>().Value);
            services.AddSingleton<IRabbitMQMessageSender, RabbitMQMessageSender>();

            services.AddScoped<IReviewService, ReviewService>();

            services.AddOpenApiDocument(config =>
            {
                config.Title = "Review API";

                config.DocumentProcessors.Add(new SecurityDefinitionAppender("Bearer",
                    new OpenApiSecurityScheme
                    {
                        Type = OpenApiSecuritySchemeType.ApiKey,
                        Name = "Authorization",
                        Description = "Copy 'Bearer ' + valid JWT token",
                        In = OpenApiSecurityApiKeyLocation.Header
                    }));
            });
        }

        public static void ConfigureDbContext(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ReviewDbContext>(options => 
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
        }

        public static void ConfigureJwt(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidIssuer = configuration["IdentityConfiguration:IdentityIssuer"],
                        ValidAudience = configuration["IdentityConfiguration:IdentityAudience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["IdentityConfiguration:IdentitySecret"])),
                        ValidateIssuerSigningKey = true,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });
        }
    }
}
