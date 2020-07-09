
using System.Collections.Generic;
using BWR.Application.Dtos.Common;
using BWR.Domain.Model.Common;

namespace BWR.Application.Interfaces.Common
{
    public interface IMoneyActionAppService
    {
        string GetActionName(MoneyAction moneyAction);
        IList<MoneyActionDetailDto> GetByTransactionId(int transactionId);
    }
}
