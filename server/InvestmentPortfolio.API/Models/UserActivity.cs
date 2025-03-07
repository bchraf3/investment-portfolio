namespace InvestmentPortfolio.API.Models;

public class UserActivity
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    
    public string ActivityType { get; set; } = string.Empty; // Login, Portfolio Creation, Investment, etc.
    public string Description { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string? RelatedEntityType { get; set; } // Portfolio, Investment, etc.
    public int? RelatedEntityId { get; set; }
}