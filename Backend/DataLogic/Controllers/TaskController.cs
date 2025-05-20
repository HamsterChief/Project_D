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
  
    [HttpPut("edit/{id}")]
    public async Task<IActionResult> EditTask([FromRoute] int id, [FromBody] TaskItem task)
    {
        var result = await _service.EditTask(id, task);

        if (result.StatusCode == 200)
        {
            return Ok(result.Data);
        }

        return BadRequest(result.ErrorMessage);
    }

    [HttpDelete("remove/{id}")]
    public async Task<IActionResult> RemoveTask([FromRoute] int id)
    {
        var result = await _service.RemoveTask(id);

        if (result.StatusCode == 200)
        {
            return Ok(result.Data);
        }

        return BadRequest(result.ErrorMessage);
    }

    [HttpPut("finish/{id}")]
    public async Task<IActionResult> FinishTask(int id){
        var result = await _service.FinishTask(id);

        if (result.StatusCode == 200){
            return Ok(result.Data);
        }

        return BadRequest(result.ErrorMessage);
    }
}
