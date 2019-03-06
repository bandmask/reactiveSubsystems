using HostApi.DataAccess;
using HostApi.DataAccess.Models;
using Microsoft.AspNetCore.Mvc;

namespace HostApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GamesController : ControllerBase
    {
        private readonly ICache _cache;

        public GamesController (ICache cache)
        {
            _cache = cache;

        }

        [HttpGet]
        public ActionResult GetAll ()
        {
            var entities = _cache.GetAll();
            return Ok(new { entities = entities });
        }

        [HttpGet("game")]
        public ActionResult GetGames ()
        {
            var games = _cache.GetAllOfType(typeof(Game).ToString());
            return Ok(new { games = games });
        }

        [HttpPost("game")]
        public ActionResult AddGame () {
            var game = new Game
            {
                Value = 10 * _cache.GetNumberOfRecords() / 13
            };
            _cache.Add(game);
            return Ok(new { createdId = game.Id });
        }

        [HttpGet("player")]
        public ActionResult GetPlayers ()
        {
            var players = _cache.GetAllOfType(typeof(Player).ToString());
            return Ok(new { players = players });
        }


        [HttpPost("player")]
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