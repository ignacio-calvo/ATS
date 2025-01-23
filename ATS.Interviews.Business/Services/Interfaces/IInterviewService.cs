using ATS.Interviews.Data.Models;

namespace ATS.Interviews.Business.Services.Interfaces
{
    public interface IInterviewService
    {
        Task<IEnumerable<Interview>> GetInterviewsAsync();
        Task<Interview> GetInterviewByIdAsync(int id);
        Task<Interview> CreateInterviewAsync(Interview interview);
        Task UpdateInterviewAsync(int id, Interview interview);
        Task DeleteInterviewAsync(int id);
        Task RemoveInterviewerFromInterviewAsync(int interviewId, int interviewerId);
        Task AddInterviewerToInterviewAsync(int interviewId, int interviewerId, int? interviewTemplateId);
        Task<IEnumerable<Interview>> GetInterviewsByInterviewerAsync(int interviewerId);
    }
}


