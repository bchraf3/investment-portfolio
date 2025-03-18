using InvestmentPortfolio.API.Models;

namespace InvestmentPortfolio.API.Repositories;

public interface IPortfolioRepository
{
    Task<IEnumerable<Portfolio>> GetAllPortfoliosAsync(string userId);
    Task<Portfolio?> GetPortfolioByIdAsync(int id, string userId);
    Task<Portfolio> CreatePortfolioAsync(Portfolio portfolio);
    Task UpdatePortfolioAsync(Portfolio portfolio);
    Task DeletePortfolioAsync(int id);
}