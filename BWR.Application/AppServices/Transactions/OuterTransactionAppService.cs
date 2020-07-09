using AutoMapper;
using BWR.Application.Dtos.Client;
using BWR.Application.Dtos.Setting.Coin;
using BWR.Application.Dtos.Setting.Country;
using BWR.Application.Dtos.Transaction.OuterTransaction;
using BWR.Application.Dtos.TypeOfPay;
using BWR.Application.Interfaces.Shared;
using BWR.Application.Interfaces.Transaction;
using BWR.Domain.Model.Clients;
using BWR.Domain.Model.Settings;
using BWR.Domain.Model.Transactions;
using BWR.Domain.Model.Treasures;
using BWR.Infrastructure.Context;
using BWR.ShareKernel.Exceptions;
using BWR.ShareKernel.Interfaces;
using System.Collections.Generic;
using System.Linq;
using BWR.Application.Dtos.Company;
using BWR.Application.Dtos.Setting.Attachment;
using BWR.Domain.Model.Companies;

namespace BWR.Application.AppServices.Transactions
{
    public class OuterTransactionAppService: IOuterTransactionAppService
    {
        private readonly IUnitOfWork<MainContext> _unitOfWork;
        private readonly IAppSession _appSession;

        public OuterTransactionAppService(
            IUnitOfWork<MainContext> unitOfWork,
            IAppSession appSession)
        {
            _unitOfWork = unitOfWork;
            _appSession = appSession;
        }

        public IList<OuterTransactionDto> GetTransactions(OuterTransactionInputDto input)
        {
            IList<OuterTransactionDto> outerTransactionsDto = new List<OuterTransactionDto>();

            try
            {
                var outerTransactions = _unitOfWork.GenericRepository<Transaction>().FindBy(x => x.TransactionTypeId == 1);

                if (input.CoinId != null)
                {
                    outerTransactions = outerTransactions.Where(x => x.CoinId == input.CoinId);
                }

                if (input.CountryId != null)
                {
                    outerTransactions = outerTransactions.Where(x => x.CountryId == input.CountryId);
                }

                if (input.ReceiverClientId != null)
                {
                    outerTransactions = outerTransactions.Where(x => x.ReciverClientId == input.ReceiverClientId);
                }

                if (input.SenderClientId != null)
                {
                    outerTransactions = outerTransactions.Where(x => x.SenderClientId == input.SenderClientId);
                }

                if (input.From != null)
                {
                    outerTransactions = outerTransactions.Where(x => x.Created >= input.From);
                }
                if (input.To != null)
                {
                    outerTransactions = outerTransactions.Where(x => x.Created <= input.To);
                }

                outerTransactionsDto = Mapper.Map<List<Transaction>, List<OuterTransactionDto>>(outerTransactions.ToList());
            }
            catch (BwrException ex)
            {
                Infrastructure.Exceptions.Tracing.SaveException(ex);
            }
            return outerTransactionsDto;
        }

        public OuterTransactionDto GetTransactionById(int id)
        {
            OuterTransactionDto outerTransactionDto = null;

            try
            {
                var outerTransaction = _unitOfWork.GenericRepository<Transaction>().GetById(id);

                if (outerTransaction != null && outerTransaction.TransactionTypeId != 2)
                {
                    outerTransactionDto = Mapper.Map<Transaction, OuterTransactionDto>(outerTransaction);
                }
            }
            catch (BwrException ex)
            {
                Infrastructure.Exceptions.Tracing.SaveException(ex);
            }
            return outerTransactionDto;
        }

        public OuterTransactionInsertInitialDto InitialInputData()
        {
            var currentTreasuryId = _appSession.GetCurrentTreasuryId();
            var treasuryCashes = _unitOfWork.GenericRepository<TreasuryCash>().FindBy(x => x.TreasuryId == currentTreasuryId).ToList();
            var coins = treasuryCashes.Select(x => new CoinForDropdownDto() { Name = x.Coin.Name, Id = x.Coin.Id }).ToList();

            var countries = _unitOfWork.GenericRepository<Country>().FindBy(x => x.IsEnabled == true)
                .Select(x => new CountryForDropdownDto() { Id = x.Id, Name = x.Name }).ToList();

            var clients = _unitOfWork.GenericRepository<Client>().FindBy(x => x.ClientType == ClientType.Normal)
                .Select(x => new ClientDto() { Id = x.Id, FullName = x.FullName , IsEnabled = x.IsEnabled}).ToList();

            var agents = _unitOfWork.GenericRepository<Client>().FindBy(x => x.ClientType == ClientType.Client)
                .Select(x => new ClientDto() { Id = x.Id, FullName = x.FullName , IsEnabled = x.IsEnabled }).ToList();

            var typeOfPays = _unitOfWork.GenericRepository<TypeOfPay>().GetAll()
                .Select(x => new TypeOfPayDto() { Id = x.Id, Name = x.Name }).ToList();

            var companies = _unitOfWork.GenericRepository<Company>().GetAll()
                .Select(x => new CompanyForDropdownDto() { Id = x.Id, Name = x.Name }).ToList();

            var attachments = _unitOfWork.GenericRepository<Attachment>().GetAll()
                .Select(x => new AttachmentForDropdownDto() { Id = x.Id, Name = x.Name }).ToList();

            var outerTransactionInsertInputDto = new OuterTransactionInsertInitialDto()
            {
                Coins = coins,
                Countries = countries,
                Agents = agents,
                Clients = clients,
                TypeOfPays = typeOfPays,
                TreasuryId = currentTreasuryId,
                Companies = companies,
                Attachments = attachments
            };

            return outerTransactionInsertInputDto;
        }
    }
}
