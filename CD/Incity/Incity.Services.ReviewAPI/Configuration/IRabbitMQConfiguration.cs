namespace Incity.Services.ReviewAPI.Configuration
{
    public interface IRabbitMQConfiguration
    {
        string Hostname { get; set; }
        string Password { get; set; }
        string Username { get; set; }
    }
}