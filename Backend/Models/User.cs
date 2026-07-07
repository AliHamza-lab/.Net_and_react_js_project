using System;

namespace Backend.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "User"; // Default role: User. Can also be Admin
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
