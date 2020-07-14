using System.Collections.Generic;
using BWR.Application.Dtos.Branch;
using BWR.Domain.Model.Branches;

namespace BWR.Application.Interfaces.Branch
{
    public interface IBranchCashAppService
    {
        IList<BranchCashDto> GetAll();
        IList<BranchCashDto> GetForSpecificBranch(int branchId);
        BranchCashDto Insert(BranchCashInsertDto dto);
    }
}
