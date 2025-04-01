using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using InvestmentPortfolio.API.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace InvestmentPortfolio.API.Extensions;

public static class Auth0Extensions
{
    public static IServiceCollection AddAuth0Authentication(this IServiceCollection services, IConfiguration configuration)
    {
        var domain = $"https://{configuration["Auth0:Domain"]}/";
        
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Authority = domain;
                options.Audience = configuration["Auth0:Audience"];
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = ClaimTypes.NameIdentifier
                };
            });

        services.AddAuthorization(options =>
        {
            // Define policies for different permissions
            options.AddPolicy("read:portfolios", policy => policy.Requirements.Add(
                new HasScopeRequirement("read:portfolios", domain)
            ));
            options.AddPolicy("write:portfolios", policy => policy.Requirements.Add(
                new HasScopeRequirement("write:portfolios", domain)
            ));
            options.AddPolicy("delete:portfolios", policy => policy.Requirements.Add(
                new HasScopeRequirement("delete:portfolios", domain)
            ));
            options.AddPolicy("read:investments", policy => policy.Requirements.Add(
                new HasScopeRequirement("read:investments", domain)
            ));
            options.AddPolicy("write:investments", policy => policy.Requirements.Add(
                new HasScopeRequirement("write:investments", domain)
            ));
            options.AddPolicy("delete:investments", policy => policy.Requirements.Add(
                new HasScopeRequirement("delete:investments", domain)
            ));
            options.AddPolicy("read:preferences", policy => policy.Requirements.Add(
                new HasScopeRequirement("read:preferences", domain)
            ));
        });

        services.AddSingleton<IAuthorizationHandler, HasScopeHandler>();

        return services;
    }
}