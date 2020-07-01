let ProvinveModlRow = document.getElementById('ProvinveModlRow');
let ProvinveModlDivInectance = ProvinveModlRow.getElementsByTagName('div')[0].cloneNode(true);
function GetProvinveNameInsideCountryModel() {
    var divs = ProvinveModlRow.getElementsByClassName('ProvinveModlDiv');
    var pName = [];
    for (var i = 0; i < divs.length; i++) {
        var input = divs[i].getElementsByTagName('input')[0];
        if (input.value != "") {
            pName.push(input.value);
        }
    }
    return pName;
}
function FillCountryTable() {
    $.post(
        "_JsonCountry",
        function (data) {
            for (var i = 0; i < data.length; i++) {
                CountryTable.row.add([
                    data[i].Name,
                    FlipBoolToYesOrNo(data[i].IsEnabled),
                    CreateCountryChoicFunction(data[i].Id) + CreateCountryUpdateDiv(data[i].Id)
                ]).draw();
            }
            CountryPrivleges();
        }
    )
}

function CountryPrivleges() {
    if (!HavePrivlege(priveleges.updateCountry)) {
        var GroupEditBtn = document.getElementsByName('CountryEditBtn');
        for (var i = 0; i < GroupEditBtn.length; i++) {
            GroupEditBtn[i].style = "visibility:hidden;";
        }
    }
    if (!HavePrivlege(priveleges.deleteCountry)) {
        var GroupDeleteBtn = document.getElementsByName('CountryDeleteBtn');
        for (var i = 0; i < GroupEditBtn.length; i++) {
            GroupDeleteBtn[i].style = "visibility:hidden;";
        }
    }
}
function CreateCountryChoicFunction(id) {
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
    viewButton.setAttribute("name", "CountryViewBtn");
    viewButton.innerText = "عرض";

    var editBtn = document.createElement("button");
    editDiv.appendChild(editBtn);
    editBtn.setAttribute("class", "btn btn-secondary");
    editBtn.setAttribute("name", "CountryEditBtn");
    editBtn.setAttribute("onclick", "CountryEditFuncrtion(this);");
    editBtn.innerText = "تعديل";

    var deleteBtn = document.createElement("button");
    DeleteDiv.appendChild(deleteBtn);
    deleteBtn.setAttribute("class", "btn btn-danger");
    deleteBtn.setAttribute("name", "CountryDeleteBtn");
    deleteBtn.setAttribute("onclick", "CountryDeleteFuncrtion(this," + id + ");");
    deleteBtn.innerText = "حذف";
    return choiceDIv.outerHTML;
}
function CreateCountryUpdateDiv(id) {
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
    savebtn.setAttribute("onclick", "CountrySaveFuncrtion(this," + id + ");");
    savebtn.style.width = "100px";
    savebtn.innerText = "حفظ";

    var cancelBtn = document.createElement('button');
    CancelDiv.appendChild(cancelBtn);
    cancelBtn.setAttribute("class", "btn btn-danger");
    cancelBtn.setAttribute('onclick', 'CountryCancelFuncrtion(this,' + id + ');');
    cancelBtn.innerText = "إلغاء";
    cancelBtn.style.width = "100px";
    CancelDiv.appendChild(cancelBtn);

    return updateDiv.outerHTML;
}
var CountryName;
var CountryStatus;
function CountryEditFuncrtion(element) {
    var ChoicDive = element.parentElement.parentElement;
    ChoicDive.style.display = "none";
    var UpdateDiv = ChoicDive.nextSibling;
    UpdateDiv.style.display = "block";

    var row = ChoicDive.parentElement.parentElement;

    var nameTd = row.getElementsByTagName("td")[0];
    CountryName = nameTd.innerText;


    var enabledTd = row.getElementsByTagName("td")[1];
    CountryStatus = FlipYesOrNoToBoolean(enabledTd.innerText);


    var nameText = document.createElement("input");
    nameText.setAttribute("type", "text");
    nameText.setAttribute("class", "form-control");

    nameTd.innerText = "";
    nameText.value = CountryName;
    nameTd.appendChild(nameText);

    var checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.checked = CountryStatus;


    enabledTd.innerText = "";
    enabledTd.appendChild(checkBox);

    var CountryEditBtn = document.getElementsByName("CountryViewBtn");
    var CountryViewBtn = document.getElementsByName("CountryEditBtn");
    var CountryeDeleteBtn = document.getElementsByName("CountryDeleteBtn");
    for (var i = 0; i < CountryeDeleteBtn.length; i++) {
        CountryEditBtn[i].disabled = CountryViewBtn[i].disabled = CountryeDeleteBtn[i].disabled = true;
    }
}

