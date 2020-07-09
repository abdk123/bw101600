using BWR.Application.Interfaces.Transaction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
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
            var innerTransactionsDto = _innerTransactionAppService.GetTransactions();
            return View(innerTransactionsDto);
        }
    }
}