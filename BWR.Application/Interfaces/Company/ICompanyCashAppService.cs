

using BWR.Application.Dtos.Company;
using System.Collections.Generic;

namespace BWR.Application.Interfaces.Company
{
    public interface ICompanyCashAppService
    {
        IList<CompanyBalanceDto> GetCompanyCashs(int companyId);
        CompanyCashDto Insert(CompanyCashDto dto);
        CompanyCashDto Update(CompanyCashDto dto);
        CompanyCashDto UpdateBalance(CompanyBalanceDto dto);
    }
}
