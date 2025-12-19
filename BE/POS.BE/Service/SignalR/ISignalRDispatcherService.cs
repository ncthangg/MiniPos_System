using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.SignalR
{
    public interface ISignalRDispatcherService
    {
        Task SendToEntityPageAsync(string entityType, string pageKey, string action, object? data);
        Task SendToEntityDetailAsync(string entityType, string entityId, string action, object? data);
    }
}
