﻿using System.ComponentModel.DataAnnotations;

namespace BWR.Application.Dtos.Company.CompanyCommission
{
    public class CompanyCommissionInsertDto
    {
        [Required(ErrorMessage = "حقل من مطلوب")]
        [Display(Name = "من")]
        public decimal StartRange { get; set; }

        [Display(Name = "إلى")]
        public decimal? EndRange { get; set; }

        [Display(Name = "القيمة")]
        public decimal? Cost { get; set; }

        [Display(Name = "القيمة")]
        [Range(0,100,ErrorMessage ="يجب ان تكون النسبة بين 0 و 100")]
        public decimal? Ratio { get; set; }

        public bool IsEnabled { get; set; }

        [Required(ErrorMessage = "اسم العملة مطلوب")]
        [Display(Name = "اسم العملة")]
        public int CoinId { get; set; }

        [Required(ErrorMessage = "اسم البلد مطلوب")]
        [Display(Name = "اسم البلد")]
        public int CompanyCountryId { get; set; }
    }
}
