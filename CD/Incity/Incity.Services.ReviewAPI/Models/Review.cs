using System.ComponentModel.DataAnnotations;

namespace Incity.Services.ReviewAPI.Models
{
    public class Review
    {
        [Key]
        public Guid Id { get; set; }
        public string Username { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public double Rating { get; set; }
        public Guid StructureId { get; set; }
        public string? Description { get; set; }
    }
}
