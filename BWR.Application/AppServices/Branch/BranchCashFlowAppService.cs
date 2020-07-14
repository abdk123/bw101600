using AutoMapper;
using BWR.Application.Dtos.BranchCashFlow;
using BWR.Application.Interfaces.BranchCashFlow;
using BWR.Application.Interfaces.Shared;
using BWR.Domain.Model.Branches;
using BWR.Infrastructure.Context;
using BWR.Infrastructure.Exceptions;
using BWR.ShareKernel.Exceptions;
using BWR.ShareKernel.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace BWR.Application.AppServices.Branches
{
    public class BranchCashFlowAppService : IBranchCashFlowAppService
    {
        private readonly IUnitOfWork<MainContext> _unitOfWork;
        private readonly IAppSession _appSession;

        public BranchCashFlowAppService(IUnitOfWork<MainContext> unitOfWork, IAppSession appSession)
        {
            _unitOfWork = unitOfWork;
            _appSession = appSession;
        }
        
        public IList<BranchCashFlowDto> GetAll()
        {
            var branchcashflowsDtos = new List<BranchCashFlowDto>();
            try
            {
                var branchcashflows = _unitOfWork.GenericRepository<BranchCashFlow>().GetAll().ToList();
                branchcashflowsDtos = Mapper.Map<List<BranchCashFlow>, List<BranchCashFlowDto>>(branchcashflows);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return branchcashflowsDtos;
        }

        public IList<BranchCashFlowDto> Get(Expression<Func<BranchCashFlow, bool>> predicate)
        {
            var branchcashflowsDtos = new List<BranchCashFlowDto>();
            try
            {
                var branchcashflows = _unitOfWork.GenericRepository<BranchCashFlow>().FindBy(predicate).ToList();
                if (branchcashflows.Any())
                {
                    branchcashflowsDtos = Mapper.Map<List<BranchCashFlow>, List<BranchCashFlowDto>>(branchcashflows);
                }
                
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return branchcashflowsDtos;
        }


    }
}
