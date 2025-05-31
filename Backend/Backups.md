```cs
using Microsoft.AspNetCore.Mvc;

public class FormItemWrapper
{
    public FormItem FormItem { get; set; }
}

[ApiController]
[Route("api/{formType:required}")]
public class FormController : ControllerBase
{
    private readonly IFormService _service;

    public FormController(IFormService formService)
    {
        _service = formService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateForm([FromRoute] string formType, [FromBody] FormItemWrapper wrapper /*,[FromBody] FormItem formItem*/)
    {
        if (!Enum.TryParse<FormType>(formType, true, out var parsedType))
            return BadRequest("Form type is onbekend");

            
        var formItem = wrapper.FormItem;
        if (formItem == null)
            return BadRequest("formItem is required");

        formItem.FormType = parsedType;

        var result = await _service.CreateForm(wrapper);

        if (result.StatusCode == 200)
            return Ok(result.Data);

        return BadRequest(result.ErrorMessage);
    }

    [HttpGet("date/{date}")]
    public async Task<IActionResult> GetFormsOnDate([FromRoute] DateTime date)
    {
        var result = await _service.GetFormsOnDate(date);

        if (result.StatusCode == 200){
            return Ok(result.Data);
        }

        return BadRequest(result.ErrorMessage);
    }

    [HttpDelete("remove/{id}")]
    public async Task<IActionResult> RemoveForm([FromRoute] string formType, int id)
    {
        if (!Enum.TryParse<FormType>(formType, true, out var parsedType))
            return BadRequest("Form type is onbekend");

        var result = await _service.RemoveForm(id, parsedType);

        if (result.StatusCode == 200)
            return Ok(result.Data);

        return BadRequest(result.ErrorMessage);
    }
}
```
```cs
using Microsoft.EntityFrameworkCore;

public class FormService : IFormService
{
    private readonly AppDbContext _context;

    public FormService(AppDbContext dbContext)
    {
        _context = dbContext;
    }

    public async Task<ServiceResult<FormItem>> CreateForm(FormItemWrapper wrapper /*,FormItem formItem*/)
    {
        // if (string.IsNullOrEmpty(formItem.Title))
        // {
        //     return ServiceResult<FormItem>.Failure("Titel is verplicht.");
        // }
        var formItem = wrapper.FormItem;
        if (formItem == null)
            return ServiceResult<FormItem>.Failure("formItem is required");


        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == formItem.UserId);

        if (user == null)
        {
            return ServiceResult<FormItem>.Failure($"Gebruiker met id {formItem.UserId} niet gevonden.");
        }
        _context.formItems.Add(formItem);

        // n can be treated as a bool
        int n = await _context.SaveChangesAsync();
        if (n > 0)
        {
            return ServiceResult<FormItem>.SuccessResult(formItem);
        }
        return ServiceResult<FormItem>.Failure("Formulier niet ingediend.");
    }

    public async Task<ServiceResult<List<FormItem>>> GetFormsOnDate(DateTime date)
    {
        var startOfDay = date.Date;  
        var endOfDay = date.Date.AddDays(1).AddTicks(-1);  
        
        var forms = await _context.formItems
            .Where(f => f.SubmissionDate.Date >= startOfDay && f.SubmissionDate.Date <= endOfDay)
            .ToListAsync();

        if (forms.Any())
        {
            return ServiceResult<List<FormItem>>.SuccessResult(forms);
        }

        return ServiceResult<List<FormItem>>.Failure("Geen formulieren gevonden voor deze datum.");
    }
    public async Task<ServiceResult<List<FormItem>>> GetFormsOnDate(DateTime date, FormType formType)
    {
        var startOfDay = date.Date;  
        var endOfDay = date.Date.AddDays(1).AddTicks(-1);  
        
        var forms = await _context.formItems
            .Where(f => f.SubmissionDate.Date >= startOfDay && f.SubmissionDate.Date <= endOfDay && f.FormType == formType)
            .ToListAsync();

        if (forms.Any())
        {
            return ServiceResult<List<FormItem>>.SuccessResult(forms);
        }

        return ServiceResult<List<FormItem>>.Failure($"Geen {formType} formulieren gevonden voor deze datum.");
    }

    public async Task<ServiceResult<FormItem>> RemoveForm(int formId, FormType formType/*,int superUserId*/)
    {
        var foundForm = await _context.formItems.FirstOrDefaultAsync(t => t.Id == formId);

        if (foundForm != null){
            _context.formItems.Remove(foundForm);
            await _context.SaveChangesAsync();
            return ServiceResult<FormItem>.SuccessResult(foundForm);
        }

        return ServiceResult<FormItem>.Failure($"{formType} formulier bestaat niet.");
    }
}

public interface IFormService
{
    public Task<ServiceResult<FormItem>> CreateForm(FormItemWrapper wrapper /*,FormItem formItem*/);
    public Task<ServiceResult<List<FormItem>>> GetFormsOnDate(DateTime date);
    // public Task<ServiceResult<FormItem>> EditForm(int id, FormItem form);
    public Task<ServiceResult<FormItem>> RemoveForm(int taskId, FormType formType/*,int superUserId*/);
}
```