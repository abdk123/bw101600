function FillBranchTable() {
    $.post(
        '_JSONGetBranch',
        function (data) {
            for (var i = 0; i < data.length; i++) {

                branchTable.row.add([
                    data[i].branchName,
                    "<span>" + data[i].countryName + "</span>" + '<input type="hidden" name="CountyID" value="' + data[i].countryid + '">',
                    data[i].branchAddress,
                    FlipBoolToYesOrNo(data[i].branchEnabled),
                    createBranchChoiceDIvDiv(data[i].branchId) + CreateBranchUpdateDiv(data[i].branchId)
                ]).draw();
            }
        }
    )
}
$('#BranchNameTxt').keyup(function () {
    var BranchNameError = document.getElementById('BranchNameError');
    if (this.value == "" && (BranchNameError.innerHTML == "يجب تعبئة حقل الأسم" || BranchNameError.innerHTML == "يجب تعبئة اختيار المدينة الأساسية")) {
        return;
    }
    BranchNameError.style.color = "black";
    if (this.value == "") {
        BranchNameError.innerHTML = "";
        return;
    }
    $.post(
        '_JSONGetSimelarBranch', {
            name: this.value
        },
        function (data) {
            if (data != 'null')
                BranchNameError.innerHTML = "هناك قسم مشابه و هو" + data.Name;
            else
                BranchNameError.innerHTML = "";
        }
    )
})
$('#addBranch').click(function () {
    var BranchNameError = document.getElementById('BranchNameError');
    var BranchNameTxt = document.getElementById('BranchNameTxt');
    var BranchcountryID = document.getElementById('BranchcountryID');
    var BranchAddress = document.getElementById('BranchAddress');
    if (BranchNameTxt.value == "") {
        BranchNameError.style.color = 'red';
        BranchNameError.innerHTML = "يجب تعبئة حقل الأسم";
        return;
    }
    if (BranchcountryID.value == "") {
        BranchNameError.style.color = 'red';
        BranchNameError.innerHTML = "يجب تعبئة اختيار المدينة الأساسية";
        return;
    }
    if (BranchAddress.value == "") {
        BranchNameError.style.color = 'red';
        BranchNameError.innerHTML = "يجب تعبئة العنوان ";
        return;
    }
    $.post(
        '_AjaxAddBranch', {
            name: BranchNameTxt.value,
            countryId: BranchcountryID.value,
            address: BranchAddress.value
        },
        function (data) {
            branchTable.row.add([
                data.branchName,
                "<span>" + data.countryName + "</span>" + '<input type="hidden" name="CountyID" value="' + data.countryid + '">',
                data.branchAddress,
                FlipBoolToYesOrNo(data.branchEnabled),
                createBranchChoiceDIvDiv(data.branchId) + CreateBranchUpdateDiv(data.branchId)
            ]).draw();
        }
    )
})
function createBranchChoiceDIvDiv(id) {
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
    viewButton.setAttribute("name", "BranchViewBtn");
    viewButton.setAttribute("onclick", "BranchViewFuncrtion(this," + id + ");");
    viewButton.innerText = "عرض";

    var editBtn = document.createElement("button");
    editDiv.appendChild(editBtn);
    editBtn.setAttribute("class", "btn btn-secondary");
    editBtn.setAttribute("name", "BranchEditBtn");
    editBtn.setAttribute("onclick", "BranchEditFuncrtion(this);");
    editBtn.innerText = "تعديل";

    var deleteBtn = document.createElement("button");
    DeleteDiv.appendChild(deleteBtn);
    deleteBtn.setAttribute("class", "btn btn-danger");
    deleteBtn.setAttribute("name", "BranchDeleteBtn");
    deleteBtn.setAttribute("onclick", "BranchDeleteFuncrtion(this," + id + ");");
    deleteBtn.innerText = "حذف";
    return choiceDIv.outerHTML;
}
function CreateBranchUpdateDiv(id) {
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
    savebtn.setAttribute("onclick", "BranchSaveFuncrtion(this," + id + ");");
    savebtn.style.width = "100px";
    savebtn.innerText = "حفظ";

    var cancelBtn = document.createElement('button');
    CancelDiv.appendChild(cancelBtn);
    cancelBtn.setAttribute("class", "btn btn-danger");
    cancelBtn.setAttribute('onclick', 'BranchCancelFuncrtion(this,' + id + ');');
    cancelBtn.innerText = "إلغاء";
    cancelBtn.style.width = "100px";
    CancelDiv.appendChild(cancelBtn);

    return updateDiv.outerHTML;
}
function BranchViewFuncrtion(element, id) {
    alert('view' + id);
}
function BranchDeleteFuncrtion(element, id) {
    $.confirm({
        title: "تأكيد",
        content: "ملاحظة: لا يكمنك حذف فرع مرتبط بها شيئ ",
        buttons: {
            تأكيد: function () {
                $.post(
                    '_AjaxDeleteBranch', {
                        id: id,
                    },
                    function (data) {
                        console.log(data);
                        if (data == 'True') {
                            var row = element.parentElement.parentElement.parentElement.parentElement;
                            branchTable.row(row).remove().draw();
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

var BranchName;
var BranchStatus;
var BranchAddress;
var BranchCountryID;
var BranchCountryName;

function BranchEditFuncrtion(element) {
    var ChoicDive = element.parentElement.parentElement;
    ChoicDive.style.display = "none";
    var UpdateDiv = ChoicDive.nextSibling;
    UpdateDiv.style.display = "block";

    var row = ChoicDive.parentElement.parentElement;

    var nameTd = row.getElementsByTagName("td")[0];
    BranchName = nameTd.innerText;

    var addressTd = row.getElementsByTagName("td")[2];
    BranchAddress = addressTd.innerText;

    var enabledTd = row.getElementsByTagName("td")[3];
    BranchStatus = FlipYesOrNoToBoolean(enabledTd.innerText);

    var countryTd = row.getElementsByTagName("td")[1];
    BranchCountryName = countryTd.getElementsByTagName("span")[0].innerText;
    BranchCountryID = countryTd.getElementsByTagName("input")[0].value;


    var nameText = document.createElement("input");
    nameText.setAttribute("type", "text");
    nameText.setAttribute("class", "form-control");
    var addressText = nameText.cloneNode();

    nameTd.innerText = "";
    nameText.value = BranchName;
    nameTd.appendChild(nameText);

    addressText.value = BranchAddress;
    addressTd.innerText = "";
    addressTd.appendChild(addressText);

    var checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.checked = BranchStatus;


    enabledTd.innerText = "";
    enabledTd.appendChild(checkBox);


    var DropDownList = document.createElement("select");
    countryTd.innerText = "";
    $.post(
        '_JsonAllCountry',
        function (data) {
            for (var i = 0; i < data.length; i++) {
                var option = document.createElement("option");
                option.value = data[i].id;
                option.innerText = data[i].Name;
                if (data[i].id == BranchCountryID)
                    option.selected = true;
                DropDownList.appendChild(option);
            }
        }
    );
    countryTd.appendChild(DropDownList);
    var ProvinceEditBtn = document.getElementsByName("BranchEditBtn");
    var ProvinceViewBtn = document.getElementsByName("BranchViewBtn");
    var ProvinceDeleteBtn = document.getElementsByName("BranchDeleteBtn");
    for (var i = 0; i < ProvinceDeleteBtn.length; i++) {
        ProvinceEditBtn[i].disabled = ProvinceViewBtn[i].disabled = ProvinceDeleteBtn[i].disabled = true;
    }
}
function BranchCancelFuncrtion(element) {
    var UpdateDiv = element.parentElement.parentElement;
    UpdateDiv.style.display = "none";
    var ChoicDiv = UpdateDiv.previousElementSibling;
    ChoicDiv.style.display = "block";
    var BranchEditBtn = document.getElementsByName("BranchEditBtn");
    var BranchViewBtn = document.getElementsByName("BranchViewBtn");
    var BranchDeleteBtn = document.getElementsByName("BranchDeleteBtn");
    for (var i = 0; i < BranchViewBtn.length; i++) {
        BranchEditBtn[i].disabled = BranchViewBtn[i].disabled = BranchDeleteBtn[i].disabled = false;
    }

    var row = ChoicDiv.parentElement.parentElement;
    var nameTd = row.getElementsByTagName("td")[0];
    nameTd.inneHtml = "";
    nameTd.innerText = BranchName;

    var enabledTd = row.getElementsByTagName("td")[3];
    enabledTd.inneHtml = "";
    enabledTd.innerText = FlipBoolToYesOrNo(BranchStatus);


    var countryTd = row.getElementsByTagName("td")[1];
    countryTd.innerHTML = '';
    countryTd.innerHTML = "<span>" + BranchCountryName + "</span>";
    countryTd.innerHTML += '<input type="hidden" name="CountyID" value="' + BranchCountryID + '">';
    BranchCountryID


    var addressTd = row.getElementsByTagName("td")[2];
    addressTd.innerHTML = "";
    addressTd.innerText = BranchAddress;
    BranchName = undefined;
    BranchStatus = undefined;
    BranchCountryID = undefined;
    BranchAddress = undefined;
    BranchCountryName = undefined;
}
function BranchSaveFuncrtion(element, id) {
    var row = element.parentElement.parentElement.parentElement.parentElement;
    var nameTd = row.getElementsByTagName("td")[0];
    var countryTd = row.getElementsByTagName("td")[1];
    var enabledTd = row.getElementsByTagName("td")[3];
    var addressTd = row.getElementsByTagName("td")[2];
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
    var newAddress = addressTd.getElementsByTagName("input")[0].value;
    if (newAddress == "") {
        $.confirm(
            {
                title: 'خطاء',
                content: 'لا يمكن ان يكون حقل العنوان فارغ',
                buttons: {
                    موافق: function () {
                    }
                }
            }
        );
        return;
    }
    var newStatus = enabledTd.getElementsByTagName("input")[0].checked;
    var Select = countryTd.getElementsByTagName('select')[0];
    var countryID = countryTd.getElementsByTagName("select")[0].value;
    var countryName = Select.options[Select.selectedIndex].text;
    BranchAddress
    if (newName == BranchName && BranchStatus == newStatus && BranchCountryID == countryID && BranchAddress == newAddress) {
        BranchCancelFuncrtion(element);
        return;
    }
    $.post(
        '_JSONGetSimelarBranch', {
            name: newName,
            id: id
        },
        function (data) {
            console.log(data);
            if (data != "null") {
                $.confirm({
                    title: "تنبيه!",
                    content: "هناك فرع مشابهة  ",
                    buttons: {
                        تأكيد: function () {
                            $.post(
                                '_AjaxUpdateBranch', {
                                    id: id,
                                    name: newName,
                                    address: newAddress,
                                    enabled: newStatus,
                                    countryid: countryID,
                                },
                                function (data) {
                                    if (data == 'True') {
                                        BranchName = newName;
                                        BranchAddress = newAddress;
                                        BranchStatus = newStatus;
                                        BranchCountryID = countryID;
                                        BranchCountryName = countryName;
                                        BranchCancelFuncrtion(element);
                                    }
                                }
                            )
                        }
                        ,
                        إلغاء: function () {

                            BranchCancelFuncrtion(element);
                        }
                    }
                })
            } else {
                $.post(
                    '_AjaxUpdateBranch', {
                        id: id,
                        name: newName,
                        address: newAddress,
                        enabled: newStatus,
                        countryid: countryID,
                    },
                    function (data) {
                        if (data == 'True') {
                            BranchName = newName;
                            BranchAddress = newAddress;
                            BranchStatus = newStatus;
                            BranchCountryID = countryID;
                            BranchCountryName = countryName;
                            BranchCancelFuncrtion(element);
                        }
                    }
                )
            }
        }
    )
}
