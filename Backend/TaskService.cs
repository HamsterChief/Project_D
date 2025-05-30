using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class TaskService : ITaskService {

    private readonly AppDbContext _context;

    public TaskService(AppDbContext dbContext){
        _context = dbContext;
    }

    public async Task<ServiceResult<TaskItem>> CreateTask(TaskItem taskItem)
    {
        // Validaties
        if (string.IsNullOrEmpty(taskItem.Title))
            return ServiceResult<TaskItem>.Failure("Titel is verplicht.");

        if (taskItem.StartDate < DateTime.Now)
            return ServiceResult<TaskItem>.Failure("Startdatum moet in de toekomst zijn.");

        if (taskItem.EndDate < taskItem.StartDate)
            return ServiceResult<TaskItem>.Failure("Einddatum moet na startdatum zijn.");

        if (taskItem.UserId <= 0)
        {
            Console.WriteLine($"Ontvangen userId: {taskItem.UserId}");
            return ServiceResult<TaskItem>.Failure("Ongeldige gebruiker.");
        }
            
            

        var userExists = await _context.Users.AnyAsync(u => u.Id == taskItem.UserId);
        if (!userExists)
            return ServiceResult<TaskItem>.Failure("Gebruiker niet gevonden.");

        // Taak maken
        var newTask = new TaskItem
        {
            Title = taskItem.Title,
            Description = taskItem.Description,
            StartDate = taskItem.StartDate,
            EndDate = taskItem.EndDate,
            Finished = false,
            UserId = taskItem.UserId
        };

        _context.taskItems.Add(newTask);
        int saved = await _context.SaveChangesAsync();

        return saved > 0
            ? ServiceResult<TaskItem>.SuccessResult(newTask)
            : ServiceResult<TaskItem>.Failure("Taak niet toegevoegd.");
    }

    public async Task<ServiceResult<List<TaskItem>>> GetTasksOnDate(DateTime date, int userId)
    {
        var startOfDay = date.Date;
        var endOfDay = startOfDay.AddDays(1);

        var tasks = await _context.taskItems
            .Where(t =>
                t.UserId == userId &&
                (
                    (t.StartDate >= startOfDay && t.StartDate < endOfDay) ||
                    (t.EndDate >= startOfDay && t.EndDate < endOfDay)
                )
            )
            .ToListAsync();

        if (tasks.Any())
        {
            return ServiceResult<List<TaskItem>>.SuccessResult(tasks);
        }

        return ServiceResult<List<TaskItem>>.Failure("Geen taken gevonden voor deze datum.");
    }

    public async Task<ServiceResult<TaskItem>> EditTask(int id, TaskItem task)
    {
        var foundTask = await _context.taskItems.FirstOrDefaultAsync(t => t.Id == id);

        if (foundTask != null)
        {
            foundTask.Title = task.Title;
            foundTask.StartDate = task.StartDate;
            foundTask.EndDate = task.EndDate;
            foundTask.Description = task.Description;
            foundTask.Finished = task.Finished;

            await _context.SaveChangesAsync();
            return ServiceResult<TaskItem>.SuccessResult(foundTask);
        }

        return ServiceResult<TaskItem>.Failure("Taak bestaat niet.");
    }

    public async Task<ServiceResult<TaskItem>> RemoveTask(int taskId){
        var foundTask = await _context.taskItems.FirstOrDefaultAsync(t => t.Id == taskId);

        if (foundTask != null){
            _context.taskItems.Remove(foundTask);
            await _context.SaveChangesAsync();
            return ServiceResult<TaskItem>.SuccessResult(foundTask);
        }

        return ServiceResult<TaskItem>.Failure("Taak bestaat niet.");
    }

    public async Task<ServiceResult<TaskItem>> FinishTask(int taskId)
    {
        var foundTask = await _context.taskItems.FirstOrDefaultAsync(t => t.Id == taskId);

        if (foundTask == null)
        {
            return ServiceResult<TaskItem>.Failure("Taak niet gevonden.");
        }

        if (foundTask.Finished)
        {
            return ServiceResult<TaskItem>.Failure("Taak is al gemarkeerd als voltooid.");
        }

        foundTask.Finished = true;
        await _context.SaveChangesAsync();

        return ServiceResult<TaskItem>.SuccessResult(foundTask);
    }

}

public interface ITaskService {
    public Task<ServiceResult<TaskItem>> CreateTask(TaskItem taskItem);
    public Task<ServiceResult<List<TaskItem>>> GetTasksOnDate (DateTime date, int UserId);

    public Task<ServiceResult<TaskItem>> EditTask(int id, TaskItem task);

    public Task<ServiceResult<TaskItem>> RemoveTask(int taskId);

    public Task<ServiceResult<TaskItem>> FinishTask(int taskId);
}