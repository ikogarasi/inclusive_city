using Incity.Services.StructureAPI.Dto;
using Incity.Services.StructureAPI.Repository;

namespace Incity.Services.StructureAPI.Services
{
    public class NearestStructureService : INearestStructureService
    {
        private readonly IStructureRepository _structureRepository;

        public NearestStructureService(IStructureRepository structureRepository)
        {
            _structureRepository = structureRepository;
        }

        public async Task<IEnumerable<GetStructureDto>> FindNearest(LocationDto location, int count, string? category)
        {
            var structures = await _structureRepository.GetStructures(category);

            var locationDistances = structures.ToDictionary(structure => structure, structure => DistanceTo(location, structure));

            var totalCount = count == 0 ? locationDistances.Count : Math.Min(count, locationDistances.Count);

            var results = locationDistances.OrderBy(i => i.Value)
                .Take(totalCount)
                .Select(result =>
                {
                    result.Key.DistanceInKm = result.Value;
                    return result.Key;
                });

            return results;
        }

        public async Task<GetStructureDto?> FindStructureById(LocationDto location, Guid structureId)
        {
            var structure = await _structureRepository.GetStructure(structureId);

            if (structure == null)
            {
                return null;
            }

            structure.DistanceInKm = DistanceTo(location, structure);

            return structure;
        }

        private static double DistanceTo(LocationDto location, GetStructureDto target)
        {
            var baseRadian = Math.PI * location.Latitude / 180;
            var targetRadian = Math.PI * target.Latitude / 180;
            var theta = location.Longitude - target.Longitude;
            var thetaRadian = Math.PI * theta / 180;

            var distance = Math.Sin(baseRadian) * Math.Sin(targetRadian) + Math.Cos(baseRadian) *
                Math.Cos(targetRadian) * Math.Cos(thetaRadian);

            distance = Math.Acos(distance);

            distance = distance * 180 / Math.PI;
            distance = distance * 60 * 1.1515 * 1.60934;

            return distance;
        }
    }
}
