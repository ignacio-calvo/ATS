using ATS.Interviews.Data.Models;

namespace ATS.Interviews.Business.Services.Interfaces
{
    public interface IInterviewerService
    {
        Task<IEnumerable<Interviewer>> GetInterviewersAsync();
        Task<Interviewer> GetInterviewerByIdAsync(int id);
        Task<Interviewer> CreateInterviewerAsync(Interviewer interviewer);
        Task UpdateInterviewerAsync(int id, Interviewer interviewer);
        Task DeleteInterviewerAsync(int id);
    }
}
