using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Incity.Services.QuestionsAPI.Controllers
{
    [Area("User")]
    [Route("api/[Area]/[controller]")]
    [ApiController]
    [Authorize]
    public class QuestionController : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAllQuestions(bool pending = false)
        {
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> SubmitQuestion()
        {
            return Ok();
        }
    }
}
