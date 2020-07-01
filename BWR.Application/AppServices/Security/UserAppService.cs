using AutoMapper;
using BWR.Application.Dtos.User;
using BWR.Application.Interfaces.Security;
using BWR.Application.Interfaces.Shared;
using BWR.Domain.Model.Security;
using BWR.Infrastructure.Context;
using BWR.Infrastructure.Exceptions;
using BWR.ShareKernel.Exceptions;
using BWR.ShareKernel.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BWR.Application.AppServices.Security
{
    public class UserAppService : IUserAppService
    {
        private readonly IUnitOfWork<MainContext> _unitOfWork;
        private readonly IAppSession _appSession;

        public UserAppService(IUnitOfWork<MainContext> unitOfWork, IAppSession appSession)
        {
            _unitOfWork = unitOfWork;
            _appSession = appSession;
        }

        public IList<UserDto> GetAll()
        {
            var usersDtos = new List<UserDto>();
            try
            {
                var users = _unitOfWork.GenericRepository<User>().GetAll().ToList();
                usersDtos = Mapper.Map<List<User>, List<UserDto>>(users);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return usersDtos;
        }

        public UserDto GetById(Guid id)
        {
            UserDto userDto = null;
            try
            {
                var user = _unitOfWork.GenericRepository<User>().GetById(id);
                if (user != null)
                {
                    userDto = Mapper.Map<User, UserDto>(user);
                }

            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return userDto;
        }

        public IList<UserForDropdownDto> GetForDropdown(string name)
        {
            var usersDtos = new List<UserForDropdownDto>();
            try
            {
                var users = _unitOfWork.GenericRepository<User>().FindBy(x => x.UserName.StartsWith(name)).ToList();
                Mapper.Map<List<User>, List<UserForDropdownDto>>(users, usersDtos);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return usersDtos;
        }

        public UserUpdateDto GetForEdit(Guid id)
        {
            UserUpdateDto userDto = null;
            try
            {
                var user = _unitOfWork.GenericRepository<User>().GetById(id);
                if (user != null)
                {
                    userDto = Mapper.Map<User, UserUpdateDto>(user);
                }

            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return userDto;
        }

        public UserDto Insert(UserInsertDto dto)
        {
            UserDto userDto = null;
            try
            {
                var user = Mapper.Map<UserInsertDto, User>(dto);
                
                _unitOfWork.CreateTransaction();

                _unitOfWork.GenericRepository<User>().Insert(user);
                _unitOfWork.Save();

                _unitOfWork.Commit();

                userDto = Mapper.Map<User, UserDto>(user);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
                _unitOfWork.Rollback();
            }
            return userDto;
        }

        public UserDto Update(UserUpdateDto dto)
        {
            UserDto userDto = null;
            try
            {
                var user = _unitOfWork.GenericRepository<User>().GetById(dto.UserId);
                Mapper.Map<UserUpdateDto, User>(dto, user);
                //user.ModifiedBy = _appSession.GetUserName();
                _unitOfWork.CreateTransaction();

                _unitOfWork.GenericRepository<User>().Update(user);
                _unitOfWork.Save();

                _unitOfWork.Commit();

                userDto = Mapper.Map<User, UserDto>(user);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }
            return userDto;
        }

        public void Delete(Guid id)
        {
            try
            {
                var user = _unitOfWork.GenericRepository<User>().GetById(id);
                if (user != null)
                {
                    _unitOfWork.GenericRepository<User>().Delete(user);
                    _unitOfWork.Save();
                }
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }
        }

        public bool CheckIfExist(string userName, string id)
        {
            try
            {
                var user = _unitOfWork.GenericRepository<User>()
                    .FindBy(x => x.UserName.Trim().Equals(userName.Trim()) && x.UserId.ToString() != id)
                    .FirstOrDefault();
                if (user != null)
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
