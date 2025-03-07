namespace InvestmentPortfolio.API.Models;

public class Portfolio
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Investment> Investments { get; set; } = new List<Investment>();
    public ApplicationUser User { get; set; } = null!;
}