using ATS.Interviews.Data.Models;

namespace ATS.Interviews.Business.Services.Interfaces
{
    public interface IQuestionService
    {
        Task<Question> GetQuestionByIdAsync(int id);
        Task<IEnumerable<Question>> GetAllQuestionsAsync();
        Task<Question> CreateQuestionAsync(Question question);
        Task UpdateQuestionAsync(int id, Question question);
        Task DeleteQuestionAsync(int id);
    }
}

