using System;

namespace HostApi.DataAccess.Models
{
    public class Game : EntityBase
    {
        public int Value { get; set; }

        public Game() : base() 
        {
            Type = typeof(Game).ToString();
        }
    }
}