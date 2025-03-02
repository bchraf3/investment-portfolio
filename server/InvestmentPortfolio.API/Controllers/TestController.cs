using Microsoft.AspNetCore.Mvc;

namespace InvestmentPortfolio.API.Controllers; // Is this line necessary

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "API Connection successful!" });
    }
}