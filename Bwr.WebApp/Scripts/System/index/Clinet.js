let ClientBalanceModelBody = document.getElementById('ClientBalanceModelBody');

$('#addNumberBtn').click(function () {
    var phoneNumberText = document.getElementsByName('phoneNumberText');
    if (phoneNumberText.length != 0) {
        if (phoneNumberText[phoneNumberText.length - 1].value == "")
            return;
    }
    var phoneNumbers = document.getElementById('phoneNumbers');
    var row = document.createElement("div");
    row.style.margin = '10px';
    row.style.width = '80%';
    row.setAttribute("class", "row");
    var textbox = document.createElement("input");
    textbox.setAttribute("type", "text");
    textbox.setAttribute("class", "form-control");
    textbox.setAttribute("name", "phoneNumberText");
    textbox.setAttribute("onkeypress", "validationPhonNumber(this,event);");
    row.appendChild(textbox);
    phoneNumbers.appendChild(row);
});
$('#clinetTypeSelect').change(function () {

    var AccountStatusDiv = document.getElementById('AccountStatusDiv');
    if (this.value == 2) {
        AccountStatusDiv.style.display = "block";
    }
    else {
        var AcountStatus = document.getElementById('AcountStatus');
        AcountStatus.checked = true;
        AccountStatusDiv.style.display = "none";
    }
});
function fillClientTable() {
    $.post(
        '_JSONGetClientWithfirstNubmerPhone',
        function (data) {
            for (var i = 0; i < data.length; i++) {
                ClientTable.row.add([
                    data[i].Name,
                    data[i].Country,
                    data[i].Address,
                    data[i].Phone,
                    FlipBoolToYesOrNo(data[i].IsEnabled),
                    createClientChoiceDIvDiv(data[i].Id)
                ]).draw();
            }
        }
    )
}
//  it's  Take Too much time
$('#ClientNameTxt').keypress(function () {
    $.post(
        '__JSONGetSimelarClient',
        {
            Name: ClientFatherNameText.value,
        },
        function (data) {
            console.log(data);
        }
    )
});

$('#addClient').click(function () {
    var AcountStatus = document.getElementById('AcountStatus');
    var ClientErrorMessage = document.getElementById('ClientErrorMessage');
    var ClientLastText = document.getElementById('ClientLastText');
    ClientErrorMessage.style.color = "red";
    if (ClientNameTxt.value == "") {
        ClientErrorMessage.innerHTML = "يجب تعبئة حقل الأسم";
        return;
    }
    ClientErrorMessage.innerHTML = "";
    ClientErrorMessage.style.color = "BLACK";
    var clientAddress = document.getElementById('clientAddress');
    var clientCountry = document.getElementById('clientCountry');
    var phoneNumberText = document.getElementsByName('phoneNumberText');

    var Phones = [];
    for (var i = 0; i < phoneNumberText.length; i++) {
        if (phoneNumberText[i].value == "")
            continue;
        Phones.push(phoneNumberText[i].value);
    }
    var firstName = ClientNameTxt.value;
    var address = clientAddress.value;
    var country = clientCountry.value;
    var IsEnabled = AcountStatus.checked;
    var balnces = [];
    
    if (ClientBalanceModelBody.innerHTML != "") {
        var balncesRows = ClientBalanceModelBody.getElementsByClassName('row');
        for (var i = 0; i < balncesRows.length; i++) {
            var row = balncesRows[i];
            var inputs = row.getElementsByTagName('input');
            var coinId = inputs[0].value;
            var balance = deleteCommaFromNumber(inputs[1].value);
            if (!inputs[2].checked) {
                balance *= -1;
            }
            var clientBalnce = new ClientBalnce(coinId, balance);
            balnces.push(clientBalnce);
        }
    }
    
    if (country == "" || isNaN(country)) {
        country = null;
    }
    var client = new AddClient(firstName, country, address, Phones, IsEnabled, balnces);
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: "{clientDTO:" + JSON.stringify(client) + "}",
        url: "AddClient",
        success: function (data) {
            console.log(data);
            if (data != 'null') {
                ClientTable.row.add([
                data.Name,
                data.Country,
                data.Address,
                data.Phone,
                FlipBoolToYesOrNo(data.IsEnabled),
                createClientChoiceDIvDiv(data.Id)
            ]).draw();
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
    );
    //$.post(
    //    'AddClient',
    //    {
    //        FullName: firstName,
    //        address: address,
    //        countryId: country,
    //        Phones: Phones,
    //        IsEnabeld: IsEnabled,
    //    },
    //    function (data) {
    //        ClientTable.row.add([
    //            data.Name,
    //            data.Country,
    //            data.Address,
    //            data.Phone,
    //            FlipBoolToYesOrNo(data.IsEnabled),
    //            createClientChoiceDIvDiv(data.Id)
    //        ]).draw();
    //    }
    //)
});
$('#closeModel').click(function () {
    var phoneNumbers = document.getElementById('phoneNumbers');
    phoneNumbers.innerHTML = "";
});



function createClientChoiceDIvDiv(id) {
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
    viewButton.setAttribute("name", "ClientViewBtn");
    viewButton.setAttribute("onclick", "ClientViewFuncrtion(this," + id + ");");
    viewButton.innerText = "عرض";

    var editBtn = document.createElement("button");
    editDiv.appendChild(editBtn);
    editBtn.setAttribute("class", "btn btn-secondary");
    editBtn.setAttribute("name", "ClientEditBtn");
    editBtn.setAttribute("onclick", "ClientEditFuncrtion(this);");
    editBtn.innerText = "تعديل";

    var deleteBtn = document.createElement("button");
    DeleteDiv.appendChild(deleteBtn);
    deleteBtn.setAttribute("class", "btn btn-danger");
    deleteBtn.setAttribute("name", "ClientDeleteBtn");
    deleteBtn.setAttribute("onclick", "ClientDeleteFuncrtion(this," + id + ");");
    deleteBtn.innerText = "حذف";
    return choiceDIv.outerHTML;
}
function ClientViewFuncrtion(elemet, Id) {
    window.location.href = '/BwClients/Details?id=' + Id;
}
function FillCoinInClientBlanceModel() {
    if (ClientBalanceModelBody.innerHTML == "") {
        $.post(
            '_JSONGetCoin',
            function (data) {
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
                    ClientBalanceModelBody.appendChild(row);
                }
            }

        )
    }
}