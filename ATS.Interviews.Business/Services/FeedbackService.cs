using ATS.Interviews.Business.Services.Interfaces;
using ATS.Interviews.Data;
using ATS.Interviews.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace ATS.Interviews.Business.Services
{
    public class FeedbackService : IFeedbackService
    {
        private readonly InterviewDbContext _context;

        public FeedbackService(InterviewDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Feedback>> GetFeedbacksAsync()
        {
            return await _context.Feedbacks
                .Include(f => f.Interview)
                .Include(f => f.Interviewer)
                .Include(f => f.Question)
                .Include(f => f.SelectedOption)
                .ToListAsync();
        }

        public async Task<Feedback> GetFeedbackByIdAsync(int id)
        {
            return await _context.Feedbacks
                .Include(f => f.Interview)
                .Include(f => f.Interviewer)
                .Include(f => f.Question)
                .Include(f => f.SelectedOption)
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<Feedback> CreateFeedbackAsync(Feedback feedback)
        {
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();
            return feedback;
        }

        public async Task UpdateFeedbackAsync(int id, Feedback feedback)
        {
            if (id != feedback.Id)
            {
                throw new ArgumentException("ID mismatch");
            }

            _context.Entry(feedback).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteFeedbackAsync(int id)
        {
            var feedback = await _context.Feedbacks.FindAsync(id);
            if (feedback == null)
            {
                throw new KeyNotFoundException("Feedback not found");
            }

            _context.Feedbacks.Remove(feedback);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Feedback>> GetFeedbacksByInterviewAndInterviewerAsync(int interviewId, int interviewerId)
        {
            return await _context.Feedbacks
                .Where(f => f.InterviewId == interviewId && f.InterviewerId == interviewerId)
                .Include(f => f.Question)
                .Include(f => f.SelectedOption)
                .ToListAsync();
        }

        public async Task SaveFeedbacksAsync(IEnumerable<Feedback> feedbacks)
        {
            foreach (var feedback in feedbacks)
            {
                if (feedback.Id == 0)
                {
                    _context.Feedbacks.Add(feedback);
                }
                else
                {
                    _context.Entry(feedback).State = EntityState.Modified;
                }
            }
            await _context.SaveChangesAsync();
        }
    }
}
