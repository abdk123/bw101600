using BWR.Application.Dtos.Transaction;
using System;
using System.Collections.Generic;

namespace BWR.Application.Interfaces.Transaction
{
    public interface ITransactionAppService
    {
        IList<TransactionDto> GetTransactionDontDileverd(DateTime? startDate,DateTime? endDate);
        TransactionDto GetById(int id);
        TransactionDto DileverTransaction(int transactionId);
    }
}
