using Incity.Services.StructureAPI.Dto;
using Incity.Services.StructureAPI.Models;
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
        private readonly IStructureService _structureService;

        public StructureController(IStructureService structureService)
        {
            _structureService = structureService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStructures()
        {
            return Ok(await _structureService.GetStructures());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStructure(Guid id)
        {
            return Ok(await _structureService.GetStructure(id));
        }


        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateStructure([FromForm] StructureDto dto)
        {
            return Ok(await _structureService.CreateStructure(dto));
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateStructure([FromForm] StructureDto dto)
        {
            return Ok(await _structureService.UpdateStructure(dto));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStructure(Guid id)
        {
            await _structureService.DeleteStructure(id);

            return Ok();
        }
    }
}
