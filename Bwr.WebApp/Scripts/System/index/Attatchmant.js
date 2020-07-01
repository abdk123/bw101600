function FillAttachmentTable() {
    $.post(
        "_JSONGetAttatchment",
        function (data) {
            for (var i = 0; i < data.length; i++) {
                AttatchmentTable.row.add([
                    data[i].Name,
                    FlipBoolToYesOrNo(data[i].IsEnabled),
                    _div._creatDivFunction(data[i].Id, "Attatchment")
                ]).draw();
            }
        }
    );
}

var AttatchmentName;
var AttatchmentStatus;
function AttatchmentEditFuncrtion(element) {
    var ChoicDive = element.parentElement.parentElement;
    ChoicDive.style.display = "none";
    var UpdateDiv = ChoicDive.nextSibling;
    UpdateDiv.style.display = "block";

    var row = ChoicDive.parentElement.parentElement;

    var nameTd = row.getElementsByTagName("td")[0];
    AttatchmentName = nameTd.innerText;


    var enabledTd = row.getElementsByTagName("td")[1];
    AttatchmentStatus = FlipYesOrNoToBoolean(enabledTd.innerText);


    var nameText = document.createElement("input");
    nameText.setAttribute("type", "text");
    nameText.setAttribute("class", "form-control");

    nameTd.innerText = "";
    nameText.value = AttatchmentName;
    nameTd.appendChild(nameText);

    var checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.checked = AttatchmentStatus;


    enabledTd.innerText = "";
    enabledTd.appendChild(checkBox);

    var AttatchmentEditBtn = document.getElementsByName("AttatchmentViewBtn");
    var AttatchmentViewBtn = document.getElementsByName("AttatchmentEditBtn");
    var AttatchmentDeleteBtn = document.getElementsByName("AttatchmentDeleteBtn");
    for (var i = 0; i < AttatchmentDeleteBtn.length; i++) {
        AttatchmentEditBtn[i].disabled = AttatchmentViewBtn[i].disabled = AttatchmentDeleteBtn[i].disabled = true;
    }
}

function AttatchmentCancelFuncrtion(element) {
    var UpdateDiv = element.parentElement.parentElement;
    UpdateDiv.style.display = "none";
    var ChoicDiv = UpdateDiv.previousElementSibling;
    ChoicDiv.style.display = "block";
    var AttatchmentEditBtn = document.getElementsByName("AttatchmentViewBtn");
    var AttatchmentViewBtn = document.getElementsByName("AttatchmentEditBtn");
    var AttatchmenteDeleteBtn = document.getElementsByName("AttatchmentDeleteBtn");
    for (var i = 0; i < AttatchmenteDeleteBtn.length; i++) {
        AttatchmentEditBtn[i].disabled = AttatchmentViewBtn[i].disabled = AttatchmenteDeleteBtn[i].disabled = false;
    }

    var row = ChoicDiv.parentElement.parentElement;
    var nameTd = row.getElementsByTagName("td")[0];
    nameTd.inneHtml = "";
    nameTd.innerText = AttatchmentName;

    var enabledTd = row.getElementsByTagName("td")[1];
    enabledTd.inneHtml = "";
    enabledTd.innerText = FlipBoolToYesOrNo(AttatchmentStatus);
    AttatchmentName = undefined;
    AttatchmentStatus = undefined;
}

