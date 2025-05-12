using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class TaskService : ITaskService {

    private readonly AppDbContext _context;

    public TaskService(AppDbContext dbContext){
        _context = dbContext;
    }

    public async Task<ServiceResult<TaskItem>> CreateTask(TaskItem taskItem){

        if (string.IsNullOrEmpty(taskItem.Title)){
            return ServiceResult<TaskItem>.Failure("Titel is verplicht.");
        }

        if (taskItem.StartDate < DateTime.Now){
            return ServiceResult<TaskItem>.Failure("Startdatum moet in de toekomst zijn.");
        }

        if (taskItem.EndDate < taskItem.StartDate){
            return ServiceResult<TaskItem>.Failure("Einddatum moet na startdatum zijn");
        }

        taskItem.Finished = false;
        _context.taskItems.Add(taskItem);
        int n = await _context.SaveChangesAsync();

        if (n > 0){
            return ServiceResult<TaskItem>.SuccessResult(taskItem);
        }
        return ServiceResult<TaskItem>.Failure("Taak niet toegevoegd.");
    }

    public async Task<ServiceResult<List<TaskItem>>> GetTasksOnDate(DateTime date){

        var tasks = await _context.taskItems.Where(t => date > t.StartDate && date < t.EndDate).ToListAsync();

        return ServiceResult<List<TaskItem>>.SuccessResult(tasks);
    }


}


public interface ITaskService {
    public Task<ServiceResult<TaskItem>> CreateTask(TaskItem taskItem);
    public Task<ServiceResult<List<TaskItem>>> GetTasksOnDate (DateTime date);

    // public Task<ServiceResult<TaskItem> EditTask(TaskItem taskItem);

    // public Task<ServiceResult<TaskItem> RemoveTask(TaskItem taskItem);

    // public Task<ServiceResult<TaskItem> FinishTask(bool Finished);
}