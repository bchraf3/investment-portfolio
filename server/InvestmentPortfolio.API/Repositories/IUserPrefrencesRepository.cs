using InvestmentPortfolio.API.Models;

namespace InvestmentPortfolio.API.Repositories;

public interface IUserPreferencesRepository
{
    Task<UserPreferences?> GetUserPreferencesAsync(string userId);
    Task<UserPreferences> CreateUserPreferencesAsync(UserPreferences preferences);
    Task UpdateUserPreferencesAsync(UserPreferences preferences);
}