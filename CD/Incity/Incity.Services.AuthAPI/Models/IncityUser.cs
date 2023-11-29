using Microsoft.AspNetCore.Identity;

namespace Incity.Services.AuthAPI.Models
{
    public class IncityUser : IdentityUser
    {
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiry { get; set; }
    }
}
