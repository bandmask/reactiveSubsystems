using System;

namespace HostApi.DataAccess.Models
{
    public class EntityBase
    {
        public string Id { get; private set; }
        public DateTime Created { get; private set; }
        public string Type { get; protected set; }    

        public EntityBase()
        {
            Id = Guid.NewGuid().ToString("N");
            Created = DateTime.Now;
        }
    }
}