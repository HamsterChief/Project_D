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