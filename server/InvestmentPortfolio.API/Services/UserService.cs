using InvestmentPortfolio.API.Data;
using InvestmentPortfolio.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace InvestmentPortfolio.API.Services;

public interface IUserService
{
    Task<ApplicationUser> SyncUserAsync(string userId, string email);
}

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApplicationUser> SyncUserAsync(string userId, string email)
    {
        // Check if user exists
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            // Create new user with generated username
            var baseUsername = GenerateBaseUsername(email);
            var username = await GenerateUniqueUsernameAsync(baseUsername);

            user = new ApplicationUser
            {
                Id = userId,
                Email = email,
                DisplayName = username, // Set display name to username initially
                CreatedAt = DateTime.UtcNow,
                LastLoginAt = DateTime.UtcNow
            };
            
            _context.Users.Add(user);
        }
        else if (user.Email != email)
        {
            // Update email if changed
            user.Email = email;
            user.LastLoginAt = DateTime.UtcNow;
        }
        else
        {
            // Just update last login time
            user.LastLoginAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return user;
    }

    private string GenerateBaseUsername(string email)
    {
        // Extract everything before @ in email
        var match = Regex.Match(email, @"^([^@]+)@");
        if (match.Success)
        {
            return match.Groups[1].Value;
        }
        
        // Fallback if email format is unexpected
        return "user" + Guid.NewGuid().ToString().Substring(0, 8);
    }

    private async Task<string> GenerateUniqueUsernameAsync(string baseUsername)
    {
        // Check if base username is available
        if (!await _context.Users.AnyAsync(u => u.DisplayName == baseUsername))
        {
            return baseUsername;
        }

        // Try adding numbers until we find a unique username
        int counter = 1;
        string candidateUsername;
        do
        {
            candidateUsername = $"{baseUsername}{counter}";
            counter++;
        } while (await _context.Users.AnyAsync(u => u.DisplayName == candidateUsername));

        return candidateUsername;
    }
}