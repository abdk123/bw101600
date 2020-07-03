using System.ComponentModel.DataAnnotations;
using BWR.Application.Common;

namespace BWR.Application.Dtos.Branch
{
    public class BranchCommissionUpdateDto : EntityDto
    {
        [Required(ErrorMessage = "��� �� �����")]
        [Display(Name = "��")]
        public decimal StartRange { get; set; }

        [Required(ErrorMessage = "��� ��� �����")]
        [Display(Name = "���")]
        public decimal EndRange { get; set; }

        [Display(Name = "������")]
        public decimal? Cost { get; set; }

        [Display(Name = "������")]
        public decimal? Ratio { get; set; }

        public bool IsEnabled { get; set; }
        public int BranchId { get; set; }

        [Required(ErrorMessage = "��� ������ �����")]
        [Display(Name = "��� ������")]
        public int CoinId { get; set; }

        [Required(ErrorMessage = "��� ����� �����")]
        [Display(Name = "��� �����")]
        public int CountryId { get; set; }
    }
}
