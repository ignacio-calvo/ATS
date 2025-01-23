using ATS.Interviews.Business.Services.Interfaces;
using ATS.Interviews.Data;
using ATS.Interviews.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace ATS.Interviews.Business.Services
{
    public class InterviewTemplateService : IInterviewTemplateService
    {
        private readonly InterviewDbContext _context;

        public InterviewTemplateService(InterviewDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<InterviewTemplate>> GetInterviewTemplatesAsync()
        {
            return await _context.InterviewTemplates
                .Include(it => it.InterviewTemplateSections)
                .ThenInclude(its => its.Section)
                .ThenInclude(s => s.Questions)
                .ToListAsync();
        }

        public async Task<InterviewTemplate> GetInterviewTemplateByIdAsync(int id)
        {
            return await _context.InterviewTemplates
                .Include(it => it.InterviewTemplateSections)
                .ThenInclude(its => its.Section)
                .ThenInclude(s => s.Questions)
                .FirstOrDefaultAsync(it => it.Id == id);
        }



        public async Task<InterviewTemplate> CreateInterviewTemplateAsync(InterviewTemplate interviewTemplate)
        {
            _context.InterviewTemplates.Add(interviewTemplate);
            await _context.SaveChangesAsync();
            return interviewTemplate;
        }

        public async Task UpdateInterviewTemplateAsync(int id, InterviewTemplate interviewTemplate)
        {
            if (id != interviewTemplate.Id)
            {
                throw new ArgumentException("ID mismatch");
            }

            _context.Entry(interviewTemplate).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteInterviewTemplateAsync(int id)
        {
            var interviewTemplate = await _context.InterviewTemplates.FindAsync(id);
            if (interviewTemplate == null)
            {
                throw new KeyNotFoundException("InterviewTemplate not found");
            }

            _context.InterviewTemplates.Remove(interviewTemplate);
            await _context.SaveChangesAsync();
        }
    }
}
