using BWR.Application.Dtos.Transaction.OuterTransaction;
using System.Collections.Generic;

namespace BWR.Application.Interfaces.Transaction
{
    public interface IOuterTransactionAppService
    {
        IList<OuterTransactionDto> GetTransactions(OuterTransactionInputDto input);
        OuterTransactionDto GetTransactionById(int id);
        OuterTransactionInsertInitialDto InitialInputData();
        OuterTransactionDto OuterClientTransaction(OuterTransactionInsertDto input);
        OuterTransactionDto OuterAgentTransaction(OuterTransactionInsertDto input);
        OuterTransactionDto OuterCompanyTranasction(OuterTransactionInsertDto input);
    }
}
