using Incity.Services.AuthAPI.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Incity.Services.AuthAPI.Infrastructure
{
    public class AuthDbContext : IdentityDbContext<IncityUser, IncityRole, string>
    {
        private readonly IConfiguration _configuration;
        private static bool _ensureCreated = false;

        public AuthDbContext(DbContextOptions<AuthDbContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;

            if (!_ensureCreated)
            {
                Database.EnsureDeleted();
                Database.EnsureCreated();
                _ensureCreated = true;
            }
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            DataSeed.SeedData(builder, _configuration);
            base.OnModelCreating(builder);
        }

    }
}
