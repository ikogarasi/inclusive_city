using Incity.Services.StructureAPI.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;

namespace Incity.Services.StructureAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly StructureDbContext _structureDbContext;

        public CategoryController(StructureDbContext structureDbContext)
        {
            _structureDbContext = structureDbContext;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _structureDbContext.Categories
                .AsNoTracking()
                .ToListAsync());
        }
    }
}
