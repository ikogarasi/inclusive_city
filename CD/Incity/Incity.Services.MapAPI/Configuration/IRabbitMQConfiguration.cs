namespace Incity.Services.StructureAPI.Configuration
{
    public interface IRabbitMQConfiguration
    {
        string Hostname { get; set; }
        string Password { get; set; }
        string Username { get; set; }
    }
}