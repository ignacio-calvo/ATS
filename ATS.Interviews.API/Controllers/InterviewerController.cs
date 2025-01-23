using Microsoft.AspNetCore.Mvc;
using ATS.Interviews.Data.Models;
using ATS.Interviews.Business.Services.Interfaces;

namespace ATS.Interviews.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InterviewerController : ControllerBase
    {
        private readonly IInterviewerService _interviewerService;

        public InterviewerController(IInterviewerService interviewerService)
        {
            _interviewerService = interviewerService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Interviewer>>> GetInterviewers()
        {
            var interviewers = await _interviewerService.GetInterviewersAsync();
            return Ok(interviewers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Interviewer>> GetInterviewer(int id)
        {
            var interviewer = await _interviewerService.GetInterviewerByIdAsync(id);
            if (interviewer == null)
            {
                return NotFound();
            }

            return Ok(interviewer);
        }

        [HttpPost]
        public async Task<ActionResult<Interviewer>> CreateInterviewer(Interviewer interviewer)
        {
            var createdInterviewer = await _interviewerService.CreateInterviewerAsync(interviewer);
            return CreatedAtAction(nameof(GetInterviewer), new { id = createdInterviewer.Id }, createdInterviewer);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInterviewer(int id, Interviewer interviewer)
        {
            try
            {
                await _interviewerService.UpdateInterviewerAsync(id, interviewer);
            }
            catch (ArgumentException)
            {
                return BadRequest();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInterviewer(int id)
        {
            try
            {
                await _interviewerService.DeleteInterviewerAsync(id);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
