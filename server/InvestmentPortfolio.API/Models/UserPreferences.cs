namespace InvestmentPortfolio.API.Models;

public class UserPreferences
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    
    // Theme preferences
    public string ThemePreference { get; set; } = "Light"; // Light, Dark, System
    
    // Notification settings
    public bool EmailNotificationsEnabled { get; set; } = true;
    public bool PriceAlertNotificationsEnabled { get; set; } = true;
    public bool PortfolioSummaryNotificationsEnabled { get; set; } = true;
    
    // Display preferences
    public string DefaultPortfolioView { get; set; } = "Summary"; // Summary, Detailed, Performance
    public string DefaultCurrency { get; set; } = "USD";
    public bool ShowPerformanceInPercentage { get; set; } = true;
}