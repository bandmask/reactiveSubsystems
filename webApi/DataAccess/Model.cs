using System;

namespace webApi.DataAccess
{
    public class Model
    {
        public string Id { get; set; }
        public int Value { get; set; }
        public DateTime Created { get; set;}

        public Model()
        {
            Id = Guid.NewGuid().ToString("N");
            Created = DateTime.Now;
        }
    }
}