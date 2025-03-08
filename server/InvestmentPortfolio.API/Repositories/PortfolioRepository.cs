// Repositories/PortfolioRepository.cs
using InvestmentPortfolio.API.Data;
using InvestmentPortfolio.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InvestmentPortfolio.API.Repositories;

public class PortfolioRepository : IPortfolioRepository
{
    private readonly ApplicationDbContext _context;

    public PortfolioRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Portfolio>> GetAllPortfoliosAsync(string userId)
    {
        return await _context.Portfolios
            .Include(p => p.Investments)
            .Where(p => p.UserId == userId)
            .ToListAsync();
    }

    public async Task<Portfolio?> GetPortfolioByIdAsync(int id, string userId)
    {
        return await _context.Portfolios
            .Include(p => p.Investments)
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
    }

    public async Task<Portfolio> CreatePortfolioAsync(Portfolio portfolio)
    {
        _context.Portfolios.Add(portfolio);
        await _context.SaveChangesAsync();
        return portfolio;
    }

    public async Task UpdatePortfolioAsync(Portfolio portfolio)
    {
        _context.Entry(portfolio).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeletePortfolioAsync(int id)
    {
        var portfolio = await _context.Portfolios.FindAsync(id);
        if (portfolio != null)
        {
            _context.Portfolios.Remove(portfolio);
            await _context.SaveChangesAsync();
        }
    }
}