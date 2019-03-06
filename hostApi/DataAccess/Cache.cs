using System;
using System.Collections.Generic;
using System.Linq;
using HostApi.DataAccess.Models;
using ServiceStack.Redis;
using ServiceStack.Redis.Generic;

namespace HostApi.DataAccess
{
    public interface ICache
    {
        int GetNumberOfRecords();
        EntityBase Get(string type, string id);
        IList<EntityBase> GetAll();
        IList<EntityBase> GetAllOfType(string type);
        void Add(EntityBase model);
        void Remove(EntityBase model);
        void Reset();
    }

    public class Cache : ICache
    {
        private readonly IRedisClientsManager _clientManager;

        public Cache(IRedisClientsManager clientsManager)
        {
            _clientManager = clientsManager;
        }

        public IList<EntityBase> GetAll()
        {
            return Executor<IList<EntityBase>>.Execute(_clientManager, client => {
                return client.GetAll();
            });
        }

        public IList<EntityBase> GetAllOfType(string type)
        {
            return GetAll().Where(x => x.Type == type).ToList();
        }

        public EntityBase Get(string type, string id)
        {
            return GetAll().Where(x => x.Type == type && x.Id == id).FirstOrDefault();
        }

        public void Add(EntityBase model)
        {
            Executor.Execute(_clientManager, client => {
                client.Store(model);
            });
        }

        public void Remove(EntityBase model)
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
            public static void Execute(IRedisClientsManager clientManager, Action<IRedisTypedClient<EntityBase>> action)
            {
                using (var client = clientManager.GetClient()) {
                    action(client.As<EntityBase>());
                    client.PublishMessage("updates", "updated");
                }
            }
        }

        private static class Executor<K> where K : class 
        {
            public static K Execute(IRedisClientsManager clientManager, Func<IRedisTypedClient<EntityBase>, K> func)
            {
                using (var client = clientManager.GetClient()) {
                    return func(client.As<EntityBase>());
                }
            }
        }
    }
}