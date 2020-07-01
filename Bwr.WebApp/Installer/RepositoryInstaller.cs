using System;
using BWR.Application.AppServices.Branch;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Microsoft.AspNet.Identity;
using BWR.Infrastructure.Common;
using BWR.Infrastructure.Context;
using IdentityUser = Bwr.WebApp.Identity.IdentityUser;
using BWR.ShareKernel.Interfaces;
using Bwr.WebApp.Identity;
using BWR.Domain.Repositories;
using BWR.Infrastructure.Repositories;
using BWR.Application.Interfaces.Setting;
using BWR.Application.AppServices.Setting;
using BWR.Application.Interfaces.Shared;
using Bwr.WebApp.Models.Security;
using BWR.Application.AppServices.Companies;
using BWR.Application.Interfaces.Company;
using BWR.Application.Interfaces.Security;
using BWR.Application.AppServices.Security;
using BWR.Application.Interfaces.Client;
using BWR.Application.AppServices.Clients;
using BWR.Application.Interfaces.Branch;

namespace Bwr.WebApp.Installer
{
    public class RepositoryInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(Component.For(typeof(IGenericRepository<>)).ImplementedBy(typeof(GenericRepository<>)).LifestyleTransient());
            container.Register(Component.For(typeof(IUnitOfWork<MainContext>)).ImplementedBy(typeof(UnitOfWork<MainContext>)).LifestyleTransient());
            container.Register(Component.For(typeof(IUserStore<IdentityUser, Guid>)).ImplementedBy(typeof(UserStore)).LifestyleTransient());
            container.Register(Component.For(typeof(UserManager<IdentityUser, Guid>)).LifestyleTransient());
            container.Register(Component.For(typeof(RoleManager<IdentityRole, Guid>)).LifestyleTransient());
            container.Register(Component.For(typeof(RoleStore)).LifestyleTransient());
            container.Register(Component.For<IAppSession>().ImplementedBy<AppSession>());
            //=========
            container.Register(Component.For<IRoleRepository>().ImplementedBy<RoleRepository>().LifestyleTransient());
            container.Register(Component.For<IUserRepository>().ImplementedBy<UserRepository>().LifestyleTransient());
            container.Register(Component.For<IExternalLoginRepository>().ImplementedBy<ExternalLoginRepository>().LifestyleTransient());

            //==========
            container.Register(Component.For<ICountryAppService>().ImplementedBy<CountryAppService>().LifestyleTransient());
            container.Register(Component.For<IProvinceAppService>().ImplementedBy<ProvinceAppService>().LifestyleTransient());
            container.Register(Component.For<ICoinAppService>().ImplementedBy<CoinAppService>().LifestyleTransient());
            container.Register(Component.For<ICompanyAppService>().ImplementedBy<CompanyAppService>().LifestyleTransient());
            container.Register(Component.For<ICompanyCashAppService>().ImplementedBy<CompanyCashAppService>().LifestyleTransient());
            container.Register(Component.For<ICompanyCountryAppService>().ImplementedBy<CompanyCountryAppService>().LifestyleTransient());
            container.Register(Component.For<IPublicIncomeAppService>().ImplementedBy<PublicIncomeAppService>().LifestyleTransient());
            container.Register(Component.For<IPublicExpenseAppService>().ImplementedBy<PublicExpenseAppService>().LifestyleTransient());
            container.Register(Component.For<IAttachmentAppService>().ImplementedBy<AttachmentAppService>().LifestyleTransient());
            container.Register(Component.For<IRoleAppService>().ImplementedBy<RoleAppService>().LifestyleTransient());
            container.Register(Component.For<IUserAppService>().ImplementedBy<UserAppService>().LifestyleTransient());
            container.Register(Component.For<IPermissionAppService>().ImplementedBy<PermissionAppService>().LifestyleTransient());
            container.Register(Component.For<IClientAppService>().ImplementedBy<ClientAppService>().LifestyleTransient());
            container.Register(Component.For<IClientCashAppService>().ImplementedBy<ClientCashAppService>());
            container.Register(Component.For<IClientPhoneAppService>().ImplementedBy<ClientPhoneAppService>());
            container.Register(Component.For<IBranchCommissionAppService>().ImplementedBy<BranchCommissionAppService>());


