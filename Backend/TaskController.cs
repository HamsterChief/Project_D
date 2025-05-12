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

    [HttpGet("date/{date}")]
    public async Task<IActionResult> GetTasksOnDate([FromRoute] DateTime date){
        var result = await _service.GetTasksOnDate(date);

        if (result.StatusCode == 200){
            return Ok(result.Data);
        }

        return BadRequest(result.ErrorMessage);
    }
}
