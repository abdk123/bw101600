﻿using BWR.ShareKernel.Common;

namespace BWR.Domain.Model.Settings
{
    public class TypeOfPay: Entity
    {
        public string Name { get; set; }
        public bool IsEnabled { get; set; }
    }
}
