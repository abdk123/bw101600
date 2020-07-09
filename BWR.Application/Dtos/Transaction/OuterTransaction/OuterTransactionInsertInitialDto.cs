using System.Collections.Generic;
using BWR.Application.Dtos.Client;
using BWR.Application.Dtos.Company;
using BWR.Application.Dtos.Setting.Attachment;
using BWR.Application.Dtos.Setting.Coin;
using BWR.Application.Dtos.Setting.Country;
using BWR.Application.Dtos.TypeOfPay;

namespace BWR.Application.Dtos.Transaction.OuterTransaction
{
    public class OuterTransactionInsertInitialDto
    {
        public OuterTransactionInsertInitialDto()
        {
            Coins = new List<CoinForDropdownDto>();
            Countries = new List<CountryForDropdownDto>();
            TypeOfPays = new List<TypeOfPayDto>();
            Agents = new List<ClientDto>();
            Clients = new List<ClientDto>();
            Companies=new List<CompanyForDropdownDto>();
            Attachments=new List<AttachmentForDropdownDto>();
        }

        public int? TreasuryId { get; set; }
        public IList<CoinForDropdownDto> Coins { get; set; }
        public IList<CountryForDropdownDto> Countries { get; set; }
        public IList<TypeOfPayDto> TypeOfPays { get; set; }
        public IList<ClientDto> Agents { get; set; }
        public IList<ClientDto> Clients { get; set; }
        public IList<CompanyForDropdownDto> Companies { get; set; }
        public IList<AttachmentForDropdownDto> Attachments { get; set; }
    }
}