function CountryCancelFuncrtion(element) {
    var UpdateDiv = element.parentElement.parentElement;
    UpdateDiv.style.display = "none";
    var ChoicDiv = UpdateDiv.previousElementSibling;
    ChoicDiv.style.display = "block";
    var CountryEditBtn = document.getElementsByName("CountryViewBtn");
    var CountryViewBtn = document.getElementsByName("CountryEditBtn");
    var CountryeDeleteBtn = document.getElementsByName("CountryDeleteBtn");
    for (var i = 0; i < CountryeDeleteBtn.length; i++) {
        CountryEditBtn[i].disabled = CountryViewBtn[i].disabled = CountryeDeleteBtn[i].disabled = false;
    }

    var row = ChoicDiv.parentElement.parentElement;
    var nameTd = row.getElementsByTagName("td")[0];
    nameTd.inneHtml = "";
    nameTd.innerText = CountryName;

    var enabledTd = row.getElementsByTagName("td")[1];
    enabledTd.inneHtml = "";
    enabledTd.innerText = FlipBoolToYesOrNo(CountryStatus);
    CountryName = undefined;
    CountryStatus = undefined;
}

$("#jsonAddCountrybtn").click(function () {
    var textBox = document.getElementById("countryNameTxt");
    var CountyNameError = document.getElementById("CountyNameError");
    if (textBox.value === "") {
        CountyNameError.innerHTML = "يجب تعبئة الحقل";
        CountyNameError.style.color = 'red';
        return;
    }
    var provinousNames = GetProvinveNameInsideCountryModel();
    var country = new AddCountry(textBox.value, provinousNames);

    $.ajax({
        url: rootPath + "Country/AddCountry",
        type: "post",
        contentType: "application/json;charset=utf-8",
        data: "{addCountry:" + JSON.stringify(country) + "}",
        success: function (data) {
            if (data != "null") {
                FillCompanyCountrySelect();
                CountryTable.row.add([
                    data.Name,
                    FlipBoolToYesOrNo(data.IsEnabled),
                    CreateCountryChoicFunction(data.Id) + CreateCountryUpdateDiv(data.Id)
                ]).draw();
                textBox.value = "";
                CountryPrivleges();
                FillprovinceCountreySelect();
                FillProvinceTable();
                $('#ProvinveModlRow').empty();
                ProvinveModlRow.appendChild(ProvinveModlDivInectance.cloneNode(true));
            } else {
                $.dialog({
                    title: "خطاء",
                    content: "يرجى أعادة تحميل الصفحة و إعادة المحاولة"
                });
            }
        },
        error: function () {
            $.dialog({
                title: "خطاء",
                content: "يرجى أعادة تحميل الصفحة و إعادة المحاولة"
            });
        }
    })
    //$.post(
    //    '/Country/AddCountry', {

    //    },
    //    function (data) {
    //        if (data != "null") {
    //            FillCompanyCountrySelect();
    //            CountryTable.row.add([
    //                data.Name,
    //                FlipBoolToYesOrNo(data.IsEnabled),
    //                CreateCountryChoicFunction(data.Id) + CreateCountryUpdateDiv(data.Id)
    //            ]).draw();
    //            textBox.value = "";
    //            CountryPrivleges();
    //            FillprovinceCountreySelect();
    //        } else {
    //            $.dialog({
    //                title: "خطاء",
    //                content: "يرجى أعادة تحميل الصفحة و إعادة المحاولة"
    //            });
    //        }
    //    }
    //);
});
//<summary>
//check the simelar country if exist 
//<erorr>
//don't work
$("#countryNameTxt").keyup(function () {
    var CountyNameError = document.getElementById("CountyNameError");

    if (this.value === "" && CountyNameError.innerHTML === "يجب تعبئة الحقل") {
        return;
    }
    if (this.value === "") {
        CountyNameError.innerHTML = "";
        CountyNameError.innerText = "";
        return;
    }
    if (CountyNameError.innerHTML === "يجب تعبئة الحقل") {
        CountyNameError.innerHTML = "";
        CountyNameError.style.color = "black";
    }
    $.post(
        '_JsonSimelarCountry', {
            name: this.value,
        },
        function (data) {
            if (data === "null") {
                CountyNameError.innerHTML = "";
            } else {
                // use data as array becase it is a dynamic prop
                CountyNameError.innerHTML = "يوجد مدينة مشابهة و هي : <a href=/bw_countrys/Details/" + data[0].Value + ">" + data[1].Value + "</a>";
            }
        });

});


