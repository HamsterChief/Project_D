public class VerificationCode
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string VerificationCodeStr { get; set; }
    public User User { get; set; }
}

public class EmailVerificationDto
{
    public int UserId { get; set; }
    public string VerificationCodeStr { get; set; }
}
