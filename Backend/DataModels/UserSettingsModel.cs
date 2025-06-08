// using System.ComponentModel.DataAnnotations.Schema;

public class UserSettings
{
    public int Id { get; set; }
    // [ForeignKey("User")]
    public int UserId { get; set; } // of int als je integer IDs gebruikt
    public string PreferredColor { get; set; }
    public string Font { get; set; }
    public string Background { get; set; }
    public string IconStyle { get; set; }
    public User User { get; set; }
}
