using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/profile")]

public class ProfileController : ControllerBase
{

    private readonly IProfileService _service;

    public ProfileController(IProfileService profileService)
    {
        _service = profileService;
    }

    [HttpPut("editEmail/{id}")]
    public async Task<IActionResult> EditEmail([FromRoute] int id, [FromBody] string newEmail)
    {
        var result = await _service.EditEmail(id, newEmail);

        if (result.StatusCode == 200)
        {
            return Ok(result.Data);
        }

        return BadRequest(result.ErrorMessage);
    }

    [HttpPut("editPassword/{id}")]
    public async Task<IActionResult> EditPassword([FromRoute] int id, [FromBody] String newPassword)
    {
        var result = await _service.EditPassword(id, newPassword);

        if (result.StatusCode == 200)
        {
            return Ok(result.Data);
        }

        return BadRequest(result.ErrorMessage);
    }
}
