namespace InvestmentPortfolio.API.Models;

public class Investment
{
    public int Id { get; set; }
    public string Symbol { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal PurchasePrice { get; set; }
    public DateTime PurchaseDate { get; set; }
    public int PortfolioId { get; set; }
    public Portfolio Portfolio { get; set; } = null!;
}