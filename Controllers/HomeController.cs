using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebApi_Frond_End_UdaApp.Models;

namespace WebApi_Frond_End_UdaApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Registro()
        {
            return View();
        }

        public IActionResult Inicio()
        {
            return View();
        }
        public IActionResult PaginaPrincipal()
        {
            return View();
        }
        public IActionResult Perfil()
        {
            ViewBag.Title = "Perfil"; 

            return View();
        }
        public IActionResult Gerente()
        {
            return View();
        }

        public IActionResult Moderador()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
