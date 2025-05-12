public class ServiceResult<T>
{
    public T? Data { get; set; }
    public int StatusCode { get; set; }
    public string? ErrorMessage { get; set; }
    public bool Success => StatusCode >= 200 && StatusCode < 300;

    public static ServiceResult<T> SuccessResult(T data, int statusCode = 200)
    {
        return new ServiceResult<T> { Data = data, StatusCode = statusCode };
    }

    public static ServiceResult<T> Failure(string errorMessage, int statusCode = 400)
    {
        return new ServiceResult<T> { ErrorMessage = errorMessage, StatusCode = statusCode };
    }
}



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