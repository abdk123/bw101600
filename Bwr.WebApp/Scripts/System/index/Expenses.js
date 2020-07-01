$('#ExpensesNameTxt').keyup(function () {
    var ExpensesNameError = document.getElementById('ExpensesNameError');
    if (this.value == "" && ExpensesNameError.innerHTML == "يجب تعبئة حقل الأسم") {
        return;
    }
    ExpensesNameError.style.color = "black";
    if (this.value == "") {
        ExpensesNameError.innerHTML = "";
        return;
    }

    $.post(
        '_JsonSimelarExpensess', {
            name: this.value
        },
        function (data) {
            if (data != 'null')
                ExpensesNameError.innerHTML = "هناك قسم مشابه و هو" + data.Name;
            else
                ExpensesNameError.innerHTML = "";
        }
    );
    
})
$('#ExpensesAddBtn').click(function () {
    var ExpensesNameError = document.getElementById('ExpensesNameError');
    var ExpensesNameTxt = document.getElementById('ExpensesNameTxt');
    if (ExpensesNameTxt.value == "") {
        ExpensesNameError.style.color = "red";
        ExpensesNameError.innerHTML = "يجب تعبئة حقل الأسم";
        return;
    }
    $.post(
        '_AjxaAddExpenses', {
            name: ExpensesNameTxt.value,
        },
        function (data) {
            if (data != "false") {
                ExpensesTable.row.add([
                    data.Name,
                    FlipBoolToYesOrNo(data.Enabled),
                    createExpensesChoiceDIvDiv(data.id) + CreateExpensesUpdateDiv(data.id)
                ]).draw();

            }
        }
    )


});

function FillExpensesTable() {
    $.post(
        '_JsonGetExpenses',
        function (data) {
            for (var i = 0; i < data.length; i++) {
                ExpensesTable.row.add([
                    data[i].Name,
                    FlipBoolToYesOrNo(data[i].Enabled),
                    createExpensesChoiceDIvDiv(data[i].id) + CreateExpensesUpdateDiv(data[i].id)
                ]).draw();
            }
        }
    )
};

function createExpensesChoiceDIvDiv(id) {
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
    viewButton.setAttribute("name", "ExpensesViewBtn");
    viewButton.setAttribute("onclick", "ExpensesViewFuncrtion(this," + id + ");");
    viewButton.innerText = "عرض";

    var editBtn = document.createElement("button");
    editDiv.appendChild(editBtn);
    editBtn.setAttribute("class", "btn btn-secondary");
    editBtn.setAttribute("name", "ExpensesEditBtn");
    editBtn.setAttribute("onclick", "ExpensesEditFuncrtion(this);");
    editBtn.innerText = "تعديل";

    var deleteBtn = document.createElement("button");
    DeleteDiv.appendChild(deleteBtn);
    deleteBtn.setAttribute("class", "btn btn-danger");
    deleteBtn.setAttribute("name", "ExpensesDeleteBtn");
    deleteBtn.setAttribute("onclick", "ExpensesDeleteFuncrtion(this," + id + ");");
    deleteBtn.innerText = "حذف";
    return choiceDIv.outerHTML;
}


function CreateExpensesUpdateDiv(id) {
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
    savebtn.setAttribute("onclick", "ExpensesSaveFuncrtion(this," + id + ");");
    savebtn.style.width = "100px";
    savebtn.innerText = "حفظ";

    var cancelBtn = document.createElement('button');
    CancelDiv.appendChild(cancelBtn);
    cancelBtn.setAttribute("class", "btn btn-danger");
    cancelBtn.setAttribute('onclick', 'ExpensesCancelFuncrtion(this,' + id + ');');
    cancelBtn.innerText = "إلغاء";
    cancelBtn.style.width = "100px";
    CancelDiv.appendChild(cancelBtn);
    return updateDiv.outerHTML;
}

