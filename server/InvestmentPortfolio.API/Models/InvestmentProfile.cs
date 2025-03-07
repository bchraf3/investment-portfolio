namespace InvestmentPortfolio.API.Models;

public class InvestmentProfile
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    
    // Investment preferences and goals
    public string RiskToleranceLevel { get; set; } = "Moderate"; // Conservative, Moderate, Aggressive
    public decimal MonthlyInvestmentGoal { get; set; } = 0;
    public decimal AnnualReturnGoal { get; set; } = 0;
    public string InvestmentStrategy { get; set; } = string.Empty;
    public string InvestmentTimeHorizon { get; set; } = "Long-term"; // Short-term, Medium-term, Long-term
    
    // Financial information (optional)
    public decimal? AnnualIncome { get; set; }
    public decimal? NetWorth { get; set; }
}