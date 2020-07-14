using BWR.Application.Dtos.Transaction.InnerTransaction;
using BWR.Application.Interfaces.Transaction;
using System;
using System.Web.Mvc;

namespace Bwr.WebApp.Controllers.Transaction
{
    public class InnerTransactionController : Controller
    {
        private readonly IInnerTransactionAppService _innerTransactionAppService;

        public InnerTransactionController(IInnerTransactionAppService innerTransactionAppService)
        {
            _innerTransactionAppService = innerTransactionAppService;
        }
        // GET: InnerTransaction
        public ActionResult Index()
        {
            var innerTransactionInitialDto = _innerTransactionAppService.InitialInputData();
            ViewBag.Companies = new SelectList(innerTransactionInitialDto.Companies, "Id", "Name");
            ViewBag.Coin = new SelectList(innerTransactionInitialDto.Coins, "Id", "Name");
            ViewBag.Clients = new SelectList(innerTransactionInitialDto.Clients, "Id", "FullName");
            ViewData["NormalClient"] = innerTransactionInitialDto.NormalClients;
            return View();
        }

        [HttpPost]
        public ActionResult SaveInnerTransactions(InnerTransactionInsertListDto Incometransacrions)
        {
            try
            {
                bool transactionsSaved = _innerTransactionAppService.SaveInnerTransactions(Incometransacrions);

                return Json(transactionsSaved);
            }
            catch (Exception ex)
            {
                return Json("error");
            }
        }
    }
}