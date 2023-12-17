using Incity.Services.QuestionsAPI.Dto;
using Incity.Services.QuestionsAPI.Models;
using Incity.Services.QuestionsAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Incity.Services.QuestionsAPI.Controllers
{
    [Area("User")]
    [Route("api/User/[controller]")]
    [ApiController]
    [Authorize]
    public class QuestionController : ControllerBase
    {
        private readonly IQuestionService _questionService;

        public QuestionController(IQuestionService questionService)
        {
            _questionService = questionService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Topic>), 200)]
        public async Task<IActionResult> GetAllQuestions(bool pending = false)
        {
            return Ok(await _questionService.GetQuestionsForUser(pending));
        }

        [HttpPost]
        [ProducesResponseType(typeof(Question), 200)]
        public async Task<IActionResult> SubmitQuestion([FromBody] QuestionDto dto)
        {
            return Ok(await _questionService.AddQuestion(dto));
        }
    }
}
