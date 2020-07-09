﻿using BWR.Application.Extensions;
using BWR.Application.Interfaces.Common;
using BWR.Application.Interfaces.Shared;
using BWR.Domain.Model.Clients;
using BWR.Domain.Model.Common;
using BWR.Domain.Model.Companies;
using BWR.Domain.Model.Settings;
using BWR.Infrastructure.Context;
using BWR.ShareKernel.Interfaces;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using BWR.Application.Dtos.Common;
using BWR.Infrastructure.Exceptions;
using BWR.ShareKernel.Exceptions;

namespace BWR.Application.AppServices.Common
{
    public class MoneyActionAppService: IMoneyActionAppService
    {
        private readonly IUnitOfWork<MainContext> _unitOfWork;
        private readonly IAppSession _appSession;

        public MoneyActionAppService(IUnitOfWork<MainContext> unitOfWork
            , IAppSession appSession)
        {
            _unitOfWork = unitOfWork;
            _appSession = appSession;
        }

        public string GetActionName(MoneyAction moneyAction)
        {
            if (moneyAction.Transaction != null && moneyAction.BoxAction == null)
                return moneyAction.Transaction.GetActionName();
            if (moneyAction.PublicMoney != null)
                return moneyAction.PublicMoney.GetActionName();
            if (moneyAction.BoxAction != null)
            {
                if (moneyAction.ClientCashFlows != null && moneyAction.ClientCashFlows.Count > 0)
                    return new List<ClientCashFlow>(moneyAction.ClientCashFlows)[0].Client.FullName;
                return new List<CompanyCashFlow>(moneyAction.CompanyCashFlows)[0].CompanyName();
            }
            if (moneyAction.Exchange != null)
            {
                return _unitOfWork.GenericRepository<Coin>().GetById(moneyAction.Exchange.SecoundCoinId).Name;
            }
            return "GetActionName";
        }

        public IList<MoneyActionDetailDto> GetByTransactionId(int transactionId)
        {
            IList<MoneyActionDetailDto> moneyActionDetailsDto = new List<MoneyActionDetailDto>();
            try
            {
                var moneyActions = _unitOfWork.GenericRepository<MoneyAction>()
                    .FindBy(x => x.TransactionId == transactionId).ToList();

                moneyActionDetailsDto = Mapper.Map<List<MoneyAction>, List<MoneyActionDetailDto>>(moneyActions);
            }
            catch (BwrException exception)
            {
                Tracing.SaveException(exception);
            }

            return moneyActionDetailsDto;
        }
    }
}
