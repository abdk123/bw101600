let companyBalanceModelBody = document.getElementById('companyBalanceModelBody');
let companyCountrySelect = document.getElementById('companyCountrySelect');
function fillCompanyTable() {
    $.post(
        '_JSONGetCompy',
        function (data) {
            for (var i = 0; i < data.length; i++) {
                CompanyTable.row.add([
                    data[i].Name,
                    FlipBoolToYesOrNo(data[i].IsEnabled),
                    CreateCompanyChoicFunction(data[i].Id) + CreateCompanyUpdateDiv(data[i].Id)
                ]).draw();
            }
        }
    )
}
$(document).ready(function () {
    $('#companyCountrySelect').select2();
    FillCompanyCountrySelect();
});
function FillCompanyCountrySelect() {
    companyCountrySelect.innerHTML = "";
    $.get(
        '/Region/Get',
        function (data) {
            for (var i = 0; i < data.length; i++) {
                var option = document.createElement('option');
                option.innerText = data[i].Name;
                option.value = data[i].Id;
                companyCountrySelect.appendChild(option);
            }
        }
    )
}
$('#companyNameText').keyup(function () {
    var companyMessageLable = document.getElementById('companyErrorMessage');
    if (this.value == "" && companyMessageLable.innerText == "لا يمكن ان يكون اسم الشكرة فارغ") {
        return;
    }
    if (this.value == "") {
        companyMessageLable.innerText = "";
        companyMessageLable.style.color = "black";
        return;
    }
    $.post('_JSONSimelarCompany', {
        companyName: this.value
    },
        function (data) {
            if (data != "null") {
                companyMessageLable.innerHTML = "هناك مدينة شركة مشابهة و هي <a>" + data.Name + "</a>"
            } else {
                companyMessageLable.innerText = "";
            }
        });
});
$('#companyAddBtn').click(function () {
    var companyName = document.getElementById("companyNameText").value;
    var lableMessage = document.getElementById("companyErrorMessage");
    if (companyName == "") {
        lableMessage.style.color = "red";
        lableMessage.innerText = "لا يمكن ان يكون اسم الشكرة فارغ";
        return;
    }
    var balances = [];
    if (companyBalanceModelBody.innerHTML != "") {
        var rows = companyBalanceModelBody.getElementsByClassName('row');
        for (var i = 0; i < rows.length; i++) {
            var inputs = rows[i].getElementsByTagName('input');
            var coinId = parseInt(inputs[0].value);
            var balnce = parseFloat(deleteCommaFromNumber(inputs[1].value));
            if (!inputs[2].checked) {
                balnce = balnce * -1;
            }

            var companyBalnce = new CompanyBalnce(coinId, balnce);
            balances.push(companyBalnce);
        }
    }
    var countriesId = $('#companyCountrySelect').val();
    console.log(countriesId);
    var company = new AddCompany(companyName, balances, countriesId);
    console.log(company);
    
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: "{addCompany:" + JSON.stringify(company) + "}",
        url: "_AJaxAddCompany",
        success: function (data) {
            if (data != 'null') {
                companyName.value = "";
                lableMessage.innerText = "";
                CompanyTable.row.add([
                    data.Name,
                    FlipBoolToYesOrNo(data.IsEnabled),
                    CreateCompanyChoicFunction(data.Id) + CreateCompanyUpdateDiv(data.Id)
                ]).draw();
                companyBalanceModelBody.innerHTML = "";
                return;
            } else {
                alert("حدث خطاء ما");
            }
        },
        error: function (eee) {
            alert('حدث خطأ ما يجب إعادة المحاولة');
            location.reload();
        }
    }
    )
});
function updateCountry(element, id) {
    var elementDiv = element.parentElement.parentElement;
    var row = elementDiv.parentElement.parentElement;
    var tdCompanyName = row.getElementsByTagName("td")[0].getElementsByTagName("input")[0].value;
    var tdCompanyEnabled = row.getElementsByTagName("td")[1].getElementsByTagName("input")[0].checked;
    if (tdCompanyName == "") {
        $.confirm({
            title: 'تنبيه!',
            content: 'لا يمكن ان يكون حقل الأسم فارغ',
            buttons: {
                موافق: function () {
                }
            }
        }
        );
        return;
    }
    if (tdCompanyName == companyName && tdCompanyEnabled == companyEnabled) {
        CompanyCancelUpdate(element);
        return;
    }
    $.post(
        '_JSONSimelarCompany',
        {
            companyName: tdCompanyName,
            id: id,
        },
        function (data) {
            if (data != "null") {
                $.confirm({
                    title: "تأكيد!",
                    content: "هناك شركة موجودة مسبقاً تحمل نفس الأسم هل انت متأكد من التعديل",
                    buttons: {
                        تأكيد: function () {
                            $.post(
                                '_AjaxUpdateCompany', {
                                    id: id,
                                    name: tdCompanyName,
                                    enabled: tdCompanyEnabled,
                                },
                                function (data) {
                                    console.log(data);
                                    if (data != "True") {
                                        $.confirm({
                                            title: "خطاء!",
                                            content: "حدث خطاء يرجى إعادة المحاولة",
                                            buttons: {
                                                موافق: function () { }
                                            }
                                        });
                                    }
                                    else {
                                        companyName = tdCompanyName;
                                        companyEnabled = tdCompanyEnabled;
                                        CompanyCancelUpdate(element);
                                    }
                                }
                            )
                        },
                        إلغاء: function () {
                            CompanyCancelUpdate(element);
                        }

                    }

                });
            } else {
                $.post(
                    '_AjaxUpdateCompany', {
                        id: id,
                        name: tdCompanyName,
                        enabled: tdCompanyEnabled,
                    },
                    function (data) {
                        if (data != "True") {
                            $.confirm({
                                title: "خطاء!",
                                content: "حدث خطاء يرجى إعادة المحاولة",
                                buttons: {
                                    موافق: function () { }
                                }
                            });
                        }
                        else {
                            companyName = tdCompanyName;
                            companyEnabled = tdCompanyEnabled;
                            CompanyCancelUpdate(element);
                        }
                    }
                )

            }
        }
    )

}

