using Microsoft.AspNetCore.Identity;

namespace Backend.Services;

public class PasswordHasher : IPasswordHasher
{
    private readonly PasswordHasher<string> _hasher = new();

    public string HashPassword(string password) => 
        _hasher.HashPassword("dummyUser", password);

    public bool VerifyPassword(string password, string passwordHash) =>
        _hasher.VerifyHashedPassword("dummyUser", passwordHash, password) == PasswordVerificationResult.Success;
}
