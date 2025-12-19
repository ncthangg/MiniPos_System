using API.SignalR.Hubs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.SignalR
{
    public class SignalRDispatcherService : ISignalRDispatcherService
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public SignalRDispatcherService(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendToEntityPageAsync(string entityType, string pageKey, string action, object? data)
        {
            List<string> groupNames;

            groupNames = [$"page:{entityType}:{pageKey}"];

            await _hubContext.Clients.Groups(groupNames).SendAsync("ReceiveMessage", action, data);
        }

        public async Task SendToEntityDetailAsync(string entityType, string entityId, string action, object? data)
        {
            var groupName = $"detail:{entityType}:{entityId}";

            await _hubContext.Clients.Group(groupName).SendAsync("ReceiveMessage", action, data);
        }

    }

}
