function FilltrasuryCoinSelectInModel() {
    var treasuryCoinSelectInModel = document.getElementById('treasuryCoinSelectInModel');
    treasuryCoinSelectInModel.innerHTML = "";
    $.post(
        '_JSONGetCoin',
        function (data) {
            var option = document.createElement('option');
            option.value = "";
            option.innerText = "الرجاء اختيار العملة";
            treasuryCoinSelectInModel.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                addCoinForSelect(data[i]);
            }
        }
    );
}
function addCoinForSelect(data) {
    var treasuryCoinSelectInModel = document.getElementById('treasuryCoinSelectInModel');
    var option = document.createElement('option');
    option.value = data.Id;
    option.innerText = data.Name;
    if (!data.IsEnabled)
        option.disabled = true;
    treasuryCoinSelectInModel.appendChild(option);
}
FilltrasuryCoinSelectInModel();
$('#treasuryCoinSelectInModel').change(function () {
    if (this.value == "")
        return;
    var Id = this.value;
    var hiddin = document.createElement("input");
    hiddin.setAttribute("type", "hidden");
    hiddin.setAttribute("value", Id);
    var Name = $(this).find('option:selected').text();
    var row = document.createElement("div");
    row.setAttribute("class", "row");
    row.appendChild(hiddin);
    var lableDiv = document.createElement("div");
    lableDiv.setAttribute("class", "col-lg-4");
    var lable = document.createElement("lable");
    lable.innerText = Name + ":  " + "الرصيد الأولي";
    lableDiv.appendChild(lable);
    row.appendChild(lableDiv);

    var TextDiv = document.createElement('div');
    TextDiv.setAttribute("class", "col-lg-5");
    var text = document.createElement("input");
    text.setAttribute("class", "form-control");
    text.setAttribute("type", "text");
    text.value = 0;
    text.setAttribute("onkeypress", "validation(this,event);");
    text.setAttribute("onkeyup", "FormaittingNumber(this);");
    text.setAttribute("onkeydown", "PriventEmptytext(this,event)");
    TextDiv.appendChild(text);
    row.appendChild(TextDiv);


    var Icon = document.createElement('i');
    Icon.setAttribute("class", "fa fa-close");
    Icon.setAttribute("onClick", "deleteCoinBalanceRow(this," + Id + ")");
    row.appendChild(Icon);

    $(this).find('option:selected').remove();
    TreasuryBalanceDiv.appendChild(row);
});
function deleteCoinBalanceRow(element, Id) {
    $.post(
        '_JsonGetCoinById', {
            id: Id,
        },
        function (data) {
            addCoinForSelect(data);
        }
    )
    element.parentElement.remove();
}
$('#closeTreasuryBalanceModel').click(function () {
    var TreasuryBalanceDiv = document.getElementById('TreasuryBalanceDiv');
    TreasuryBalanceDiv.innerHTML = "";
    FilltrasuryCoinSelectInModel();
});

$('#jsonAddTreasurybtn').click(function () {
    var TreasuryNameText = document.getElementById('TreasuryNameText');
    if (TreasuryNameText.value == "") {
        TreasuryNameError.style.color = "red";
        TreasuryNameError.innerText = "يجب ان تملئ حقل اسم الصندوق";
        return;
    }
    var idCoinWithBalance = "";
    var TreasuryBalanceDiv = document.getElementById('TreasuryBalanceDiv');
    var rows = TreasuryBalanceDiv.getElementsByClassName("row");
    for (var i = 0; i < rows.length; i++) {
        var input = rows[i].getElementsByTagName("input");
        var id = input[0].value;
        var balance = deleteCommaFromNumber(input[1].value);
        idCoinWithBalance += id + ":" + balance + ",";
    }
    if (idCoinWithBalance !== "")
        idCoinWithBalance = idCoinWithBalance.substring(0, idCoinWithBalance.length - 1);
    $.post(
        '_AjaxAddTreasueryWithBalance', {
            boxName: TreasuryNameText.value,
            balnce: idCoinWithBalance
        },
        function (data) {
            TreasuryTable.clear().draw();
            FillTreasuryTable();
            TreasuryNameText.value = "";
            var TreasuryBalanceDiv = document.getElementById('TreasuryBalanceDiv');
            TreasuryBalanceDiv.innerHTML = "";
            FilltrasuryCoinSelectInModel();
        }
    );
})
function FillTreasuryTable() {
    $.post(
        '_JsonGetTreasuryWithBalance',
        function (data) {
            for (var i = 0; i < data.length; i++) {
                addRowForTreasuryTable(data[i]);
            }
        }
    );
}
function addRowForTreasuryTable(data) {
    var Balance = "";
    for (var i = 0; i < data.Balance.length; i++) {
        var Coinblance = data.Balance[i].Balance;
        Balance += data.Balance[i].CoinName + ":" + numberWithCommas(Coinblance);
        if (i + 1 != data.Balance.length) {
            Balance += "<br>";
        }
    }
    TreasuryTable.row.add([
        data.Name,
        FlipBoolToYesOrNo(data.IsEnabled),
        Balance,
        _div._creatDivFunction(data.Id, "Treasury")
    ]).draw();
}
function TreasuryViewFuncrtion(id) {
    window.location = "/Treasury/Truasury/?truseryId=" + id;
}

