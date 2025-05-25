using Microsoft.EntityFrameworkCore;

public class UserSettingsService
{
    private readonly AppDbContext _context;

    public UserSettingsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserSettings?> GetSettings(string userId)
    {
        return await _context.UserSettings.FirstOrDefaultAsync(u => u.UserId == userId);
    }

    public async Task<UserSettings> SaveSettings(UserSettings settings)
    {
        var existing = await _context.UserSettings.FirstOrDefaultAsync(u => u.UserId == settings.UserId);
        if (existing != null)
        {
            existing.PreferredColor = settings.PreferredColor;
            existing.Font = settings.Font;
            existing.Background = settings.Background;
            existing.IconStyle = settings.IconStyle;
        }
        else
        {
            _context.UserSettings.Add(settings);
        }

        await _context.SaveChangesAsync();
        return settings;
    }
}