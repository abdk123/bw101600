using BWR.Application.Common;
namespace BWR.Application.Dtos.TransactionStatus
{
    public class TransactionStatusDto : EntityDto
    {
         public string Name { get; set; }
         public bool IsEnabled { get; set; }
    }
}
