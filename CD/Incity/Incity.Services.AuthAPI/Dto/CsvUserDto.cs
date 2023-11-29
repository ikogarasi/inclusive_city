namespace Incity.Services.AuthAPI.Dto
{
    public record CsvUserDto(string Username,string Email, string Password, IEnumerable<string> Roles);
}
