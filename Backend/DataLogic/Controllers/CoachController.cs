using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/ai")]
public class AIController : ControllerBase
{
    private readonly OpenAiService _openAiService;

    public AIController(OpenAiService openAiService)
    {
        _openAiService = openAiService;
    }

    [HttpPost("coach")]
    public async Task<IActionResult> GetCoachAdvice([FromBody] CoachRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Prompt))
        {
            return BadRequest("Prompt mag niet leeg zijn.");
        }

        if (!request.UserId.HasValue || request.UserId <= 0)
        {
            return BadRequest("Ongeldige gebruiker.");
        }

        try
        {
            var advice = await _openAiService.GetCoachAdviceAsync(request.Prompt);
            return Ok(new { advice });
        }
        catch (Exception ex)
        {
            // Log eventueel de fout
            return StatusCode(500, "Fout bij ophalen van advies: " + ex.Message);
        }
    }
}

public class CoachRequest
{
    public int? UserId { get; set; }
    public string Prompt { get; set; }
}