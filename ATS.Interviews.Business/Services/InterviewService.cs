using ATS.Interviews.Business.Services.Interfaces;
using ATS.Interviews.Data;
using ATS.Interviews.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace ATS.Interviews.Business.Services
{
    public class InterviewService : IInterviewService
    {
        private readonly InterviewDbContext _context;

        public InterviewService(InterviewDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Interview>> GetInterviewsAsync()
        {
            return await _context.Interviews
                .Include(i => i.Candidate)
                .Include(i => i.InterviewInterviewers)
                    .ThenInclude(ii => ii.Interviewer)
                .Include(i => i.InterviewInterviewers)
                    .ThenInclude(ii => ii.InterviewTemplate)
                .ToListAsync();
        }

        public async Task<Interview> GetInterviewByIdAsync(int id)
        {
            return await _context.Interviews
                .Include(i => i.Candidate)
                .Include(i => i.InterviewInterviewers)
                    .ThenInclude(ii => ii.Interviewer)
                .Include(i => i.InterviewInterviewers)
                    .ThenInclude(ii => ii.InterviewTemplate)
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<Interview> CreateInterviewAsync(Interview interview)
        {
            // Create a new Interview object with only the necessary properties
            var newInterview = new Interview
            {
                CandidateId = interview.CandidateId,
                ScheduledDate = interview.ScheduledDate,
                JobDescriptionLink = interview.JobDescriptionLink // Ensure the JobDescriptionLink is set
            };

            // Add the new interview object to generate its ID
            _context.Interviews.Add(newInterview);
            await _context.SaveChangesAsync();

            // Create new InterviewInterviewer objects with the generated InterviewId
            var newInterviewInterviewers = interview.InterviewInterviewers.Select(ii => new InterviewInterviewer
            {
                InterviewId = newInterview.Id,
                InterviewerId = ii.InterviewerId,
                InterviewTemplateId = ii.InterviewTemplateId
            }).ToList();

            // Add the new InterviewInterviewer objects to the context
            _context.InterviewInterviewers.AddRange(newInterviewInterviewers);
            await _context.SaveChangesAsync();

            // Update the newInterview object to include the new InterviewInterviewers
            newInterview.InterviewInterviewers = newInterviewInterviewers;

            return newInterview;
        }

        public async Task UpdateInterviewAsync(int id, Interview interview)
        {
            if (id != interview.Id)
            {
                throw new ArgumentException("ID mismatch");
            }

            _context.Entry(interview).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteInterviewAsync(int id)
        {
            var interview = await _context.Interviews.FindAsync(id);
            if (interview == null)
            {
                throw new KeyNotFoundException("Interview not found");
            }

            _context.Interviews.Remove(interview);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveInterviewerFromInterviewAsync(int interviewId, int interviewerId)
        {
            var interview = await _context.Interviews
                .Include(i => i.InterviewInterviewers)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null)
            {
                throw new KeyNotFoundException("Interview not found");
            }

            var interviewInterviewer = interview.InterviewInterviewers
                .FirstOrDefault(ii => ii.InterviewerId == interviewerId);

            if (interviewInterviewer == null)
            {
                throw new KeyNotFoundException("Interviewer not found in the interview");
            }

            _context.InterviewInterviewers.Remove(interviewInterviewer);
            await _context.SaveChangesAsync();
        }

        public async Task AddInterviewerToInterviewAsync(int interviewId, int interviewerId, int? interviewTemplateId)
        {
            var interview = await _context.Interviews
                .Include(i => i.InterviewInterviewers)
                .FirstOrDefaultAsync(i => i.Id == interviewId);

            if (interview == null)
            {
                throw new KeyNotFoundException("Interview not found");
            }

            var interviewInterviewer = new InterviewInterviewer
            {
                InterviewId = interviewId,
                InterviewerId = interviewerId,
                InterviewTemplateId = interviewTemplateId
            };

            _context.InterviewInterviewers.Add(interviewInterviewer);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Interview>> GetInterviewsByInterviewerAsync(int interviewerId)
        {
            return await _context.Interviews
                .Include(i => i.Candidate)
                .Include(i => i.InterviewInterviewers)
                    .ThenInclude(ii => ii.Interviewer)
                .Include(i => i.InterviewInterviewers)
                    .ThenInclude(ii => ii.InterviewTemplate)
                .Where(i => i.InterviewInterviewers.Any(ii => ii.InterviewerId == interviewerId))
                .ToListAsync();
        }
    }
}