function CreateCompanyChoicFunction(id) {
    var choiceDIv = document.createElement("div");
    var viewDiv = document.createElement("div");
    viewDiv.setAttribute("class", "col-lg-4");
    var editDiv = viewDiv.cloneNode();
    var DeleteDiv = viewDiv.cloneNode();

    choiceDIv.appendChild(viewDiv);
    choiceDIv.appendChild(editDiv);
    choiceDIv.appendChild(DeleteDiv);

    var viewButton = document.createElement("button");
    viewDiv.appendChild(viewButton);
    viewButton.setAttribute("class", "btn btn-primary");
    viewButton.setAttribute("name", "CompanyViewBtn");
    viewButton.setAttribute("onclick", "CompanyViewFunction(" + id + ");");
    viewButton.innerText = "عرض";

    var editBtn = document.createElement("button");
    editDiv.appendChild(editBtn);
    editBtn.setAttribute("class", "btn btn-secondary");
    editBtn.setAttribute("name", "CompanyEditBtn");
    editBtn.setAttribute("onclick", "CompanyEditFuncrtion(this);");
    editBtn.innerText = "تعديل";

    var deleteBtn = document.createElement("button");
    DeleteDiv.appendChild(deleteBtn);
    deleteBtn.setAttribute("class", "btn btn-danger");
    deleteBtn.setAttribute("name", "CompanyDeleteBtn");
    deleteBtn.setAttribute("onclick", "CompanyDeleteFuncrtion(this," + id + ");");
    deleteBtn.innerText = "حذف";
    return choiceDIv.outerHTML;
}
function CreateCompanyUpdateDiv(id) {
    var updateDiv = document.createElement('div');
    updateDiv.style.display = "none";

    var SaveDiv = document.createElement("div");
    SaveDiv.setAttribute("class", "col-lg-6");
    var CancelDiv = SaveDiv.cloneNode();

    updateDiv.appendChild(SaveDiv);
    updateDiv.appendChild(CancelDiv);

    var savebtn = document.createElement("button");
    SaveDiv.appendChild(savebtn);
    savebtn.setAttribute("class", "btn btn-success");
    savebtn.setAttribute("onclick", "CompanySaveFuncrtion(this," + id + ");");
    savebtn.style.width = "100px";
    savebtn.innerText = "حفظ";

    var cancelBtn = document.createElement('button');
    CancelDiv.appendChild(cancelBtn);
    cancelBtn.setAttribute("class", "btn btn-danger");
    cancelBtn.setAttribute('onclick', 'CompanyCancelFuncrtion(this,' + id + ');');
    cancelBtn.innerText = "إلغاء";
    cancelBtn.style.width = "100px";
    CancelDiv.appendChild(cancelBtn);
    return updateDiv.outerHTML;
}


