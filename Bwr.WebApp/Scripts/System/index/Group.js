
function FillTableWithGroup() {
    $.post(
        "_JSONGetGroup",
        function (data) {
            for (var i = 0; i < data.length; i++) {
                GroupTable.row.add([
                    data[i].Name,
                    FlipBoolToYesOrNo(data[i].IsEnabled),
                    _div._creatDivFunction(data[i].Id, "Group")
                ]).draw();
            }
            GroupPrivleges();
        }
    )
}
function GroupPrivleges() {
    if (!HavePrivlege('UpdateGroup')) {
        var GroupEditBtn = document.getElementsByName('GroupEditBtn');
        for (var i = 0; i < GroupEditBtn.length; i++) {
            GroupEditBtn[i].style = "visibility:hidden;";
        }
    }
    if (!HavePrivlege('DeleteGroup')) {
        var GroupDeleteBtn = document.getElementsByName('GroupDeleteBtn');
        for (var i = 0; i < GroupEditBtn.length; i++) {
            GroupDeleteBtn[i].style = "visibility:hidden;";
        }
    }
}

function FillPrivilegesSelect() {
    var PrivilegesSelect = document.getElementById("PrivilegesSelect");
    PrivilegesSelect.innerHTML = "";
    $.post(
        '_JSONGetPrivileges',
        function (data) {
            for (var i = 0; i < data.length; i++) {
                var option = document.createElement("option");
                option.value = data[i].Id;
                option.innerText = data[i].Name;
                PrivilegesSelect.appendChild(option);
            }
        }
    );
}

var GroupName;
var GroupStatus;
if (HavePrivlege(priveleges.updateGroup)) {
    function GroupEditFuncrtion(element) {
        var ChoicDive = element.parentElement.parentElement;
        ChoicDive.style.display = "none";
        var UpdateDiv = ChoicDive.nextSibling;
        UpdateDiv.style.display = "block";

        var row = ChoicDive.parentElement.parentElement;

        var nameTd = row.getElementsByTagName("td")[0];
        GroupName = nameTd.innerText;


        var enabledTd = row.getElementsByTagName("td")[1];
        GroupStatus = FlipYesOrNoToBoolean(enabledTd.innerText);


        var nameText = document.createElement("input");
        nameText.setAttribute("type", "text");
        nameText.setAttribute("class", "form-control");

        nameTd.innerText = "";
        nameText.value = GroupName;
        nameTd.appendChild(nameText);

        var checkBox = document.createElement("input");
        checkBox.setAttribute("type", "checkbox");
        checkBox.checked = GroupStatus;


        enabledTd.innerText = "";
        enabledTd.appendChild(checkBox);

        var GroupEditBtn = document.getElementsByName("GroupViewBtn");
        var GroupViewBtn = document.getElementsByName("GroupEditBtn");
        var GroupDeleteBtn = document.getElementsByName("GroupDeleteBtn");
        for (var i = 0; i < GroupDeleteBtn.length; i++) {
            GroupEditBtn[i].disabled = GroupViewBtn[i].disabled = GroupDeleteBtn[i].disabled = true;
        }
    }
}

function GroupCancelFuncrtion(element) {
    var UpdateDiv = element.parentElement.parentElement;
    UpdateDiv.style.display = "none";
    var ChoicDiv = UpdateDiv.previousElementSibling;
    ChoicDiv.style.display = "block";
    var GroupEditBtn = document.getElementsByName("GroupViewBtn");
    var GroupViewBtn = document.getElementsByName("GroupEditBtn");
    var GroupeDeleteBtn = document.getElementsByName("GroupDeleteBtn");
    for (var i = 0; i < GroupeDeleteBtn.length; i++) {
        GroupEditBtn[i].disabled = GroupViewBtn[i].disabled = GroupeDeleteBtn[i].disabled = false;
    }

    var row = ChoicDiv.parentElement.parentElement;
    var nameTd = row.getElementsByTagName("td")[0];
    nameTd.inneHtml = "";
    nameTd.innerText = GroupName;

    var enabledTd = row.getElementsByTagName("td")[1];
    enabledTd.inneHtml = "";
    enabledTd.innerText = FlipBoolToYesOrNo(GroupStatus);
    GroupName = undefined;
    GroupStatus = undefined;
}

