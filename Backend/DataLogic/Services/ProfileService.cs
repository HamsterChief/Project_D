using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class ProfileService : IProfileService {

    private readonly AppDbContext _context;

    public ProfileService(AppDbContext dbContext){
        _context = dbContext;
    }

    // public async Task<ServiceResult<User>> EditContactEmail([FromBody] User updatedUser)
    // {
    //     var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == updatedUser.Id);
    //     if (user == null)
    //         return ServiceResult<User>.Failure("Gebruiker niet gevonden.");

    //     if (!RegisterAndLoginMethods.IsValidEmail(updatedUser.Email))
    //         return ServiceResult<User>.Failure("Ongeldig emailadres.");

    //     user.Email = updatedUser.Email;
    //     await _context.SaveChangesAsync();

    //     return ServiceResult<User>.SuccessResult(user);
    // }

    public async Task<ServiceResult<User>> EditPassword([FromBody] User updatedUser)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == updatedUser.Id);
        if (user == null)
            return ServiceResult<User>.Failure("Gebruiker niet gevonden.");

        if (!RegisterAndLoginMethods.isValidPassword(updatedUser.Password))
            return ServiceResult<User>.Failure("Wachtwoord voldoet niet aan de eisen.");

        user.Password = RegisterAndLoginMethods.HashPassword(updatedUser.Password);
        await _context.SaveChangesAsync();

        return ServiceResult<User>.SuccessResult(user);
    }
}

public interface IProfileService
{
    // public Task<ServiceResult<User>> EditContactEmail(User updatedUser);
    public Task<ServiceResult<User>> EditPassword(User updatedUser);

}
