using Incity.Services.StructureAPI.Models;

namespace Incity.Services.StructureAPI.Dto
{
    public record StructureDto(
        Guid? Id, 
        string Name, 
        string Description,
        IFormFile? Image, 
        string Category, 
        double Latitude, 
        double Longitude);
}