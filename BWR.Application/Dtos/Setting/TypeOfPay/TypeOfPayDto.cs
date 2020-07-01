using BWR.Application.Common;

namespace BWR.Application.Dtos.TypeOfPay
{
    public class TypeOfPayDto : EntityDto
    {
         public string Name { get; set; }
         public bool IsEnabled { get; set; }
    }
}
