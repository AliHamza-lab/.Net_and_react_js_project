using Backend.Models;
using Backend.Services;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    ITokenService tokenService,
    IValidator<RegisterRequest> registerValidator,
    IValidator<LoginRequest> loginValidator,
    ILogger<AuthController> logger) : ControllerBase
{
    // POST: api/auth/signup
    [HttpPost("signup")]
    public async Task<IActionResult> SignUp([FromBody] RegisterRequest request)
    {
        var validationResult = await registerValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            logger.LogWarning("Registration validation failed for username: {Username}", request.Username);
            foreach (var error in validationResult.Errors)
            {
                ModelState.AddModelError(error.PropertyName, error.ErrorMessage);
            }
            return BadRequest(ModelState);
        }

        var existingUser = await userRepository.GetByUsernameAsync(request.Username);
        if (existingUser != null)
        {
            logger.LogWarning("Registration failed: Username '{Username}' is already taken", request.Username);
            return BadRequest(new { message = "Username is already taken." });
        }

        var role = string.Equals(request.Role, "admin", System.StringComparison.OrdinalIgnoreCase) ? "Admin" : "User";

        var user = new User
        {
            Username = request.Username,
            PasswordHash = passwordHasher.HashPassword(request.Password),
            Role = role
        };

        await userRepository.CreateAsync(user);
        logger.LogInformation("User '{Username}' registered successfully with role '{Role}'", user.Username, user.Role);
        var token = tokenService.GenerateToken(user);

        return Ok(new AuthResponse
        {
            Token = token,
            Username = user.Username,
            Role = user.Role
        });
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var validationResult = await loginValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            logger.LogWarning("Login validation failed for username: {Username}", request.Username);
            foreach (var error in validationResult.Errors)
            {
                ModelState.AddModelError(error.PropertyName, error.ErrorMessage);
            }
            return BadRequest(ModelState);
        }

        var user = await userRepository.GetByUsernameAsync(request.Username);
        if (user == null || !passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            logger.LogWarning("Login failed: Invalid credentials for username '{Username}'", request.Username);
            return Unauthorized(new { message = "Invalid username or password." });
        }

        logger.LogInformation("User '{Username}' logged in successfully", user.Username);
        var token = tokenService.GenerateToken(user);

        return Ok(new AuthResponse
        {
            Token = token,
            Username = user.Username,
            Role = user.Role
        });
    }
}
