let userErrorMessage = document.getElementById('userErrorMessage');
let users = [];
var userName;
var IsEnabled;
function FillUserTable() {
    $.post(
        '/User/Get',
        function (data) {
            for (var i = 0; i < data.length; i++) {
                AddRowForUserTable(data[i]);
                users = data;
            }
        }
    );
}

function AddRowForUserTable(user) {
    if (user.Id == Autorize.Id) {
        return;
    }
    UserTable.row.add([
        user.Name,
        user.UserName,
        FlipBoolToYesOrNo(user.IsEnabled),
        _div._creatDivFunction(user.Id, "User"),
    ]).draw();
}

function checkUserName(userName) {
    var user = users.filter(c => c.UserName == userName);
    userErrorMessage.innerText = '';
    if (user.length == 0) {
        return true;
    }
    userErrorMessage.innerText = "اسم المستخدم غير صالح";
    return false;
}
$('#jsonAddUserbtn').click(function () {
    var name = $('#NameTxt').val();
    var userName = $('#UserNameTxt').val();
    var password = $('#PasswordTxt').val();
    var cPassword = $('#ConfirmPasswordTxt').val();
    var checked = document.getElementById('IsActive').checked;
    userErrorMessage.innerHTML = "";
    userErrorMessage.style.color = "red";
    if (name == "") {
        userErrorMessage.innerHTML = "يجب ملئ حقل الأسم";
        return;
    }
    if (userName == "") {
        userErrorMessage.innerHTML = "يجب ملئ حقل اسم المستخدم";
        return;
    }
    if (!checkUserName(userName)) {
        return;
    }
    if (password == "") {
        userErrorMessage.innerHTML = "يجب ملئ حقل كلمة المرور";
        return;
    }
    if (cPassword != password) {
        userErrorMessage.innerHTML = "يجب ان تتطابق كلمة المرور مع تاكيد كلمة المررور";
        return;
    }
    var groupIds = $('#UserGroupId').val();
    if (groupIds == null) {
        groupIds = [];
    }
    $.post(
        '/User/Creat',{
            name: name,
            userName: userName,
            password: password,
            isEnabled: checked,
            groupNumber: groupIds
        }, function (data) {
            AddRowForUserTable(data);
        }
    )
});
function formReset() {
    $('#NameTxt').val('');
    $('#UserNameTxt').val('');
    $('#PasswordTxt').val('');
    $('#ConfirmPasswordTxt').val('');
}

function UserEditFuncrtion(element) {
    var row = getRowFormAnyElement(element);
    var mainDiv = element.parentElement.parentElement;
    var updateDivChoices = mainDiv.nextSibling;
    updateDivChoices.style.display = 'block';
    mainDiv.style.display = 'none';
    var tds = row.getElementsByTagName('td');
    userName = tds[0].innerHTML;
    tds[0].innerHTML = '';
    IsEnabled = FlipYesOrNoToBoolean(tds[2].innerHTML);
    tds[2].innerHTML = '';
    var textBox = document.createElement('input');
    textBox.setAttribute('type', 'text');
    textBox.value = userName;
    tds[0].appendChild(textBox);
    var chekcBox = document.createElement('input');
    chekcBox.setAttribute('type', 'checkbox');
    chekcBox.checked = IsEnabled;
    tds[2].appendChild(chekcBox);
    var UserEditBtn = document.getElementsByName('UserEditBtn');
    var UserViewBtn = document.getElementsByName('UserViewBtn');
    var UserDeleteBtn = document.getElementsByName('UserDeleteBtn');
    for (var i = 0; i < UserEditBtn.length; i++) {
        UserEditBtn[i].disabled = UserViewBtn[i].disabled = UserDeleteBtn[i].disabled = true;
    }
}
function UserCancelFuncrtion(element, Id) {
    var row = getRowFormAnyElement(element);
    var tds = row.getElementsByTagName('td');
    tds[0].innerHTML = userName;
    tds[2].innerHTML = FlipBoolToYesOrNo(IsEnabled);
    var mainDiv = element.parentElement.parentElement;
    var updateDivChoices = mainDiv.previousSibling;
    updateDivChoices.style.display = 'block';
    mainDiv.style.display = 'none';
    var UserEditBtn = document.getElementsByName('UserEditBtn');
    var UserViewBtn = document.getElementsByName('UserViewBtn');
    var UserDeleteBtn = document.getElementsByName('UserDeleteBtn');
    for (var i = 0; i < UserEditBtn.length; i++) {
        UserEditBtn[i].disabled = UserViewBtn[i].disabled = UserDeleteBtn[i].disabled = false;
    }

}
function UserSaveFuncrtion(element, Id) {
    var row = getRowFormAnyElement(element);
    var tds = row.getElementsByTagName('td');

    userName = tds[0].getElementsByTagName('input')[0].value;
    IsEnabled = tds[2].getElementsByTagName('input')[0].checked;
    $.post(
        '/User/Update', {
            Id: Id,
            name: userName,
            IsEnabled: IsEnabled
        }, function (data) {
            console.log(data);
        }
    )
    UserCancelFuncrtion(element, Id);
}
function UserViewFuncrtion(userId) {
    console.log(userId);
    window.location.href = '/user/Details?userid=' + userId;
}