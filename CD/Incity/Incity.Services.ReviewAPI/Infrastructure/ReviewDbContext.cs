using Incity.Services.ReviewAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace Incity.Services.ReviewAPI.Infrastructure
{
    public class ReviewDbContext : DbContext
    {
        public ReviewDbContext(DbContextOptions<ReviewDbContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<Review> Reviews { get; set; }
    }
}
