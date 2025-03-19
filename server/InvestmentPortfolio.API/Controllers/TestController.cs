using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InvestmentPortfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    [HttpGet("public")]
    public IActionResult Public()
    {
        return Ok(new { message = "This is a public endpoint, no authentication required." });
    }

    [HttpGet("private")]
    [Authorize]
    public IActionResult Private()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var username = User.Identity?.Name;
        
        return Ok(new { 
            message = "This is a private endpoint, authentication required.",
            userId = userId,
            username = username,
            claims = User.Claims.Select(c => new { c.Type, c.Value }),
            authenticated = User.Identity?.IsAuthenticated ?? false,
            timestamp = DateTime.UtcNow
        });
    }

    [HttpGet("permissions")]
    [Authorize]
    public IActionResult Permissions()
    {
        var scopeClaim = User.FindFirst("scope")?.Value ?? "";
        var scopes = scopeClaim.Split(' ');
        
        return Ok(new {
            message = "Your permissions:",
            scopes = scopes,
            allClaims = User.Claims.Select(c => new { c.Type, c.Value })
        });
    }

    [HttpGet("scopes")]
    [Authorize]
    public IActionResult Scopes()
    {
        var scopeClaim = User.FindFirst("scope")?.Value ?? "";
        var scopes = scopeClaim.Split(' ');
        
        return Ok(new {
            message = "Your permissions:",
            scopes = scopes,
            hasReadPortfolios = scopes.Contains("read:portfolios"),
            hasWritePortfolios = scopes.Contains("write:portfolios"),
            hasDeletePortfolios = scopes.Contains("delete:portfolios"),
            allClaims = User.Claims.Select(c => new { c.Type, c.Value })
        });
    }

    [HttpGet("portfolio-scope")]
    [Authorize("read:portfolios")]
    public IActionResult PortfolioScope()
    {
        return Ok(new {
            message = "You have the 'read:portfolios' scope",
            userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
        });
    }
}