using System.Threading.Tasks;
using Xunit;
using Microsoft.EntityFrameworkCore;
using Backend; // Your DbContext namespace
using Microsoft.AspNetCore.Mvc;

namespace AgandaAppTests
{
    public class Backend_Test
    {
        private AppDbContext GetTestDbContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;
            return new AppDbContext(options);
        }

        [Fact]
        public async Task Register_And_Login_Works()
        {
            // Use a unique DB name for isolation
            var dbContext = GetTestDbContext("RegisterAndLoginTestDb");
            var controller = new AuthController(dbContext);

            var testUser = new User
            {
                Email = "testuser@example.com",
                Password = "Test1234!" // Must meet your password requirements
            };

            // Act: Register
            var registerResult = await controller.Register(testUser);
            Assert.True(registerResult is OkResult || registerResult is OkObjectResult, "Register should return Ok");

            // Act: Login
            var loginUser = new User
            {
                Email = "testuser@example.com",
                Password = "Test1234!"
            };
            var loginResult = await controller.Login(loginUser);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(loginResult);
            Assert.NotNull(okResult.Value);
            var resultData = okResult.Value.ToString();
            Assert.Contains("testuser@example.com", resultData);
        }

        [Fact]
        public async Task Register_With_Existing_Email_Fails()
        {
            var dbContext = GetTestDbContext("RegisterDuplicateEmailDb");
            var controller = new AuthController(dbContext);

            var user = new User
            {
                Email = "duplicate@example.com",
                Password = "Password1!"
            };

            // Register first time
            var firstRegister = await controller.Register(user);
            Assert.True(firstRegister is OkResult || firstRegister is OkObjectResult);

            // Register second time with same email
            var secondRegister = await controller.Register(user);
            Assert.True(secondRegister is BadRequestResult || secondRegister is BadRequestObjectResult, "Should not allow duplicate email registration");
        }

        [Fact]
        public async Task Login_With_Wrong_Password_Fails()
        {
            var dbContext = GetTestDbContext("LoginWrongPasswordDb");
            var controller = new AuthController(dbContext);

            var user = new User
            {
                Email = "user2@example.com",
                Password = "CorrectPassword1!"
            };

            // Register
            var registerResult = await controller.Register(user);
            Assert.True(registerResult is OkResult || registerResult is OkObjectResult);

            // Attempt login with wrong password
            var loginUser = new User
            {
                Email = "user2@example.com",
                Password = "WrongPassword!"
            };
            var loginResult = await controller.Login(loginUser);
            Assert.True(loginResult is UnauthorizedResult || loginResult is UnauthorizedObjectResult, "Login with wrong password should fail");
        }

        [Fact]
        public async Task Login_With_Nonexistent_User_Fails()
        {
            var dbContext = GetTestDbContext("LoginNonexistentUserDb");
            var controller = new AuthController(dbContext);

            var loginUser = new User
            {
                Email = "doesnotexist@example.com",
                Password = "AnyPassword1!"
            };
            var loginResult = await controller.Login(loginUser);
            Assert.True(loginResult is UnauthorizedResult || loginResult is UnauthorizedObjectResult, "Login with nonexistent user should fail");
        }
    }
}
