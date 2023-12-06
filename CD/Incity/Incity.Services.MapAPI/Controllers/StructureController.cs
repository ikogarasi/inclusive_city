using Incity.Services.StructureAPI.Dto;
using Incity.Services.StructureAPI.Models;
using Incity.Services.StructureAPI.Repository;
using Incity.Services.StructureAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Incity.Services.StructureAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StructureController : ControllerBase
    {
        private readonly IStructureRepository _structureRepository;
        private readonly INearestStructureService _nearestStructureService;

        public StructureController(IStructureRepository structureService, INearestStructureService nearestStructureService)
        {
            _structureRepository = structureService;
            _nearestStructureService = nearestStructureService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<GetStructureDto>), 200)]
        public async Task<IActionResult> GetAllStructures(double latitude, double longitude, int count, string? category)
        {
            return Ok(await _nearestStructureService.FindNearest(new(latitude, longitude), count, category));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(GetStructureDto), 200)]
        public async Task<IActionResult> GetStructure(Guid id, double latitude, double longitude)
        {
            return Ok(await _nearestStructureService.FindStructureById(new(latitude, longitude), id));
        }


        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(typeof(GetStructureDto), 200)]
        public async Task<IActionResult> CreateStructure([FromForm] StructureDto dto)
        {
            return Ok(await _structureRepository.CreateStructure(dto));
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(typeof(GetStructureDto), 200)]
        public async Task<IActionResult> UpdateStructure([FromForm] StructureDto dto)
        {
            return Ok(await _structureRepository.UpdateStructure(dto));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStructure(Guid id)
        {
            await _structureRepository.DeleteStructure(id);

            return Ok();
        }
    }
}
