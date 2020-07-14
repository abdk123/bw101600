using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BWR.Application.Dtos.Branch;
using BWR.Application.Interfaces.Branch;
using BWR.Domain.Model.Branches;

namespace Bwr.WebApp.Controllers.Setting
{
    public class BranchCashController : Controller
    {
        private readonly IBranchCashAppService _branchCashAppService;
        public BranchCashController(IBranchCashAppService branchCashAppService)
        {
            _branchCashAppService = branchCashAppService;
        }
        // GET: BranchCash
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Get()
        {
            var branchCaches = _branchCashAppService.GetAll().Where(x => !x.IsMainCoin);

            return Json(new { data = branchCaches }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetForBranch()
        {
            var branchCaches = _branchCashAppService.GetForSpecificBranch(BranchHelper.Id);

            return Json(branchCaches);
        }

        public bool ChecekIfTherIsMaincoin()
        {
            return _branchCashAppService.GetAll().Any(c => c.IsMainCoin);
        }
    }
}