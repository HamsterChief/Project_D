public class FormItem
{
    public int Id { get; set; }
    // public string Title { get; set; }
    public string Text { get; set; }
    public DateTime SubmissionDate { get; set; }
    public int UserId { get; set; }
    // public User User { get; set; } = null;
    public FormType FormType { get; set; } = FormType.None;
}

public enum FormType
{
    None,
    Feedback,
    Bug,
}