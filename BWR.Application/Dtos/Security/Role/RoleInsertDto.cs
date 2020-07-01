using System;
using System.ComponentModel.DataAnnotations;

namespace BWR.Application.Dtos.Role
{
    public class RoleInsertDto 
    {
         public Guid RoleId { get; set; }

        [Required(ErrorMessage = "����� �����")]
        [Display(Name = "��� �����")]
        public string Name { get; set; }
         
    }
}
