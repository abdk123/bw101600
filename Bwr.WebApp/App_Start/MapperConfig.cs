﻿using AutoMapper;
using BWR.Application.Dtos.Branch;
using BWR.Application.Dtos.Client;
using BWR.Application.Dtos.Company;
using BWR.Application.Dtos.Permission;
using BWR.Application.Dtos.Role;
using BWR.Application.Dtos.Setting.Attachment;
using BWR.Application.Dtos.Setting.Coin;
using BWR.Application.Dtos.Setting.Country;
using BWR.Application.Dtos.Setting.Provinces;
using BWR.Application.Dtos.Setting.PublicExpense;
using BWR.Application.Dtos.Setting.PublicIncome;
using BWR.Application.Dtos.Transaction;
using BWR.Application.Dtos.User;
using BWR.Domain.Model.Branches;
using BWR.Domain.Model.Clients;
using BWR.Domain.Model.Companies;
using BWR.Domain.Model.Security;
using BWR.Domain.Model.Settings;
using BWR.Domain.Model.Transactions;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using BWR.Application.Dtos.Treasury;
using BWR.Domain.Model.Treasures;
using BWR.Application.Dtos.Company.CompanyCommission;
using BWR.Application.Common;
using BWR.Application.Dtos.Company.CompanyCashFlow;
using BWR.Application.Dtos.Treasury.TreasuryMoneyAction;

