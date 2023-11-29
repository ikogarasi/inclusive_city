using Incity.Services.AuthAPI.Configuraiton;
using Incity.Services.AuthAPI.Infrastructure;
using Incity.Services.AuthAPI.Models;
using Incity.Services.AuthAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Runtime.CompilerServices;
using System.Text;

namespace Incity.Services.AuthAPI.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<IdentityConfiguration>(
                configuration.GetSection(nameof(IdentityConfiguration)));

            services.AddSingleton<IIdentityConfiguration>(i =>
                i.GetRequiredService<IOptions<IdentityConfiguration>>().Value);
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddScoped<IUserService, UserService>();
        }

        public static void ConfigureDbContext(this IServiceCollection services,  IConfiguration configuration)
        {
            services.AddDbContext<AuthDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
        }

        public static void ConfigureIdentity(this IServiceCollection services)
        {
            services.AddIdentity<IncityUser, IncityRole>(options =>
            {
                options.Password.RequiredLength = 6;
                options.Password.RequireDigit = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.SignIn.RequireConfirmedEmail = false;
                options.SignIn.RequireConfirmedAccount = false;
                options.SignIn.RequireConfirmedPhoneNumber = false;
            })
                .AddEntityFrameworkStores<AuthDbContext>()
                .AddDefaultTokenProviders()
                .AddUserValidator<UserValidator<IncityUser>>();
        }

        public static void ConfigureJwt(this IServiceCollection services, IConfiguration configuration)
        {
            var tokenConfiguration = configuration.GetSection("IdentityConfiguration").Get<IdentityConfiguration>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidIssuer = tokenConfiguration.IdentityIssuer,
                        ValidAudience = tokenConfiguration.IdentityAudience,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenConfiguration.IdentitySecret)),
                        ValidateIssuerSigningKey = true,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });
        }
    }
}
