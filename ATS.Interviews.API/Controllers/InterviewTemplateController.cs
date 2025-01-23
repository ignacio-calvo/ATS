using Microsoft.AspNetCore.Mvc;
using ATS.Interviews.Data;
using ATS.Interviews.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace ATS.Interviews.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InterviewTemplateController : ControllerBase
    {
        private readonly InterviewDbContext _context;

        public InterviewTemplateController(InterviewDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InterviewTemplate>>> GetInterviewTemplates()
        {
            return await _context.InterviewTemplates
                .Include(it => it.InterviewTemplateSections)
                .ThenInclude(its => its.Section)
                .ThenInclude(s => s.Questions)
                .ThenInclude(q => q.InputOptions)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InterviewTemplate>> GetInterviewTemplate(int id)
        {
            var interviewTemplate = await _context.InterviewTemplates
                .Include(it => it.InterviewTemplateSections)
                .ThenInclude(its => its.Section)
                .ThenInclude(s => s.Questions)
                .ThenInclude(q => q.InputOptions)
                .FirstOrDefaultAsync(it => it.Id == id);

            if (interviewTemplate == null)
            {
                return NotFound();
            }

            return interviewTemplate;
        }

        [HttpPost]
        public async Task<ActionResult<InterviewTemplate>> CreateInterviewTemplate(InterviewTemplate interviewTemplate)
        {
            _context.InterviewTemplates.Add(interviewTemplate);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInterviewTemplate), new { id = interviewTemplate.Id }, interviewTemplate);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInterviewTemplate(int id, InterviewTemplate interviewTemplate)
        {
            if (id != interviewTemplate.Id)
            {
                return BadRequest("ID mismatch");
            }

            var existingTemplate = await _context.InterviewTemplates
                .Include(it => it.InterviewTemplateSections)
                .FirstOrDefaultAsync(it => it.Id == id);

            if (existingTemplate == null)
            {
                return NotFound();
            }

            // Update the template properties
            existingTemplate.Name = interviewTemplate.Name;

            // Update the sections
            existingTemplate.InterviewTemplateSections.Clear();
            foreach (var its in interviewTemplate.InterviewTemplateSections)
            {
                var section = await _context.Sections.FindAsync(its.SectionId);
                if (section == null)
                {
                    return BadRequest($"Section with ID {its.SectionId} not found");
                }

                existingTemplate.InterviewTemplateSections.Add(new InterviewTemplateSection
                {
                    InterviewTemplateId = its.InterviewTemplateId,
                    SectionId = its.SectionId,
                    Section = section,
                    Order = its.Order
                });
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InterviewTemplateExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInterviewTemplate(int id)
        {
            var interviewTemplate = await _context.InterviewTemplates.FindAsync(id);
            if (interviewTemplate == null)
            {
                return NotFound();
            }

            _context.InterviewTemplates.Remove(interviewTemplate);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InterviewTemplateExists(int id)
        {
            return _context.InterviewTemplates.Any(e => e.Id == id);
        }
    }
}
