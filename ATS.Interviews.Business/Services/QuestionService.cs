using ATS.Interviews.Business.Services.Interfaces;
using ATS.Interviews.Data;
using ATS.Interviews.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace ATS.Interviews.Business.Services
{
    public class QuestionService : IQuestionService
    {
        private readonly InterviewDbContext _context;

        public QuestionService(InterviewDbContext context)
        {
            _context = context;
        }

        public async Task<Question> GetQuestionByIdAsync(int id)
        {
            return await _context.Questions.Include(q => q.InputOptions).FirstOrDefaultAsync(q => q.Id == id);
        }

        public async Task<IEnumerable<Question>> GetAllQuestionsAsync()
        {
            return await _context.Questions.Include(q => q.InputOptions).ToListAsync();
        }

        public async Task<Question> CreateQuestionAsync(Question question)
        {
            // Create a new Question object with only the necessary properties
            var newQuestion = new Question
            {
                Text = question.Text,
                Hint = question.Hint,
                SectionId = question.SectionId,
                Order = question.Order,
                IsRequired = question.IsRequired,
                InputType = question.InputType
            };

            // Add the new question object to generate its ID
            _context.Questions.Add(newQuestion);
            await _context.SaveChangesAsync();

            // Create new InputOption objects with the generated QuestionId
            var newInputOptions = question.InputOptions?.Select(io => new InputOption
            {
                QuestionId = newQuestion.Id,
                OptionText = io.OptionText
            }).ToList();

            // Add the new InputOption objects to the context
            if (newInputOptions != null)
            {
                _context.InputOptions.AddRange(newInputOptions);
                await _context.SaveChangesAsync();
            }

            // Update the newQuestion object to include the new InputOptions
            newQuestion.InputOptions = newInputOptions;

            return newQuestion;
        }

        public async Task UpdateQuestionAsync(int id, Question question)
        {
            if (id != question.Id)
            {
                throw new ArgumentException("ID mismatch");
            }

            _context.Entry(question).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteQuestionAsync(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question != null)
            {
                _context.Questions.Remove(question);
                await _context.SaveChangesAsync();
            }
        }
    }
}

