using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly UserSettingsService _service;

    public SettingsController(UserSettingsService service)
    {
        _service = service;
    }

    [HttpGet("{userId}")]
    public async Task<ActionResult<UserSettings>> GetSettings(string userId)
    {
        var settings = await _service.GetSettings(userId);
        if (settings == null)
            return NotFound();

        return Ok(settings);
    }

    [HttpPost]
    public async Task<ActionResult<UserSettings>> SaveSettings(UserSettings settings)
    {
        var result = await _service.SaveSettings(settings);
        return Ok(result);
    }

}