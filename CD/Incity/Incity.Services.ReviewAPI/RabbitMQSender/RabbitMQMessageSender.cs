using Incity.Services.ReviewAPI.Configuration;
using Incity.Services.ReviewAPI.Messages;
using Newtonsoft.Json;
using RabbitMQ.Client;
using System.Text;

namespace Incity.Services.ReviewAPI.RabbitMQSender
{
    public class RabbitMQMessageSender : IRabbitMQMessageSender
    {
        private readonly IRabbitMQConfiguration _rabbitMQConfiguration;
        private IConnection _connection;

        public RabbitMQMessageSender(IRabbitMQConfiguration rabbitMQConfiguration)
        {
            _rabbitMQConfiguration = rabbitMQConfiguration;
        }

        public void SendMessage(StructureRatingDto message, string queueName)
        {
            if (ConnectionExists())
            {
                using var channel = _connection.CreateModel();

                channel.QueueDeclare(queue: queueName, false, false, false, arguments: null);

                var json = JsonConvert.SerializeObject(message);
                var body = Encoding.UTF8.GetBytes(json);

                channel.BasicPublish(exchange: "", routingKey: queueName, basicProperties: null, body: body);
            }
        }

        private bool ConnectionExists()
        {
            if (_connection != null)
            {
                return true;
            }

            CreateConnection();

            return _connection != null;
        }

        private void CreateConnection()
        {
            try
            {
                var factory = new ConnectionFactory
                {
                    HostName = _rabbitMQConfiguration.Hostname,
                    Password = _rabbitMQConfiguration.Password,
                    UserName = _rabbitMQConfiguration.Username,
                };

                _connection = factory.CreateConnection();
            }
            catch (Exception ex)
            {

            }
        }
    }
}
