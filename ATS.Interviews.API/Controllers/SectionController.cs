using Microsoft.AspNetCore.Mvc;
using ATS.Interviews.Business.Services.Interfaces;
using ATS.Interviews.Data.Models;

namespace ATS.Interviews.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SectionController : ControllerBase
    {
        private readonly ISectionService _sectionService;
        private readonly IQuestionService _questionService;

        public SectionController(ISectionService sectionService, IQuestionService questionService)
        {
            _sectionService = sectionService;
            _questionService = questionService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Section>>> GetSections()
        {
            var sections = await _sectionService.GetSectionsAsync();
            return Ok(sections);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Section>> GetSection(int id)
        {
            var section = await _sectionService.GetSectionByIdAsync(id);
            if (section == null)
            {
                return NotFound();
            }

            return Ok(section);
        }

        [HttpPost]
        public async Task<ActionResult<Section>> CreateSection(Section section)
        {
            var createdSection = await _sectionService.CreateSectionAsync(section);
            return CreatedAtAction(nameof(GetSection), new { id = createdSection.Id }, createdSection);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSection(int id, Section section)
        {
            try
            {
                await _sectionService.UpdateSectionAsync(id, section);
            }
            catch (ArgumentException)
            {
                return BadRequest();
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSection(int id)
        {
            try
            {
                await _sectionService.DeleteSectionAsync(id);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }

        // New endpoints for handling questions
        [HttpPost("{sectionId}/questions")]
        public async Task<ActionResult<Question>> AddQuestion(int sectionId, [FromBody] Question question)
        {
            var section = await _sectionService.GetSectionByIdAsync(sectionId);
            if (section == null)
            {
                return NotFound();
            }

            question.SectionId = sectionId;

            try
            {
                var createdQuestion = await _questionService.CreateQuestionAsync(question);
                return CreatedAtAction(nameof(GetSection), new { id = sectionId }, createdQuestion);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPut("{sectionId}/questions/{questionId}")]
        public async Task<IActionResult> UpdateQuestion(int sectionId, int questionId, [FromBody] Question question)
        {
            var section = await _sectionService.GetSectionByIdAsync(sectionId);
            if (section == null)
            {
                return NotFound();
            }

            var existingQuestion = section.Questions.FirstOrDefault(q => q.Id == questionId);
            if (existingQuestion == null)
            {
                return NotFound();
            }

            existingQuestion.Text = question.Text;
            existingQuestion.Hint = question.Hint;
            existingQuestion.Order = question.Order;
            existingQuestion.IsRequired = question.IsRequired;
            existingQuestion.InputType = question.InputType;
            existingQuestion.InputOptions = question.InputOptions;

            try
            {
                await _sectionService.UpdateSectionAsync(sectionId, section);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }

            return NoContent();
        }

        [HttpDelete("{sectionId}/questions/{questionId}")]
        public async Task<IActionResult> DeleteQuestion(int sectionId, int questionId)
        {
            var section = await _sectionService.GetSectionByIdAsync(sectionId);
            if (section == null)
            {
                return NotFound();
            }

            var question = section.Questions.FirstOrDefault(q => q.Id == questionId);
            if (question == null)
            {
                return NotFound();
            }

            section.Questions.Remove(question);
            await _sectionService.UpdateSectionAsync(sectionId, section);

            return NoContent();
        }
    }
}








