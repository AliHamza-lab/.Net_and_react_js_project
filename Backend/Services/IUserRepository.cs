using Backend.Models;
using System.Threading.Tasks;

namespace Backend.Services;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
    Task<User> CreateAsync(User user);
}
