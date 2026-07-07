using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Security.Claims;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PagesController(ILogger<PagesController> logger) : ControllerBase
{
    // GET: api/pages/public
    [HttpGet("public")]
    public IActionResult GetPublicPage()
    {
        logger.LogInformation("Public page accessed");
        return Ok(new
        {
            title = "Public Dashboard Data",
            content = "This content is public and available to anyone without logging in.",
            timestamp = DateTime.UtcNow
        });
    }

    // GET: api/pages/user-only
    [HttpGet("user-only")]
    [Authorize(Roles = "User,Admin")]
    public IActionResult GetUserOnlyPage()
    {
        var username = User.Identity?.Name ?? "Unknown";
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";

        logger.LogInformation("User-only page accessed by '{Username}' with role '{Role}'", username, role);

        return Ok(new
        {
            title = "User Dashboard Data",
            content = $"Hello {username}, this content is protected and only accessible to users with the 'User' or 'Admin' role.",
            authorizedUser = username,
            authorizedRole = role,
            timestamp = DateTime.UtcNow
        });
    }

    // GET: api/pages/admin-only
    [HttpGet("admin-only")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetAdminOnlyPage()
    {
        var username = User.Identity?.Name ?? "Unknown";
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";

        logger.LogInformation("Admin-only page accessed by '{Username}'. Initiating audit log entry", username);

        return Ok(new
        {
            title = "Admin Control Panel Data",
            content = $"Welcome Administrator {username}! This content is strictly restricted to the 'Admin' role. All operations here are audited.",
            authorizedUser = username,
            authorizedRole = role,
            timestamp = DateTime.UtcNow
        });
    }
}
