using Microsoft.AspNetCore.Identity;

namespace Incity.Services.AuthAPI.Models
{
    public class IncityRole : IdentityRole
    {
        public string Name { get; set; }
        public UserRole SysType { get; set; }
    }
}
