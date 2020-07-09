using AutoMapper;
using BWR.Application.Dtos.Transaction.InnerTransaction;
using BWR.Application.Interfaces.Shared;
using BWR.Application.Interfaces.Transaction;
using BWR.Domain.Model.Transactions;
using BWR.Infrastructure.Context;
using BWR.ShareKernel.Exceptions;
using BWR.ShareKernel.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace BWR.Application.AppServices.Transactions
{
    public class InnerTransactionAppService : IInnerTransactionAppService
    {
        private readonly IUnitOfWork<MainContext> _unitOfWork;
        private readonly IAppSession _appSession;
        public InnerTransactionAppService(IUnitOfWork<MainContext> unitOfWork, IAppSession appSession)
        {
            _unitOfWork = unitOfWork;
            _appSession = appSession;
        }

        public IList<InnerTransactionDto> GetTransactions()
        {
            IList<InnerTransactionDto> innerTransactionsDto = new List<InnerTransactionDto>();

            try
            {
                var innerTransactions = _unitOfWork.GenericRepository<Transaction>().FindBy(x => x.TransactionTypeId == 2).ToList();

                innerTransactionsDto= Mapper.Map<List<Transaction>, List<InnerTransactionDto>>(innerTransactions);
            }
            catch (BwrException ex)
            {
                Infrastructure.Exceptions.Tracing.SaveException(ex);
            }
            return innerTransactionsDto;
        }


    }
}
