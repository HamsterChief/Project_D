using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddScoped<ITaskService, TaskService>();
        builder.Services.AddScoped<IFormService, FormService>();

        builder.Services.AddHttpClient<OpenAiService>();
        builder.Services.AddScoped<ChatService>();
        builder.Services.AddScoped<UserSettingsService>();
        
        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlite("Data Source=Database.db"));

        builder.Services.AddControllers();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.AllowAnyOrigin()
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });

        builder.WebHost.UseUrls("http://0.0.0.0:5133");

        var app = builder.Build();

        app.UseCors("AllowFrontend");
        app.UseHttpsRedirection();
        app.MapControllers();

        app.Run();
    }
}
