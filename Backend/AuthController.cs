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

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound($"User with id {id} not found.");

        // Voor veiligheid: haal eventueel password hash eruit voordat je terugstuurt
        user.Password = null;

        return Ok(user);
    }

    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            return BadRequest("User already exists");

        if (!RegisterAndLoginMethods.IsValidEmail(user.Email))
        {
            return BadRequest("Error: invalid email.");
        }
        if (!RegisterAndLoginMethods.isValidPassword(user.Password))
        {
            return BadRequest(@"Error: invalid password. Must contain at least 8 characters, one capital (letter) and one special (*-!#)");
        }

        user.Password = RegisterAndLoginMethods.HashPassword(user.Password);
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User loginUser)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginUser.Email);

        if (user == null)
            return Unauthorized("Invalid login");

        // Controleer wachtwoord correct (geef plaintext in, user.Password is gehashed)
        bool passwordValid = RegisterAndLoginMethods.ValidatePassword(loginUser.Password, user.Password);

        if (!passwordValid)
            return Unauthorized("Invalid login");

        // Return enkel id en email, geen wachtwoord
        return Ok(new { id = user.Id, email = user.Email });
    }
}