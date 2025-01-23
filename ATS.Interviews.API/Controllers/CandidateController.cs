using Microsoft.AspNetCore.Mvc;
using ATS.Interviews.Business.Services.Interfaces;
using ATS.Interviews.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace ATS.Interviews.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CandidateController : ControllerBase
    {
        private readonly ICandidateService _candidateService;

        public CandidateController(ICandidateService candidateService)
        {
            _candidateService = candidateService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Candidate>>> GetCandidates()
        {
            var candidates = await _candidateService.GetCandidatesAsync();
            return Ok(candidates);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Candidate>> GetCandidate(int id)
        {
            var candidate = await _candidateService.GetCandidateByIdAsync(id);
            if (candidate == null)
            {
                return NotFound();
            }

            return Ok(candidate);
        }

        [HttpPost]
        public async Task<ActionResult<Candidate>> CreateCandidate(Candidate candidate)
        {
            var createdCandidate = await _candidateService.CreateCandidateAsync(candidate);
            return CreatedAtAction(nameof(GetCandidate), new { id = createdCandidate.Id }, createdCandidate);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Candidate>> UpdateCandidate(int id, Candidate candidate)
        {
            try
            {
                var updatedCandidate = await _candidateService.UpdateCandidateAsync(id, candidate);
                return Ok(updatedCandidate);
            }
            catch (ArgumentException)
            {
                return BadRequest();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCandidate(int id)
        {
            try
            {
                await _candidateService.DeleteCandidateAsync(id);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
