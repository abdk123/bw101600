using System;
using System.Collections.Generic;
using System.Linq;
using BWR.Application.Dtos.Role;
using BWR.Application.Dtos.User;
using BWR.Domain.Model.Security;
namespace BWR.Application.Interfaces.Security
{
    public interface IUserAppService 
    {
        IList<UserForDropdownDto> GetForDropdown(string name);
        bool CheckIfExist(string name, string id);
        IList<UserDto> GetAll();
        UserDto GetById(Guid id);
        UserDto Insert(UserInsertDto dto);
        UserDto Update(UserUpdateDto dto);
        UserUpdateDto GetForEdit(Guid id);
        void Delete(Guid id);
        
    }
}