if (HavePrivlege(priveleges.addGroup)) {
    $("#jsonAddGroupbtn").click(function () {
        
        var textBox = document.getElementById("GroupNameText");
        //var selectPrivileges = document.getElementById("PrivilegesSelect").value;
        var selectPrivileges = $('#PrivilegesSelect').val();
        var CountyNameError = document.getElementById("GroupNameError");
        if (textBox.value === "") {
            CountyNameError.innerHTML = "يجب تعبئة الحقل";
            CountyNameError.style.color = 'red';
            return;
        }
        $.post(
            '_AjaxAddGroup', {
                GroupName: textBox.value
            },
            function (Group) {
                if (Group != "null") {
                    if (selectPrivileges != null) {
                        for (var i = 0; i < selectPrivileges.length; i++) {
                            $.post(
                                '_AjaxAddGroupPrivileges', {
                                    GroupId: Group.Id,
                                    PrivilegeId: selectPrivileges[i],
                                },
                                function (GroupPrivileg) {
                                }
                            );
                        }
                    }
                    GroupTable.row.add([
                        Group.Name,
                        FlipBoolToYesOrNo(Group.IsEnabled),
                        _div._creatDivFunction(Group.Id, "Group")
                    ]).draw();
                    GroupPrivleges();
                    textBox.value = "";
                }
                else {
                    $.dialog({
                        title: "خطاء",
                        content: "يرجى أعادة تحميل الصفحة و إعادة المحاولة"
                    });
                }
            }
        );
    });
}
//<summary>
//check the simelar Group if exist 
//<erorr>
//don't work
if (HavePrivlege(priveleges.addGroup)) {
    $("#GroupNameText").keyup(function () {
        var CountyNameError = document.getElementById("GroupNameError");

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
            '_JsonSimelarGroup', {
                name: this.value,
            },
            function (data) {
                if (data === "null") {
                    GroupNameError.innerHTML = "";
                } else {
                    // use data as array becase it is a dynamic prop
                    GroupNameError.innerHTML = "يوجد مجموعة مشابهة و هي : <a href=/bw_Groups/Details/" + data[0].Value + ">" + data[1].Value + "</a>";
                }
            });

    });
}

if (HavePrivlege(priveleges.deleteGroup)) {
    function GroupDeleteFuncrtion(element, id) {
        $.confirm({
            title: 'تأكيد!',
            content: 'لم تتم العملية اذا كان ضمن هذه المجموعة مستخدمين',
            buttons: {
                تأكيد: function () {
                    $.ajax({
                        url: "/System/_AjaxDelteGroup",
                        data: { Id: id },
                        type: "post",
                        success: function (data) {
                            if (data === "True") {
                                var row = element.parentElement.parentElement.parentElement.parentElement;
                                GroupTable.row(row).remove().draw();
                                //  FillTableWithGroup();
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
        });
    }
}

if (HavePrivlege(priveleges.updateGroup)) {
    function GroupSaveFuncrtion(element, id) {
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
        if (newName == GroupName && GroupStatus == newStatus) {
            GroupCancelFuncrtion(element);
            return;
        }
        $.post(
            '_JsonSimelarGroup', {
                name: newName,
                id: id
            },
            function (data) {
                if (data === "null") {
                    $.post(
                        '_AjaxUpdateGroup', {
                            id: id,
                            name: newName,
                            Status: newStatus,
                        },
                        function (data) {
                            if (data === "True") {
                                GroupName = newName;
                                GroupStatus = newStatus;
                                GroupCancelFuncrtion(element);
                                //  FillTableWithGroup();
                                alert("تعم التعديل");
                            } else {
                                GroupCancelFuncrtion(element);
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
                                    '_AjaxUpdateGroup', {
                                        id: id,
                                        name: newName,
                                        Status: newStatus,
                                    },
                                    function (data) {
                                        if (data === "True") {
                                            GroupName = newName;
                                            GroupStatus = newStatus;
                                            GroupCancelFuncrtion(element);
                                            //  FillTableWithGroup();
                                            alert("تعم التعديل");
                                        } else {
                                            GroupCancelFuncrtion(element);
                                            alert("لم يتم العتديل هناك خطاء ما حاول مجدداً");
                                        }
                                    }
                                );
                            },
                            إلغاء: function () {
                                GroupCancelFuncrtion(element);
                            }
                        }
                    });
                }
            });
    }
}

