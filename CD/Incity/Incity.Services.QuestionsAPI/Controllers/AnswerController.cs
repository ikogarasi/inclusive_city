using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Incity.Services.QuestionsAPI.Controllers
{
    [Area("Admin")]
    [Route("api/[Area]/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AnswerController : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAllQuestions(Guid? userId = null, bool pending = false)
        {
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> AnswerQuestion()
        {
            return Ok();
        }

        [HttpDelete("{answerId}")]
        public async Task<IActionResult> RemoveAnswer(Guid answerId)
        {
            return Ok();
        }

        [HttpPatch("{questionId}")]
        public async Task<IActionResult> CloseQuestion()
        {
            return Ok();
        }
    }
}
