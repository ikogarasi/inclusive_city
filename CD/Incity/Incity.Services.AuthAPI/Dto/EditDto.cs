namespace Incity.Services.AuthAPI.Dto
{
    public record EditDto(string UserName, string? Email, string? Password, IEnumerable<string>? Roles);
}
