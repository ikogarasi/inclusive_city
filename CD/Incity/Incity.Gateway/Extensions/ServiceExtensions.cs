using Incity.Gateway.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Incity.Gateway.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureJwt(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<IdentityConfiguration>(
                configuration.GetSection(nameof(IdentityConfiguration)));

            services.AddSingleton<IIdentityConfiguration>(i =>
                i.GetRequiredService<IOptions<IdentityConfiguration>>().Value);

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
