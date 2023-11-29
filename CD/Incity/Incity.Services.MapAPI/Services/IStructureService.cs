using Incity.Services.StructureAPI.Dto;
using Incity.Services.StructureAPI.Models;

namespace Incity.Services.StructureAPI.Services
{
    public interface IStructureService
    {
        Task<IEnumerable<GetStructureDto>> GetStructures();
        Task<GetStructureDto?> GetStructure(Guid id);
        Task<GetStructureDto> CreateStructure(StructureDto dto);
        Task<GetStructureDto> UpdateStructure(StructureDto dto);
        Task ChangeRating(Guid structureId, double averageRating);
        Task DeleteStructure(Guid id);
    }
}