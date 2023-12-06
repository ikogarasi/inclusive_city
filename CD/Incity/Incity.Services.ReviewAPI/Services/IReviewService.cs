using Incity.Services.ReviewAPI.Dto;
using Incity.Services.ReviewAPI.Models;

namespace Incity.Services.ReviewAPI.Services
{
    public interface IReviewService
    {
        Task<Review> AddReview(ReviewDto dto, string username);
        Task<IEnumerable<Review>> GetReviewsForStructure(Guid structureId);
        Task RemoveReview(Guid reviewId);
    }
}