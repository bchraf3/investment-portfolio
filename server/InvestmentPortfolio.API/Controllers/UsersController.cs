using System.Net.Http.Headers;
using System.Text.Json;
using InvestmentPortfolio.API.Models;
using InvestmentPortfolio.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InvestmentPortfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    public UsersController(
        IUserService userService, 
        ILogger<UsersController> logger,
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration)
    {
        _userService = userService;
        _logger = logger;
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }

    [HttpPost("sync")]
    [Authorize]
    public async Task<ActionResult<ApplicationUser>> SyncUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            _logger.LogWarning("Missing user ID in token");
            return BadRequest(new { error = "User ID claim missing from token" });
        }

        try
        {
            // Get the access token from the request
            var accessToken = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            // Get user profile from Auth0 userinfo endpoint
            var userInfo = await GetUserInfoAsync(accessToken);
            
            if (userInfo == null || string.IsNullOrEmpty(userInfo.Email))
            {
                return BadRequest(new { error = "Could not retrieve email from Auth0" });
            }

            var user = await _userService.SyncUserAsync(userId, userInfo.Email);
            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error syncing user");
            return StatusCode(500, new { error = "Failed to sync user", message = ex.Message });
        }
    }

    private async Task<UserInfo?> GetUserInfoAsync(string accessToken)
    {
        var client = _httpClientFactory.CreateClient();
        var domain = _configuration["Auth0:Domain"];

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        
        var response = await client.GetAsync($"https://{domain}/userinfo");
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<UserInfo>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
        
        _logger.LogError("Failed to get user info: {StatusCode}", response.StatusCode);
        return null;
    }

    // Simple model to receive user info
    private class UserInfo
    {
        public string? Sub { get; set; }
        public string? Email { get; set; }
        public string? Name { get; set; }
    }

}