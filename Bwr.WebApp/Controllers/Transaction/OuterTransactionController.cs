﻿using BWR.Application.Dtos.Transaction.OuterTransaction;
using BWR.Application.Interfaces.Shared;
using BWR.Application.Interfaces.Transaction;
using System;
using System.Linq;
using System.Web.Mvc;
using BWR.Application.Interfaces.Common;
using BWR.Application.Interfaces.Setting;
using PagedList;
using System.Collections.Generic;
using BWR.Domain.Model.Settings;

namespace Bwr.WebApp.Controllers.Transaction
{
    public class OuterTransactionController : Controller
    {
        private readonly IOuterTransactionAppService _outerTransactionAppService;
        private readonly ICoinAppService _coinAppService;
        private readonly ICountryAppService _countryAppService;
        private readonly IMoneyActionAppService _moneyActionAppService;
        private readonly IAppSession _appSession;
        private string _message;
        private bool _success;

        public OuterTransactionController(
            IOuterTransactionAppService outerTransactionAppService,
            ICoinAppService coinAppService,
            ICountryAppService countryAppService,
            IMoneyActionAppService moneyActionAppService,
            IAppSession appSession
            )
        {
            _outerTransactionAppService = outerTransactionAppService;
            _coinAppService = coinAppService;
            _countryAppService = countryAppService;
            _moneyActionAppService = moneyActionAppService;
            _appSession = appSession;
            _message = "";
            _success = false;
        }
        
        // GET: OuterTransaction
        public ActionResult Index(TypeOfPay typeOfPay, int? coinId, int? countryId, int? receiverClientId, int? senderClientId, DateTime? from, DateTime? to, int? page)
        {
            var outerTransactionInputDto = new OuterTransactionInputDto()
            {
                CoinId = coinId,
                CountryId = countryId,
                From = from,
                ReceiverClientId = receiverClientId,
                SenderClientId = senderClientId,
                To = to,
                TypeOfPay = typeOfPay
            };

            var outerTransactionsDto = _outerTransactionAppService.GetTransactions(outerTransactionInputDto).ToPagedList(page ?? 1, 10);
            return View(outerTransactionsDto);
        }

        [HttpGet]
        public ActionResult CreateOuterTransaction()
        {
            var initialData = _outerTransactionAppService.InitialInputData();

            return View(initialData);
        }

        public ActionResult OuterTransactionDetails(int transactionId)
        {
            var outerTransaction = _outerTransactionAppService.GetTransactionById(transactionId);

            var initialData = _outerTransactionAppService.InitialInputData();

                    
            ViewBag.Coins= new SelectList(initialData.Coins, "Id", "Name", outerTransaction.CoinId);
            ViewBag.Countries = new SelectList(initialData.Countries, "Id", "Name", outerTransaction.CountryId);
            ViewBag.Countries = new SelectList(initialData.Companies, "Id", "Name", outerTransaction.SenderCompanyId);
            ViewBag.Attachments = new SelectList(initialData.Attachments, "Id", "Name");
            ViewBag.ReceiverCompany = new SelectList(initialData.Companies.Where(x=>x.Id== outerTransaction.ReceiverCompanyId)
                , "Id", "Name", outerTransaction.ReceiverCompanyId);

            ViewBag.Agents = initialData.Agents;
            ViewBag.Clients = initialData.Clients;

            var moneyAction = _moneyActionAppService.GetByTransactionId(transactionId).FirstOrDefault();
            if (moneyAction != null)
            {
                ViewBag.MainCompanyCashFlow =moneyAction.CompanyCashFlows.FirstOrDefault(x => x.CompanyId == outerTransaction.SenderCompanyId);
                ViewBag.SecoundCompanyCashFlow =moneyAction.CompanyCashFlows.FirstOrDefault(x => x.CompanyId == outerTransaction.ReceiverCompanyId);
                ViewBag.ClientCashFlow =moneyAction.ClientCashFlows.FirstOrDefault();

            }
            
            return View(outerTransaction);
        }

        [HttpPost]
        public ActionResult OuterClientTransaction(OuterTransactionInsertDto input)
        {
            try
            {
                var outerTransactionDto = _outerTransactionAppService.OuterClientTransaction(input);
                if (outerTransactionDto != null)
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

        [HttpPost]
        public ActionResult OuterAgentTransaction(OuterTransactionInsertDto input)
        {
            try
            {
                var outerTransactionDto = _outerTransactionAppService.OuterAgentTransaction(input);
                if (outerTransactionDto != null)
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

        [HttpPost]
        public ActionResult OuterCompanyTranasction(OuterTransactionInsertDto input)
        {
            try
            {
                var outerTransactionDto = _outerTransactionAppService.OuterCompanyTranasction(input);
                if (outerTransactionDto != null)
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

        [HttpPost]
        public ActionResult InitialOuterTransactionData()
        {
            var initialData = _outerTransactionAppService.InitialInputData();

            return Json(initialData);
        }
    }
}