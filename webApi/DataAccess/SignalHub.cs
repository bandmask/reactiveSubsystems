
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using ServiceStack.Redis;

namespace webApi.DataAccess
{
    public interface ISignalHub
    {
        void Start();
        void Stop();
        void Send(string message);
    }
    /* SignalHub
     * SignalR.Hub not working at the moment
     */
    public class SignalHub : ISignalHub // Hub
    {
        private static IRedisClient _client;
        private static IRedisPubSubServer _pubSubServer;
        private readonly IRedisClientsManager _clientsManager;

        public SignalHub(IRedisClientsManager clientsManager)
        {
            _clientsManager = clientsManager;
        }

        private Action<string, string> Log = (message, channel) => {
            Console.WriteLine($"ping event recieved {channel} {message}");
        };

        public void Start()
        {
            _client = _clientsManager.GetClient();
            _pubSubServer = _clientsManager.CreatePubSubServer("ping", Log).Start();

            Send("message");
        }

        public void Stop()
        {
            if (_client != null) {
                _client.Dispose();
                _client = null;
            }

            if (_pubSubServer != null) {
                _pubSubServer.Dispose();
                _pubSubServer = null;
            }
        }

        public void Send(string message)
        {
            _client.PublishMessage("pong", message);
        }

        /* Signal
         * Clients is null.
         */
        // private async Task Signal(string v1, string v2) 
        // {
        //     await Clients.All.SendAsync("message", v1, v2);
        // }
    }
}