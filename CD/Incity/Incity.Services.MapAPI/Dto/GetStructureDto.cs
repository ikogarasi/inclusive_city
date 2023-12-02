namespace Incity.Services.StructureAPI.Dto
{
    public class GetStructureDto
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public string Category { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double Rating { get; set; }
        public double? DistanceInKm { get; set; }

        public GetStructureDto(
            Guid? id,
            string name,
            string description,
            string imageUrl,
            string category,
            double latitude,
            double longitude,
            double rating,
            double? distanceInKm)
        {
            Id = id;
            Name = name;
            Description = description;
            ImageUrl = imageUrl;
            Category = category;
            Latitude = latitude;
            Longitude = longitude;
            Rating = rating;
            DistanceInKm = distanceInKm;
        }
    }
}
