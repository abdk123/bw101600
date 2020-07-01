using BWR.ShareKernel.Common;

namespace BWR.Domain.Model.Transactions
{
    public class TransactionType: Entity
    {
        public string Name { get; set; }
        public bool IsEnabled { get; set; }
    }
}