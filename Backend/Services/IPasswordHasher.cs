namespace Backend.Services;

/// <summary>
/// Provides methods for hashing passwords and verifying them.
/// </summary>
public interface IPasswordHasher
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string passwordHash);
}
