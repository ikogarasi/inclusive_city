using Incity.Services.AuthAPI.Dto;
using Incity.Services.AuthAPI.Models;
using Incity.Services.AuthAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;

namespace Incity.Services.AuthAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IPasswordHasher<IncityUser> _passwordHasher;
        private readonly IConfiguration _configuration;

        public UserController(IUserService userService, 
            IPasswordHasher<IncityUser> passwordHasher, 
            IConfiguration configuration)
        {
            _userService = userService;
            _passwordHasher = passwordHasher;
            _configuration = configuration;
        }

        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        [HttpGet("UsersForAdministration")]
        [ProducesResponseType(typeof(IEnumerable<UserForAdministrationDto>), 200)]
        public async Task<IActionResult> GetUserForAdministration()
        {
            var result = await _userService.GetUserForAdministration();

            return Ok(result);
        }

        [HttpPost("Login")]
        [ProducesResponseType(typeof(TokenDto), 200)]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userService.GetUser(dto.UserName);

            if (user != null)
            {
                var hashResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            
                if (hashResult == PasswordVerificationResult.Success)
                {
                    var token = await _userService.GenerateToken(user);
                    var refreshToken = await _userService.GenerateRefreshToken(user);

                    return Ok(new TokenDto
                    (
                        token,
                        refreshToken
                    ));
                }
            }

            return Unauthorized();
        }

        [HttpPost("Register")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (await _userService.GetUser(dto.UserName) != null)
            {
                return BadRequest("User with same name already exists");
            }

            var user = await _userService.CreateUser(dto);
            var results = await _userService.AddRoles(user, new List<string> { UserRole.User.ToString() });
            var errors = results.SelectMany(i => i.Errors);

            if (errors.Any())
            {
                return BadRequest(string.Join('\n', errors.Select(i => i.Description)));
            }

            return Ok();
        }

        [HttpPost("Refresh-Token")]
        [ProducesResponseType(typeof(TokenDto), 200)]
        public async Task<IActionResult> RefreshToken([FromBody] TokenDto dto)
        {
            var refreshToken = dto.RefreshToken;
            var accessToken = dto.AccessToken;

            var principal = _userService.GetClaimsPrincipalFromExpiredToken(accessToken);

            if (principal == null) 
            {
                return BadRequest("Invalid access or request token");
            }

            var user = await _userService.GetUser(principal.Identity.Name);

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiry <= DateTime.Now)
            {
                return BadRequest("Invalid access or request token");
            }

            var newAccessToken = await _userService.GenerateToken(user);
            var newRefreshToken = await _userService.GenerateRefreshToken(user);

            Response.Cookies.Append("token", newAccessToken);
            Response.Cookies.Append("refreshToken", newRefreshToken);

            return Ok(new TokenDto
            (
                newAccessToken,
                newRefreshToken
            ));
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost("Edit")]
        [ProducesResponseType(typeof(IncityUser), 200)]
        public async Task<IActionResult> Edit([FromBody] EditDto dto)
        {
            try
            {
                var user = await _userService.Edit(dto);
                return Ok(user);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }
    }
}
