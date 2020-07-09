using BWR.Application.Interfaces.Shared;
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

        public int GetCurrentTreasuryId()
        {
            //int treasuryId = 0;
            //int.TryParse(HttpContext.Current.Session["CurrentTreusery"].ToString(), out treasuryId);
            //return treasuryId;

            return 3;
        }
    }
}