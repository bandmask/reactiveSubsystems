using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HostApi.DataAccess;

namespace HostApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ValuesController : ControllerBase
    {
        private readonly ISignalHub _signalHub;

        public ValuesController (ISignalHub signalHub)
        {
            _signalHub = signalHub;
        }

        [HttpGet("status")]
        public ActionResult Status () {
            return Ok( new { time = DateTime.Now });
        }
        
        [HttpGet("start")]
        public ActionResult Start ()
        {
            _signalHub.Start();
            return Ok(new { message = "signal hub started" });
        }
        
        [HttpGet("stop")]
        public ActionResult Stop ()
        {
            _signalHub.Stop();
            return Ok(new { message = "signal hub stopped" });
        }
    }
}
