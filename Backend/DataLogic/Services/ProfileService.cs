using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class ProfileService : IProfileService {

    private readonly AppDbContext _context;

    public ProfileService(AppDbContext dbContext){
        _context = dbContext;
    }

    public async Task<ServiceResult<User>> EditEmail(int id, string newEmail)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null)
            return ServiceResult<User>.Failure("Gebruiker niet gevonden.");

        if (!RegisterAndLoginMethods.IsValidEmail(newEmail))
            return ServiceResult<User>.Failure("Ongeldig emailadres.");

        user.Email = newEmail;
        await _context.SaveChangesAsync();

        return ServiceResult<User>.SuccessResult(user);
    }

    public async Task<ServiceResult<User>> EditPassword(int id, string newPassword)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null)
            return ServiceResult<User>.Failure("Gebruiker niet gevonden.");

        if (!RegisterAndLoginMethods.isValidPassword(newPassword))
            return ServiceResult<User>.Failure("Wachtwoord voldoet niet aan de eisen.");

        user.Password = RegisterAndLoginMethods.HashPassword(newPassword);
        await _context.SaveChangesAsync();

        return ServiceResult<User>.SuccessResult(user);
    }
}

public interface IProfileService
{
    public Task<ServiceResult<User>> EditEmail(int id, string newEmail);
    public Task<ServiceResult<User>> EditPassword(int id, string newPassword);

}
