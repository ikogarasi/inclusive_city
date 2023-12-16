using Incity.Services.AuthAPI.Models;

namespace Incity.Services.AuthAPI.Dto
{
    public record UserForAdministrationDto(string Id, 
        string UserName, 
        string Email, 
        IEnumerable<UserRole> Roles);
}
