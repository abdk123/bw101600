using BWR.Application.Dtos.Company;
using BWR.Application.Interfaces.Company;
using System.Linq;
using System.Web.Mvc;

namespace Bwr.WebApp.Controllers.Company
{
    public class CompanyCashController : Controller
    {
        
        private readonly ICompanyCashAppService _companyCashAppService;
        private string _message;
        private bool _success;

        public CompanyCashController(ICompanyCashAppService companyCashAppService)
        {
            _companyCashAppService = companyCashAppService;
            _message = "";
            _success = false;
        }

        // GET: CompanyCash
        public ActionResult Index(int companyId)
        {
            var dto = new CompanyCashDto()
            {
                CompanyId = companyId
            };
            return View(dto);
        }

        public ActionResult GetCompanyBalance(int companyId)
        {
            var companyCashs = _companyCashAppService.GetCompanyCashs(companyId).OrderBy(x => x.CoinName);

            return Json(new { data = companyCashs }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult EditCompanyCash(CompanyCashesDto dto)
        {
            var companyBalance = _companyCashAppService.UpdateBalance(dto);
            if (companyBalance != null)
                _success = true;
            else
            {
                _success = false;
                _message = "حدثت مشكلة اثناء تعديل البيانات ";
            }

            return Json(new { Success = _success, Message = _message }, JsonRequestBehavior.AllowGet);
        }

        public decimal GetCompanyBalnce(int companyId, int coinId)
        {
            return _companyCashAppService.GetCompanyCashs(companyId).FirstOrDefault(x => x.CoinId == coinId).Total;
        }

        public ActionResult GetCompanyCashes(int companyId)
        {
            var companyCashes = _companyCashAppService.GetCompanyCashs(companyId);
            return Json(companyCashes);
        }

        public JsonResult GetCompanyCashesForOther(int companyId)
        {
            var companyCashes = _companyCashAppService.GetAll().Where(x => x.CompanyId != companyId).ToList();

            return Json(companyCashes);
        }

        public JsonResult GetCompanyMaxAndDeptByCoin(int coinId, int companyId)
        {
            var companyCash = _companyCashAppService.GetCompanyCashs(companyId).FirstOrDefault(x => x.CoinId == coinId);

            return Json(new
            {
                companyCash.MaxCreditor,
                companyCash.MaxDebit,
                companyCash.Total
            });
        }
        
    }
}