            //container.Register(Component.For<IClientCashFlowAppService>().ImplementedBy<ClientCashFlowAppService>());
            //container.Register(Component.For<ITreasuryAppService>().ImplementedBy<TreasuryAppService>());
            //container.Register(Component.For<ITreasuryCashAppService>().ImplementedBy<TreasuryCashAppService>());
            //container.Register(Component.For<ITreasuryMoneyActionAppService>().ImplementedBy<TreasuryMoneyActionAppService>());
            //container.Register(Component.For<IUserTreasueryAppService>().ImplementedBy<UserTreasueryAppService>());
            //container.Register(Component.For<ITransactionAppService>().ImplementedBy<TransactionAppService>());
            //container.Register(Component.For<ITransactionStatusAppService>().ImplementedBy<TransactionStatusAppService>());
            //container.Register(Component.For<ITransactionTypeAppService>().ImplementedBy<TransactionTypeAppService>());
            //container.Register(Component.For<IClaimAppService>().ImplementedBy<ClaimAppService>());
            //container.Register(Component.For<IExternalLoginAppService>().ImplementedBy<ExternalLoginAppService>());

            //container.Register(Component.For<IRoleAppService>().ImplementedBy<RoleAppService>());
            //container.Register(Component.For<IUserAppService>().ImplementedBy<UserAppService>());
            //container.Register(Component.For<ILogAppService>().ImplementedBy<LogAppService>());
            //container.Register(Component.For<ICompanyAppService>().ImplementedBy<CompanyAppService>());
            //container.Register(Component.For<ICompanyCashAppService>().ImplementedBy<CompanyCashAppService>());
            //container.Register(Component.For<ICompanyCashFlowAppService>().ImplementedBy<CompanyCashFlowAppService>());
            //container.Register(Component.For<ICompanyCommissionAppService>().ImplementedBy<CompanyCommissionAppService>());
            //container.Register(Component.For<ICompanyCountryAppService>().ImplementedBy<CompanyCountryAppService>());
            //container.Register(Component.For<ICompanyUserAppService>().ImplementedBy<CompanyUserAppService>());
            //container.Register(Component.For<IPublicExpenseAppService>().ImplementedBy<PublicExpenseAppService>());
            //container.Register(Component.For<IPublicIncomeAppService>().ImplementedBy<PublicIncomeAppService>());
            //container.Register(Component.For<IActionAppService>().ImplementedBy<ActionAppService>());
            //container.Register(Component.For<IAttachmentAppService>().ImplementedBy<AttachmentAppService>());
            //container.Register(Component.For<ICoinAppService>().ImplementedBy<CoinAppService>());
            //container.Register(Component.For<ICountryAppService>().ImplementedBy<CountryAppService>());
            //container.Register(Component.For<ITypeOfPayAppService>().ImplementedBy<TypeOfPayAppService>());
            //container.Register(Component.For<IBoxActionAppService>().ImplementedBy<BoxActionAppService>());
            //container.Register(Component.For<IExchangeAppService>().ImplementedBy<ExchangeAppService>());
            //container.Register(Component.For<IMoenyActionAppService>().ImplementedBy<MoenyActionAppService>());
            //container.Register(Component.For<IPhoneBaseAppService>().ImplementedBy<PhoneBaseAppService>());
            //container.Register(Component.For<IPublicMoneyAppService>().ImplementedBy<PublicMoneyAppService>());

            //container.Register(Component.For<IClientAttatchmentAppService>().ImplementedBy<ClientAttatchmentAppService>());

            //container.Register(Component.For<IClientTypeAppService>().ImplementedBy<ClientTypeAppService>());
            //container.Register(Component.For<IBranchAppService>().ImplementedBy<BranchAppService>());
            //container.Register(Component.For<IBranchCashAppService>().ImplementedBy<BranchCashAppService>());
            //container.Register(Component.For<IBranchCashFlowAppService>().ImplementedBy<BranchCashFlowAppService>());


        }
    }

    
}