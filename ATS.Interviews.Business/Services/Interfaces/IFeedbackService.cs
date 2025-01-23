using ATS.Interviews.Data.Models;

namespace ATS.Interviews.Business.Services.Interfaces
{
    public interface IFeedbackService
    {
        Task<IEnumerable<Feedback>> GetFeedbacksAsync();
        Task<Feedback> GetFeedbackByIdAsync(int id);
        Task<Feedback> CreateFeedbackAsync(Feedback feedback);
        Task UpdateFeedbackAsync(int id, Feedback feedback);
        Task DeleteFeedbackAsync(int id);
        Task<IEnumerable<Feedback>> GetFeedbacksByInterviewAndInterviewerAsync(int interviewId, int interviewerId);
        Task SaveFeedbacksAsync(IEnumerable<Feedback> feedbacks);
    }
}
