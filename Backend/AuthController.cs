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
            return BadRequest("User already exists");

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User loginUser)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == loginUser.Email);

        if (user == null || user.Password != loginUser.Password)
            return Unauthorized("Invalid login");

        return Ok("Loggin in successfull");
    }
}