using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Incity.Services.StructureAPI.Models
{
    public class CategoryStructure
    {
        [Key]
        public Guid Id { get; set; }

        public Guid CategoryId { get; set; }
        [ForeignKey(nameof(CategoryId))]
        public Category Category { get; set; }
        
        public Guid StructureId { get; set; }
        [ForeignKey(nameof(StructureId))]
        public Structure Structure { get; set; }
    }
}
