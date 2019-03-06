using HostApi.DataAccess;
using HostApi.DataAccess.Models;
using Microsoft.AspNetCore.Mvc;

namespace HostApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly ICache _cache;

        public GameController (ICache cache)
        {
            _cache = cache;

        }

        [HttpGet]
        public ActionResult GetGames ()
        {
            var games = _cache.GetAllOfType(typeof(Game).ToString());
            return Ok(new { games = games });
        }

        [HttpPost]
        public ActionResult AddGame () {
            var game = new Game
            {
                Value = 10 * _cache.GetNumberOfRecords() / 13
            };
            _cache.Add(game);
            return Ok(new { createdId = game.Id });
        }
    }
}