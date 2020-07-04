using BWR.Application.Interfaces.Common;
using BWR.Application.Interfaces.Shared;
using BWR.Infrastructure.Context;
using BWR.ShareKernel.Interfaces;

namespace BWR.Application.AppServices.Common
{
    class MoneyActionAppService: IMoneyActionAppService
    {
        private readonly IUnitOfWork<MainContext> _unitOfWork;
        private readonly IAppSession _appSession;

        public MoneyActionAppService(IUnitOfWork<MainContext> unitOfWork
            , IAppSession appSession)
        {
            _unitOfWork = unitOfWork;
            _appSession = appSession;
        }
        
    }
}
