public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;

    public RequestLoggingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        await _next(context);

        var endpointPath = context.Request.Path;
        var statusCode = context.Response.StatusCode;

        var logEntry = $"[{DateTime.UtcNow}] Path: {endpointPath}, Status Code: {statusCode}{Environment.NewLine}";

        var logFilePath = Path.Combine(Directory.GetCurrentDirectory(), "logs", "logs.txt");

        Directory.CreateDirectory(Path.GetDirectoryName(logFilePath));

        await File.AppendAllTextAsync(logFilePath, logEntry);
    }
}