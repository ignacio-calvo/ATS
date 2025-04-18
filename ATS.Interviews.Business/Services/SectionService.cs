using ATS.Interviews.Business.Services.Interfaces;
using ATS.Interviews.Data;
using ATS.Interviews.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace ATS.Interviews.Business.Services
{
    public class SectionService : ISectionService
    {
        private readonly InterviewDbContext _context;

        public SectionService(InterviewDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Section>> GetSectionsAsync()
        {
            return await _context.Sections
                .Include(s => s.Questions)
                .ThenInclude(q => q.InputOptions)
                .OrderBy(s => s.Order) // Ensure sections are ordered by the 'Order' field
                .ToListAsync();
        }

        public async Task<Section> GetSectionByIdAsync(int id)
        {
            return await _context.Sections.Include(s => s.Questions).ThenInclude(q => q.InputOptions).FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Section> CreateSectionAsync(Section section)
        {
            _context.Sections.Add(section);
            await _context.SaveChangesAsync();
            return section;
        }

        public async Task UpdateSectionAsync(int id, Section section)
        {
            if (id != section.Id)
            {
                throw new ArgumentException("ID mismatch");
            }

            var existingSection = await _context.Sections
                .Include(s => s.Questions)
                .ThenInclude(q => q.InputOptions)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (existingSection == null)
            {
                throw new KeyNotFoundException("Section not found");
            }

            // Update the existing section's properties
            _context.Entry(existingSection).CurrentValues.SetValues(section);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                // Log the exception or handle it as needed
                throw new InvalidOperationException("The section you attempted to update was modified or deleted by another user.", ex);
            }
        }

        public async Task DeleteSectionAsync(int id)
        {
            var section = await _context.Sections.FindAsync(id);
            if (section == null)
            {
                throw new KeyNotFoundException("Section not found");
            }

            _context.Sections.Remove(section);
            await _context.SaveChangesAsync();
        }
    }
}




