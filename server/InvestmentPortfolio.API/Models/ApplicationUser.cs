namespace InvestmentPortfolio.API.Models;

public class ApplicationUser
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastLoginAt { get; set; } = DateTime.UtcNow;
    
    // User Preferences
    public UserPreferences Preferences { get; set; } = new();
    
    // Portfolio Settings
    public InvestmentProfile InvestmentProfile { get; set; } = new();
    public ICollection<WatchlistItem> Watchlist { get; set; } = new List<WatchlistItem>();
    
    // Navigation properties
    public ICollection<Portfolio> Portfolios { get; set; } = new List<Portfolio>();
    public ICollection<UserActivity> ActivityHistory { get; set; } = new List<UserActivity>();
}