using Incity.Services.ReviewAPI.Dto;
using Incity.Services.ReviewAPI.Models;
using Incity.Services.ReviewAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Incity.Services.ReviewAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet("{structureId}")]
        public async Task<IActionResult> GetReviewsForStructure(Guid structureId)
        {
            return Ok(await _reviewService.GetReviewsForStructure(structureId));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SubmitReview(ReviewDto dto)
        {
            var username = User.FindFirstValue(ClaimTypes.Name);

            return Ok(await _reviewService.AddReview(dto, username));
        }

        [HttpDelete("{reviewId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveReview(Guid reviewId)
        {
            await _reviewService.RemoveReview(reviewId);

            return Ok();
        }
    }
}
