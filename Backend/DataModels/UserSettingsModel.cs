public class UserSettings
{
    //public int Id { get; set; } // waarom usersetting id? kan ook id van gebruiker hergebruiken?
    public int id { get; set; } // of int als je integer IDs gebruikt
    public string preferredColor { get; set; }
    public string font { get; set; }
    public string background { get; set; }
    public string iconStyle { get; set; }
}