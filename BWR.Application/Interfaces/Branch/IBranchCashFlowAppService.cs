using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using BWR.Application.Dtos.BranchCashFlow;

namespace BWR.Application.Interfaces.BranchCashFlow
{
    public interface IBranchCashFlowAppService 
    {
        IList<BranchCashFlowDto> GetAll();
        IList<BranchCashFlowDto> Get(Expression<Func<BWR.Domain.Model.Branches.BranchCashFlow, bool>> predicate) ;

    }
}
