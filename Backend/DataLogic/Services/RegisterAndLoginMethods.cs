using System.Text.Json;
using System.Text.RegularExpressions;
using static System.Net.Mail.MailAddress;

public static class RegisterAndLoginMethods
{
    public static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }
    public static bool ValidatePassword(string password, string correctHash)
    {
        return BCrypt.Net.BCrypt.Verify(password, correctHash);
    }

    public static bool IsValidEmail(string emailAddress)
    {
        // try {
        //     var addr = new System.Net.Mail.MailAddress(emailAddress);
        //     return addr.Address == emailAddress;
        // } catch {
        //     return false;
        // }
        string regPattern = @"^[^\.][\w\.-]+@[\w\.-]+\.[\w]+$";
        if (emailAddress.Contains("@")&& emailAddress.Contains(".")&&Regex.IsMatch(emailAddress, regPattern))
        {
            return true;
        }
        return false;
    }

    public static bool isValidPassword(string password) => Regex.IsMatch(password, @"^(?=.*[A-Z])(?=.*\d)[A-Za-z0-9\-!#$]{8,24}$");
}
