$('#RevenueNameTxt').keyup(function () {
    var RevenueNameError = document.getElementById('RevenueNameError');
    if (this.value == "" && RevenueNameError.innerHTML == "يجب تعبئة حقل الأسم") {
        return;
    }
    RevenueNameError.style.color = "black";
    if (this.value == "") {
        RevenueNameError.innerHTML = "";
        return;
    }

    $.post(
        '_JsonSimelarRevenues', {
            name: this.value
        },
        function (data) {
            if (data != 'null')
                RevenueNameError.innerHTML = "هناك قسم ايراد و هو " + data.Name;
            else
                RevenueNameError.innerHTML = "";
        }
    );
    
})
$('#RevenueAddBtn').click(function () {
    var RevenueNameError = document.getElementById('RevenueNameError');
    var RevenueNameTxt = document.getElementById('RevenueNameTxt');
    if (RevenueNameTxt.value == "") {
        RevenueNameError.style.color = "red";
        RevenueNameError.innerHTML = "يجب تعبئة حقل الأسم";
        return;
    }
    $.post(
        '_AjxaAddRevenues', {
            name: RevenueNameTxt.value,
        },
        function (data) {
            if (data != "false") {
                RevenueTable.row.add([
                    data.Name,
                    FlipBoolToYesOrNo(data.IsEnabled),
                    createRevenueChoiceDIvDiv(data.Id) + CreateRevenueUpdateDiv(data.Id)
                ]).draw();
            }
            RevenueNameTxt.value = "";
        }
    )


});

function FillRevenueTable() {
    $.post(
        '_JsonGetRevenues',
        function (data) {
            for (var i = 0; i < data.length; i++) {
                RevenueTable.row.add([
                    data[i].Name,
                    FlipBoolToYesOrNo(data[i].IsEnabled),
                    createRevenueChoiceDIvDiv(data[i].Id) + CreateRevenueUpdateDiv(data[i].Id)
                ]).draw();
            }
        }
    )
};

function createRevenueChoiceDIvDiv(id) {
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
    viewButton.setAttribute("name", "RevenueViewBtn");
    viewButton.setAttribute("onclick", "RevenueViewFuncrtion(this," + id + ");");
    viewButton.innerText = "عرض";

    var editBtn = document.createElement("button");
    editDiv.appendChild(editBtn);
    editBtn.setAttribute("class", "btn btn-secondary");
    editBtn.setAttribute("name", "RevenueEditBtn");
    editBtn.setAttribute("onclick", "RevenueEditFuncrtion(this);");
    editBtn.innerText = "تعديل";

    var deleteBtn = document.createElement("button");
    DeleteDiv.appendChild(deleteBtn);
    deleteBtn.setAttribute("class", "btn btn-danger");
    deleteBtn.setAttribute("name", "RevenueDeleteBtn");
    deleteBtn.setAttribute("onclick", "RevenueDeleteFuncrtion(this," + id + ");");
    deleteBtn.innerText = "حذف";
    return choiceDIv.outerHTML;
}


function CreateRevenueUpdateDiv(id) {
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
    savebtn.setAttribute("onclick", "RevenueSaveFuncrtion(this," + id + ");");
    savebtn.style.width = "100px";
    savebtn.innerText = "حفظ";

    var cancelBtn = document.createElement('button');
    CancelDiv.appendChild(cancelBtn);
    cancelBtn.setAttribute("class", "btn btn-danger");
    cancelBtn.setAttribute('onclick', 'RevenueCancelFuncrtion(this,' + id + ');');
    cancelBtn.innerText = "إلغاء";
    cancelBtn.style.width = "100px";
    CancelDiv.appendChild(cancelBtn);
    return updateDiv.outerHTML;
}

