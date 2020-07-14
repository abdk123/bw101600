

using BWR.Application.Dtos.Company;
using System.Collections.Generic;

namespace BWR.Application.Interfaces.Company
{
    public interface ICompanyCashAppService
    {
        IList<CompanyCashesDto> GetAll();
        IList<CompanyCashesDto> GetCompanyCashs(int companyId);
        CompanyCashDto Insert(CompanyCashDto dto);
        CompanyCashDto Update(CompanyCashDto dto);
        CompanyCashDto UpdateBalance(CompanyCashesDto dto);
    }
}
