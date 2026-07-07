using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace Backend.Services;

public class UserRepository(AppDbContext dbContext, ILogger<UserRepository> logger) : IUserRepository
{
    public async Task<User?> GetByUsernameAsync(string username)
    {
        if (string.IsNullOrWhiteSpace(username))
            return null;

        logger.LogInformation("Querying database for user: '{Username}'", username);

        return await dbContext.Users
            .FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower());
    }

    public async Task<User> CreateAsync(User user)
    {
        ArgumentNullException.ThrowIfNull(user);

        logger.LogInformation("Saving new user to database: '{Username}' with role '{Role}'", user.Username, user.Role);

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();
        return user;
    }
}