function ExpensesDeleteFuncrtion(element, id) {
    $.confirm({
        title: "تأكيد",
        content: "ملاحظة: لا يكمنك حذف نوع الإيرادات إذا كان  مرتبط بها شيئ ",
        buttons: {
            تأكيد: function () {
                $.post(
                    '_AjaxDeleteExpenses', {
                        id: id,
                    },
                    function (data) {
                        console.log(data);
                        if (data == 'True') {
                            var row = element.parentElement.parentElement.parentElement.parentElement;
                            ExpensesTable.row(row).remove().draw();
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

var ExpensesName;
var ExpensesStatus;

function ExpensesEditFuncrtion(element) {
    var ChoicDive = element.parentElement.parentElement;
    ChoicDive.style.display = "none";
    var UpdateDiv = ChoicDive.nextSibling;
    UpdateDiv.style.display = "block";

    var row = ChoicDive.parentElement.parentElement;

    var nameTd = row.getElementsByTagName("td")[0];
    ExpensesName= nameTd.innerText;


    var enabledTd = row.getElementsByTagName("td")[1];
    ExpensesStatus = FlipYesOrNoToBoolean(enabledTd.innerText);


    var nameText = document.createElement("input");
    nameText.setAttribute("type", "text");
    nameText.setAttribute("class", "form-control");

    nameTd.innerText = "";
    nameText.value = ExpensesName;
    nameTd.appendChild(nameText);


    var checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.checked = ExpensesStatus;


    enabledTd.innerText = "";
    enabledTd.appendChild(checkBox);

    var ProvinceEditBtn = document.getElementsByName("ExpensesEditBtn");
    var ProvinceViewBtn = document.getElementsByName("ExpensesViewBtn");
    var ProvinceDeleteBtn = document.getElementsByName("ExpensesDeleteBtn");
    for (var i = 0; i < ProvinceDeleteBtn.length; i++) {
        ProvinceEditBtn[i].disabled = ProvinceViewBtn[i].disabled = ProvinceDeleteBtn[i].disabled = true;
    }
}


function ExpensesCancelFuncrtion(element) {
    var UpdateDiv = element.parentElement.parentElement;
    UpdateDiv.style.display = "none";
    var ChoicDiv = UpdateDiv.previousElementSibling;
    ChoicDiv.style.display = "block";
    var BranchEditBtn = document.getElementsByName("ExpensesEditBtn");
    var BranchViewBtn = document.getElementsByName("ExpensesViewBtn");
    var BranchDeleteBtn = document.getElementsByName("ExpensesDeleteBtn");
    for (var i = 0; i < BranchViewBtn.length; i++) {
        BranchEditBtn[i].disabled = BranchViewBtn[i].disabled = BranchDeleteBtn[i].disabled = false;
    }

    var row = ChoicDiv.parentElement.parentElement;
    var nameTd = row.getElementsByTagName("td")[0];
    nameTd.inneHtml = "";
    nameTd.innerText = ExpensesName;

    var enabledTd = row.getElementsByTagName("td")[1];
    enabledTd.inneHtml = "";
    enabledTd.innerText = FlipBoolToYesOrNo(ExpensesStatus);
    
    ExpensesName = undefined;
    ExpensesStatus = undefined;
}


function ExpensesSaveFuncrtion(element, id) {
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
    if (newName == ExpensesName && ExpensesStatus == newStatus){
        ExpensesCancelFuncrtion(element);
        return;
    }
    $.post(
        '_JsonSimelarExpensess', {
            name: newName,
            id: id
        },
        function (data) {
            console.log(data);
            if (data != "null") {
                $.confirm({
                    title: "تنبيه!",
                    content: "هناك ايراد مشابهة  ",
                    buttons: {
                        تأكيد: function () {
                            $.post(
                                '_AjaxUpdateExpenses', {
                                    id: id,
                                    name: newName,
                                    enable: newStatus,
                                },
                                function (data) {
                                    if (data == 'True') {
                                        ExpensesName = newName;
                                        ExpensesStatus = newStatus;
                                        ExpensesCancelFuncrtion(element);
                                    }
                                }
                            )
                        }
                        ,
                        إلغاء: function () {

                            ExpensesCancelFuncrtion(element);
                        }
                    }
                })
            } else {
                $.post(
                    '_AjaxUpdateExpenses', {
                        id: id,
                        name: newName,
                        enable: newStatus,
                    },
                    function (data) {
                        if (data == 'True') {
                            ExpensesName = newName;
                            ExpensesStatus = newStatus;
                            ExpensesCancelFuncrtion(element);
                        }
                    }
                )
            }
        }
    )
} 