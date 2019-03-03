using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using webApi.DataAccess;

namespace webApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly ICache _cache;
        private readonly SignalHub _signalHub;

        public ValuesController(SignalHub signalHub, ICache cache)
        {
            _signalHub = signalHub;
            _cache = cache;
        }

        [HttpGet("status")]
        public ActionResult Status() {
            return Ok( new { time = DateTime.Now });
        }
        
        [HttpGet]
        public ActionResult Get()
        {
            return Ok(_cache.GetAll());
        }

        [HttpPost("add")]
        public void Add()
        {
            _cache.Add(new Model
            {
                Value = new Random().Next()
            });
        }

        [HttpPost("remove/{id}")]
        public void Remove(string id)
        {
            _cache.Remove(_cache.Get(id));
        }

        [HttpDelete("reset")]
        public void Reset()
        {
            _cache.Reset();
        }
        
        [HttpGet("start")]
        public ActionResult Start()
        {
            _signalHub.Start();
            return Ok(new { message = "signal hub started" });
        }
        
        [HttpGet("stop")]
        public ActionResult Stop()
        {
            _signalHub.Stop();
            return Ok(new { message = "signal hub stopped" });
        }

        [HttpPost("send")]
        public ActionResult Send([FromBody] string message)
        {
            _signalHub.Send(message);
            return Ok(new { message = $"signal hub message sent {message}" });
        }
    }
}
