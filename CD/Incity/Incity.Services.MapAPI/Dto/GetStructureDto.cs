namespace Incity.Services.StructureAPI.Dto
{
    public record GetStructureDto(
        Guid? Id,
        string Name,
        string Description,
        string ImageUrl,
        string Category,
        double Latitude,
        double Longitude,
        double Rating
    );
}
