using System;
using System.Diagnostics;

namespace BWR.ShareKernel.Exceptions
{
    public class BwrException : Exception
    {
        public string MethodName
        {
            get
            {
                return new StackTrace(this).GetFrame(0).GetMethod().Name;
            }
        }

        public string FileName
        {
            get
            {
                return new StackTrace(this).GetFrame(0).GetFileName();
            }
        }
    }
}
