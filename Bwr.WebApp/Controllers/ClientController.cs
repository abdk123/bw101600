using BWR.Application.Interfaces.Setting;
using BWR.ShareKernel.Exceptions;
using System.Linq;
using System.Linq.Dynamic;
using System.Web.Mvc;
using BWR.Infrastructure.Exceptions;
using DataTables.Mvc;
using BWR.Application.Dtos.Client;
using BWR.Application.Interfaces.Client;
using System.Collections.Generic;

namespace Bwr.WebApp.Controllers
{
    public class ClientController : Controller
    {
        private readonly IClientAppService _clientAppService;
        private readonly IProvinceAppService _provinceAppService;
        private string _message;
        private bool _success;

        public ClientController(IClientAppService clientAppService, IProvinceAppService provinceAppService)
        {
            _clientAppService = clientAppService;
            _provinceAppService = provinceAppService;
            _message = "";
            _success = false;
        }

        public ActionResult Index()
        {
            return View();
        }

        #region Client

        public ActionResult Get([ModelBinder(typeof(DataTablesBinder))] IDataTablesRequest requestModel)
        {
            try
            {
                var clients = _clientAppService.GetAll().AsQueryable();

                var totalCount = clients.Count();

                // searching and sorting
                clients = SearchAndSort(requestModel, clients);
                var filteredCount = clients.Count();

                // Paging
                clients = clients.Skip(requestModel.Start).Take(requestModel.Length);

                var dataTablesResponse = new DataTablesResponse(requestModel.Draw, clients.ToList(), filteredCount, totalCount);
                return Json(dataTablesResponse, JsonRequestBehavior.AllowGet);
            }
            catch (BwrException ex)
            {
                Tracing.SaveException(ex);
                return Json(new { Success = false, Message = _message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public ActionResult Create()
        {
            return View("_CreateClient");
        }

        [HttpPost]
        public ActionResult Create(ClientInsertDto dto)
        {
            if (ChechIfPhoneRepeated(dto.ClientPhones))
            {
                _success = false;
                _message = "رقم الهاتف مكرر";
            }
            else
            {
                var clientDto = _clientAppService.Insert(dto);
                if (clientDto != null)
                    _success = true;
                else
                {
                    _success = false;
                    _message = "حدثت مشكلة اثناء إضافة بيانات العميل";
                }
            }

            return Json(new { Success = _success, Message = _message }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult Edit(int id)
        {
            var dto = _clientAppService.GetForEdit(id);

            if (Request.IsAjaxRequest())
                return PartialView("_EditClient", dto);

            return View(dto);
        }

        [HttpPost]
        public ActionResult Edit(ClientUpdateDto dto)
        {
            if (ChechIfPhoneRepeated(dto.ClientPhones))
            {
                _success = false;
                _message = "رقم الهاتف مكرر";
            }
            else
            {
                var clientDto = _clientAppService.Update(dto);
                if (clientDto != null)
                    _success = true;
                else
                {
                    _success = false;
                    _message = "حدثت مشكلة اثناء تعديل بيانات العميل";
                }
            }

            return Json(new { Success = _success, Message = _message }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult Delete(int id)
        {
            var dto = _clientAppService.GetById(id);

            if (Request.IsAjaxRequest())
                return PartialView("_DeleteClient", dto);

            return View(dto);
        }

        [HttpPost]
        public ActionResult Delete(ClientDto dto)
        {
            _clientAppService.Delete(dto.Id.Value);

            return Content("success");
        }

        public ActionResult Detail(int id)
        {
            var dto = _clientAppService.GetById(id);

            if (Request.IsAjaxRequest())
                return PartialView("_DetailsClient", dto);

            return View(dto);
        }

        
        #endregion

        #region Helper Method

        private IQueryable<ClientDto> SearchAndSort(IDataTablesRequest requestModel, IQueryable<ClientDto> query)
        {
            // Apply filters
            if (requestModel.Search.Value != string.Empty)
            {
                var value = requestModel.Search.Value.Trim();
                query = query.Where(p => p.FullName.Contains(value)

                                   );
            }

            var filteredCount = query.Count();

            // Sort
            var sortedColumns = requestModel.Columns.GetSortedColumns();
            var orderByString = string.Empty;

            foreach (var column in sortedColumns)
            {
                orderByString += orderByString != string.Empty ? "," : "";
                orderByString += (column.Data) + (column.SortDirection == Column.OrderDirection.Ascendant ? " asc" : " desc");
            }

            query = query.OrderBy(orderByString == string.Empty ? "BarCode asc" : orderByString);

            return query;
        }

        public bool ChechIfPhoneRepeated(IList<ClientPhoneDto> phones)
        {
            var phonesRepeated = phones.Select(x=>x.Phone).Distinct().ToList();

            if (phonesRepeated.Count != phones.Count)
                return true;

            return false;
        }


        #endregion
    }
}