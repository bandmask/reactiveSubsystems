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
        int GetNumberOfRecords ();
        int GetNumberOfRecordsOfType (string type);
        EntityBase Get (string id);
        EntityBase GetOfType (string type, string id);
        IList<EntityBase> GetAll ();
        IList<EntityBase> GetAllOfType (string type);
        void Add (EntityBase model);
        void Remove (EntityBase model);
        void Reset ();
    }

    public class Cache : ICache
    {
        private readonly IRedisClientsManager _clientManager;

        public Cache (IRedisClientsManager clientsManager)
        {
            _clientManager = clientsManager;
        }

        public int GetNumberOfRecords ()
        {
            return GetAll().Count;
        }

        public int GetNumberOfRecordsOfType(string type)
        {
            return GetAllOfType(type).Count;
        }

        public IList<EntityBase> GetAll ()
        {
            return Executor<IList<EntityBase>>.Execute(_clientManager, client => {
                return client.GetAll();
            });
        }

        public IList<EntityBase> GetAllOfType (string type)
        {
            return GetAll().Where(x => x.Type == type).ToList();
        }

        public EntityBase Get(string id)
        {
            return GetAll().Where(x => x.Id == id).FirstOrDefault();
        }

        public EntityBase GetOfType (string type, string id)
        {
            return GetAllOfType(type).Where(x => x.Id == id).FirstOrDefault();
        }

        public void Add (EntityBase model)
        {
            Executor.Execute(_clientManager, client => {
                client.Store(model);
            }, (true, $"entity:added:{model.Type}", model.Id));
        }

        public void Remove (EntityBase model)
        {
            Executor.Execute(_clientManager, client => {
                client.Delete(model);
            }, (true, $"entity:removed:{model.Type}", model.Id));
        }

        public void Reset ()
        {
            Executor.Execute(_clientManager, client => {
                client.DeleteAll();
            }, (true, $"entity:reset:all", "entities resetted"));
        }

        private static class Executor
        {
            public static void Execute (IRedisClientsManager clientManager, Action<IRedisTypedClient<EntityBase>> action, (bool Signal, string Channel, string Message)? signalInfo = null)
            {
                using (var client = clientManager.GetClient()) {
                    action(client.As<EntityBase>());
            
                    if (signalInfo.HasValue && signalInfo.Value.Signal)
                    {
                        client.PublishMessage(signalInfo.Value.Channel, signalInfo.Value.Message);
                    }
                }
            }
        }

        private static class Executor<T> where T : class 
        {
            public static T Execute (IRedisClientsManager clientManager, Func<IRedisTypedClient<EntityBase>, T> func)
            {
                using (var client = clientManager.GetClient()) {
                    return func(client.As<EntityBase>());
                }
            }
        }
    }
}