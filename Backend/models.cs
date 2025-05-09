public class User {
    public int Id { get; set;}
    public string Email { get; set; }
    public string Password {get; set;}
}


public class TaskItem {

    public int Id {get; set;}
    public string Title { get; set;}

    public DateTime StartDate {get; set;}

    public DateTime EndDate {get; set;}

    public string Description {get; set;}

    public bool Finished {get; set;} = false;

    public int UserId {get; set;}

    public User User { get; set; }
}


public class AppointmentItem {

    public int Id {get; set;}

    public string Title {get; set;}

    public DateTime StartDate {get; set;}

    public DateTime EndDate {get; set;}

    public string Description {get; set;}

    public string Location {get; set;}

    public bool isAllDay {get; set;}=false;

    public int UserId {get; set;}

    public User User {get; set;}
}