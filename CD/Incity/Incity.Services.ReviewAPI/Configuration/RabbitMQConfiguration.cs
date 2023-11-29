namespace Incity.Services.ReviewAPI.Configuration
{
    public class RabbitMQConfiguration : IRabbitMQConfiguration
    {
        public string Hostname { get; set; }
        public string Password { get; set; }
        public string Username { get; set; }
    }
}
