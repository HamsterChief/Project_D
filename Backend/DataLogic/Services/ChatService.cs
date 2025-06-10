using Microsoft.EntityFrameworkCore;

public class ChatService
{
    private readonly AppDbContext _context;

    public ChatService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ChatMessage>> GetChatHistoryAsync(int userId, DateTime? since = null)
    {
        var query = _context.ChatMessages.Where(m => m.UserId == userId);
        if (since.HasValue)
            query = query.Where(m => m.Timestamp >= since.Value);

        return await query.OrderBy(m => m.Timestamp).ToListAsync();
    }
    // ...existing code...

    public async Task<List<ChatMessage>> GetChatHistoryByEmailAsync(string email, DateTime? since = null)
    {
        var query = _context.ChatMessages.Where(m => m.Email == email);
        if (since.HasValue)
            query = query.Where(m => m.Timestamp >= since.Value);

        return await query.OrderBy(m => m.Timestamp).ToListAsync();
    }

    // ...existing code...

    public async Task AddMessageAsync(ChatMessage message)
    {
        _context.ChatMessages.Add(message);
        await _context.SaveChangesAsync();
    }
}