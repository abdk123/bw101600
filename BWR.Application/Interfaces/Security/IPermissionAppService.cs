using BWR.Application.Dtos.Permission;
using System;
using System.Collections.Generic;

namespace BWR.Application.Interfaces.Security
{
    public interface IPermissionAppService
    {
        IList<PermissionDto> GetForSpecificRole(Guid roleId);
        IList<PermissionDto> SavePermissions(Guid roleId, IList<string> permissions);

    }
}
