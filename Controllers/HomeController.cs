using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ajanda.Models;

namespace Ajanda.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            DataAccess da = new DataAccess();
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
