using BWR.Application.Interfaces.Client;
using BWR.Application.Interfaces.Setting;
using BWR.Application.Interfaces.Transaction;
using System;
using System.Linq;
using System.Web.Mvc;

namespace Bwr.WebApp.Controllers.Transaction
{
    public class TransactionController : Controller
    {
        private readonly ITransactionAppService _transactionAppService;
        private readonly IAttachmentAppService _attachmentAppService;
        private readonly IClientAttatchmentAppService _clientAttatchmentAppService;
        private string _message;
        private bool _success;

        public TransactionController(ITransactionAppService transactionAppService,
            IClientAttatchmentAppService clientAttatchmentAppService,
            IAttachmentAppService attachmentAppService)
        {
            _transactionAppService = transactionAppService;
            _clientAttatchmentAppService = clientAttatchmentAppService;
            _attachmentAppService = attachmentAppService;
            _message = "";
            _success = false;
        }
        public ActionResult TransactionDontDileverd(int? companyId, DateTime? from, DateTime? to)
        {
            var transactions = _transactionAppService.GetTransactionDontDileverd(from, to);
            return View(transactions);
        }

        [HttpGet]
        public ActionResult DileverdTransaction(int transactionId)
        {
            var transaction = _transactionAppService.GetById(transactionId);
            if (transaction == null)
            {
                return HttpNotFound();
            }
            if ((bool)transaction.Deliverd)
            {
                return HttpNotFound();
            }
            ViewData["Attachments"] = new SelectList(_attachmentAppService.GetForDropdown(""), "Id", "Name");
            ViewBag.ClientAttachment = _clientAttatchmentAppService.GetAll().Where(c => c.ClientId == transaction.ReciverClientId);

            return View(transaction);
        }
        
        [HttpPost]
        public ActionResult DileverTransaction(int transactionId)
        {
            try
            {
                var transactionDto = _transactionAppService.DileverTransaction(transactionId);
                if (transactionDto != null)
                    _success = true;
                else
                {
                    _success = false;
                    _message = "حدثت مشكلة اثناء الحفظ";
                }
            }
            catch (Exception ex)
            {
                _success = false;
                _message = "حدثت مشكلة اثناء الحفظ";
            }

            return Json(new { Success = _success, Message = _message }, JsonRequestBehavior.AllowGet);
        }
    }
}