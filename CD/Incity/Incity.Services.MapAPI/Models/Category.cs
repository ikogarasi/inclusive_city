using System.ComponentModel.DataAnnotations;

namespace Incity.Services.StructureAPI.Models
{
    public class Category
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string NormalizedName { get; set; } 
    }
}
