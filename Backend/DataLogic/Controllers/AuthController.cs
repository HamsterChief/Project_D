using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Net; using System.Net.Mail;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
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

        // Send verification email
        var verificationCode = GenerateVerificationCode();
        SendVerificationEmail(user.Email, verificationCode);

        // Add user to database
        user.Password = RegisterAndLoginMethods.HashPassword(user.Password);
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Add verification code to database
        VerificationCode VC = new VerificationCode(); VC.UserId = user.Id; VC.VerificationCodeStr = verificationCode;
        _context.VerificationCodes.Add(VC);

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
            user = new { user.Id, user.Email } // Add more fields as needed
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
        else if (!user.IsVerified) Forbid("Account is nog niet geverifieerd");

        user.Password = RegisterAndLoginMethods.HashPassword(loginUser.Password);
        await _context.SaveChangesAsync();

        return Ok("Wachtwoord is veranderd");
    }

    // https://dev.to/sammychris/how-to-implement-user-registration-and-email-verification-in-react-1map

    [HttpPut("verify_email")]
    public async Task<IActionResult> VerifyEmail([FromBody] EmailVerificationDto dto)
    {
        int userId = dto.UserId;
        string verificationCode = dto.VerificationCodeStr;

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return NotFound("Fout: geen account gevonden met huidige gegevens.");

        var verificationCodeBody = await _context.VerificationCodes.FirstOrDefaultAsync
        (vcObj => vcObj.UserId == userId && vcObj.VerificationCodeStr == verificationCode);
        if (verificationCodeBody == null) return NotFound("Fout: geen verificatie code gevonden die gekoppeld is aan huidige gebruiker.");

        user.IsVerified = true; await _context.SaveChangesAsync();

        return Ok("Email verificatie gelukt");
    }

    public string GenerateVerificationCode()
    {
        Random random = new Random();
        return random.Next(100000, 999999).ToString();
    }

    public void SendVerificationEmail(string recipientEmail, string code)
    {
        try
        {
            var smtpServer = _configuration["EmailSettings:SmtpServer"];
            var port = int.Parse(_configuration["EmailSettings:Port"]);
            var senderEmail = _configuration["EmailSettings:SenderEmail"];
            var senderPassword = _configuration["EmailSettings:SenderPassword"];

            MailMessage mail = new MailMessage
            {
                From = new MailAddress(senderEmail),
                Subject = "Email Verification",
                Body = $"Jouw verificatie code is: {code}. Verifieer je binnen de app onder instellingen",
                IsBodyHtml = false
            };
            mail.To.Add(recipientEmail);

            using (SmtpClient smtpClient = new SmtpClient(smtpServer, port))
            {
                smtpClient.Credentials = new NetworkCredential(senderEmail, senderPassword);
                smtpClient.EnableSsl = true;
                smtpClient.Send(mail);
            }

            Console.WriteLine("Verification email sent.");


        }
        catch (Exception ex)
        {
            Console.WriteLine("Error sending verification email: " + ex.Message);
        }
    }
}
