using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BWR.Application.Dtos.Treasury
{
    public class TreasuryCashDto
    {
        public int Id { get; set; }
        public decimal Total { get; set; }
        public bool IsEnabled { get; set; }

        public int CoinId { get; set; }
        public int TreasuryId { get; set; }
    }
}
