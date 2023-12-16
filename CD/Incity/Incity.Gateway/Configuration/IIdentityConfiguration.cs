namespace Incity.Gateway.Configuration
{
    public interface IIdentityConfiguration
    {
        string IdentityAudience { get; set; }
        string IdentityIssuer { get; set; }
        string IdentitySecret { get; set; }
    }
}