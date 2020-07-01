using BWR.Application.Common;
using System;

namespace BWR.Application.Dtos.Client
{
    public class ClientCashFlowDto : EntityDto
    {
        public decimal Total { get; set; }
        public decimal Amount { get; set; }
        public bool Matched { get; set; }
        public int ClientId { get; set; }
        public int CoinId { get; set; }
        public int MoenyActionId { get; set; }
        public Guid UserId { get; set; }
    }
}