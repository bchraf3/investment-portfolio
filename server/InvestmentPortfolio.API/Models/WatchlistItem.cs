namespace InvestmentPortfolio.API.Models;

public class WatchlistItem
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    
    public string Symbol { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public DateTime AddedDate { get; set; } = DateTime.UtcNow;
    public decimal? PriceAlertThreshold { get; set; }
}