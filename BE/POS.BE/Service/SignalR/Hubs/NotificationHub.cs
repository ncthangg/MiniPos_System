using Microsoft.AspNetCore.SignalR;

namespace API.SignalR.Hubs
{
    public class NotificationHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            Console.WriteLine("Ket noi toi NotificationHub");
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine("Ngat ket noi NotificationHub");
            return base.OnDisconnectedAsync(exception);
        }

        // Cho phép client join vào các "group" theo page hoặc entity
        public async Task JoinGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task LeaveGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }
    }
}
