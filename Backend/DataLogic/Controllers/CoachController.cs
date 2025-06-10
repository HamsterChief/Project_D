using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/ai")]
public class AIController : ControllerBase
{
    private readonly OpenAiService _openAiService;
    private readonly ChatService _chatService;

    public AIController(OpenAiService openAiService, ChatService chatService)
    {
        _openAiService = openAiService;
        _chatService = chatService;
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory([FromQuery] int userId)
    {
        if (userId <= 0)
            return BadRequest("Ongeldige gebruiker.");

        // Haal de laatste 7 dagen op, pas aan indien gewenst
        var history = await _chatService.GetChatHistoryAsync(userId, DateTime.UtcNow.AddDays(-7));

        // Geef alleen relevante velden terug
        var result = history.Select(m => new
        {
            role = m.Role,
            content = m.Content,
            timestamp = m.Timestamp
        });

        return Ok(result);
    }

    [HttpPost("coach")]
    public async Task<IActionResult> GetCoachAdvice([FromBody] CoachRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Prompt))
            return BadRequest("Prompt mag niet leeg zijn.");
        if (!request.UserId.HasValue || request.UserId <= 0)
            return BadRequest("Ongeldige gebruiker.");

        // 1. Haal chatgeschiedenis op
        var history = await _chatService.GetChatHistoryAsync(request.UserId.Value, DateTime.UtcNow.AddDays(-7));

        // 2. Bouw messages-lijst voor OpenAI
        var messages = new List<object>
        {
            new { role = "system", content = "Je bent een vriendelijke en geduldige digitale coach die mensen met ADHD helpt bij het maken van overzichtelijke en haalbare planningen. Je geeft praktische, korte en motiverende adviezen die helpen om structuur aan te brengen in hun dag. Als er een vraag wordt gesteld die niks met de planning of taken voor een gebruiker te maken heeft dan beantwoord je met Nee." }
        };
        messages.AddRange(history.Select(m => new { role = m.Role, content = m.Content }));
        messages.Add(new { role = "user", content = request.Prompt });

        // 3. Vraag advies aan OpenAI
        var advice = await _openAiService.GetCoachAdviceAsync(messages);

        // 4. Sla user prompt en assistant response op
        await _chatService.AddMessageAsync(new ChatMessage
        {
            UserId = request.UserId.Value,
            Role = "user",
            Content = request.Prompt,
            Timestamp = DateTime.UtcNow
        });
        await _chatService.AddMessageAsync(new ChatMessage
        {
            UserId = request.UserId.Value,
            Role = "assistant",
            Content = advice,
            Timestamp = DateTime.UtcNow
        });

        return Ok(new { advice });
    }
}

public class CoachRequest
{
    public int? UserId { get; set; }
    public string Prompt { get; set; }
}