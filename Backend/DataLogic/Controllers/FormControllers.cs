// using Microsoft.AspNetCore.Mvc;

// [ApiController]
// [Route("api/{formType:required}")]
// public class FormController : ControllerBase
// {
//     private readonly IFormService _service;

//     public FormController(IFormService formService)
//     {
//         _service = formService;
//     }

//     [HttpPost("create")]
//     public async Task<IActionResult> CreateForm([FromRoute] string formType, [FromBody] FormItem formItem)
//     {
//         if (!Enum.TryParse<FormType>(formType, true, out var parsedType))
//             return BadRequest("Form type is onbekend");

//         formItem.FormType = parsedType;

//         var result = await _service.CreateForm(formItem);

//         if (result.StatusCode == 200)
//             return Ok(result.Data);

//         return BadRequest(result.ErrorMessage);
//     }

//     [HttpGet("date/{date}")]
//     public async Task<IActionResult> GetFormsOnDate([FromRoute] DateTime date)
//     {
//         var result = await _service.GetFormsOnDate(date);

//         if (result.StatusCode == 200){
//             return Ok(result.Data);
//         }

//         return BadRequest(result.ErrorMessage);
//     }

//     [HttpDelete("remove/{id}")]
//     public async Task<IActionResult> RemoveForm([FromRoute] string formType, int id)
//     {
//         if (!Enum.TryParse<FormType>(formType, true, out var parsedType))
//             return BadRequest("Form type is onbekend");

//         var result = await _service.RemoveForm(id, parsedType);

//         if (result.StatusCode == 200)
//             return Ok(result.Data);

//         return BadRequest(result.ErrorMessage);
//     }
// }
