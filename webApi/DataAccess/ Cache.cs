using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using ServiceStack.Redis;
using ServiceStack.Redis.Generic;

namespace webApi.DataAccess
{
    public interface ICache
    {
        int GetNumberOfRecords();
        Model Get(string id);
        IList<Model> GetAll();
        void Add(Model model);
        void Remove(Model model);
        void Reset();
    }

    public class Cache : ICache
    {
        private readonly IRedisClientsManager _clientManager;

        public Cache(IRedisClientsManager clientsManager)
        {
            _clientManager = clientsManager;
        }

        public IList<Model> GetAll()
        {
            return Executor<IList<Model>>.Execute(_clientManager, client => {
                return client.GetAll();
            });
        }

        public Model Get(string id)
        {
            return GetAll().Where(x => x.Id == id).FirstOrDefault();
        }

        public void Add(Model model)
        {
            Executor.Execute(_clientManager, client => {
                client.Store(model);
            });
        }

        public void Remove(Model model)
        {
            Executor.Execute(_clientManager, client => {
                client.Delete(model);
            });
        }

        public int GetNumberOfRecords()
        {
            return GetAll().Count;
        }

        public void Reset()
        {
            Executor.Execute(_clientManager, client => {
                client.DeleteAll();
            });
        }

        private static class Executor
        {
            public static void Execute(IRedisClientsManager clientManager, Action<IRedisTypedClient<Model>> action)
            {
                using (var client = clientManager.GetClient()) {
                    action(client.As<Model>());
                    client.PublishMessage("updates", "updated");
                }
            }
        }

        private static class Executor<T> where T : class 
        {
            public static T Execute(IRedisClientsManager clientManager, Func<IRedisTypedClient<Model>, T> func)
            {
                using (var client = clientManager.GetClient()) {
                    return func(client.As<Model>());
                }
            }
        }
    }
}