using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Incity.Services.StructureAPI.Models
{
    public class Structure
    {
        [Key]
        public Guid Id { get; set; }

        public string DisplayName { get; set; }
        
        public string Description { get; set; }

        public double Rating { get; set; } = 0.0;
        
        public string ImageUrl { get; set; }

        // needs for deleting
        public string? ImageName { get; set; }
        
        public double Latitude { get; set; }
        
        public double Longitude { get; set; }
    }
}