var companyName;
var companyEnabled;

function CompanyEditFuncrtion(element) {
    var ChoicDive = element.parentElement.parentElement;
    ChoicDive.style.display = "none";
    var UpdateDiv = ChoicDive.nextSibling;
    UpdateDiv.style.display = "block";

    var row = ChoicDive.parentElement.parentElement;

    var nameTd = row.getElementsByTagName("td")[0];
    companyName = nameTd.innerText;


    var enabledTd = row.getElementsByTagName("td")[1];
    companyEnabled = FlipYesOrNoToBoolean(enabledTd.innerText);


    var nameText = document.createElement("input");
    nameText.setAttribute("type", "text");
    nameText.setAttribute("class", "form-control");

    nameTd.innerText = "";
    nameText.value = companyName;
    nameTd.appendChild(nameText);

    var checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.checked = companyEnabled;


    enabledTd.innerText = "";
    enabledTd.appendChild(checkBox);

    var CountryEditBtn = document.getElementsByName("CompanyViewBtn");
    var CountryViewBtn = document.getElementsByName("CompanyEditBtn");
    var CountryeDeleteBtn = document.getElementsByName("CompanyDeleteBtn");
    for (var i = 0; i < CountryeDeleteBtn.length; i++) {
        CountryEditBtn[i].disabled = CountryViewBtn[i].disabled = CountryeDeleteBtn[i].disabled = true;
    }
}
function CompanyCancelFuncrtion(element) {
    var UpdateDiv = element.parentElement.parentElement;
    UpdateDiv.style.display = "none";
    var ChoicDiv = UpdateDiv.previousElementSibling;
    ChoicDiv.style.display = "block";
    var CountryEditBtn = document.getElementsByName("CompanyViewBtn");
    var CountryViewBtn = document.getElementsByName("CompanyEditBtn");
    var CountryeDeleteBtn = document.getElementsByName("CompanyDeleteBtn");
    for (var i = 0; i < CountryeDeleteBtn.length; i++) {
        CountryEditBtn[i].disabled = CountryViewBtn[i].disabled = CountryeDeleteBtn[i].disabled = false;
    }

    var row = ChoicDiv.parentElement.parentElement;
    var nameTd = row.getElementsByTagName("td")[0];
    nameTd.inneHtml = "";
    nameTd.innerText = companyName;

    var enabledTd = row.getElementsByTagName("td")[1];
    enabledTd.inneHtml = "";
    enabledTd.innerText = FlipBoolToYesOrNo(companyEnabled);
    companyName = undefined;
    companyEnabled = undefined;
}
function CompanyDeleteFuncrtion(element, id) {
    alert("After");
}
function CompanySaveFuncrtion(element, id) {
    var row = element.parentElement.parentElement.parentElement.parentElement;
    var nameTd = row.getElementsByTagName("td")[0];
    var enabledTd = row.getElementsByTagName("td")[1]
    var newName = nameTd.getElementsByTagName("input")[0].value;
    if (newName == "") {
        $.confirm(
            {
                title: 'خطاء',
                content: 'لا يمكن ان يكون حقل الأسم فارغ',
                buttons: {
                    موافق: function () {
                    }
                }
            }
        );
        return;
    }
    var newStatus = enabledTd.getElementsByTagName("input")[0].checked;
    if (newName == companyName && companyEnabled == newStatus) {
        CompanyCancelFuncrtion(element);
        return;
    }
    $.post(
        '_JSONSimelarCompany', {
            companyName: newName,
            id: id
        },
        function (data) {
            console.log(data);
            if (data === "null") {
                $.post(
                    '_AjaxUpdateCompany', {
                        id: id,
                        name: newName,
                        enabled: newStatus,
                    },
                    function (data) {
                        if (data === "True") {
                            companyName = newName;
                            companyEnabled = newStatus;
                            CompanyCancelFuncrtion(element);
                            alert("تعم التعديل");
                        } else {
                            CompanyCancelFuncrtion(element);
                            alert("لم يتم العتديل هناك خطاء ما حاول مجدداً");
                        }
                    }
                );
            } else {
                $.confirm({
                    title: 'تأكيد !',
                    content: 'هناك شركة  تحمل نفس الأسم هل انت متأكد من التعديل ؟',
                    buttons: {
                        تأكيد: function () {
                            $.post(
                                '_AjaxUpdateCompany', {
                                    id: id,
                                    name: newName,
                                    enabled: newStatus,
                                },
                                function (data) {
                                    if (data === "True") {
                                        companyName = newName;
                                        companyEnabled = newStatus;
                                        CompanyCancelFuncrtion(element);
                                        alert("تعم التعديل");
                                    } else {
                                        CountryCancelFuncrtion(element);
                                        alert("لم يتم العتديل هناك خطاء ما حاول مجدداً");
                                    }
                                }
                            );
                        },
                        إلغاء: function () {
                            CompanyCancelFuncrtion(element);
                        }
                    }
                });
            }
        });
}
function CompanyViewFunction(Id) {
    window.location.href = '/BwCompanies/Details?id=' + Id;
}
function FillCoinCompanyBalnceModel() {

    if (companyBalanceModelBody.innerHTML == "") {
        $.post(
            '_JSONGetCoin',
            function (data) {
                console.log("ss");
                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    var row = document.createElement('div');
                    row.setAttribute('class', 'row');
                    var divColLg4 = document.createElement('div');
                    divColLg4.setAttribute('class', 'col-lg-4');

                    var divCoinName = divColLg4.cloneNode();

                    divCoinName.innerText = data[i].Name;
                    var coinId = document.createElement('input');
                    coinId.setAttribute('type', 'hidden');
                    coinId.setAttribute('value', data[i].Id);
                    divCoinName.appendChild(coinId);
                    row.appendChild(divCoinName);

                    var divBlance = divColLg4.cloneNode();
                    var balnceText = document.createElement('input');
                    balnceText.setAttribute("onkeypress", "validation(this,event)");
                    balnceText.setAttribute("onkeyup", "FormaittingNumber(this);");
                    balnceText.setAttribute("onkeydown", "PriventEmptytext(this, event)");
                    balnceText.setAttribute('value', '0');
                    divBlance.appendChild(balnceText);
                    row.appendChild(divBlance);
                    var divCheckBox = divColLg4.cloneNode();
                    divCheckBox.innerText = "له:";
                    var checkBox = document.createElement('input');
                    checkBox.setAttribute('type', 'checkbox');
                    divCheckBox.appendChild(checkBox);
                    row.appendChild(divCheckBox);
                    companyBalanceModelBody.appendChild(row);
                }
            }
        )
    }
}