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
        private readonly SignalHub _signalHub;

        public ValuesController(SignalHub signalHub)
        {
            _signalHub = signalHub;
        }

        [HttpGet("status")]
        public ActionResult Status() {
            return Ok( new { time = DateTime.Now });
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
