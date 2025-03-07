using Microsoft.EntityFrameworkCore;
using InvestmentPortfolio.API.Models;

namespace InvestmentPortfolio.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<ApplicationUser> Users { get; set; } = null!;
    public DbSet<Portfolio> Portfolios { get; set; } = null!;
    public DbSet<Investment> Investments { get; set; } = null!;
    public DbSet<InvestmentProfile> InvestmentProfiles { get; set; } = null!;
    public DbSet<UserActivity> UserActivities { get; set; } = null!;
    public DbSet<UserPreferences> UserPreferences { get; set; } = null!;
    public DbSet<WatchlistItem> WatchlistItems { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Investment to Portfolio relation (already exists)
        modelBuilder.Entity<Investment>()
            .HasOne(i => i.Portfolio)
            .WithMany(p => p.Investments)
            .HasForeignKey(i => i.PortfolioId);
            
        // User to Portfolio relation
        modelBuilder.Entity<Portfolio>()
            .HasOne(p => p.User)
            .WithMany(u => u.Portfolios)
            .HasForeignKey(p => p.UserId);
            
        // User to UserPreferences (one-to-one)
        modelBuilder.Entity<UserPreferences>()
            .HasOne(up => up.User)
            .WithOne(u => u.Preferences)
            .HasForeignKey<UserPreferences>(up => up.UserId);
            
        // User to InvestmentProfile (one-to-one)
        modelBuilder.Entity<InvestmentProfile>()
            .HasOne(ip => ip.User)
            .WithOne(u => u.InvestmentProfile)
            .HasForeignKey<InvestmentProfile>(ip => ip.UserId);
            
        // User to WatchlistItem
        modelBuilder.Entity<WatchlistItem>()
            .HasOne(wi => wi.User)
            .WithMany(u => u.Watchlist)
            .HasForeignKey(wi => wi.UserId);
            
        // User to UserActivity
        modelBuilder.Entity<UserActivity>()
            .HasOne(ua => ua.User)
            .WithMany(u => u.ActivityHistory)
            .HasForeignKey(ua => ua.UserId);
    }
}