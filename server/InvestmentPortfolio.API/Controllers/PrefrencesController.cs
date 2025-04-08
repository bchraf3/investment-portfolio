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
            // Log request details
            _logger.LogDebug("Request content type: {ContentType}", Request.ContentType);
            _logger.LogDebug("Request body: {RequestBody}", await new System.IO.StreamReader(Request.Body).ReadToEndAsync());
            
            string userId = GetUserId();
            _logger.LogInformation("Processing preference update for user: {UserId}", userId);
            _logger.LogInformation("Received preferences data: {Preferences}", JsonSerializer.Serialize(preferences));
            
            // Ensure we're updating the correct user's preferences
            preferences.UserId = userId;
            _logger.LogDebug("Set userId in preferences object to: {UserId}", userId);
            
            var existingPreferences = await _preferencesRepository.GetUserPreferencesAsync(userId);
            _logger.LogDebug("Existing preferences: {ExistingPreferences}", 
                existingPreferences != null ? JsonSerializer.Serialize(existingPreferences) : "null");
            
            if (existingPreferences == null)
            {
                _logger.LogInformation("No existing preferences found, creating new record for user: {UserId}", userId);
                preferences.Id = 0;
                
                var createdPreferences = await _preferencesRepository.CreateUserPreferencesAsync(preferences);
                _logger.LogInformation("Successfully created preferences with ID: {PreferenceId}", createdPreferences.Id);
                
                return CreatedAtAction(nameof(GetUserPreferences), createdPreferences);
            }
            else
            {
                _logger.LogInformation("Updating existing preferences with ID: {PreferenceId} for user: {UserId}", 
                    existingPreferences.Id, userId);
                
                preferences.Id = existingPreferences.Id;
                _logger.LogDebug("Before repository update call. Preferences object: {Preferences}", 
                    JsonSerializer.Serialize(preferences));
                
                await _preferencesRepository.UpdateUserPreferencesAsync(preferences);
                _logger.LogInformation("Successfully updated preferences for user: {UserId}", userId);
                
                return NoContent();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user preferences");
            return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
        }
    }
}