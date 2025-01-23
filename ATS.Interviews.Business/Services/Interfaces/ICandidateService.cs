using ATS.Interviews.Data.Models;

namespace ATS.Interviews.Business.Services.Interfaces
{
    public interface ICandidateService
    {
        Task<IEnumerable<Candidate>> GetCandidatesAsync();
        Task<Candidate> GetCandidateByIdAsync(int id);
        Task<Candidate> CreateCandidateAsync(Candidate candidate);
        Task<Candidate> UpdateCandidateAsync(int id, Candidate candidate);
        Task DeleteCandidateAsync(int id);
    }
}


