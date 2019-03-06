using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using ServiceStack.Redis;

namespace HostApi.DataAccess
{
    public interface ISignalHub
    {
        void Start ();
        void Stop ();
        void Send (string channel, string message);
    }
    
    public class SignalHub : ISignalHub
    {
        private const string CHANNEL_START = "challangers:start";
        private const string CHANNEL_END = "challangers:end";
        private const string CHANNEL_RECIEVE = "challangers:result";

        private static IList<string> _values;        
        private static IRedisClient _client;
        private static IRedisPubSubServer _pubSubServer;
        private readonly IRedisClientsManager _clientsManager;

        public SignalHub (IRedisClientsManager clientsManager)
        {
            _clientsManager = clientsManager;
        }

        private Action<string, string> RegisterResults = (channel, result) => {
            _values.Add(result);
        };

        private static string GetResults () {
            return $"Number of results: {_values.Count}. {String.Join(",", _values)}";
        }

        public async void Start ()
        {
            _values = new List<string>();
            _client = _clientsManager.GetClient();
            Console.WriteLine($"starting up  {GetResults()}");
            _pubSubServer = _clientsManager.CreatePubSubServer(CHANNEL_RECIEVE, RegisterResults).Start();
            Send(CHANNEL_START, "now collecting results");
            await Task.Delay(TimeSpan.FromSeconds(10));
            Stop();
        }

        public void Stop ()
        {
            if (_client != null) {
                var results = GetResults();
                Console.WriteLine($"results: {results}");
                Send(CHANNEL_END, $"results are in {results}");

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

        public void Send (string channel, string message)
        {
            _client.PublishMessage(channel, message);
        }
    }
}