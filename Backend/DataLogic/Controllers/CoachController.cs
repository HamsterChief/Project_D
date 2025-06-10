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

    // ...existing code...

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory([FromQuery] string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return BadRequest("Ongeldig e-mailadres.");

        // Haal de laatste 7 dagen op voor dit e-mailadres
        var history = await _chatService.GetChatHistoryByEmailAsync(email, DateTime.UtcNow.AddDays(-7));

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
        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest("Ongeldig e-mailadres.");

        // 1. Haal chatgeschiedenis op voor dit e-mailadres
        var history = await _chatService.GetChatHistoryByEmailAsync(request.Email, DateTime.UtcNow.AddDays(-7));

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
            Email = request.Email,
            Role = "user",
            Content = request.Prompt,
            Timestamp = DateTime.UtcNow
        });
        await _chatService.AddMessageAsync(new ChatMessage
        {
            Email = request.Email,
            Role = "assistant",
            Content = advice,
            Timestamp = DateTime.UtcNow
        });

        return Ok(new { advice });
    }

    public class CoachRequest
    {
        public string Email { get; set; }
        public string Prompt { get; set; }
    }
}