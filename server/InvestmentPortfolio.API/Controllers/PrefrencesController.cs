using InvestmentPortfolio.API.Models;
using InvestmentPortfolio.API.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace InvestmentPortfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PreferencesController : ControllerBase
{
    private readonly IUserPreferencesRepository _preferencesRepository;
    private readonly ILogger<PreferencesController> _logger;

    public PreferencesController(IUserPreferencesRepository preferencesRepository, ILogger<PreferencesController> logger)
    {
        _preferencesRepository = preferencesRepository;
        _logger = logger;
        _logger.LogInformation("PreferencesController initialized");
    }

    // Get the current user's ID from their claims
    private string GetUserId()
    {
        _logger.LogDebug("Getting user ID from claims");
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            _logger.LogWarning("User ID not found in token");
            throw new UnauthorizedAccessException("User ID not found in token");
        }
        
        _logger.LogDebug("User ID from claims: {UserId}", userId);
        return userId;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<UserPreferences>> GetUserPreferences()
    {
        _logger.LogInformation("GetUserPreferences endpoint called");
        try 
        {
            string userId = GetUserId();
            _logger.LogInformation("Getting preferences for user: {UserId}", userId);
            
            var preferences = await _preferencesRepository.GetUserPreferencesAsync(userId);
            _logger.LogDebug("Repository returned preferences: {Preferences}", 
                preferences != null ? JsonSerializer.Serialize(preferences) : "null");
            
            if (preferences == null)
            {
                _logger.LogInformation("No preferences found for user: {UserId}", userId);
                return NotFound(new { message = "User preferences not found" });
            }
                
            _logger.LogInformation("Successfully retrieved preferences for user: {UserId}", userId);
            return Ok(preferences);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized access attempt");
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user preferences");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdateUserPreferences([FromBody] UserPreferences preferences)
    {
        _logger.LogInformation("UpdateUserPreferences endpoint called");
        try
        {
            string userId = GetUserId();
            
            // Log the incoming preferences object for debugging
            _logger.LogDebug("Incoming preferences: {Preferences}", JsonSerializer.Serialize(preferences));
            
            // Ensure we're updating the correct user's preferences
            preferences.UserId = userId;
            
            var existingPreferences = await _preferencesRepository.GetUserPreferencesAsync(userId);
            
            if (existingPreferences == null)
            {
                _logger.LogInformation("Creating new preferences for user: {UserId}", userId);
                preferences.Id = 0; // Ensure ID is 0 for new record
                var created = await _preferencesRepository.CreateUserPreferencesAsync(preferences);
                return CreatedAtAction(nameof(GetUserPreferences), created);
            }
            
            // Copy the ID from existing preferences
            preferences.Id = existingPreferences.Id;
            
            await _preferencesRepository.UpdateUserPreferencesAsync(preferences);
            return Ok(new { success = true, message = "Preferences updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user preferences");
            return StatusCode(500, new { error = ex.Message });
        }
    }
}