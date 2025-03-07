using Microsoft.EntityFrameworkCore;
using InvestmentPortfolio.API.Models;

namespace InvestmentPortfolio.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

public DbSet<Portfolio> Portfolios { get; set; } = null!;
public DbSet<Investment> Investments { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Define relationships
        modelBuilder.Entity<Investment>()
            .HasOne(i => i.Portfolio)
            .WithMany(p => p.Investments)
            .HasForeignKey(i => i.PortfolioId);
    }
}