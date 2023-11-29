namespace Incity.Services.AuthAPI.Configuraiton
{
    public interface IIdentityConfiguration
    {
        int DurationInMinutes { get; set; }
        string IdentityAudience { get; set; }
        string IdentityIssuer { get; set; }
        string IdentitySecret { get; set; }
        int RefreshTokenDurationInDays { get; set; }
    }
}