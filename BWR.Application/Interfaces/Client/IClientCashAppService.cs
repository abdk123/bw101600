using System.Collections.Generic;
using BWR.Application.Dtos.Client;
namespace BWR.Application.Interfaces.Client
{
    public interface IClientCashAppService
    {
        IList<ClientCashDto> GetAll();
        ClientCashDto GetById(int id);
        ClientCashDto Insert(ClientCashDto dto);
        ClientCashDto Update(ClientCashDto dto);
        void Delete(int id);
    }
}
