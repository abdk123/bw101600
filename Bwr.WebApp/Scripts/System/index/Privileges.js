function FillTableWithPrivileges() {
    $.post(
        "_JSONGetPrivileges",
        function (data) {
            for (var i = 0; i < data.length; i++) {
                PrivilegesTable.row.add([
                    data[i].Id,
                    data[i].Name,
                    FuncPassword(data[i].Password),
                    _PrivilegescreatDivFunction(data[i].Id, "Privileges"),
                ]).draw();
            }
        }
    )
}


function _PrivilegescreatDivFunction(id, TableName) {
   
    attToggle = ["col-lg-6", "تعديل كلمة المرور", "#PrivilegesPassword", TableName+"btnEdit"];
    toggle = _CreateElementAndSetAttribute("toggle", attToggle);
    return toggle;
}

var PrivilegesName;
var PrivilegesPassword ="";
var TableName = "Privileges";
var Ident;
$('#PrivilegesTable').on('click', 'tr', function () {
    var table = $('#PrivilegesTable').DataTable();
    table.columns(0).visible(true);
    var tablerow = $(this).closest('tr').context;
    Ident = tablerow.getElementsByTagName("td")[0].innerText;
    table.columns(0).visible(false);
});

$('#PrivilegesTable').on('click', 'tr', function (e) {
    if (e.target.id == 'PrivilegesbtnEdit') {
        
        $.post(
            "_JSONGetPrivilegesWithId", {
            id: Ident,
        },
            function (data) {
                if (data != "null") {
                    PrivilegesPassword = data.Password;
                    PrivilegesName = data.Name;

                }
                else {
                    console.log("...خيرا بغيرا");
                }
            }
        )

        
    }

});
$('#txtOldPass,#txtNewPass,#txtConfPass').keyup(function () {
    var txtNew = document.getElementById("txtNewPass");
    var txtConf = document.getElementById("txtConfPass");
    confNewPassword(txtNew, txtConf, txtNew.value, txtConf.value);
});

function save() {
    var table = $('#PrivilegesTable').DataTable();
    var txtold = document.getElementById("txtOldPass");
    var txtNew = document.getElementById("txtNewPass");
    var txtConf = document.getElementById("txtConfPass");
    var newPassword = txtNew.value;
    if (txtold.disabled == false) {
        if (txtold.value != PrivilegesPassword) {
            alert("كلمة حماية الصلاحية غير صحيحة !!");
            cancel();
            return;
        }
    }
    if (txtConf.value != txtNew.value) {
        alert("تأكيد كلمة حماية الصلاحية غير صحيح , حاول ثانية");
        cancel();
        return;
    }
    if (txtConf.value == "" || txtNew.value == "" ) {
        $.confirm({
            title: 'تأكيد!',
            content: 'هل تريد بالتأكيد حذف كلمة الحماية لهذه الصلاحية',
            buttons: {
                تأكيد: function () {
                    $.ajax({
                        url: "/System/_AjaxUpdatePrivileges",
                        data: { Id: Ident, Password: "" },
                        type: "post",
                        success: function (data) {
                            if (data) {
                                table.clear();
                                FillTableWithPrivileges();
                                alert(" تم التعديل بنجاح");
                                cancel();
                                return;
                            }
                            else {
                                $.dialog({
                                    title: 'خطاء',
                                    content: 'لا يمكنك مسح هذه كلمة الحماية لهذه الصلاحية',
                                });
                            }
                        }
                        
                    }
                    )

                },
                إلغاء: function () {
                    cancel();
                    return;
                }
            }
        })
    }
    else {
        $.post(
            '_AjaxUpdatePrivileges', {
            id: Ident,
            password: newPassword
        },
            function (data) {
                if (data) {
                    table.clear();
                    FillTableWithPrivileges();
                    alert("تم التعديل بنجاح ");
                    cancel();
                }
                else {
                    alert("لم يتم التعديل هناك خطاء ما حاول مجدداً");
                    cancel();
                }
            }
        )
    }
}
function cancel() {
    var txtold = document.getElementById("txtOldPass");
    var txtNew = document.getElementById("txtNewPass");
    var txtConf = document.getElementById("txtConfPass");
    txtold.value = txtNew.value = txtConf.value = "";
    id = undefined;
    PrivilegesPassword = undefined;
}
function confNewPassword(element1 , element2, newP , conf) {
    if (newP != conf) {
        element1.style.borderColor = "red";
        element2.style.borderColor = "red";
    }
    if (newP == conf) {
        element1.style.borderColor = "blue";
        element2.style.borderColor = "blue";
    }
}
$('#PrivilegesPassword').mousemove(function () {
    var PrivNameText = document.getElementById("PrivNameText");
    var txtold = document.getElementById("txtOldPass");
    PrivNameText.innerText = PrivilegesName;
    if (PrivilegesPassword == "null" || PrivilegesPassword == undefined || PrivilegesPassword == "") {
        txtold.disabled = true;
    }
    else {
        txtold.disabled = false;
    }
});
//txtOldPass.addEventListener("change", confOldPassword(txtOldPass, PrivilegesPassword, txtOldPass.innerText));
        //txtConfPass.addEventListener("change", confNewPassword(txtNewPass, txtConfPass, txtNewPass.innerText, txtConfPass.innerText));
 //var ChoicDiv = _CreateElementAndSetAttribute("div", [TableName + "choicDiv"]);
    //var EditDiv = _CreateElementAndSetAttribute("div", [TableName + "EditDiv", "col-lg-1"], ChoicDiv);

    //var AttEditBtn = ["btn btn-secondary", TableName + "EditBtn", "تعديل"];

    //EditView = _CreateElementAndSetAttribute("btn", AttEditBtn, EditDiv);
    //EditView.id = "EditView";




    //var SaveDiv = _CreateElementAndSetAttribute("div", [TableName + "SaveDiv", "col-lg-6"], UpdateDiv);
    //var cancelDiv = _CreateElementAndSetAttribute("div", [TableName + "cancelDiv", "col-lg-6"], UpdateDiv);
    //AttSaveBtn = ["btn btn-success", TableName + "SaveBtn", "حفظ", TableName + "SaveFuncrtion(this," + id + ");", "100px"];
    //SaveBtn = _CreateElementAndSetAttribute("btn", AttSaveBtn, SaveDiv);
    //SaveBtn.id = "SaveBtn";
    //AttCancelBtn = ["btn btn-danger", TableName + "CancelBtn", "إلغاء", TableName + "CancelFuncrtion(this," + id + ");", "100px"];
    //cancelBtn = _CreateElementAndSetAttribute("btn", AttCancelBtn, cancelDiv);
    //cancelBtn.id = "cancelBtn";
