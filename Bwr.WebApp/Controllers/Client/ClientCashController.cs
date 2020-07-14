using BWR.Application.Interfaces.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Bwr.WebApp.Controllers.Client
{
    public class ClientCashController : Controller
    {
        private readonly IClientCashAppService _clientCashAppService;

        public ClientCashController(IClientCashAppService clientCashAppService)
        {
            _clientCashAppService = clientCashAppService;
        }
        // GET: ClientCash
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult GetClientCashes(int clientId, int coinId)
        {
            var clientCashes = _clientCashAppService.GetAll().FirstOrDefault(x => x.ClientId == clientId && x.CoinId == clientId);

            return Json(clientCashes);
        }
    }
}