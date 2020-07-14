using BWR.Application.Dtos.Transaction.InnerTransaction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BWR.Application.Interfaces.Transaction
{
    public interface IInnerTransactionAppService
    {
        IList<InnerTransactionDto> GetTransactions();
        InnerTransactionInsertInitialDto InitialInputData();
        bool SaveInnerTransactions(InnerTransactionInsertListDto incometransacrions);
    }
}