//$('#PrivilegesTable').on('click', 'tr', function (e) {
//    var table = $('#PrivilegesTable').DataTable();
//    table.columns(0).visible(true);
//    //if (e.target.id == 'EditView') {
//    //    var tablerow = $(this).closest('tr').context;
//    //    var id = tablerow.getElementsByTagName("td")[0].innerText;
//    //        $.post(
//    //            "_JSONGetPrivilegesWithId", {
//    //            id: id,
//    //        },
//    //            function (data) {
//    //                if (data != "null") {
//    //                    PrivilegesName = data.Name;
//    //                    PrivilegesPassword = data.Password;
//    //                    var nametd = tablerow.getElementsByTagName("td")[0];
//    //                    nametd.innerText = "";
//    //                    var passwordtd = tablerow.getElementsByTagName("td")[1];
//    //                    passwordtd.innerText = "";
//    //                    attname = ["text", "form-control", PrivilegesName];
//    //                    attpass = ["text", "form-control"];
//    //                    attConfPass = ["text", "form-control"];
//    //                    nametxt = _CreateElementAndSetAttribute("txt", attname, nametd);
//    //                    passowrdtxt = _CreateElementAndSetAttribute("txt", attpass, passwordtd);
//    //                    confPassTxt = _CreateElementAndSetAttribute("txt", attpass, passwordtd);
//    //                    divs = tablerow.getElementsByTagName("td")[2].childNodes;
//    //                    for (var t = 0; t < divs.length; t++) {
//    //                        if (divs[t].id == TableName + "choicDiv") {
//    //                            divs[t].style.display = "none";
//    //                        }
//    //                        if (divs[t].id == TableName +"UpdateDiv")
//    //                            divs[t].style.display = "block";
//    //                    }
//    //                }
//    //                else {
//    //                    alert("حدث خطأ ما يرجى المحاولة لاحقا");
//    //                }
//    //            }
//    //        )
//    //    }
    
//    table.column(0).visible(false);
//    if (e.target.id == 'DltView') {

//    }
//});
  
