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
            _logger.LogInformation("Updating preferences for user {UserId}", preferences.UserId);
            
            // Get existing record by ID
            var existingPreferences = await _context.UserPreferences
                .FirstOrDefaultAsync(p => p.Id == preferences.Id);
                
            if (existingPreferences == null)
            {
                throw new KeyNotFoundException($"Preferences with ID {preferences.Id} not found");
            }
            
            // Update specific fields only
            existingPreferences.ThemePreference = preferences.ThemePreference;
            existingPreferences.EmailNotificationsEnabled = preferences.EmailNotificationsEnabled;
            existingPreferences.PriceAlertNotificationsEnabled = preferences.PriceAlertNotificationsEnabled;
            existingPreferences.PortfolioSummaryNotificationsEnabled = preferences.PortfolioSummaryNotificationsEnabled;
            existingPreferences.DefaultPortfolioView = preferences.DefaultPortfolioView;
            existingPreferences.DefaultCurrency = preferences.DefaultCurrency;
            existingPreferences.ShowPerformanceInPercentage = preferences.ShowPerformanceInPercentage;
        
            
            await _context.SaveChangesAsync();
            _logger.LogInformation("Successfully updated preferences for user {UserId}", preferences.UserId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating preferences for user {UserId}", preferences.UserId);
            throw;
        }
    }
}