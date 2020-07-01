using BWR.Application.Interfaces.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Bwr.WebApp.Models.Security
{
    public class AppSession: IAppSession
    {
        public string GetUserName()
        {
            if (HttpContext.Current != null && HttpContext.Current.User != null)
            {
                return HttpContext.Current.User.Identity.Name;
            }
            return string.Empty;
        }
    }
}