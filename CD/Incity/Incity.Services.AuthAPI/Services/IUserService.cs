using Incity.Services.AuthAPI.Dto;
using Incity.Services.AuthAPI.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Incity.Services.AuthAPI.Services
{
    public interface IUserService
    {
        Task<IncityUser> CreateUser(RegisterDto dto);
        Task<IncityUser> Edit(EditDto dto);
        Task<string> GenerateRefreshToken(IncityUser user);
        Task<string> GenerateToken(IncityUser user);
        ClaimsPrincipal? GetClaimsPrincipalFromExpiredToken(string token);
        Task<IncityUser> GetUser(string username);
        Task<IEnumerable<UserForAdministrationDto>> GetUserForAdministration();
        Task<IEnumerable<IdentityResult>> AddRoles(IncityUser user, IEnumerable<string> roles);
    }
}