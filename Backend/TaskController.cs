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

    [HttpPut("edit")]
    public async Task<IActionResult> EditTask([FromBody] TaskItem task){
        var result = await _service.EditTask(task);

        if (result.StatusCode == 200){
            return Ok(result.Data);
        }

        return BadRequest(result.ErrorMessage);
    }

    [HttpDelete("remove")]
    public async Task<IActionResult> RemoveTask([FromBody] TaskItem task){
        var result = await _service.RemoveTask(task);

        if (result.StatusCode == 200){
            return Ok(result.Data);
        }

        return BadRequest(result.ErrorMessage);
    }

    [HttpPut("finish")]
    public async Task<IActionResult> FinishTask([FromBody] TaskItem task){
        var result = await _service.FinishTask(task);

        if (result.StatusCode == 200){
            return Ok(result.Data);
        }

        return BadRequest(result.ErrorMessage);
    }
}
