using System.ComponentModel.DataAnnotations;

namespace Incity.Services.QuestionsAPI.Models
{
    public class Question
    {
        [Key]
        public Guid Id { get; set; }
        
        public Guid UserId { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public string Description { get; set; }

        public DateTime TimeStamp { get; set; } = DateTime.UtcNow;
        
        public bool IsClosed { get; set; } = false;
    }
}
