﻿namespace Incity.Gateway.Configuration
{
    public class IdentityConfiguration : IIdentityConfiguration
    {
        public string IdentityIssuer { get; set; }
        public string IdentityAudience { get; set; }
        public string IdentitySecret { get; set; }
    }
}
