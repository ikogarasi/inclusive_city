using Incity.Services.AuthAPI.Configuraiton;
using Incity.Services.AuthAPI.Dto;
using Incity.Services.AuthAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Incity.Services.AuthAPI.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<IncityUser> _userManager;
        private readonly IIdentityConfiguration _configuration;
        private readonly HttpContext _httpContext;

        public UserService(UserManager<IncityUser> userManager, IIdentityConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _configuration = configuration;
            _httpContext = httpContextAccessor.HttpContext;
        }

        public async Task<IncityUser> CreateUser(RegisterDto dto)
        {
            if (dto == null)
            {
                throw new ArgumentNullException(nameof(dto));
            }

            var user = new IncityUser
            {
                UserName = dto.UserName,
                Email = dto.Email,
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                throw new InvalidOperationException();
            }

            return user;
        }

        public async Task<IncityUser> Edit(EditDto dto)
        {
            if (string.IsNullOrEmpty(dto.UserName))
            {
                throw new InvalidDataException("UserName is required");
            }

            var user = await _userManager.FindByNameAsync(dto.UserName)
                ?? throw new InvalidDataException();

            var userClaims = _httpContext.User.Identity as ClaimsIdentity;
            var userName = userClaims?.FindFirst(ClaimTypes.Name)?.Value;

            if (userName != dto.UserName || !_httpContext.User.IsInRole("Admin")) 
            { 
                throw new UnauthorizedAccessException();
            }

            if (!string.IsNullOrEmpty(dto.Email))
            {
                var token = await _userManager.GenerateChangeEmailTokenAsync(user, dto.Email);
                var result = await _userManager.ChangeEmailAsync(user, dto.Email, token);

                if (!result.Succeeded)
                {
                    throw new InvalidOperationException("Invalid email");
                }
            }

            if (!string.IsNullOrEmpty(dto.Password))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, token, dto.Password);

                if (!result.Succeeded)
                {
                    throw new InvalidOperationException("Invalid password");
                }
            }

            if (dto.Roles != null)
            {
                var roles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, roles);
                var result = await _userManager.AddToRolesAsync(user, dto.Roles);

                if (!result.Succeeded)
                {
                    throw new InvalidOperationException("Invalid roles");
                }
            }

            return user;
        }

        public async Task<IEnumerable<IdentityResult>> AddRoles(IncityUser user, IEnumerable<string> roles)
        {
            if (user is null)
                throw new ArgumentNullException(nameof(user));

            if (roles is null)
                throw new ArgumentNullException(nameof(roles));

            var result = new List<IdentityResult>();
            foreach (var role in roles)
            {
                var identityResult = await _userManager.AddToRoleAsync(user, role);
                result.Add(identityResult);
            }

            return result;
        }

        public async Task<IEnumerable<UserForAdministrationDto>> GetUserForAdministration()
        {
            var users = _userManager.Users;
            var result = new List<UserForAdministrationDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var userRoles = roles.Select(i => Enum.Parse<UserRole>(i));

                result.Add(new UserForAdministrationDto
                (
                    user.Id,
                    user.UserName,
                    user.Email,
                    userRoles
                ));
            }

            return result;
        }

        public async Task<IncityUser> GetUser(string username)
        {
            return await _userManager.FindByNameAsync(username);
        }

        public async Task<string> GenerateToken(IncityUser user)
        {
            var userRoles = await _userManager.GetRolesAsync(user)
                ?? throw new InvalidOperationException($"No roles for user {user.UserName}");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            foreach (var role in userRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.IdentitySecret));
            var credentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256Signature);
            var token = new JwtSecurityToken(
                issuer: _configuration.IdentityIssuer,
                audience: _configuration.IdentityAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_configuration.DurationInMinutes),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }

        public ClaimsPrincipal? GetClaimsPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.IdentitySecret)),
                ValidIssuer = _configuration.IdentityIssuer,
                ValidAudience = _configuration.IdentityAudience,
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);


            if (securityToken is not JwtSecurityToken jwtSecurityToken || 
                !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256Signature, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token");
            }

            return principal;
        }

        public async Task<string> GenerateRefreshToken(IncityUser user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            user.RefreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(_configuration.RefreshTokenDurationInDays);

            var result = await _userManager.UpdateAsync(user);

            return user.RefreshToken;
        }
    }
}
