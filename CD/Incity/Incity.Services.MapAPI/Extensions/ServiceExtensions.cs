using AzureBlobStorage;
using Incity.Services.StructureAPI.Configuration;
using Incity.Services.StructureAPI.Infrastructure;
using Incity.Services.StructureAPI.RabbitMQConsumer;
using Incity.Services.StructureAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Incity.Services.StructureAPI.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<RabbitMQConfiguration>(
                configuration.GetSection(nameof(RabbitMQConfiguration)));
           
            services.AddSingleton<IRabbitMQConfiguration>(i =>
                i.GetRequiredService<IOptions<RabbitMQConfiguration>>().Value);

            services.AddScoped<IStructureService, StructureService>();
            
            services.AddTransient<IAzureStorage, AzureStorage>();
            services.AddHostedService<RabbitMQReviewConsumer>();
        }

        public static void ConfigureDbContext(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<StructureDbContext>(options =>
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
