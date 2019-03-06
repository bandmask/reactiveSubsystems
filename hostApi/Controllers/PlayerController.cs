using HostApi.DataAccess;
using HostApi.DataAccess.Models;
using Microsoft.AspNetCore.Mvc;

namespace HostApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayerController : ControllerBase
    {
        private readonly ICache _cache;
        public PlayerController(ICache cache)
        {
            _cache = cache;
        }

        [HttpGet]
        public ActionResult GetPlayers ()
        {
            var players = _cache.GetAllOfType(typeof(Player).ToString());
            return Ok(new { players = players });
        }


        [HttpPost]
        public ActionResult AddPlayer ()
        {
            var player = new Player
            {
                Name = $"New player {10 * _cache.GetNumberOfRecords() / 11}"
            };
            _cache.Add(player);
            return Ok(new { createdId = player });
        }
    }
}