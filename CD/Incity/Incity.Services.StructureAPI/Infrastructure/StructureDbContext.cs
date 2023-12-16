using Incity.Services.StructureAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Incity.Services.StructureAPI.Infrastructure
{
    public class StructureDbContext : DbContext
    {
        public StructureDbContext(DbContextOptions options) : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<Structure> Structures { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<CategoryStructure> CategoryStructures { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            DataSeed.SeedData(builder);
            base.OnModelCreating(builder);
        }
    }
}
