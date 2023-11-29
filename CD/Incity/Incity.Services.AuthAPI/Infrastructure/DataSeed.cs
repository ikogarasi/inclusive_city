using Incity.Services.AuthAPI.Helpers;
using Incity.Services.AuthAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Incity.Services.AuthAPI.Infrastructure
{
    public static class DataSeed
    {
        private static readonly Dictionary<string, string> _roleIds = new();

        public static void SeedData(ModelBuilder modelBuilder, IConfiguration configuration)
        {
            SeedRoles(modelBuilder);
            SeedUsers(modelBuilder, configuration);
        }

        private static void SeedRoles(ModelBuilder modelBuilder)
        {
            var values = Enum.GetValues(typeof(UserRole)).Cast<UserRole>();

            foreach (var value in values)
            {
                _roleIds.TryAdd(value.ToString(), Guid.NewGuid().ToString());

                modelBuilder.Entity<IncityRole>().HasData(new IncityRole()
                {
                    Id = _roleIds[value.ToString()],
                    Name = value.ToString(),
                    SysType = value,
                    NormalizedName = value.ToString().ToUpper()
                });
            }
        }

        private static void SeedUsers(ModelBuilder modelBuilder, IConfiguration configuration)
        {
            var csvReader = new CsvUserReader(configuration["CsvUsersPath"]);

            var users = csvReader.Read();

            foreach (var dto in users)
            {
                var user = new IncityUser
                {
                    Id = Guid.NewGuid().ToString(),
                    UserName = dto.Username,
                    Email = dto.Email,
                    NormalizedUserName = dto.Username.ToUpper(),
                    NormalizedEmail = dto.Email.ToUpper(),
                    EmailConfirmed = true
                };

                var passwordHasher = new PasswordHasher<IncityUser>();
                user.PasswordHash = passwordHasher.HashPassword(user, dto.Password);

                modelBuilder.Entity<IncityUser>().HasData(user);

                foreach (var role in dto.Roles)
                {
                    modelBuilder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
                    {
                        UserId = user.Id,
                        RoleId = _roleIds[role]
                    });
                }
            }
        }
    }
}
