using Incity.Services.QuestionsAPI.Dto;
using Incity.Services.QuestionsAPI.Infrastructure;
using Incity.Services.QuestionsAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Incity.Services.QuestionsAPI.Services
{
    public class QuestionService
    {
        private readonly QuestionsDbContext _dbContext;
        private readonly HttpContext _httpContext;

        public QuestionService(QuestionsDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _httpContext = httpContextAccessor.HttpContext;
        }

        public async Task<IEnumerable<Topic>> GetQuestionsForUser(bool pending = false)
        {
            var userId = Guid.Parse(_httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier));

            return await GetQuestions(userId, pending);
        }

        public async Task<IEnumerable<Topic>> GetQuestionsForAdmin(Guid? userId = null, bool pending = false)
        {
            return await GetQuestions(userId, pending);
        }

        public async Task<Question> AddQuestion(QuestionDto dto)
        {
            var userId = Guid.Parse(_httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier));
            var username = _httpContext.User.FindFirstValue(ClaimTypes.Name);
            var email = _httpContext.User.FindFirstValue(ClaimTypes.Email);

            var question = new Question
            {
                UserId = userId,
                UserName = username,
                Email = email,
                Description = dto.Description,
            };

            await _dbContext.Questions.AddAsync(question);
            await _dbContext.SaveChangesAsync();

            return question;
        }

        public async Task<Topic> AnswerQuestion(AnswerDto dto)
        {
            var questionFromDb = await _dbContext.Questions
                .FirstOrDefaultAsync(i => i.Id == dto.QuestionId && i.IsClosed == false)
                    ?? throw new ArgumentException("Question with such is already closed or does not exist");

            var userId = Guid.Parse(_httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier));
            var username = _httpContext.User.FindFirstValue(ClaimTypes.Name);

            var answer = new Answer
            {
                QuestionId = questionFromDb.Id,
                Text = dto.Text,
                UserId = userId,
                UserName = username
            };

            await _dbContext.Answers.AddAsync(answer);

            questionFromDb.IsClosed = true;

            await _dbContext.SaveChangesAsync();

            return new()
            {
                Question = questionFromDb,
                Answer = answer
            };
        }

        private async Task<IEnumerable<Topic>> GetQuestions(Guid? userId = null, bool pending = false)
        {
            var query = _dbContext.Questions
                .AsNoTracking()
                .GroupJoin(
                    _dbContext.Answers,
                    question => question.Id,
                    answer => answer.QuestionId,
                    (question, answers) => new Topic
                    {
                        Question = question,
                        Answer = answers.FirstOrDefault()
                    });

            if (userId != null)
            {
                query = query.Where(i => i.Question.UserId == userId);
            }

            if (pending)
            {
                query = query.Where(i => !i.Question.IsClosed);
            }

            return await query.ToListAsync();
        } 
    }
}
