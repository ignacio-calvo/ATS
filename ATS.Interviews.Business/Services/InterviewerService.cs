using ATS.Interviews.Business.Services.Interfaces;
using ATS.Interviews.Data;
using ATS.Interviews.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace ATS.Interviews.Business.Services
{
    public class InterviewerService : IInterviewerService
    {
        private readonly InterviewDbContext _context;

        public InterviewerService(InterviewDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Interviewer>> GetInterviewersAsync()
        {
            return await _context.Interviewers
                .Include(i => i.Feedbacks)
                .Include(i => i.InterviewInterviewers)
                    .ThenInclude(ii => ii.Interview)
                .Include(i => i.InterviewInterviewers)
                    .ThenInclude(ii => ii.InterviewTemplate)
                .ToListAsync();
        }

        public async Task<Interviewer> GetInterviewerByIdAsync(int id)
        {
            return await _context.Interviewers
                .Include(i => i.Feedbacks)
                .Include(i => i.InterviewInterviewers)
                    .ThenInclude(ii => ii.Interview)
                .Include(i => i.InterviewInterviewers)
                    .ThenInclude(ii => ii.InterviewTemplate)
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<Interviewer> CreateInterviewerAsync(Interviewer interviewer)
        {
            _context.Interviewers.Add(interviewer);
            await _context.SaveChangesAsync();
            return interviewer;
        }

        public async Task UpdateInterviewerAsync(int id, Interviewer interviewer)
        {
            if (id != interviewer.Id)
            {
                throw new ArgumentException("ID mismatch");
            }

            _context.Entry(interviewer).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteInterviewerAsync(int id)
        {
            var interviewer = await _context.Interviewers.FindAsync(id);
            if (interviewer == null)
            {
                throw new KeyNotFoundException("Interviewer not found");
            }

            _context.Interviewers.Remove(interviewer);
            await _context.SaveChangesAsync();
        }
    }
}
