using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<User> Users => Set<User>();

    public DbSet<TaskItem> taskItems => Set<TaskItem>();
    public DbSet<FormItem> formItems => Set<FormItem>();

    public DbSet<ChatMessage> ChatMessages { get; set; }
    public DbSet<AppointmentItem> appointmentItems => Set<AppointmentItem>();
        
    public DbSet<UserSettings> UserSettings => Set<UserSettings>();

        
}