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

    // [HttpPut("editEmail/{id}")]
    // public async Task<IActionResult> EditContactEmail([FromBody] User updatedUser)
    // {
    //     var result = await _service.EditContactEmail(updatedUser);

    //     if (result.StatusCode == 200)
    //     {
    //         return Ok(result.Data);
    //     }

    //     return BadRequest(result.ErrorMessage);
    // }

    [HttpPut("editPassword/{id}")]
    public async Task<IActionResult> EditPassword([FromBody] User updatedUser)
    {
        var result = await _service.EditPassword(updatedUser);

        if (result.StatusCode == 200)
        {
            return Ok(result.Data);
        }

        return BadRequest(result.ErrorMessage);
    }
}