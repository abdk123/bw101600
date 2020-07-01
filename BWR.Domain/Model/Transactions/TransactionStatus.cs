using BWR.ShareKernel.Common;

namespace BWR.Domain.Model.Transactions
{
    public class TransactionStatus: Entity
    {
        public string Name { get; set; }
        public bool IsEnabled { get; set; }
    }
}