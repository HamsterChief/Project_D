public class ChatMessage
{
    public int Id { get; set; }
    public int UserId { get; set; } // Koppel aan je gebruikerssysteem
    public string Role { get; set; }   // "user" of "assistant"
    public string Content { get; set; }
    public string Email { get; set; }
    public DateTime Timestamp { get; set; }
}