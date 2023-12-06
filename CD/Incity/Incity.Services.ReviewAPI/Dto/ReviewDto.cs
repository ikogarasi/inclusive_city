namespace Incity.Services.ReviewAPI.Dto
{
    public class ReviewDto
    {
        public Guid StructureId { get; set; }
        public string? Description { get; set; }
        public double Rating { get; set; }
    }
}
