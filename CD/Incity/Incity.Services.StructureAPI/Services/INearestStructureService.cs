using Incity.Services.StructureAPI.Dto;

namespace Incity.Services.StructureAPI.Services
{
    public interface INearestStructureService
    {
        Task<IEnumerable<GetStructureDto>> FindNearest(LocationDto location, int count, string? category);
        Task<GetStructureDto?> FindStructureById(LocationDto location, Guid structureId);
    }
}