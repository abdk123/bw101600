using AutoMapper;
using BWR.Application.Dtos.Client;
using BWR.Application.Interfaces.Client;
using BWR.Application.Interfaces.Shared;
using BWR.Domain.Model.Clients;
using BWR.Infrastructure.Context;
using BWR.Infrastructure.Exceptions;
using BWR.ShareKernel.Exceptions;
using BWR.ShareKernel.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace BWR.Application.AppServices.Clients
{
    public class ClientCashAppService : IClientCashAppService
    {
        private readonly IUnitOfWork<MainContext> _unitOfWork;
        private readonly IAppSession _appSession;

        public ClientCashAppService(IUnitOfWork<MainContext> unitOfWork, IAppSession appSession)
        {
            _unitOfWork = unitOfWork;
            _appSession = appSession;
        }

        public IList<ClientCashDto> GetAll()
        {
            var clientCashsDtos = new List<ClientCashDto>();
            try
            {
                var clientCashs = _unitOfWork.GenericRepository<ClientCash>().GetAll().ToList();
                clientCashsDtos = Mapper.Map<List<ClientCash>, List<ClientCashDto>>(clientCashs);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return clientCashsDtos;
        }

        public ClientCashDto GetById(int id)
        {
            ClientCashDto clientCashDto = null;
            try
            {
                var clientCash = _unitOfWork.GenericRepository<ClientCash>().GetById(id);
                if (clientCash != null)
                {
                    clientCashDto = Mapper.Map<ClientCash, ClientCashDto>(clientCash);
                }

            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }

            return clientCashDto;
        }
        public ClientCashDto Insert(ClientCashDto dto)
        {
            ClientCashDto clientCashDto = null;
            try
            {
                var clientCash = Mapper.Map<ClientCashDto, ClientCash>(dto);
                clientCash.CreatedBy = _appSession.GetUserName();
                clientCash.IsEnabled = true;
                _unitOfWork.CreateTransaction();

                _unitOfWork.GenericRepository<ClientCash>().Insert(clientCash);
                _unitOfWork.Save();

                _unitOfWork.Commit();

                clientCashDto = Mapper.Map<ClientCash, ClientCashDto>(clientCash);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
                _unitOfWork.Rollback();
            }
            return clientCashDto;
        }

        public ClientCashDto Update(ClientCashDto dto)
        {
            ClientCashDto clientCashDto = null;
            try
            {
                var clientCash = _unitOfWork.GenericRepository<ClientCash>().GetById(dto.Id);
                Mapper.Map<ClientCashDto, ClientCash>(dto, clientCash);
                clientCash.ModifiedBy = _appSession.GetUserName();
                _unitOfWork.CreateTransaction();

                _unitOfWork.GenericRepository<ClientCash>().Update(clientCash);
                _unitOfWork.Save();

                _unitOfWork.Commit();

                clientCashDto = Mapper.Map<ClientCash, ClientCashDto>(clientCash);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }
            return clientCashDto;
        }

        public void Delete(int id)
        {
            try
            {
                var clientCash = _unitOfWork.GenericRepository<ClientCash>().GetById(id);
                if (clientCash != null)
                {
                    _unitOfWork.GenericRepository<ClientCash>().Delete(clientCash);
                    _unitOfWork.Save();
                }
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
            }
        }

        
    }
}
