using Incity.Services.ReviewAPI.Messages;

namespace Incity.Services.ReviewAPI.RabbitMQSender
{
    public interface IRabbitMQMessageSender
    {
        void SendMessage(StructureRatingDto message);
    }
}