using Incity.Services.QuestionsAPI.Dto;
using Incity.Services.QuestionsAPI.Models;
using Incity.Services.QuestionsAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Incity.Services.QuestionsAPI.Controllers
{
    [Route("api/Admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AnswerController : ControllerBase
    {
        private readonly IQuestionService _questionService;

        public AnswerController(IQuestionService questionService)
        {
            _questionService = questionService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Topic>), 200)]
        public async Task<IActionResult> GetAllQuestions(Guid? userId = null, bool pending = false)
        {
            return Ok(await _questionService.GetQuestionsForAdmin(userId, pending));
        }

        [HttpPost]
        [ProducesResponseType(typeof(Topic), 200)]
        public async Task<IActionResult> AnswerQuestion([FromBody] AnswerDto dto)
        {
            return Ok(await _questionService.AnswerQuestion(dto));
        }
    }
}
