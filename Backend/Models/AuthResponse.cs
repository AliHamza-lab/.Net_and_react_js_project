namespace Backend.Models;

/// <summary>
/// Response returned after a successful authentication (login/signup) flow.
/// </summary>
public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