namespace Bwr.WebApp
{
    public class MapperConfig
    {
        public static void Map()
        {
            //Country
            Mapper.CreateMap<Country, CountryDto>();
            Mapper.CreateMap<CountryDto, Country>();
            Mapper.CreateMap<Country, CountryForDropdownDto>();
            Mapper.CreateMap<CountryInsertDto, Country>();
            Mapper.CreateMap<CountryUpdateDto, Country>().ForMember(x=>x.Provinces,x=>x.Ignore());
            Mapper.CreateMap<Country, CountryInsertDto>();
            Mapper.CreateMap<Country, CountryUpdateDto>();

            //Province
            Mapper.CreateMap<Country, ProvinceDto>();
            Mapper.CreateMap<Country, ProvinceForDropdownDto>();
            Mapper.CreateMap<ProvinceInsertDto, Country>();
            Mapper.CreateMap<ProvinceUpdateDto, Country>();
            Mapper.CreateMap<Country, ProvinceUpdateDto>();
            Mapper.CreateMap<CountryDto, ProvinceInsertDto>();
            
            //User
            Mapper.CreateMap<User, UserDto>();
            Mapper.CreateMap<User, UserForDropdownDto>();
            Mapper.CreateMap<UserInsertDto, User>();
            Mapper.CreateMap<UserUpdateDto, User>();
            Mapper.CreateMap<User, UserUpdateDto>();

            //CompanyCash
            Mapper.CreateMap<CompanyCashDto, CompanyCash>();
            Mapper.CreateMap<CompanyCash, CompanyCashDto>();
            Mapper.CreateMap<CompanyCash, CompanyCashUpdateDto>();
            Mapper.CreateMap<CompanyCashUpdateDto, CompanyCash>();
            Mapper.CreateMap<CompanyCash, CompanyCashesDto>()
                .ForMember(x => x.ForHim, x => x.Ignore())
                .ForMember(x => x.OnHim, x => x.Ignore());

            //Company
            Mapper.CreateMap<Company, CompanyDto>();
            
            Mapper.CreateMap<Company, CompanyForDropdownDto>();
            Mapper.CreateMap<CompanyInsertDto, Company>();
            Mapper.CreateMap<CompanyUpdateDto, Company>();
            Mapper.CreateMap<Company, CompanyUpdateDto>();
            Mapper.CreateMap<CompanyCashesDto, CompanyCash>();
            Mapper.CreateMap<CompanyCash, CompanyCashesDto>();

            //PublicIncome
            Mapper.CreateMap<PublicIncome, PublicIncomeDto>();
            Mapper.CreateMap<PublicIncome, PublicIncomeForDropdownDto>();
            Mapper.CreateMap<PublicIncomeInsertDto, PublicIncome>();
            Mapper.CreateMap<PublicIncomeUpdateDto, PublicIncome>();
            Mapper.CreateMap<PublicIncome, PublicIncomeUpdateDto>();

            //PublicExpense
            Mapper.CreateMap<PublicExpense, PublicExpenseDto>();
            Mapper.CreateMap<PublicExpense, PublicExpenseForDropdownDto>();
            Mapper.CreateMap<PublicExpenseInsertDto, PublicExpense>();
            Mapper.CreateMap<PublicExpenseUpdateDto, PublicExpense>();
            Mapper.CreateMap<PublicExpense, PublicExpenseUpdateDto>();

            //Attachment
            Mapper.CreateMap<Attachment, AttachmentDto>();
            Mapper.CreateMap<Attachment, AttachmentForDropdownDto>();
            Mapper.CreateMap<AttachmentInsertDto, Attachment>();
            Mapper.CreateMap<AttachmentUpdateDto, Attachment>();
            Mapper.CreateMap<Attachment, AttachmentUpdateDto>();

            //Role
            Mapper.CreateMap<Role, RoleDto>();
            Mapper.CreateMap<Role, RoleForDropdownDto>();
            Mapper.CreateMap<RoleInsertDto, Role>();
            Mapper.CreateMap<RoleUpdateDto, Role>();
            Mapper.CreateMap<Role, RoleUpdateDto>();

            //Permission
            Mapper.CreateMap<Permission, PermissionDto>();
            Mapper.CreateMap<Permission, PermissionForDropdownDto>();
            Mapper.CreateMap<PermissionInsertDto, Permission>();
            Mapper.CreateMap<PermissionUpdateDto, Permission>();
            Mapper.CreateMap<Permission, PermissionUpdateDto>();

            //Coin
            Mapper.CreateMap<Coin, CoinDto>();
            Mapper.CreateMap<Coin, CoinForDropdownDto>();
            Mapper.CreateMap<CoinInsertDto, Coin>();
            Mapper.CreateMap<CoinUpdateDto, Coin>();
            Mapper.CreateMap<Coin, CoinUpdateDto>();

            //Client
            Mapper.CreateMap<Client, ClientDto>();
            Mapper.CreateMap<ClientInsertDto, Client>();
            Mapper.CreateMap<ClientUpdateDto, Client>()
                .ForMember(x=>x.ClientCashes,x=>x.Ignore())
                .ForMember(x => x.ClientPhones, x => x.Ignore());
            Mapper.CreateMap<Client, ClientUpdateDto>();
            Mapper.CreateMap<ClientCash, ClientCashDto>();
            Mapper.CreateMap<ClientCashDto, ClientCash>();
            Mapper.CreateMap<ClientPhone, ClientPhoneDto>();
            Mapper.CreateMap<ClientPhoneDto, ClientPhone>();
            Mapper.CreateMap<ClientCashFlow, ClientCashFlowDto>();
            Mapper.CreateMap<ClientCashFlowDto, ClientCashFlow>();
            Mapper.CreateMap<ClientAttatchment, ClientAttatchmentDto>();
            Mapper.CreateMap<ClientAttatchmentDto, ClientAttatchment>();
            Mapper.CreateMap<TransactionDto, Transaction>();
            Mapper.CreateMap<Transaction, TransactionDto>();
            Mapper.CreateMap<ClientDto, ClientUpdateDto>();

            //Branch
            Mapper.CreateMap<Branch, BranchDto>();
            Mapper.CreateMap<BranchDto, Branch>();

            //BranchCommission
            Mapper.CreateMap<BranchCommission, BranchCommissionDto>();
            Mapper.CreateMap<BranchCommissionInsertDto, BranchCommission>();
            Mapper.CreateMap<BranchCommissionUpdateDto, BranchCommission>()
                .ForMember(x => x.BranchId, x => x.Ignore())
                .ForMember(x => x.Branch, x => x.Ignore());
            Mapper.CreateMap<BranchCommission, BranchCommissionUpdateDto>();

            //BranchCash
            Mapper.CreateMap<BranchCashInsertDto, BranchCash>();
            Mapper.CreateMap<BranchCash, BranchCashDto>();

            //TreasuryCash
            Mapper.CreateMap<TreasuryCashDto, TreasuryCash>();
            Mapper.CreateMap<TreasuryCash, TreasuryCashDto>();

            //Treasury
            Mapper.CreateMap<Treasury, TreasuryDto>();
            Mapper.CreateMap<TreasuryInsertDto, Treasury>();
            Mapper.CreateMap<TreasuryUpdateDto, Treasury>();
            Mapper.CreateMap<Treasury, TreasuryUpdateDto>();

            //TreasuryMoneyAction
            Mapper.CreateMap<TreasuryMoneyAction, TreasuryMoneyActionDto>()
                .ForMember(x => x.Created, x => x.Ignore());
            //Mapper.CreateMap<TreasuryMoneyActionInputDto, TreasuryMoneyAction>();

            //CompanyCommission
            Mapper.CreateMap<CompanyCommission, CompanyCommissionDto>();
            Mapper.CreateMap<CompanyCommission, CompanyCommissionsDto>()
                .ForMember(x => x.CountryName, x => x.Ignore())
                .ForMember(x => x.CoinName, x => x.Ignore());
            Mapper.CreateMap<CompanyCommissionInsertDto, CompanyCommission>();
            Mapper.CreateMap<CompanyCommissionUpdateDto, CompanyCommission>();
            Mapper.CreateMap<CompanyCommission, CompanyCommissionUpdateDto>();

            //CompanyCountry
            Mapper.CreateMap<CompanyCountryDto, CompanyCountry>();
            Mapper.CreateMap<CompanyCountry, CompanyCountryDto>();
            Mapper.CreateMap<CompanyCountry, DtoForDropdown>();

            //CompanyCashFlow
            Mapper.CreateMap<CompanyCashFlowDto, CompanyCashFlow>();
            Mapper.CreateMap<CompanyCashFlowDto, CompanyCashFlow>();
            Mapper.CreateMap<CompanyCashFlowOutputDto, CompanyCashFlow>();
            Mapper.CreateMap<CompanyCashFlow, CompanyCashFlowOutputDto>();
        }
    }

    public static class MapperConfigExtension
    {
        public static IMappingExpression<TSource, TDestination> IgnoreAllNonExisting<TSource, TDestination>(this IMappingExpression<TSource, TDestination> expression)
        {
            var flags = BindingFlags.Public | BindingFlags.Instance;
            var sourceType = typeof(TSource);
            var destinationProperties = typeof(TDestination).GetProperties(flags);

            foreach (var property in destinationProperties)
            {
                if (sourceType.GetProperty(property.Name, flags) == null)
                {
                    expression.ForMember(property.Name, opt => opt.Ignore());
                }
            }
            return expression;
        }
    }
}