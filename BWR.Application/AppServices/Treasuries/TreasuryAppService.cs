using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using BWR.Application.Dtos.Treasury;
using BWR.Application.Interfaces.Shared;
using BWR.Application.Interfaces.Treasury;
using BWR.Domain.Model.Treasures;
using BWR.Infrastructure.Context;
using BWR.Infrastructure.Exceptions;
using BWR.ShareKernel.Exceptions;
using BWR.ShareKernel.Interfaces;

namespace BWR.Application.AppServices.Treasuries
{
    public class TreasuryAppService : ITreasuryAppService
    {
        private readonly IUnitOfWork<MainContext> _unitOfWork;
        private readonly ITreasuryCashAppService _treasuryCashAppService;
        private readonly IAppSession _appSession;

        public TreasuryAppService(IUnitOfWork<MainContext> unitOfWork
            , ITreasuryCashAppService treasuryCashAppService
            , IAppSession appSession)
        {
            _unitOfWork = unitOfWork;
            _treasuryCashAppService = treasuryCashAppService;
            _appSession = appSession;
        }

        public IList<TreasuryDto> GetAll()
        {
            var treasuriesDtos = new List<TreasuryDto>();
            try
            {
                var treasuries = _unitOfWork.GenericRepository<Treasury>().GetAll().ToList();
                treasuriesDtos = Mapper.Map<List<Treasury>, List<TreasuryDto>>(treasuries);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return treasuriesDtos;
        }

        public TreasuryDto GetById(int id)
        {
            TreasuryDto treasuryDto = null;
            try
            {
                var treasury = _unitOfWork.GenericRepository<Treasury>().GetById(id);
                if (treasury != null)
                {
                    treasuryDto = Mapper.Map<Treasury, TreasuryDto>(treasury);
                }

            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return treasuryDto;
        }


        public TreasuryUpdateDto GetForEdit(int id)
        {
            TreasuryUpdateDto treasuryDto = null;
            try
            {
                var treasury = _unitOfWork.GenericRepository<Treasury>().GetById(id);
                if (treasury != null)
                {
                    treasuryDto = Mapper.Map<Treasury, TreasuryUpdateDto>(treasury);
                }

            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return treasuryDto;
        }

        public TreasuryDto Insert(TreasuryInsertDto dto)
        {
            TreasuryDto treasuryDto = null;
            try
            {
                var treasury = Mapper.Map<TreasuryInsertDto, Treasury>(dto);
                //treasury.CreatedBy = _appSession.GetUserName();
                treasury.IsEnabled = true;
                _unitOfWork.CreateTransaction();

                _unitOfWork.GenericRepository<Treasury>().Insert(treasury);
                _unitOfWork.Save();

                _unitOfWork.Commit();

                treasuryDto = Mapper.Map<Treasury, TreasuryDto>(treasury);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
                _unitOfWork.Rollback();
            }
            return treasuryDto;
        }

        public TreasuryDto Update(TreasuryUpdateDto dto)
        {
            TreasuryDto treasuryDto = null;
            try
            {
                var treasury = _unitOfWork.GenericRepository<Treasury>().GetById(dto.Id);

                _unitOfWork.CreateTransaction();

                foreach (var treasuryCashDto in dto.TreasuryCashes)
                {
                    _treasuryCashAppService.Update(treasuryCashDto);
                }


                //treasury.ModifiedBy = _appSession.GetUserName();
                treasury.Name = dto.Name;

                _unitOfWork.GenericRepository<Treasury>().Update(treasury);
                _unitOfWork.Save();

                _unitOfWork.Commit();
                _unitOfWork.GenericRepository<Treasury>().RefershEntity(treasury);
                treasuryDto = Mapper.Map<Treasury, TreasuryDto>(treasury);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
                _unitOfWork.Rollback();
            }
            return treasuryDto;
        }


        public void Delete(int id)
        {
            try
            {
                var treasury = _unitOfWork.GenericRepository<Treasury>().GetById(id);
                if (treasury != null)
                {
                    _unitOfWork.GenericRepository<Treasury>().Delete(treasury);
                    _unitOfWork.Save();
                }
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }
        }

        public bool CheckIfExist(string name, int id)
        {
            try
            {
                var treasury = _unitOfWork.GenericRepository<Treasury>()
                    .FindBy(x => x.Name.Trim().Equals(name.Trim()) && x.Id != id)
                    .FirstOrDefault();
                if (treasury != null)
                    return true;
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return false;
        }
    }
}