$("#jsonAddAttatchmentbtn").click(function () {
    var textBox = document.getElementById("AttatchmentNameText");
    var CountyNameError = document.getElementById("AttatchmentNameError");
    if (textBox.value === "") {
        CountyNameError.innerHTML = "يجب تعبئة الحقل";
        CountyNameError.style.color = 'red';
        return;
    }
    $.post(
        '_AjaxAddAttatchment', {
        AttatchmentName: textBox.value
    },
        function (data) {
            if (data != "null") {
                console.log(data);
                AttatchmentTable.row.add([
                    data.Name,
                    FlipBoolToYesOrNo(data.IsEnabled),
                    _div._creatDivFunction(data.Id, "Attatchment")
                ]).draw();
                textBox.value = "";
                //   FillTableWithAttatchment();
            } else {
                $.dialog({
                    title: "خطاء",
                    content: "يرجى أعادة تحميل الصفحة و إعادة المحاولة"
                });
            }
        }
    );
});
//<summary>
//check     the simelar Attatchment if exist 
//<erorr>
//don't work
$("#AttatchmentNameText").keyup(function () {
    var CountyNameError = document.getElementById("AttatchmentNameError");

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
        '_JsonSimelarAttatchment', {
        name: this.value,
    },
        function (data) {
            if (data === "null") {
                AttatchmentNameError.innerHTML = "";
            } else {
                // use data as array becase it is a dynamic prop
                AttatchmentNameError.innerHTML = "يوجد مجموعة مشابهة و هي : <a href=/bw_Attatchments/Details/" + data[0].Value + ">" + data[1].Value + "</a>";
            }
        });

});


function AttatchmentDeleteFuncrtion(element, id) {
    $.confirm({
        title: 'تأكيد!',
        content: 'لم تتم العملية اذا كان ضمن هذه المجموعة مستخدمين',
        buttons: {
            تأكيد: function () {
                $.ajax({
                    url: "/System/_AjaxDelteAttatchment",
                    data: { Id: id },
                    type: "post",
                    success: function (data) {
                        if (data === "True") {
                            var row = element.parentElement.parentElement.parentElement.parentElement;
                            AttatchmentTable.row(row).remove().draw();
                            //  FillTableWithAttatchment();
                            return;
                        }
                        else {
                            $.dialog({
                                title: 'خطاء',
                                content: 'لا يمكنك مسح هذه المجموعة',
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

function AttatchmentSaveFuncrtion(element, id) {
    var row = element.parentElement.parentElement.parentElement.parentElement;
    var nameTd = row.getElementsByTagName("td")[0];
    var enabledTd = row.getElementsByTagName("td")[1];
    var newName = nameTd.getElementsByTagName("input")[0].value;
    if (newName == "") {
        $.confirm(
            {
                title: 'خطاء',
                content: 'لا يمكن ان يكون حقل اسم المجموعة فارغ',
                buttons: {
                    موافق: function () {
                    }
                }
            }
        );
        return;
    }
    var newStatus = enabledTd.getElementsByTagName("input")[0].checked;
    if (newName == AttatchmentName && AttatchmentStatus == newStatus) {
        AttatchmentCancelFuncrtion(element);
        return;
    }
    $.post(
        '_JsonSimelarAttatchment', {
        name: newName,
        id: id
    },
        function (data) {
            if (data === "null") {
                $.post(
                    '_AjaxUpdateAttatchment', {
                    id: id,
                    name: newName,
                    Status: newStatus,
                },
                    function (data) {
                        if (data === "True") {
                            AttatchmentName = newName;
                            AttatchmentStatus = newStatus;
                            AttatchmentCancelFuncrtion(element);
                            //  FillTableWithAttatchment();
                            alert("تعم التعديل");
                        } else {
                            AttatchmentCancelFuncrtion(element);
                            alert("لم يتم التعديل هناك خطاء ما حاول مجدداً");
                        }
                    }
                );
            } else {
                $.confirm({
                    title: 'تأكيد !',
                    content: 'هناك مجموعة تحمل نفس الأسم هل انت متأكد من التعديل ؟',
                    buttons: {
                        تأكيد: function () {
                            $.post(
                                '_AjaxUpdateAttatchment', {
                                id: id,
                                name: newName,
                                Status: newStatus,
                            },
                                function (data) {
                                    if (data === "True") {
                                        AttatchmentName = newName;
                                        AttatchmentStatus = newStatus;
                                        AttatchmentCancelFuncrtion(element);
                                        //  FillTableWithAttatchment();
                                        alert("تعم التعديل");
                                    } else {
                                        AttatchmentCancelFuncrtion(element);
                                        alert("لم يتم العتديل هناك خطاء ما حاول مجدداً");
                                    }
                                }
                            );
                        },
                        إلغاء: function () {
                            AttatchmentCancelFuncrtion(element);
                        }
                    }
                });
            }
        });
}

