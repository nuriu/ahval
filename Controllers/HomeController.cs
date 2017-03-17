using Microsoft.AspNetCore.Mvc;

namespace Ajanda.Controllers
{
    /// <summary>
    /// Entry point in controllers.
    /// </summary>
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
