using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Net.Mail;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
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

        // Add default App Settings for newly created user account
        int userId = user.Id;
        _context.UserSettings.Add(new UserSettings() { id = userId, preferredColor = "#7D81E1", font = "default", background = "Grey", iconStyle = "default" });
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

        return Ok(new
        {
            message = "Gelukt! Bezig met inloggen...",
            user = new { id = user.Id, email = user.Email } // Add more fields as needed
        });
    }

    [HttpPut("change_password")]
    public async Task<IActionResult> ChangePassword([FromBody] User loginUser)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == loginUser.Id);

        if (user == null)
            return NotFound("Fout: geen account gevonden met huidige gegevens.");

        if (!RegisterAndLoginMethods.isValidPassword(loginUser.Password))
            BadRequest("Wachtwoord voldoet niet aan de eisen.");

        user.Password = RegisterAndLoginMethods.HashPassword(loginUser.Password);
        await _context.SaveChangesAsync();

        return Ok("Wachtwoord is veranderd");
    }

    // https://dev.to/sammychris/how-to-implement-user-registration-and-email-verification-in-react-1map

    // static string GenerateVerificationCode()
    // {
    //     Random random = new Random();
    //     return random.Next(100000, 999999).ToString();
    // }

    // static void SendVerificationEmail(string recipientEmail, string code)
    // {
    //     try
    //     {
    //         MailMessage mail = new MailMessage();
    //         SmtpClient smtpClient = new SmtpClient("smtp.gmail.com");
    //         mail.From = new MailAddress("youremail@gmail.com");
    //         mail.To.Add(recipientEmail);
    //         mail.Subject = "Email Verification";
    //         mail.Body = "Your verification code is: " + code;
    //         smtpClient.Port = 587;
    //         smtpClient.UseDefaultCredentials = false;
    //         smtpClient.Credentials = new NetworkCredential("youremail@gmail.com", "yourpassword");
    //         smtpClient.EnableSsl = true;
    //         smtpClient.Send(mail);

    //         Console.WriteLine("Verification email sent.");


    //     }
    //     catch (Exception ex)
    //     {
    //         Console.WriteLine("Error sending verification email: " + ex.Message);
    //     }
    // }
}