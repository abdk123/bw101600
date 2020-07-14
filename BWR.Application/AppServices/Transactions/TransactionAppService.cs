﻿using AutoMapper;
using BWR.Application.Dtos.Branch;
using BWR.Application.Dtos.Transaction;
using BWR.Application.Extensions;
using BWR.Application.Interfaces.Shared;
using BWR.Application.Interfaces.Transaction;
using BWR.Domain.Model.Branches;
using BWR.Domain.Model.Transactions;
using BWR.Domain.Model.Treasures;
using BWR.Infrastructure.Context;
using BWR.Infrastructure.Exceptions;
using BWR.ShareKernel.Exceptions;
using BWR.ShareKernel.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BWR.Application.AppServices.Transactions
{
    public class TransactionAppService : ITransactionAppService
    {
        private readonly IUnitOfWork<MainContext> _unitOfWork;
        private readonly IAppSession _appSession;
        public TransactionAppService(IUnitOfWork<MainContext> unitOfWork, IAppSession appSession)
        {
            _unitOfWork = unitOfWork;
            _appSession = appSession;
        }

        public IList<TransactionDto> GetTransactionDontDileverd(DateTime? startDate, DateTime? endDate)
        {
            IList<TransactionDto> outerTransactionsDto = new List<TransactionDto>();

            try
            {
                var outerTransactions = _unitOfWork.GenericRepository<Transaction>().FindBy(x => x.Deliverd == false && x.TransactionType == TransactionType.ImportTransaction);

                if (startDate != null)
                {
                    outerTransactions = outerTransactions.Where(x => x.Created >= startDate);
                }
                if (endDate != null)
                {
                    outerTransactions = outerTransactions.Where(x => x.Created <= endDate);
                }

                outerTransactionsDto = Mapper.Map<List<Transaction>, List<TransactionDto>>(outerTransactions.ToList());
            }
            catch (BwrException ex)
            {
                Infrastructure.Exceptions.Tracing.SaveException(ex);
            }
            return outerTransactionsDto;
        }

        public TransactionDto GetById(int id)
        {
            TransactionDto transactionDto = null;
            try
            {
                var transaction = _unitOfWork.GenericRepository<Transaction>().GetById(id);
                if (transaction != null)
                {
                    transactionDto = Mapper.Map<Transaction, TransactionDto>(transaction);
                }

            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }
            return transactionDto;
        }

        public TransactionDto DileverTransaction(int transactionId)
        {
            TransactionDto transactionDto = null;
            try
            {
                _unitOfWork.CreateTransaction();
                var transaction = _unitOfWork.GenericRepository<Transaction>().GetById(transactionId);

                if (transaction != null)
                {
                    transaction.Deliverd = true;
                    transaction.ModifiedBy = _appSession.GetUserName();
                    _unitOfWork.GenericRepository<Transaction>().Update(transaction);

                    var branchCash = _unitOfWork.GenericRepository<BranchCash>().FindBy(x => x.CoinId == transaction.CoinId).FirstOrDefault();
                    if (branchCash != null)
                    {
                        branchCash.Total -= transaction.Amount;
                        _unitOfWork.GenericRepository<BranchCash>().Update(branchCash);
                    }

                    var treasuryCash = _unitOfWork.GenericRepository<TreasuryCash>()
                        .FindBy(x => x.CoinId == transaction.CoinId && x.TreasuryId == _appSession.GetCurrentTreasuryId()).FirstOrDefault();
                    if (treasuryCash != null)
                    {
                        treasuryCash.Total -= transaction.Amount;
                        _unitOfWork.GenericRepository<TreasuryCash>().Update(treasuryCash);
                    }

                    int moneyActinId = transaction.MoneyActionId();

                    var branchCashFLow = new BranchCashFlow()
                    {
                        Total = branchCash.Total,
                        Amount = -transaction.Amount,
                        MonyActionId = moneyActinId,
                        BranchId = BranchHelper.Id,
                        CoinId = transaction.CoinId,
                        TreasuryId = _appSession.GetCurrentTreasuryId(),
                        CreatedBy=_appSession.GetUserName()
                    };
                    _unitOfWork.GenericRepository<BranchCashFlow>().Insert(branchCashFLow);

                    var treuseryMoenyAction = new TreasuryMoneyAction()
                    {
                        Amount = -transaction.Amount,
                        Total = treasuryCash.Total,
                        CoinId = transaction.CoinId,
                        TreasuryId = _appSession.GetCurrentTreasuryId(),
                        BranchCashFlow = branchCashFLow,
                        CreatedBy = _appSession.GetUserName()
                    };
                    _unitOfWork.GenericRepository<TreasuryMoneyAction>().Insert(treuseryMoenyAction);

                    _unitOfWork.Save();
                    _unitOfWork.Commit();

                    transactionDto = Mapper.Map<Transaction, TransactionDto>(transaction);
                }
            }
            catch(BwrException ex)
            {
                Tracing.SaveException(ex);
                _unitOfWork.Rollback();
            }
            return transactionDto;
        }
    }
}
