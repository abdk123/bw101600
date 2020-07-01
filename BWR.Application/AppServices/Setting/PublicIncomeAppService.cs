using AutoMapper;
using BWR.Application.Dtos.Setting.PublicIncome;
using BWR.Application.Interfaces.Setting;
using BWR.Application.Interfaces.Shared;
using BWR.Domain.Model.Settings;
using BWR.Infrastructure.Context;
using BWR.Infrastructure.Exceptions;
using BWR.ShareKernel.Exceptions;
using BWR.ShareKernel.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace BWR.Application.AppServices.Setting
{
    public class PublicIncomeAppService : IPublicIncomeAppService
    {
        private readonly IUnitOfWork<MainContext> _unitOfWork;
        private readonly IAppSession _appSession;

        public PublicIncomeAppService(IUnitOfWork<MainContext> unitOfWork, IAppSession appSession)
        {
            _unitOfWork = unitOfWork;
            _appSession = appSession;
        }

        public IList<PublicIncomeDto> GetAll()
        {
            var publicExpensesDtos = new List<PublicIncomeDto>();
            try
            {
                var publicExpenses = _unitOfWork.GenericRepository<PublicIncome>().GetAll().ToList();
                publicExpensesDtos = Mapper.Map<List<PublicIncome>, List<PublicIncomeDto>>(publicExpenses);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return publicExpensesDtos;
        }

        public PublicIncomeDto GetById(int id)
        {
            PublicIncomeDto publicExpenseDto = null;
            try
            {
                var publicExpense = _unitOfWork.GenericRepository<PublicIncome>().GetById(id);
                if (publicExpense != null)
                {
                    publicExpenseDto = Mapper.Map<PublicIncome, PublicIncomeDto>(publicExpense);
                }

            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return publicExpenseDto;
        }

        public IList<PublicIncomeForDropdownDto> GetForDropdown(string name)
        {
            var publicExpensesDtos = new List<PublicIncomeForDropdownDto>();
            try
            {
                var publicExpenses = _unitOfWork.GenericRepository<PublicIncome>().FindBy(x => x.Name.StartsWith(name)).ToList();
                Mapper.Map<List<PublicIncome>, List<PublicIncomeForDropdownDto>>(publicExpenses, publicExpensesDtos);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return publicExpensesDtos;
        }

        public PublicIncomeUpdateDto GetForEdit(int id)
        {
            PublicIncomeUpdateDto publicExpenseDto = null;
            try
            {
                var publicExpense = _unitOfWork.GenericRepository<PublicIncome>().GetById(id);
                if (publicExpense != null)
                {
                    publicExpenseDto = Mapper.Map<PublicIncome, PublicIncomeUpdateDto>(publicExpense);
                }

            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return publicExpenseDto;
        }

        public PublicIncomeDto Insert(PublicIncomeInsertDto dto)
        {
            PublicIncomeDto publicExpenseDto = null;
            try
            {
                var publicExpense = Mapper.Map<PublicIncomeInsertDto, PublicIncome>(dto);
                publicExpense.CreatedBy = _appSession.GetUserName();
                publicExpense.IsEnabled = true;
                _unitOfWork.CreateTransaction();

                _unitOfWork.GenericRepository<PublicIncome>().Insert(publicExpense);
                _unitOfWork.Save();

                _unitOfWork.Commit();

                publicExpenseDto = Mapper.Map<PublicIncome, PublicIncomeDto>(publicExpense);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
                _unitOfWork.Rollback();
            }
            return publicExpenseDto;
        }

        public PublicIncomeDto Update(PublicIncomeUpdateDto dto)
        {
            PublicIncomeDto publicExpenseDto = null;
            try
            {
                var publicExpense = _unitOfWork.GenericRepository<PublicIncome>().GetById(dto.Id);
                Mapper.Map<PublicIncomeUpdateDto, PublicIncome>(dto, publicExpense);
                publicExpense.ModifiedBy = _appSession.GetUserName();
                _unitOfWork.CreateTransaction();

                _unitOfWork.GenericRepository<PublicIncome>().Update(publicExpense);
                _unitOfWork.Save();

                _unitOfWork.Commit();

                publicExpenseDto = Mapper.Map<PublicIncome, PublicIncomeDto>(publicExpense);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }
            return publicExpenseDto;
        }

        public void Delete(int id)
        {
            try
            {
                var publicExpense = _unitOfWork.GenericRepository<PublicIncome>().GetById(id);
                if (publicExpense != null)
                {
                    _unitOfWork.GenericRepository<PublicIncome>().Delete(publicExpense);
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
                var publicExpense = _unitOfWork.GenericRepository<PublicIncome>()
                    .FindBy(x => x.Name.Trim().Equals(name.Trim()) && x.Id != id)
                    .FirstOrDefault();
                if (publicExpense != null)
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

