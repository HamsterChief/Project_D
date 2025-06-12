using Microsoft.EntityFrameworkCore;

public class UserSettingsService
{
    private readonly AppDbContext _context;

    public UserSettingsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserSettings?> GetSettings(int Id)
    {
        return await _context.UserSettings.FirstOrDefaultAsync(u => u.id == Id);
    }

    public async Task<UserSettings> SaveSettings(UserSettings settings)
    {
        var existing = await _context.UserSettings.FirstOrDefaultAsync(u => u.id == settings.id);
        if (existing != null)
        {
            existing.preferredColor = settings.preferredColor;
            existing.font = settings.font;
            existing.background = settings.background;
            existing.iconStyle = settings.iconStyle;
        }
        else
        {
            _context.UserSettings.Add(settings);
        }

        await _context.SaveChangesAsync();
        return settings;
    }
}