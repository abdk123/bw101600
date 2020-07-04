using BWR.Application.Dtos.Company.CompanyCashFlow;
using System.Collections.Generic;

namespace BWR.Application.Interfaces.CompanyCashFlow
{
    public interface ICompanyCashFlowAppService 
    {
        IList<CompanyCashFlowOutputDto> Get(CompanyCashFlowInputDto input);
    }
}
