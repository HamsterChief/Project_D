using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase {
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            return BadRequest("Fout: gebruiker met de huidige gegevens bestaat al.");

        if (!RegisterAndLoginMethods.IsValidEmail(user.Email))
        {
            return BadRequest("Fout: ongeldige email.");
        }
        if (!RegisterAndLoginMethods.isValidPassword(user.Password))
        {
            return BadRequest(@"Fout: een wachtwoord moet minstens 8 tekens bevatten waarvan een speciaal en een hoofdletter.");
        }

        user.Password = RegisterAndLoginMethods.HashPassword(user.Password);
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User loginUser)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == loginUser.Email);

        if (user == null)
        return NotFound("Fout: geen account gevonden met huidige gegevens.");
        
        if (!RegisterAndLoginMethods.ValidatePassword(loginUser.Password, user.Password))
            return Unauthorized("Fout: ongeldig wachtwoord.");

        return Ok("Gelukt! Bezig met inloggen...");
    }
}