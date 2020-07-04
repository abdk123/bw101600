using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using BWR.Application.Dtos.Branch;
using BWR.Application.Interfaces.Branch;
using BWR.Domain.Model.Branches;
using BWR.Application.Interfaces.Shared;
using BWR.ShareKernel.Interfaces;
using BWR.Infrastructure.Context;
using BWR.Infrastructure.Exceptions;
using BWR.ShareKernel.Exceptions;

namespace BWR.Application.AppServices.Branch
{
    public class BranchCashAppService : IBranchCashAppService
    {
        private readonly IUnitOfWork<MainContext> _unitOfWork;
        private readonly IAppSession _appSession;

        public BranchCashAppService(IUnitOfWork<MainContext> unitOfWork, IAppSession appSession)
        {
            _unitOfWork = unitOfWork;
            _appSession = appSession;
        }

        public IList<BranchCashDto> GetAll()
        {
            var branchCashesDto = new List<BranchCashDto>();
            try
            {
                var branchCashes = _unitOfWork.GenericRepository<BranchCash>().GetAll().ToList();
                branchCashesDto = Mapper.Map<List<BranchCash>, List<BranchCashDto>>(branchCashes);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return branchCashesDto;
        }

        public BranchCashDto Insert(BranchCashInsertDto dto)
        {
            BranchCashDto branchCashDto = null;
            try
            {
                var branchCash = Mapper.Map<BranchCashInsertDto, BranchCash>(dto);
                branchCash.CreatedBy = _appSession.GetUserName();
                branchCash.IsEnabled = true;
                _unitOfWork.CreateTransaction();

                var branch = _unitOfWork.GenericRepository<Domain.Model.Branches.Branch>().GetAll().FirstOrDefault();
                branchCash.BranchId = branch.Id;

                _unitOfWork.GenericRepository<BranchCash>().Insert(branchCash);
                _unitOfWork.Save();

                _unitOfWork.Commit();

                branchCashDto = Mapper.Map<BranchCash, BranchCashDto>(branchCash);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
                _unitOfWork.Rollback();
            }
            return branchCashDto;
        }
    }
}
