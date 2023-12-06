using Incity.Services.QuestionsAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace Incity.Services.QuestionsAPI.Infrastructure
{
    public class QuestionsDbContext : DbContext
    {
        public QuestionsDbContext(DbContextOptions options) : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<Question> Questions { get; set; }
        
        public DbSet<Answer> Answers { get; set; }
    }
}
