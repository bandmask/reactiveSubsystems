using System;
using System.Collections.Generic;
using System.Linq;
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
    
    public class SignalHub : ISignalHub
    {
        private static IList<string> _values;        
        private static IRedisClient _client;
        private static IRedisPubSubServer _pubSubServer;
        private readonly IRedisClientsManager _clientsManager;

        public SignalHub(IRedisClientsManager clientsManager)
        {
            _clientsManager = clientsManager;
        }

        private Action<string, string> RegisterResults = (result, channel) => {
            _values.Add(result);
        };

        private static string GetResults() {
            return $"Number of results: {_values.Count}. Latest: {_values.LastOrDefault()}";
        }

        public async void Start()
        {
            _values = new List<string>();
            _client = _clientsManager.GetClient();
            _pubSubServer = _clientsManager.CreatePubSubServer("results", RegisterResults).Start();
            Send("awaiting results");
            await Task.Delay(TimeSpan.FromSeconds(30));
            Stop();
        }

        public void Stop()
        {
            if (_client != null) {
                Send($"results are in {GetResults()}");

                _client.Dispose();
                _client = null;
            }

            if (_pubSubServer != null) {
                _pubSubServer.Stop();
                _pubSubServer.Dispose();
                _pubSubServer = null;
            }

            _values = null;
        }

        public void Send(string message)
        {
            _client.PublishMessage("challangers", message);
        }
    }
}