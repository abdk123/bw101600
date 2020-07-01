using BWR.Application.Dtos.Treasury;

namespace BWR.Application.Interfaces.Treasury
{
    public interface ITreasuryAppService : IGrudAppService<TreasuryDto, TreasuryInsertDto, TreasuryUpdateDto>
    {
        bool CheckIfExist(string name, int id);
    }
}
