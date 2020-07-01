using BWR.Application.Common;

namespace BWR.Application.Dtos.TypeOfPay
{
    public class TypeOfPayUpdateDto : EntityDto
    {
         public string Name { get; set; }
         public bool IsEnabled { get; set; }
    }
}
