using ATS.Interviews.Data.Models;

namespace ATS.Interviews.Business.Services.Interfaces
{
    public interface IInterviewTemplateService
    {
        Task<IEnumerable<InterviewTemplate>> GetInterviewTemplatesAsync();
        Task<InterviewTemplate> GetInterviewTemplateByIdAsync(int id);
        Task<InterviewTemplate> CreateInterviewTemplateAsync(InterviewTemplate interviewTemplate);
        Task UpdateInterviewTemplateAsync(int id, InterviewTemplate interviewTemplate);
        Task DeleteInterviewTemplateAsync(int id);
    }
}
