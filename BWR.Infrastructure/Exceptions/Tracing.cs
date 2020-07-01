using BWR.ShareKernel.Exceptions;
using System;
using System.Threading.Tasks;

namespace BWR.Infrastructure.Exceptions
{
    public class Tracing
    {

        public static void SaveException(BwrException ex)
        {
            Task.Factory.StartNew(() =>
            {
                
            });
        }
    }
}
