using Incity.Services.AuthAPI.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Incity.Services.AuthAPI.Infrastructure
{
    public class AuthDbContext : IdentityDbContext<IncityUser, IncityRole, string>
    {
        private readonly IConfiguration _configuration;
        
        public AuthDbContext(DbContextOptions<AuthDbContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;

            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            DataSeed.SeedData(builder, _configuration);
            base.OnModelCreating(builder);
        }

    }
}
