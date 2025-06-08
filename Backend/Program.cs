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

        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlite("Data Source=Database.db"));

        builder.Services.AddControllers();
        builder.Services.AddScoped<IFormService, FormService>();
        builder.Services.AddScoped<UserSettingsService>();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.AllowAnyOrigin()
                      .AllowAnyHeader()
                      .AllowAnyMethod();
                
                // policy.WithOrigins("http://localhost:8081")
                //         .AllowAnyHeader()
                //         .AllowAnyMethod();
            });
        });

        builder.WebHost.UseUrls("http://0.0.0.0:5133");

        var app = builder.Build();

        app.UseCors("AllowFrontend");
        app.UseCors("AllowReactNativeWebApp");
        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }
}
