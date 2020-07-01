using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BWR.Application.Dtos.Treasury;

namespace BWR.Application.Interfaces.Treasury
{
    public interface ITreasuryCashAppService
    {
        //IList<TreasuryCashDto> GetTreasuryCashes(int companyId);
        TreasuryCashDto Insert(TreasuryCashDto dto);
        TreasuryCashDto Update(TreasuryCashDto dto);
    }
}
