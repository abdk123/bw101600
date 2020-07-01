using BWR.Application.Common;

namespace BWR.Application.Dtos.TypeOfPay
{
    public class TypeOfPayInsertDto : EntityDto
    {
         public string Name { get; set; }
         public bool IsEnabled { get; set; }
    }
}
