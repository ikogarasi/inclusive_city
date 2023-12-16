using Incity.Services.ReviewAPI.Configuration;
using Incity.Services.ReviewAPI.Messages;
using Newtonsoft.Json;
using RabbitMQ.Client;
using System.Text;

namespace Incity.Services.ReviewAPI.RabbitMQSender
{
    public class RabbitMQMessageSender : IRabbitMQMessageSender
    {
        private readonly IRabbitMQConfiguration _configuration;
        private IConnection _connection;

        public RabbitMQMessageSender(IRabbitMQConfiguration rabbitMQConfiguration)
        {
            _configuration = rabbitMQConfiguration;
        }

        public void SendMessage(StructureRatingDto message)
        {
            if (ConnectionExists())
            {
                using var channel = _connection.CreateModel();

                channel.QueueDeclare(queue: _configuration.QueueName, true, false, false, arguments: null);

                var json = JsonConvert.SerializeObject(message);
                var body = Encoding.UTF8.GetBytes(json);

                channel.BasicPublish(exchange: "", routingKey: _configuration.QueueName, basicProperties: null, body: body);
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
                    HostName = _configuration.Hostname,
                    Password = _configuration.Password,
                    UserName = _configuration.Username,
                };

                _connection = factory.CreateConnection();
            }
            catch (Exception ex)
            {

            }
        }
    }
}
