using Microsoft.AspNetCore.Mvc;
using ATS.Interviews.Business.Services.Interfaces;
using ATS.Interviews.Data.Models;

namespace ATS.Interviews.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InterviewController : ControllerBase
    {
        private readonly IInterviewService _interviewService;

        public InterviewController(IInterviewService interviewService)
        {
            _interviewService = interviewService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Interview>>> GetInterviews()
        {
            var interviews = await _interviewService.GetInterviewsAsync();
            return Ok(interviews);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Interview>> GetInterview(int id)
        {
            var interview = await _interviewService.GetInterviewByIdAsync(id);
            if (interview == null)
            {
                return NotFound();
            }

            return Ok(interview);
        }

        [HttpPost]
        public async Task<ActionResult<Interview>> CreateInterview(Interview interview)
        {
            var createdInterview = await _interviewService.CreateInterviewAsync(interview);
            return CreatedAtAction(nameof(GetInterview), new { id = createdInterview.Id }, createdInterview);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInterview(int id, Interview interview)
        {
            try
            {
                await _interviewService.UpdateInterviewAsync(id, interview);
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
        public async Task<IActionResult> DeleteInterview(int id)
        {
            try
            {
                await _interviewService.DeleteInterviewAsync(id);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("{interviewId}/interviewer/{interviewerId}")]
        public async Task<IActionResult> RemoveInterviewerFromInterview(int interviewId, int interviewerId)
        {
            try
            {
                await _interviewService.RemoveInterviewerFromInterviewAsync(interviewId, interviewerId);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }

            return NoContent();
        }

        [HttpPost("{interviewId}/interviewer")]
        public async Task<IActionResult> AddInterviewerToInterview(int interviewId, [FromBody] InterviewInterviewer interviewInterviewer)
        {
            try
            {
                await _interviewService.AddInterviewerToInterviewAsync(interviewId, interviewInterviewer.InterviewerId, interviewInterviewer.InterviewTemplateId);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }

            return NoContent();
        }

        [HttpGet("byInterviewer/{interviewerId}")]
        public async Task<ActionResult<IEnumerable<Interview>>> GetInterviewsByInterviewer(int interviewerId)
        {
            var interviews = await _interviewService.GetInterviewsByInterviewerAsync(interviewerId);
            return Ok(interviews);
        }



    }
}


