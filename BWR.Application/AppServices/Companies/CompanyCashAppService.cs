﻿using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using BWR.Application.Dtos.Company;
using BWR.Application.Interfaces.Company;
using BWR.Application.Interfaces.Shared;
using BWR.Domain.Model.Companies;
using BWR.Infrastructure.Context;
using BWR.Infrastructure.Exceptions;
using BWR.ShareKernel.Exceptions;
using BWR.ShareKernel.Interfaces;

namespace BWR.Application.AppServices.Companies
{
    public class CompanyCashAppService : ICompanyCashAppService
    {
        private readonly IUnitOfWork<MainContext> _unitOfWork;
        private readonly IAppSession _appSession;

        public CompanyCashAppService(IUnitOfWork<MainContext> unitOfWork, IAppSession appSession)
        {
            _unitOfWork = unitOfWork;
            _appSession = appSession;
        }

        public IList<CompanyBalanceDto> GetCompanyCashs(int companyId)
        {
            IList<CompanyBalanceDto> companyBalanceDtos = new List<CompanyBalanceDto>();

            try
            {
                var companyCashs = _unitOfWork.GenericRepository<CompanyCash>().FindBy(x => x.CompanyId == companyId).ToList();
                foreach(var companyCash in companyCashs)
                {
                    var companyBalanceDto = new CompanyBalanceDto()
                    {
                        Id= companyCash.Id,
                        CoinId = companyCash.CoinId,
                        CoinName = companyCash.Coin != null ? companyCash.Coin.Name : string.Empty,
                        CompanyId = companyCash.CompanyId,
                        InitialBalance = companyCash.InitialBalance,
                        Total = companyCash.Total,
                        MaxCreditor = companyCash.MaxCreditor,
                        MaxDebit=companyCash.MaxDebit
                    };

                    decimal onHim = 0;
                    decimal forHim = 0;
                    if (companyBalanceDto.Total > 0)
                    {
                        forHim = (companyBalanceDto.Total * 100) / 100;
                    }
                    else if (companyBalanceDto.Total < 0)
                    {
                        onHim = (companyBalanceDto.Total * 100) / 100;
                    }

                    companyBalanceDto.ForHim = forHim;
                    companyBalanceDto.OnHim = onHim;

                    companyBalanceDtos.Add(companyBalanceDto);
                }
            }
            catch(BwrException ex)
            {
                Tracing.SaveException(ex);
            }
            return companyBalanceDtos;

        }

        public CompanyCashDto Insert(CompanyCashDto dto)
        {
            CompanyCashDto companyCashDto = null;
            try
            {
                var companyCash = Mapper.Map<CompanyCashDto, CompanyCash>(dto);
                companyCash.CreatedBy = _appSession.GetUserName();
                companyCash.IsEnabled = true;
                _unitOfWork.CreateTransaction();

                _unitOfWork.GenericRepository<CompanyCash>().Insert(companyCash);
                _unitOfWork.Save();

                _unitOfWork.Commit();

                companyCashDto = Mapper.Map<CompanyCash, CompanyCashDto>(companyCash);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
                _unitOfWork.Rollback();
            }
            return companyCashDto;
        }

        public CompanyCashDto Update(CompanyCashDto dto)
        {
            CompanyCashDto companyCashDto = null;
            try
            {
                var companyCash = _unitOfWork.GenericRepository<CompanyCash>().GetById(dto.Id);
                Mapper.Map<CompanyCashDto, CompanyCash>(dto, companyCash);
                companyCash.ModifiedBy = _appSession.GetUserName();
                //_unitOfWork.CreateTransaction();

                _unitOfWork.GenericRepository<CompanyCash>().Update(companyCash);
                _unitOfWork.Save();

                //_unitOfWork.Commit();

                companyCashDto = Mapper.Map<CompanyCash, CompanyCashDto>(companyCash);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }
            return companyCashDto;
        }

        public CompanyCashDto UpdateBalance(CompanyBalanceDto dto)
        {
            CompanyCashDto companyCashDto = null;
            try
            {
                var companyCash = _unitOfWork.GenericRepository<CompanyCash>().GetById(dto.Id);
                Mapper.Map<CompanyBalanceDto, CompanyCash>(dto, companyCash);
                companyCash.ModifiedBy = _appSession.GetUserName();
                //_unitOfWork.CreateTransaction();

                _unitOfWork.GenericRepository<CompanyCash>().Update(companyCash);
                _unitOfWork.Save();

                //_unitOfWork.Commit();

                companyCashDto = Mapper.Map<CompanyCash, CompanyCashDto>(companyCash);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }
            return companyCashDto;
        }
    }
}
