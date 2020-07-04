﻿using BWR.Domain.Model.Common;
using BWR.Domain.Model.Enums;
using BWR.Domain.Model.Settings;
using BWR.Infrastructure.Common;
using BWR.Infrastructure.Context;
using BWR.ShareKernel.Interfaces;
using System;
using System.Collections.Generic;
using System.Globalization;

namespace BWR.Application.Extensions
{
    public static class MoneyActionExtension
    {
        public static decimal? OurCommission(this MoenyAction moneyAction)
        {
            if (moneyAction.Transaction != null)
            {
                return moneyAction.Transaction.OurComission;
            }
            return null;
        }

        public static int? GetActionId(this MoenyAction moneyAction)
        {
            if (moneyAction.TransactionId != null)
                return (int)moneyAction.TransactionId;
            //if (moneyAction.PublicMoney != null)
            //    return null;
            //return -1;
            if (moneyAction.BoxAction != null)
                return moneyAction.BoxAction.Id;
            if (moneyAction.Exchange != null)
                return moneyAction.Exchange.Id;
            if (moneyAction.ClearingId != null)
                return moneyAction.ClearingId;
            return -1;
        }

        public static string GetNote(this MoenyAction moneyAction, Requester requester, int? objectId)
        {
            if (moneyAction.TransactionId != null)
                return moneyAction.Transaction.Note;
            //if (moneyAction.PublicMoney != null&&moneyAction.BoxAction!=null)
            //    return "";
            //return "none";
            if (moneyAction.BoxAction != null)
                return moneyAction.BoxAction.Note;
            if (moneyAction.ClearingId != null)
            {
                return moneyAction.Clearing.GetNote(requester, (int)objectId);
            }
            return "GetNoteMoenyAction";
        }

        public static decimal Comission(this MoenyAction moneyAction, int companyId)
        {
            if (moneyAction.Transaction != null)
            {
                return moneyAction.Transaction.CompanyComission(companyId);
            }
            return 0;
        }

        public static decimal SecounCompanyCommission(this MoenyAction moneyAction, int companyId)
        {
            if (moneyAction.Transaction != null)
            {
                return moneyAction.Transaction.SecounCompanyCommission(companyId);
            }
            return 0;
        }

        public static decimal ClientComission(this MoenyAction moneyAction, int clientId)
        {
            if (moneyAction.Transaction != null)
            {
                return moneyAction.Transaction.ClientCommission(clientId: clientId);
            }
            return 0;
        }

        public static string ReciverName(this MoenyAction moneyAction)
        {
            if (moneyAction.TransactionId != null)
                return moneyAction.Transaction.ReceiverName();
            return "";
        }

        public static string SenderName(this MoenyAction moneyAction)
        {
            if (moneyAction.TransactionId != null)
                return moneyAction.Transaction.SenderName();
            return "";
        }

        public static string CountryName(this MoenyAction moneyAction)
        {
            if (moneyAction.Transaction != null)
                if (moneyAction.Transaction.Country != null)
                    return moneyAction.Transaction.Country.Name;
            return "";
        }

        public static string GetDate(this MoenyAction moneyAction)
        {
            if (moneyAction.Transaction != null)
            {
                if (moneyAction.Transaction.Deliverd != null)
                {
                    if ((bool)moneyAction.Transaction.Deliverd)
                    {
                        return ((DateTime)moneyAction.Transaction.DeliverdDate).ToString("dd/MM/yyyy", new CultureInfo("ar-AE"));
                    }
                }
            }
            return moneyAction.Created.Value.ToString("dd/MM/yyyy", new CultureInfo("ar-AE"));
        }

        public static string CreateBy(this MoenyAction moneyAction)
        {
            if (moneyAction.Transaction != null)
            {
                return moneyAction.Transaction.CreateBy();
            }
            return moneyAction.CreatedBy;
        }

        public static string GetTypeName(this MoenyAction moneyAction,Requester requester, int? objectId)
        {
            if (moneyAction.TransactionId != null)
                return moneyAction.Transaction.GetTypeName(requester, objectId);
            if (moneyAction.PublicMoney != null)
                return moneyAction.PublicMoney.GetTypeName();
            //get Company or ClientName 
            if (moneyAction.BoxAction != null)
            {
                if (moneyAction.BoxAction.IsIncmoe)
                    return "فبض";
                return "صرف";
            }
            if (moneyAction.ExchangeId != null)
            {
                var unitOfWork = new UnitOfWork<MainContext>();
                var repository = new GenericRepository<Coin>(unitOfWork);
                return repository.GetById(moneyAction.Exchange.FirstCoinId).Name;
            }
            if (moneyAction.ClearingId != null)
            {
                return moneyAction.Clearing.GetTypeName(requester, (int)objectId);
            }
            return "GetTypeName";
        }

        
    }
}
