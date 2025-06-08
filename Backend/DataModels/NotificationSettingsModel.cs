public class NotificationSettings
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public bool EmailAllowed { get; set; }
    public bool PhoneAllowed { get; set; }
    public bool PushAllowed { get; set; }
    // public bool LikesAllowed { get; set; }
    // public bool CommentsAllowed { get; set; }
    // public bool FollowersAllowed { get; set; }
    // public bool WeekyOverviewAllowed { get; set; }
    // public bool ProductsAllowed { get; set; }
    public User User { get;  set;}
}
