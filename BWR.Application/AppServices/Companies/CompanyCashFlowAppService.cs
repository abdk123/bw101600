using AutoMapper;
using BWR.Application.Dtos.Company.CompanyCashFlow;
using BWR.Application.Extensions;
using BWR.Application.Interfaces.CompanyCashFlow;
using BWR.Application.Interfaces.Shared;
using BWR.Domain.Model.Clients;
using BWR.Domain.Model.Common;
using BWR.Domain.Model.Companies;
using BWR.Domain.Model.Enums;
using BWR.Domain.Model.Settings;
using BWR.Infrastructure.Context;
using BWR.Infrastructure.Exceptions;
using BWR.ShareKernel.Exceptions;
using BWR.ShareKernel.Interfaces;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace BWR.Application.AppServices.Companies
{
    public class CompanyCashFlowAppService : ICompanyCashFlowAppService
    {
        private readonly IUnitOfWork<MainContext> _unitOfWork;
        private readonly IAppSession _appSession;

        public CompanyCashFlowAppService(IUnitOfWork<MainContext> unitOfWork, IAppSession appSession)
        {
            _unitOfWork = unitOfWork;
            _appSession = appSession;
        }

        public IList<CompanyCashFlowOutputDto> Get(CompanyCashFlowInputDto input)
        {
            var companyCashFlowsDtos = new List<CompanyCashFlowOutputDto>();
            try
            {
                if (input.CoinId != 0)
                {
                    decimal? lastBalance = 0;
                    var companyCash = _unitOfWork.GenericRepository<CompanyCash>().GetAll().FirstOrDefault();
                    if (companyCash != null)
                    {
                        lastBalance = companyCash.InitialBalance;
                    }
                    var companyCashFlows = _unitOfWork.GenericRepository<CompanyCashFlow>()
                        .FindBy(x => x.CoinId.Equals(input.CoinId) && x.CompanyId.Equals(input.CompanyId));

                    var companyCashFlowsBeforeFromDate = companyCashFlows.Where(x => x.Created < input.From);
                    if (companyCashFlowsBeforeFromDate.Any())
                    {
                        var lastCompanyCashFlowBeforeFromDate = companyCashFlowsBeforeFromDate.LastOrDefault();
                        lastBalance = lastCompanyCashFlowBeforeFromDate.Total;
                    }

                    companyCashFlowsDtos.Add(
                            new CompanyCashFlowOutputDto()
                            {
                                Balance = lastBalance,
                                Type = "رصيد سابق"
                            });


                    var dataCashFlows = new List<CompanyCashFlow>();

                    if (input.From != null && input.To != null)
                    {
                        dataCashFlows = companyCashFlows.Where(x => x.Created >= input.From && x.Created <= input.To).ToList();
                    }
                    else if (input.From == null && input.To != null)
                    {
                        dataCashFlows = companyCashFlows.Where(x => x.Created <= input.To).ToList();
                    }
                    else if (input.From != null && input.To == null)
                    {
                        dataCashFlows = companyCashFlows.Where(x => x.Created >= input.From).ToList();
                    }
                    else
                    {
                        dataCashFlows = companyCashFlows.ToList();
                    }

                    foreach (var companyCashFlow in dataCashFlows)
                    {
                        companyCashFlowsDtos.Add(
                            new CompanyCashFlowOutputDto()
                            {
                                Id = companyCashFlow.Id,
                                Balance = companyCashFlow.Total,
                                Amount = companyCashFlow.Amount,
                                Commission = companyCashFlow.Commission(),
                                SecondCommission = companyCashFlow.SecounCommission(),
                                ReceiverName = companyCashFlow.ReceiverName(),
                                SenderName = companyCashFlow.SenderName(),
                                CountryName = companyCashFlow.CountryName(),
                                Type = companyCashFlow.MoenyAction.GetTypeName(Requester.Company, companyCashFlow.CompanyId),
                                Name = GetActionName(companyCashFlow.MoenyAction),
                                Number = companyCashFlow.MoenyAction.GetActionId(),
                                Date = companyCashFlow.Created != null ? companyCashFlow.Created.Value.ToString("dd/MM/yyyy", new CultureInfo("ar-AE")) : string.Empty,
                                Note = companyCashFlow.MoenyAction.GetNote(Requester.Company, companyCashFlow.CompanyId)
                            });
                    }
                }
                
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return companyCashFlowsDtos;
        }

        public CompanyCashFlowDto GetById(int id)
        {
            CompanyCashFlowDto companyCashFlowDto = null;
            try
            {
                var companyCashFlow = _unitOfWork.GenericRepository<CompanyCashFlow>().GetById(id);
                if (companyCashFlow != null)
                {
                    companyCashFlowDto = Mapper.Map<CompanyCashFlow, CompanyCashFlowDto>(companyCashFlow);

                }

            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return companyCashFlowDto;
        }

     
        public CompanyCashFlowUpdateDto GetForEdit(int id)
        {
            CompanyCashFlowUpdateDto companyCashFlowDto = null;
            try
            {
                var companyCashFlow = _unitOfWork.GenericRepository<CompanyCashFlow>().GetById(id);
                if (companyCashFlow != null)
                {
                    companyCashFlowDto = Mapper.Map<CompanyCashFlow, CompanyCashFlowUpdateDto>(companyCashFlow);
                }

            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return companyCashFlowDto;
        }

        public CompanyCashFlowDto Insert(CompanyCashFlowInsertDto dto)
        {
            CompanyCashFlowDto companyCashFlowDto = null;
            try
            {
                var companyCashFlow = Mapper.Map<CompanyCashFlowInsertDto, CompanyCashFlow>(dto);
                companyCashFlow.CreatedBy = _appSession.GetUserName();
                _unitOfWork.CreateTransaction();

                _unitOfWork.GenericRepository<CompanyCashFlow>().Insert(companyCashFlow);
                _unitOfWork.Save();

                _unitOfWork.Commit();

                companyCashFlowDto = Mapper.Map<CompanyCashFlow, CompanyCashFlowDto>(companyCashFlow);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
                _unitOfWork.Rollback();
            }
            return companyCashFlowDto;
        }

        public CompanyCashFlowDto Update(CompanyCashFlowUpdateDto dto)
        {
            CompanyCashFlowDto companyCashFlowDto = null;
            try
            {
                var companyCashFlow = _unitOfWork.GenericRepository<CompanyCashFlow>().GetById(dto.Id);
                Mapper.Map<CompanyCashFlowUpdateDto, CompanyCashFlow>(dto, companyCashFlow);
                companyCashFlow.ModifiedBy = _appSession.GetUserName();
                _unitOfWork.CreateTransaction();

                _unitOfWork.GenericRepository<CompanyCashFlow>().Update(companyCashFlow);
                _unitOfWork.Save();

                _unitOfWork.Commit();

                companyCashFlowDto = Mapper.Map<CompanyCashFlow, CompanyCashFlowDto>(companyCashFlow);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }
            return companyCashFlowDto;
        }

        public void Delete(int id)
        {
            try
            {
                var companyCashFlow = _unitOfWork.GenericRepository<CompanyCashFlow>().GetById(id);
                if (companyCashFlow != null)
                {
                    _unitOfWork.GenericRepository<CompanyCashFlow>().Delete(companyCashFlow);
                    _unitOfWork.Save();
                }
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }
        }

        public string GetActionName(MoenyAction moneyAction)
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
    }
}
