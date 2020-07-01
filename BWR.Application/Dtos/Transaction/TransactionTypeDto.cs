using BWR.Application.Common;
namespace BWR.Application.Dtos.TransactionType
{
    public class TransactionTypeDto : EntityDto
    {
         public string Name { get; set; }
         public bool IsEnabled { get; set; }
    }
}
