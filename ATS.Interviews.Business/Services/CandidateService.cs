using ATS.Interviews.Business.Services.Interfaces;
using ATS.Interviews.Data;
using ATS.Interviews.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace ATS.Interviews.Business.Services
{
    public class CandidateService : ICandidateService
    {
        private readonly InterviewDbContext _context;

        public CandidateService(InterviewDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Candidate>> GetCandidatesAsync()
        {
            return await _context.Candidates.Include(c => c.Interviews).ToListAsync();
        }

        public async Task<Candidate> GetCandidateByIdAsync(int id)
        {
            return await _context.Candidates.Include(c => c.Interviews).FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Candidate> CreateCandidateAsync(Candidate candidate)
        {
            _context.Candidates.Add(candidate);
            await _context.SaveChangesAsync();
            return candidate;
        }

        public async Task UpdateCandidateAsync(int id, Candidate candidate)
        {
            if (id != candidate.Id)
            {
                throw new ArgumentException("ID mismatch");
            }

            _context.Entry(candidate).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCandidateAsync(int id)
        {
            var candidate = await _context.Candidates.FindAsync(id);
            if (candidate == null)
            {
                throw new KeyNotFoundException("Candidate not found");
            }

            _context.Candidates.Remove(candidate);
            await _context.SaveChangesAsync();
        }
    }
}


