using System;

namespace HostApi.DataAccess.Models
{
    public class Player : EntityBase
    {
        public string Name { get; set; }

        public Player () : base()
        {
            Type = typeof(Player).ToString();
        }        
    }
}