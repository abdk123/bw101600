var provinceCountreySelect = document.getElementById('provinceCountreySelect');
function FillprovinceCountreySelect() {
    provinceCountreySelect.innerHTML = "";
    var Mainoption = document.createElement("option");
    Mainoption.setAttribute("value", "");
    Mainoption.innerText = "الرجاء اختيار البلد الأساسي";
    provinceCountreySelect.appendChild(Mainoption);
    $.post(
        "_JsonCountry",
        function (data) {
            FillCompanyCountrySelect();
            for (var i = 0; i < data.length; i++) {
                var option = document.createElement('option');
                option.innerText = data[i].Name;
                option.setAttribute('value', data[i].Id);
                if (!data[i].IsEnabled)
                    option.disabled = true;
                provinceCountreySelect.appendChild(option);
            }
        }
    )
}
$('#addProvince').click(function () {
    var ProvinceNameTxt = document.getElementById('ProvinceNameTxt');
    var ProvinceNameError = document.getElementById('ProvinceNameError');
    if (ProvinceNameTxt.value == "") {
        ProvinceNameError.style.color = "red";
        ProvinceNameError.innerHTML = "يجب تعبئة حقل الأسم";
        return;
    }
    var ProvincecountryID = document.getElementById('provinceCountreySelect');
    if (ProvincecountryID.value == "") {
        ProvinceNameError.style.color = "red";
        ProvinceNameError.innerHTML = "يجب تعبئة اختيار المدينة الأساسية";
    }

    $.post(
        '_AjaxAddProvince', {
            name: ProvinceNameTxt.value,
            countryID: ProvincecountryID.value
        },
        function (data) {
            FillCompanyCountrySelect();
            ProvinceTable.row.add([
                data[1].Value,
                "<span>" + data[4].Value + "</span>" + '<input type="hidden" name="CountyID" value="' + data[3].Value + '">',
                FlipBoolToYesOrNo(data[2].Value),
                createProvinceChoiceDiv(data[0].Value) + CreateProvinceUpdateDiv(data[0].Value)
            ]).draw();
        }
    );
    ProvinceNameTxt.value = "";
    ProvincecountryID.value == "";

});
$('#ProvinceNameTxt').keyup(function () {
    if (this.value == "" && (ProvinceNameError.innerHTML == "يجب تعبئة حقل الأسم" || ProvinceNameError.innerHTML == "يجب تعبئة اختيار المدينة الأساسية")) {
        return;
    }
    if (this.value == "") {
        ProvinceNameError.style.color = "black";
        ProvinceNameError.innerHTML = "";
        return;
    }
    ProvinceNameError.style.color = "balck";
    $.post(
        '_JSONGetSimelarProvince', {
            name: this.value
        },
        function (data) {
            if (data == 'null') {
                ProvinceNameError.innerHTML = "";
            } else {
                ProvinceNameError.innerHTML = "هناك مدينة مشابهة وهي " + data[1].Value + " الموجودة في " + data[3].Value;
            }
        }
    )
});
function FillProvinceTable() {
    ProvinceTable.clear().draw();
    $.post(
        '_JSONGetProvince',
        function (data) {
            for (var i = 0; i < data.length; i++) {
                ProvinceTable.row.add([
                    data[i][1].Value,
                    "<span>" + data[i][4].Value + "</span>" + '<input type="hidden" name="CountyID" value="' + data[i][3].Value + '">',
                    FlipBoolToYesOrNo(data[i][2].Value),
                    createProvinceChoiceDiv(data[i][0].Value) + CreateProvinceUpdateDiv(data[i][0].Value)
                ]).draw();
            }
        }
    );
}
function createProvinceChoiceDiv(id) {
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
    viewButton.setAttribute("name", "ProvinceViewBtn");
    viewButton.setAttribute("onclick", "ProvinceViewFuncrtion(this," + id + ");");
    viewButton.innerText = "عرض";

    var editBtn = document.createElement("button");
    editDiv.appendChild(editBtn);
    editBtn.setAttribute("class", "btn btn-secondary");
    editBtn.setAttribute("name", "ProvinceEditBtn");
    editBtn.setAttribute("onclick", "ProvinceEditFuncrtion(this);");
    editBtn.innerText = "تعديل";

    var deleteBtn = document.createElement("button");
    DeleteDiv.appendChild(deleteBtn);
    deleteBtn.setAttribute("class", "btn btn-danger");
    deleteBtn.setAttribute("name", "ProvinceDeleteBtn");
    deleteBtn.setAttribute("onclick", "ProvinceDeleteFuncrtion(this," + id + ");");
    deleteBtn.innerText = "حذف";
    return choiceDIv.outerHTML;
}
function CreateProvinceUpdateDiv(id) {
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
    savebtn.setAttribute("onclick", "ProvinceSaveFuncrtion(this," + id + ");");
    savebtn.style.width = "100px";
    savebtn.innerText = "حفظ";

    var cancelBtn = document.createElement('button');
    CancelDiv.appendChild(cancelBtn);
    cancelBtn.setAttribute("class", "btn btn-danger");
    cancelBtn.setAttribute('onclick', 'ProvinceCancelFuncrtion(this,' + id + ');');
    cancelBtn.innerText = "إلغاء";
    cancelBtn.style.width = "100px";
    CancelDiv.appendChild(cancelBtn);

    return updateDiv.outerHTML;
}
function ProvinceViewFuncrtion(element, id) {
    alert('view' + id);
}
function ProvinceDeleteFuncrtion(element, id) {
    $.confirm({
        title: "تأكيد",
        content: "ملاحظة: لا يكمنك حذف محافظة مرتبط بها شيئ ",
        buttons: {
            تأكيد: function () {
                $.post(
                    '_AjaxDeleteProvince', {
                        id: id,
                    },
                    function (data) {
                        if (data == 'True') {
                            var row = element.parentElement.parentElement.parentElement.parentElement;
                            ProvinceTable.row(row).remove().draw();
                        } else {
                            $.confirm({
                                title: "حدث خطاء",
                                content: "ربما هناك ما هو مرتبط بها (:",
                                buttons: {
                                    موافق: function () {

                                    }
                                }
                            })
                        }
                    }
                )
            },
            إلغاء: function () {
            }
        }
    });
}


