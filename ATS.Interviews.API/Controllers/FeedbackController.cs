using Microsoft.AspNetCore.Mvc;
using ATS.Interviews.Data.Models;
using ATS.Interviews.Business.Services.Interfaces;

namespace ATS.Interviews.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;

        public FeedbackController(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbacks()
        {
            var feedbacks = await _feedbackService.GetFeedbacksAsync();
            return Ok(feedbacks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Feedback>> GetFeedback(int id)
        {
            var feedback = await _feedbackService.GetFeedbackByIdAsync(id);
            if (feedback == null)
            {
                return NotFound();
            }

            return Ok(feedback);
        }

        [HttpGet("interview/{interviewId}/interviewer/{interviewerId}")]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbacksByInterviewAndInterviewer(int interviewId, int interviewerId)
        {
            var feedbacks = await _feedbackService.GetFeedbacksByInterviewAndInterviewerAsync(interviewId, interviewerId);
            return Ok(feedbacks);
        }

        [HttpPost("save")]
        public async Task<ActionResult> SaveFeedbacks([FromBody] List<Feedback> feedbacks)
        {
            await _feedbackService.SaveFeedbacksAsync(feedbacks);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFeedback(int id, Feedback feedback)
        {
            try
            {
                await _feedbackService.UpdateFeedbackAsync(id, feedback);
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
        public async Task<IActionResult> DeleteFeedback(int id)
        {
            try
            {
                await _feedbackService.DeleteFeedbackAsync(id);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
