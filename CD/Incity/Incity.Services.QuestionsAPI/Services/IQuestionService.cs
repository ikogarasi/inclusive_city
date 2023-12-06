using Incity.Services.QuestionsAPI.Dto;
using Incity.Services.QuestionsAPI.Models;

namespace Incity.Services.QuestionsAPI.Services
{
    public interface IQuestionService
    {
        Task<Question> AddQuestion(QuestionDto dto);
        Task<Topic> AnswerQuestion(AnswerDto dto);
        Task<IEnumerable<Topic>> GetQuestionsForAdmin(Guid? userId = null, bool pending = false);
        Task<IEnumerable<Topic>> GetQuestionsForUser(bool pending = false);
    }
}