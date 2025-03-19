using InvestmentPortfolio.API.Models;
using InvestmentPortfolio.API.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace InvestmentPortfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Require authentication for all endpoints in this controller
public class PortfoliosController : ControllerBase
{
    private readonly IPortfolioRepository _portfolioRepository;

    public PortfoliosController(IPortfolioRepository portfolioRepository)
    {
        _portfolioRepository = portfolioRepository;
    }

    // Get the current user's ID from their claims
    private string GetUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException("User ID not found in token");
    }

    [HttpGet]
    [Authorize("read:portfolios")] // Requires the read:portfolios permission
    public async Task<ActionResult<IEnumerable<Portfolio>>> GetPortfolios()
    {
        string userId = GetUserId(); 

        var portfolios = await _portfolioRepository.GetAllPortfoliosAsync(userId);
        return Ok(portfolios);
    }

    [HttpGet("{id}")]
    [Authorize("read:portfolios")]
    public async Task<ActionResult<Portfolio>> GetPortfolio(int id)
    {
        string userId = GetUserId();
        var portfolio = await _portfolioRepository.GetPortfolioByIdAsync(id, userId);
        
        if (portfolio == null)
            return NotFound();
            
        return Ok(portfolio);
    }

    [HttpPost]
    [Authorize("write:portfolios")]
    public async Task<ActionResult<Portfolio>> CreatePortfolio(Portfolio portfolio)
    {
        portfolio.UserId = GetUserId();
        
        await _portfolioRepository.CreatePortfolioAsync(portfolio);
        
        return CreatedAtAction(nameof(GetPortfolio), new { id = portfolio.Id }, portfolio);
    }

    [HttpPut("{id}")]
    [Authorize("write:portfolios")]
    public async Task<IActionResult> UpdatePortfolio(int id, Portfolio portfolio)
    {
        // Verify that the user owns this portfolio
        string userId = GetUserId();
        var existingPortfolio = await _portfolioRepository.GetPortfolioByIdAsync(id, userId);

        if (existingPortfolio == null)
            return NotFound();

        if (id != portfolio.Id)
            return BadRequest();

        // Ensure the user owns this portfolio
        if (existingPortfolio.UserId != userId)
            return Forbid();

        // Ensure we don't change the user ID
        portfolio.UserId = userId;
            
        await _portfolioRepository.UpdatePortfolioAsync(portfolio);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize("delete:portfolios")]
    public async Task<IActionResult> DeletePortfolio(int id)
    {
        // Verify that the user owns this portfolio
        string userId = GetUserId();
        var existingPortfolio = await _portfolioRepository.GetPortfolioByIdAsync(id, userId);

        if (existingPortfolio == null)
            return NotFound();

        await _portfolioRepository.DeletePortfolioAsync(id, userId);
        return NoContent();
    }
}