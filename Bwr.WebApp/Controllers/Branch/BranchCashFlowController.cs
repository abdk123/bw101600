using BWR.Application.Dtos.Branch;
using BWR.Application.Interfaces.BranchCashFlow;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Bwr.WebApp.Controllers.Branch
{
    public class BranchCashFlowController : Controller
    {
        private readonly IBranchCashFlowAppService _branchCashFlowAppService;

        public BranchCashFlowController(IBranchCashFlowAppService branchCashFlowAppService)
        {
            _branchCashFlowAppService = branchCashFlowAppService;
        }

        public ActionResult Index(int? coinId,DateTime? from,DateTime? to)
        {
            int branchId = BranchHelper.Id;

            var branchCashFlow = _branchCashFlowAppService.Get(x =>
              x.BranchId == branchId &&
              x.CoinId == coinId &&
              (from != null ? x.Created >= from : true) &&
              (to != null ? x.Created <= to : true)
            ).FirstOrDefault();

            return View(branchCashFlow);
        }
    }
}