using Incity.Services.StructureAPI.Configuration;
using Incity.Services.StructureAPI.Messages;
using Incity.Services.StructureAPI.Repository;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;

namespace Incity.Services.StructureAPI.RabbitMQConsumer
{
    public class RabbitMQReviewConsumer : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IRabbitMQConfiguration _configuration;
        private readonly IConnection _connection;
        private readonly IModel _channel;

        public RabbitMQReviewConsumer(IServiceProvider serviceProvider, IRabbitMQConfiguration configuration)
        {
            _serviceProvider = serviceProvider;
            _configuration = configuration;

            var factory = new ConnectionFactory
            {
                HostName = _configuration.Hostname,
                UserName = _configuration.Username, 
                Password = _configuration.Password,
            };

            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();
            _channel.QueueDeclare(queue: _configuration.QueueName, true, false, false, arguments: null);
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            stoppingToken.ThrowIfCancellationRequested();

            var consumer = new EventingBasicConsumer(_channel);

            consumer.Received += (ch, ea) =>
            {
                var content = Encoding.UTF8.GetString(ea.Body.ToArray());
                var structureRatingDto = JsonConvert.DeserializeObject<StructureRatingDto>(content);

                using var scope = _serviceProvider.CreateScope();

                var structureService = scope.ServiceProvider.GetRequiredService<IStructureRepository>();

                structureService.ChangeRating(structureRatingDto.StructureId, structureRatingDto.Rating)
                    .GetAwaiter().GetResult();

                _channel.BasicAck(ea.DeliveryTag, false);
            };

            try
            {
                _channel.BasicConsume(_configuration.QueueName, false, consumer);
            }
            catch
            {
                Console.WriteLine("RabbitMQ went down");
            }

            return Task.CompletedTask;
        }
    }
}
