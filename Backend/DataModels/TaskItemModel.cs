public class TaskItem {

    public int Id {get; set;}
    public string Title { get; set;}

    public DateTime StartDate {get; set;}

    public DateTime EndDate {get; set;}

    public string Description {get; set;}

    public bool Finished {get; set;} = false;

    public int UserId {get; set;}
}