function CountryDeleteFuncrtion(element, id) {
    $.confirm({
        title: 'تأكيد!',
        content: 'هل انت متأكد من حذف هذه المنطقة <br>ملاحظة لا تستطيع حذف منطقة مرتبط بها فرع او شركة او عميل',
        buttons: {
            تأكيد: function () {
                $.ajax({
                    url: "/System/_AjaxDeleteCountry",
                    data: { id: id },
                    type: "post",
                    success: function (data) {
                        if (data === "True") {
                            var row = element.parentElement.parentElement.parentElement.parentElement;
                            CountryTable.row(row).remove().draw();
                            FillprovinceCountreySelect();
                            return;
                        }
                        else {
                            $.dialog({
                                title: 'خطاء',
                                content: 'لا يمكنك مسح هذه المنطقة',
                            });
                        }
                    }
                }
                )

            },
            إلغاء: function () {
                return;
            }
        }
    })
}

function CountrySaveFuncrtion(element, id) {
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
    if (newName == CountryName && CountryStatus == newStatus) {
        CountryCancelFuncrtion(element);
        return;
    }
    $.post(
        '_JsonSimelarCountry', {
            name: newName,
            id: id
        },
        function (data) {
            if (data === "null") {
                $.post(
                    '_AjaxUpdateCounty', {
                        id: id,
                        name: newName,
                        Status: newStatus,
                    },
                    function (data) {
                        if (data === "True") {
                            CountryName = newName;
                            CountryStatus = newStatus;
                            CountryCancelFuncrtion(element);
                            FillprovinceCountreySelect();
                            alert("تعم التعديل");
                        } else {
                            CountryCancelFuncrtion(element);
                            alert("لم يتم العتديل هناك خطاء ما حاول مجدداً");
                        }
                    }
                );
            } else {
                $.confirm({
                    title: 'تأكيد !',
                    content: 'هناك منطقة تحمل نفس الأسم هل انت متأكد من التعديل ؟',
                    buttons: {
                        تأكيد: function () {
                            $.post(
                                '_AjaxUpdateCounty', {
                                    id: id,
                                    name: newName,
                                    Status: newStatus,
                                },
                                function (data) {
                                    if (data === "True") {
                                        CountryName = newName;
                                        CountryStatus = newStatus;
                                        CountryCancelFuncrtion(element);

                                        FillprovinceCountreySelect();
                                        alert("تعم التعديل");
                                    } else {
                                        CountryCancelFuncrtion(element);
                                        alert("لم يتم العتديل هناك خطاء ما حاول مجدداً");
                                    }
                                }
                            );
                        },
                        إلغاء: function () {
                            CountryCancelFuncrtion(element);
                        }
                    }
                });
            }
        });
}
$('#addProvinceTextBtn').click(function () {
    var divs = ProvinveModlRow.getElementsByClassName('ProvinveModlDiv');
    
    if (divs.length != 0) {

        var lastDiv = divs[divs.length - 1];
        var pTextName = lastDiv.getElementsByTagName('input')[0];
        if (pTextName.value == "") {
            return;
        }
    }
    ProvinveModlRow.appendChild(ProvinveModlDivInectance.cloneNode(true));
});
$('#closeprovinceModel').click(function () {
    $('#ProvinveModlRow').empty();
    ProvinveModlRow.appendChild(ProvinveModlDivInectance.cloneNode(true));
});