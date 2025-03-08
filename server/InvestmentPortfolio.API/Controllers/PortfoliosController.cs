using InvestmentPortfolio.API.Models;
using InvestmentPortfolio.API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace InvestmentPortfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PortfoliosController : ControllerBase
{
    private readonly IPortfolioRepository _portfolioRepository;

    public PortfoliosController(IPortfolioRepository portfolioRepository)
    {
        _portfolioRepository = portfolioRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Portfolio>>> GetPortfolios()
    {
        // In a real app, get user ID from authentication
        string userId = "test-user"; 
        var portfolios = await _portfolioRepository.GetAllPortfoliosAsync(userId);
        return Ok(portfolios);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Portfolio>> GetPortfolio(int id)
    {
        string userId = "test-user";
        var portfolio = await _portfolioRepository.GetPortfolioByIdAsync(id, userId);
        
        if (portfolio == null)
            return NotFound();
            
        return Ok(portfolio);
    }

    [HttpPost]
    public async Task<ActionResult<Portfolio>> CreatePortfolio(Portfolio portfolio)
    {
        // Set user ID
        portfolio.UserId = "test-user";
        
        await _portfolioRepository.CreatePortfolioAsync(portfolio);
        
        return CreatedAtAction(nameof(GetPortfolio), new { id = portfolio.Id }, portfolio);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePortfolio(int id, Portfolio portfolio)
    {
        if (id != portfolio.Id)
            return BadRequest();
            
        await _portfolioRepository.UpdatePortfolioAsync(portfolio);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePortfolio(int id)
    {
        await _portfolioRepository.DeletePortfolioAsync(id);
        return NoContent();
    }
}