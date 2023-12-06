using System.Net;

namespace Incity.Services.QuestionsAPI.Middlewares
{
    public class ExceptionsMiddleware
    {
        private readonly RequestDelegate _next;
        
        public ExceptionsMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(httpContext, ex.Message);
            }
        }

        private async Task HandleExceptionAsync(HttpContext httpContext, string message)
        {
            var response = httpContext.Response;

            response.ContentType = "application/json";
            response.StatusCode = (int)HttpStatusCode.BadRequest;

            await response.WriteAsJsonAsync(new { ErrorMwssage = message });
        }
    }
}
