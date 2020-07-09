using BWR.Application.Dtos.Client;
using BWR.Application.Dtos.Setting.Coin;
using BWR.Application.Dtos.Setting.Country;
using BWR.Application.Dtos.TypeOfPay;
using System.Collections.Generic;

namespace BWR.Application.Dtos.Transaction.OuterTransaction
{
    public class OuterTransactionInsertInputDto
    {
        public int? TreasuryId { get; set; }
        public int? CoinId { get; set; }
        public int? CountryId { get; set; }
        public int? TypeOfPayId { get; set; }
        public int? AgentId { get; set; }
        public int? ClientId { get; set; }
    }
}
