using InvestmentPortfolio.API.Data;
using InvestmentPortfolio.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Text.Json; // Add this import
using System.Threading.Tasks;

namespace InvestmentPortfolio.API.Repositories;

public class UserPreferencesRepository : IUserPreferencesRepository
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<UserPreferencesRepository> _logger;

    public UserPreferencesRepository(ApplicationDbContext context, ILogger<UserPreferencesRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<UserPreferences?> GetUserPreferencesAsync(string userId)
    {
        try
        {
            _logger.LogInformation("Retrieving preferences for user {UserId}", userId);
            
            var preferences = await _context.UserPreferences
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.UserId == userId);
                
            if (preferences == null)
            {
                _logger.LogInformation("No preferences found for user {UserId}", userId);
            }
            else
            {
                _logger.LogDebug("Found preferences: {Preferences}", JsonSerializer.Serialize(preferences));
            }
            
            return preferences;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving preferences for user {UserId}", userId);
            throw;
        }
    }

    public async Task<UserPreferences> CreateUserPreferencesAsync(UserPreferences preferences)
    {
        try
        {
            _logger.LogInformation("Creating preferences for user {UserId}", preferences.UserId);
            _logger.LogDebug("Preferences to create: {Preferences}", JsonSerializer.Serialize(preferences));
            
            _context.UserPreferences.Add(preferences);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Successfully created preferences with ID {Id}", preferences.Id);
            return preferences;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating preferences for user {UserId}", preferences.UserId);
            throw;
        }
    }
    
    public async Task UpdateUserPreferencesAsync(UserPreferences preferences)
    {
        try
        {
            _logger.LogInformation("Updating preferences for user {UserId} with ID {Id}", 
                preferences.UserId, preferences.Id);
            _logger.LogDebug("UpdateUserPreferencesAsync called with preferences: {Preferences}", 
                JsonSerializer.Serialize(preferences));
            
            // First, detach any existing entity with the same ID to avoid tracking conflicts
            var existingEntry = _context.ChangeTracker.Entries<UserPreferences>()
                .FirstOrDefault(e => e.Entity.Id == preferences.Id);
                
            if (existingEntry != null)
            {
                _logger.LogDebug("Detaching existing entry from change tracker");
                existingEntry.State = EntityState.Detached;
            }
            
            // Attach and mark as modified
            _context.UserPreferences.Attach(preferences);
            _context.Entry(preferences).State = EntityState.Modified;
            _logger.LogDebug("Entity state set to Modified");
            
            var changes = await _context.SaveChangesAsync();
            _logger.LogInformation("SaveChangesAsync completed. Records affected: {RecordCount}", changes);
            
            if (changes == 0)
            {
                _logger.LogWarning("No records were updated for user {UserId}", preferences.UserId);
            }
        }
        catch (DbUpdateConcurrencyException ex)
        {
            _logger.LogError(ex, "Concurrency error updating preferences for user {UserId}", preferences.UserId);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in UpdateUserPreferencesAsync for user {UserId}", preferences.UserId);
            throw;
        }
    }
}