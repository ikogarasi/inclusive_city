namespace Incity.Services.ReviewAPI.Configuration
{
    public interface IRabbitMQConfiguration
    {
        string QueueName { get; set; }
        string Hostname { get; set; }
        string Password { get; set; }
        string Username { get; set; }
    }
}