function RevenueDeleteFuncrtion(element, id) {
    $.confirm({
        title: "تأكيد",
        content: "ملاحظة: لا يكمنك حذف نوع الإيرادات إذا كان  مرتبط بها شيئ ",
        buttons: {
            تأكيد: function () {
                $.post(
                    '_AjaxDeleteRevenue', {
                        id: id,
                    },
                    function (data) {
                        if (data == 'True') {
                            var row = element.parentElement.parentElement.parentElement.parentElement;
                            RevenueTable.row(row).remove().draw();
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

var RevenueName;
var RevenueStatus;

function RevenueEditFuncrtion(element) {
    var ChoicDive = element.parentElement.parentElement;
    ChoicDive.style.display = "none";
    var UpdateDiv = ChoicDive.nextSibling;
    UpdateDiv.style.display = "block";

    var row = ChoicDive.parentElement.parentElement;

    var nameTd = row.getElementsByTagName("td")[0];
    RevenueName= nameTd.innerText;


    var enabledTd = row.getElementsByTagName("td")[1];
    RevenueStatus = FlipYesOrNoToBoolean(enabledTd.innerText);


    var nameText = document.createElement("input");
    nameText.setAttribute("type", "text");
    nameText.setAttribute("class", "form-control");

    nameTd.innerText = "";
    nameText.value = RevenueName;
    nameTd.appendChild(nameText);


    var checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.checked = RevenueStatus;


    enabledTd.innerText = "";
    enabledTd.appendChild(checkBox);

    var ProvinceEditBtn = document.getElementsByName("RevenueEditBtn");
    var ProvinceViewBtn = document.getElementsByName("RevenueViewBtn");
    var ProvinceDeleteBtn = document.getElementsByName("RevenueDeleteBtn");
    for (var i = 0; i < ProvinceDeleteBtn.length; i++) {
        ProvinceEditBtn[i].disabled = ProvinceViewBtn[i].disabled = ProvinceDeleteBtn[i].disabled = true;
    }
}


function RevenueCancelFuncrtion(element) {
    var UpdateDiv = element.parentElement.parentElement;
    UpdateDiv.style.display = "none";
    var ChoicDiv = UpdateDiv.previousElementSibling;
    ChoicDiv.style.display = "block";
    var BranchEditBtn = document.getElementsByName("RevenueEditBtn");
    var BranchViewBtn = document.getElementsByName("RevenueViewBtn");
    var BranchDeleteBtn = document.getElementsByName("RevenueDeleteBtn");
    for (var i = 0; i < BranchViewBtn.length; i++) {
        BranchEditBtn[i].disabled = BranchViewBtn[i].disabled = BranchDeleteBtn[i].disabled = false;
    }

    var row = ChoicDiv.parentElement.parentElement;
    var nameTd = row.getElementsByTagName("td")[0];
    nameTd.inneHtml = "";
    nameTd.innerText = RevenueName;

    var enabledTd = row.getElementsByTagName("td")[1];
    enabledTd.inneHtml = "";
    enabledTd.innerText = FlipBoolToYesOrNo(RevenueStatus);
    
    RevenueName = undefined;
    RevenueStatus = undefined;
}


function RevenueSaveFuncrtion(element, id) {
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
    if (newName == RevenueName && RevenueStatus == newStatus){
        RevenueCancelFuncrtion(element);
        return;
    }
    $.post(
        '_JsonSimelarRevenues', {
            name: newName,
            id: id
        },
        function (data) {
            if (data != "null") {
                $.confirm({
                    title: "تنبيه!",
                    content: "هناك ايراد مشابهة  ",
                    buttons: {
                        تأكيد: function () {
                            $.post(
                                '_AjaxUpdateRevenue', {
                                    id: id,
                                    name: newName,
                                    enable: newStatus,
                                },
                                function (data) {
                                    if (data == 'True') {
                                        RevenueName = newName;
                                        RevenueStatus = newStatus;
                                        RevenueCancelFuncrtion(element);
                                    }
                                }
                            )
                        }
                        ,
                        إلغاء: function () {

                            RevenueCancelFuncrtion(element);
                        }
                    }
                })
            } else {
                $.post(
                    '_AjaxUpdateRevenue', {
                        id: id,
                        name: newName,
                        enable: newStatus,
                    },
                    function (data) {
                        if (data == 'True') {
                            RevenueName = newName;
                            RevenueStatus = newStatus;
                            RevenueCancelFuncrtion(element);
                        }
                    }
                )
            }
        }
    )
}