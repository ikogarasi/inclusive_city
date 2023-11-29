using Incity.Services.ReviewAPI.Dto;
using Incity.Services.ReviewAPI.Infrastructure;
using Incity.Services.ReviewAPI.Messages;
using Incity.Services.ReviewAPI.Models;
using Incity.Services.ReviewAPI.RabbitMQSender;
using Microsoft.EntityFrameworkCore;

namespace Incity.Services.ReviewAPI.Services
{
    public class ReviewService : IReviewService
    {
        private readonly ReviewDbContext _dbContext;
        private readonly IRabbitMQMessageSender _rabbitMQSender;

        public ReviewService(ReviewDbContext dbContext, IRabbitMQMessageSender rabbitMQSender)
        {
            _dbContext = dbContext;
            _rabbitMQSender = rabbitMQSender;
        }

        public async Task<IEnumerable<Review>> GetReviewsForStructure(Guid structureId)
        {
            return await _dbContext.Reviews
                .AsNoTracking()
                .Where(i => i.StructureId == structureId)
                .ToListAsync();
        }

        public async Task<Review> AddReview(ReviewDto dto, string username)
        {
            var review = new Review
            {
                Username = username,
                Description = dto.Description,
                Rating = dto.Rating,
                StructureId = dto.StructureId,
            };

            await _dbContext.Reviews.AddAsync(review);
            await _dbContext.SaveChangesAsync();

            var structureAverageRating = await CalculateRating(dto.StructureId);

            _rabbitMQSender.SendMessage(structureAverageRating, "structureRatingQueue");

            return review;
        }

        public async Task RemoveReview(Guid reviewId)
        {
            var reviewFromDb = await _dbContext.Reviews
                .FirstOrDefaultAsync(i => i.Id == reviewId)
                    ?? throw new ArgumentException("Review with such id does not exist");

            _dbContext.Reviews.Remove(reviewFromDb);
            await _dbContext.SaveChangesAsync();

            var structureAverageRating = await CalculateRating(reviewFromDb.StructureId);

            _rabbitMQSender.SendMessage(structureAverageRating, "structureRatingQueue");
        }

        private async Task<StructureRatingDto?> CalculateRating(Guid structureId)
        {
            return await _dbContext.Reviews
                .AsNoTracking()
                .Where(i => i.StructureId == structureId)
                .GroupBy(i => i.StructureId)
                .Select(group => new StructureRatingDto
                {
                    StructureId = group.Key,
                    Rating = group.Average(i => i.Rating),
                })
                .FirstOrDefaultAsync();
        }
    }
}
