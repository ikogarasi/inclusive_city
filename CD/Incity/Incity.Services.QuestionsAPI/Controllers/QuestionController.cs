using Incity.Services.QuestionsAPI.Dto;
using Incity.Services.QuestionsAPI.Services;
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
        private readonly IQuestionService _questionService;

        public QuestionController(IQuestionService questionService)
        {
            _questionService = questionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllQuestions(bool pending = false)
        {
            return Ok(await _questionService.GetQuestionsForUser(pending));
        }

        [HttpPost]
        public async Task<IActionResult> SubmitQuestion(QuestionDto dto)
        {
            return Ok(await _questionService.AddQuestion(dto));
        }
    }
}
