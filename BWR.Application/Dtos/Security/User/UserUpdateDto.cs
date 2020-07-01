using System;
using System.ComponentModel.DataAnnotations;

namespace BWR.Application.Dtos.User
{
    public class UserUpdateDto
    {
        public Guid UserId { get; set; }

        [Required(ErrorMessage = "����� ������ �����")]
        [Display(Name = "����� ������")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "��� �������� �����")]
        [Display(Name = "��� ��������")]
        public string Username { get; set; }

        [Display(Name = "���� ������")]
        [DataType(DataType.Password)]
        [StringLength(50, MinimumLength = 6, ErrorMessage = "���� ������ ��� �� ���� 6 ����� ��� �����")]
        public string PasswordHash { get; set; }

        [Display(Name = "����� ���� ������")]
        [DataType(DataType.Password)]
        [Compare("PasswordHash", ErrorMessage = "��� �� ���� ����� ���� ���� ������")]
        public string ConfirmPassword { get; set; }

    }
}
