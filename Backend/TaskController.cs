using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/task")]

public class TaskController : ControllerBase {

    private readonly ITaskService _service;

    public TaskController(ITaskService taskService){
        _service = taskService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateTask([FromBody] TaskItem taskItem){
        var result = await _service.CreateTask(taskItem);

        if (result.StatusCode == 200){
            return Ok(result.Data);
        }

        return BadRequest(result.ErrorMessage);
    }

    [HttpGet("date/{date}/user/{userId}")]
    public async Task<IActionResult> GetTasksOnDate([FromRoute] DateTime date, [FromRoute] int userId){
        var result = await _service.GetTasksOnDate(date, userId);

        if (result.StatusCode == 200){
            return Ok(result.Data);
        }

        if (result.Data == null)
        {
            return Ok(new List<TaskItem>());
        }

        return BadRequest(result.ErrorMessage);
    }
  
    [HttpPut("edit/{id}/user/{userId}")]
    public async Task<IActionResult> EditTask([FromRoute] int id, [FromRoute] int userId, [FromBody] TaskItem task)
    {
        var result = await _service.EditTask(id, userId, task);

        if (result.StatusCode == 200)
        {
            return Ok(result.Data);
        }

        return BadRequest(result.ErrorMessage);
    }

    [HttpDelete("remove/{taskId}/user/{userId}")]
    public async Task<IActionResult> RemoveTask([FromRoute] int taskId, [FromRoute] int userId)
    {
        var result = await _service.RemoveTask(taskId, userId);

        if (result.StatusCode == 200)
        {
            return Ok(result.Data);
        }

        return BadRequest(result.ErrorMessage);
    }

    [HttpPut("finish/{id}/user/{userId}")]
    public async Task<IActionResult> FinishTask([FromRoute] int id, [FromRoute] int userId)
    {
        Console.WriteLine($"FinishTask aangeroepen met taskId={id}, userId={userId}");
        
        var result = await _service.FinishTask(id, userId);

        if (result.StatusCode == 200)
        {
            return Ok(result.Data);
        }

        return BadRequest(result.ErrorMessage);
    }
}
