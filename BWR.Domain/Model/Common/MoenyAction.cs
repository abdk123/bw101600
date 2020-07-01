using BWR.Domain.Model.Transactions;
using BWR.ShareKernel.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace BWR.Domain.Model.Common
{
    public class MoenyAction: Entity
    {
        public int? BoxActionsId { get; set; }
        [ForeignKey("BoxActionsId")]
        public virtual BoxAction BoxAction { get; set; }

        public int? ExchangeId { get; set; }
        [ForeignKey("ExchangeId")]
        public virtual Exchange Exchange { get; set; }

        public int? PubLicMoneyId { get; set; }
        [ForeignKey("PubLicMoneyId")]
        public virtual PublicMoney PublicMoney { get; set; }

        public int? TransactionId { get; set; }
        [ForeignKey("TransactionId")]
        public virtual Transaction Transaction { get; set; }
    }
}
