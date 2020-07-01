using AutoMapper;
using BWR.Application.Dtos.Treasury;
using BWR.Application.Interfaces.Treasury;
using BWR.Application.Interfaces.Shared;
using BWR.Domain.Model.Treasures;
using BWR.Infrastructure.Context;
using BWR.Infrastructure.Exceptions;
using BWR.ShareKernel.Exceptions;
using BWR.ShareKernel.Interfaces;

namespace BWR.Application.AppServices.Treasuries
{
    public class TreasuryCashAppService : ITreasuryCashAppService
    {
        private readonly IUnitOfWork<MainContext> _unitOfWork;
        private readonly IAppSession _appSession;

        public TreasuryCashAppService(IUnitOfWork<MainContext> unitOfWork, IAppSession appSession)
        {
            _unitOfWork = unitOfWork;
            _appSession = appSession;
        }

        public TreasuryCashDto Insert(TreasuryCashDto dto)
        {
            TreasuryCashDto treasuryCashDto = null;
            try
            {
                var treasuryCash = Mapper.Map<TreasuryCashDto, TreasuryCash>(dto);
                treasuryCash.CreatedBy = _appSession.GetUserName();
                treasuryCash.IsEnabled = true;
                _unitOfWork.CreateTransaction();

                _unitOfWork.GenericRepository<TreasuryCash>().Insert(treasuryCash);
                _unitOfWork.Save();

                _unitOfWork.Commit();

                treasuryCashDto = Mapper.Map<TreasuryCash, TreasuryCashDto>(treasuryCash);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
                _unitOfWork.Rollback();
            }
            return treasuryCashDto;
        }

        public TreasuryCashDto Update(TreasuryCashDto dto)
        {
            TreasuryCashDto treasuryCashDto = null;
            try
            {
                var treasuryCash = _unitOfWork.GenericRepository<TreasuryCash>().GetById(dto.Id);
                Mapper.Map<TreasuryCashDto, TreasuryCash>(dto, treasuryCash);
                treasuryCash.ModifiedBy = _appSession.GetUserName();
                //_unitOfWork.CreateTransaction();

                _unitOfWork.GenericRepository<TreasuryCash>().Update(treasuryCash);
                _unitOfWork.Save();

                //_unitOfWork.Commit();

                treasuryCashDto = Mapper.Map<TreasuryCash, TreasuryCashDto>(treasuryCash);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }
            return treasuryCashDto;
        }
    }
}
