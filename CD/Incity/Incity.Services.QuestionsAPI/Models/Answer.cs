using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Incity.Services.QuestionsAPI.Models
{
    public class Answer
    {
        [Key]
        public int Id { get; set; }

        public Guid UserId { get; set; }
        public string UserName { get; set; }

        public Guid QuestionId { get; set; }
        [ForeignKey(nameof(QuestionId))]
        public Question Question { get; set; }

        public string Text { get; set; }
        public DateTime TimeStamp { get; set; } = DateTime.UtcNow;
    }
}
