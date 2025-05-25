using Microsoft.EntityFrameworkCore;

public class FormService : IFormService
{
    private readonly AppDbContext _context;

    public FormService(AppDbContext dbContext)
    {
        _context = dbContext;
    }

    public async Task<ServiceResult<FormItem>> CreateForm(FormItem formItem)
    {
        // if (string.IsNullOrEmpty(formItem.Title))
        // {
        //     return ServiceResult<FormItem>.Failure("Titel is verplicht.");
        // }
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == formItem.UserId);

        if (user == null)
        {
            return ServiceResult<FormItem>.Failure($"Gebruiker met id {user.Id} niet gevonden.");
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
    public Task<ServiceResult<FormItem>> CreateForm(FormItem formItem);
    public Task<ServiceResult<List<FormItem>>> GetFormsOnDate(DateTime date);
    // public Task<ServiceResult<FormItem>> EditForm(int id, FormItem form);
    public Task<ServiceResult<FormItem>> RemoveForm(int taskId, FormType formType/*,int superUserId*/);
}