var provinceName;
var ProvinceStatus;
var ProvinceCountryID;
var ProvinceCountryName;

function ProvinceEditFuncrtion(element) {
    var ChoicDive = element.parentElement.parentElement;
    ChoicDive.style.display = "none";
    var UpdateDiv = ChoicDive.nextSibling;
    UpdateDiv.style.display = "block";

    var row = ChoicDive.parentElement.parentElement;

    var nameTd = row.getElementsByTagName("td")[0];
    provinceName = nameTd.innerText;

    var enabledTd = row.getElementsByTagName("td")[2];
    ProvinceStatus = FlipYesOrNoToBoolean(enabledTd.innerText);

    var countryTd = row.getElementsByTagName("td")[1];
    ProvinceCountryName = countryTd.getElementsByTagName("span")[0].innerText;
    ProvinceCountryID = countryTd.getElementsByTagName("input")[0].value;

    var nameText = document.createElement("input");
    nameTd.innerText = "";
    nameText.setAttribute("type", "text");
    nameText.setAttribute("class", "form-control");
    nameText.value = provinceName;
    nameTd.appendChild(nameText);

    var checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.checked = ProvinceStatus;

    enabledTd.innerText = "";
    enabledTd.appendChild(checkBox);


    var DropDownList = document.createElement("select");
    DropDownList.setAttribute("class", "form-control");
    countryTd.innerText = "";
    
    $.post(
        '_JsonCountry',
        function (data) {
            
            for (var i = 0; i < data.length; i++) {
                var option = document.createElement("option");
                option.value = data[i].Id;
                option.innerText = data[i].Name;
                if (data[i].id == ProvinceCountryID)
                    option.selected = true;
                if (!data[i].IsEnabled)
                    option.disabled = true;
                DropDownList.appendChild(option);
            }
        }
    );
    countryTd.appendChild(DropDownList);
    var ProvinceEditBtn = document.getElementsByName("ProvinceEditBtn");
    var ProvinceViewBtn = document.getElementsByName("ProvinceViewBtn");
    var ProvinceDeleteBtn = document.getElementsByName("ProvinceDeleteBtn");
    for (var i = 0; i < ProvinceDeleteBtn.length; i++) {
        ProvinceEditBtn[i].disabled = ProvinceViewBtn[i].disabled = ProvinceDeleteBtn[i].disabled = true;
    }
}
function ProvinceCancelFuncrtion(element, id) {

    
    var UpdateDiv = element.parentElement.parentElement;
    UpdateDiv.style.display = "none";
    var ChoicDiv = UpdateDiv.previousElementSibling;
    ChoicDiv.style.display = "block";   
    var ProvinceEditBtn = document.getElementsByName("ProvinceEditBtn");
    var ProvinceViewBtn = document.getElementsByName("ProvinceViewBtn");
    var ProvinceDeleteBtn = document.getElementsByName("ProvinceDeleteBtn");
    for (var i = 0; i < ProvinceDeleteBtn.length; i++) {
        ProvinceEditBtn[i].disabled = ProvinceViewBtn[i].disabled = ProvinceDeleteBtn[i].disabled = false;
    }
    var row = ChoicDiv.parentElement.parentElement;
    var nameTd = row.getElementsByTagName("td")[0];
    nameTd.inneHtml = "";
    nameTd.innerText = provinceName;

    var enabledTd = row.getElementsByTagName("td")[2];
    enabledTd.inneHtml = "";
    enabledTd.innerText = FlipBoolToYesOrNo(ProvinceStatus);

    var countryTd = row.getElementsByTagName("td")[1];
    countryTd.innerHTML = '';
    countryTd.innerHTML = "<span>" + ProvinceCountryName + "</span>";
    countryTd.innerHTML += '<input type="hidden" name="CountyID" value="' + ProvinceCountryID + '">';
    provinceName = undefined;
    ProvinceStatus = undefined;
    ProvinceCountryID = undefined;
    ProvinceCountryName = undefined;
}
function ProvinceSaveFuncrtion(element, id) {
    var row = element.parentElement.parentElement.parentElement.parentElement;
    var nameTd = row.getElementsByTagName("td")[0];
    var countryTd = row.getElementsByTagName("td")[1];
    var enabledTd = row.getElementsByTagName("td")[2];

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
        )
        return;
    }
    var newStatus = enabledTd.getElementsByTagName("input")[0].checked;
    var Select = countryTd.getElementsByTagName('select')[0];

    var countryID = countryTd.getElementsByTagName("select")[0].value;
    var countryName = Select.options[Select.selectedIndex].text;
    if (newName == provinceName && ProvinceStatus == newStatus && ProvinceCountryID == countryID) {
        ProvinceCancelFuncrtion(element);
        return;
    }
    $.post(
        '_JSONGetSimelarProvince', {
            name: newName,
            id: id
        },
        function (data) {
            if (data != "null") {
                $.confirm({
                    title: "تنبيه!",
                    content: "هناك مدينة مشابهة وهي " + data[1].Value + " الموجودة في " + data[3].Value,
                    buttons: {
                        تأكيد: function () {
                            $.post(
                                '_AjaxUpdateProvince', {
                                    id: id,
                                    name: newName,
                                    enabled: newStatus,
                                    countryid: countryID,
                                },
                                function (data) {
                                    if (data == 'True') {
                                        provinceName = newName;
                                        ProvinceStatus = newStatus;
                                        ProvinceCountryID = countryID;
                                        ProvinceCountryName = countryName;
                                        ProvinceCancelFuncrtion(element);
                                    }
                                }
                            )
                        }
                        ,
                        إلغاء: function () {

                            ProvinceCancelFuncrtion(element);
                        }
                    }
                })
            } else {
                $.post(
                    '_AjaxUpdateProvince', {
                        id: id,
                        name: newName,
                        enabled: newStatus,
                        countryid: countryID,
                    },
                    function (data) {
                        if (data == 'True') {
                            provinceName = newName;
                            ProvinceStatus = newStatus;
                            ProvinceCountryID = countryID;
                            ProvinceCountryName = countryName;
                            ProvinceCancelFuncrtion(element);
                        }
                    }
                )
            }
        }
    )
}
