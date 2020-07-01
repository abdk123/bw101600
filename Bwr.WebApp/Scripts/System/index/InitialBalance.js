
function FillBlanceTable() {
    console.log('sss');
    BalnceTable.clear().draw();
    $.post(
        '_JsonGetCoinInBalance', {
            id: 1
        }, function (data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                BalnceTable.row.add([
                    data[i].CoinName,
                    numberWithCommas(data[i].InitialBalance),
                    numberWithCommas(data[i].CurrentBalance),
                    //FlipBoolToYesOrNo(data[i].IsEnabled),
                    FlipBoolToYesOrNo(data[i].IsMainCoin),
                    _div._creatDivFunction(data[i].Id, "Balance"),
                ]).draw();
            }
        }
    );
}
var InitialBalnce;
var IsMainCoin;
var Increments = 0;
function BalanceEditFuncrtion(element) {
    var div = element.parentElement;
    var MainDiv = div.parentElement;
    MainDiv.style.display = "none";
    MainDiv.nextSibling.style.display = "block";

    var viewButton = document.getElementsByName('BalanceViewBtn');
    var editButton = document.getElementsByName('BalanceEditBtn');
    var deleteButton = document.getElementsByName('BalanceDeleteBtn');
    for (var i = 0; i < viewButton.length; i++) {
        viewButton[i].disabled = editButton[i].disabled = deleteButton[i].disabled = true;
    }


    var row = MainDiv.parentElement.parentElement;



    var tds = row.getElementsByTagName('td');
    var initialBalnceTd = tds[1];
    var IsMainCoinTd = tds[3];


    IsMainCoin = FlipYesOrNoToBoolean(IsMainCoinTd.innerText);
    InitialBalnce = deleteCommaFromNumber(initialBalnceTd.innerText);
    if (InitialBalnce == "") {
        InitialBalnce=0;
    }
    var initalBalnceTextBox = document.createElement('input');
    initalBalnceTextBox.setAttribute('type', 'text');
    initalBalnceTextBox.setAttribute('onkeypress', 'validation(this, event, true)');
    initalBalnceTextBox.setAttribute('onkeyup', 'FormaittingNumber(this)');
    initalBalnceTextBox.setAttribute('onkeydown', 'PriventEmptytext(this, event, true)');
    initalBalnceTextBox.value = numberWithCommas(InitialBalnce);
    tds[1].innerText = "";
    tds[1].appendChild(initalBalnceTextBox);


    var IsMainCoinCheckBox = document.createElement('input');
    IsMainCoinCheckBox.setAttribute("type", "checkbox");
    IsMainCoinCheckBox.checked = IsMainCoin;
    tds[3].innerText = "";
    tds[3].appendChild(IsMainCoinCheckBox);
}
function BalanceCancelFuncrtion(element) {
    
    var div = element.parentElement;
    var MainDiv = div.parentElement;
    MainDiv.style.display = "none";
    MainDiv.previousElementSibling.style.display = "block";
    var viewButton = document.getElementsByName('BalanceViewBtn');
    var editButton = document.getElementsByName('BalanceEditBtn');
    var deleteButton = document.getElementsByName('BalanceDeleteBtn');

    var row = MainDiv.parentElement.parentElement;

    var tds = row.getElementsByTagName('td');
    var initialBalnceTd = tds[1];
    var IsMainCoinTd = tds[3];
    tds[1].innerHTML = "";
    tds[3].innerHTML = "";
    tds[1].innerText = numberWithCommas(parseFloat(InitialBalnce) + parseFloat(Increments));
    var oldTd2 = tds[2].innerText;
    if (oldTd2 == "") {
        oldTd2 = '0';
    }
    tds[2].innerText = numberWithCommas(parseFloat(deleteCommaFromNumber(oldTd2)) + parseFloat(Increments));
    tds[3].innerText = FlipBoolToYesOrNo(IsMainCoin);


    for (var i = 0; i < viewButton.length; i++) {
        viewButton[i].disabled = editButton[i].disabled = deleteButton[i].disabled = false;
    }
}
function BalanceSaveFuncrtion(element, Id) {
    
    var row = getRowFormAnyElement(element);
    if (row == undefined) {
        $.confirm({
            title: "خطاء",
            content: "حدث خطاء ما الرجاء إعادة تحميل الصفحة ",
            buttons: {
                موافق: function () {

                }
            }
        });
        return;
    }
    var tds = row.getElementsByTagName('td');

    var InitalBanceTd = tds[1];
    var newInintalBalnce = deleteCommaFromNumber(InitalBanceTd.getElementsByTagName('input')[0].value);
    Increments = newInintalBalnce - InitialBalnce;
    var newIsMainCoin = tds[3].getElementsByTagName('input')[0].checked;
    if (newIsMainCoin == IsMainCoin && Increments == 0) {
        BalanceCancelFuncrtion(element);
        return;
    }
    if (IsMainCoin != newIsMainCoin) {
        if (newIsMainCoin == false) {
            $.confirm({
                title: "تأكيد",
                content: "هل انت متأكد من إلغاء كونها العملة الإفتراضية؟",
                buttons: {
                    موافق: function () {
                        updateInitalBalnce(Id, false, Increments);
                        IsMainCoin = newIsMainCoin;
                        BalanceCancelFuncrtion(element);
                    },
                    إلغاء: function () {
                        Increments = 0;
                        BalanceCancelFuncrtion(element);
                    }
                }
            })
        }
        else {
            var check = checkIfThereMainCoin(row);
            if (check != undefined) {
                $.confirm({
                    title: "تأكيد",
                    content: "هناك عملة اساسية موجودة مسبقاً <br>هل انت متأكد من تغير العملة الأساسية<br>ملاحظة سوف تتم التعاملات في الصيرفة في العملة الحالية",
                    buttons: {
                        موافق: function () {
                            var checkedRow = check;
                            var checkedTd = checkedRow.getElementsByTagName('td')[3];
                            checkedTd.innerText = FlipBoolToYesOrNo(false);
                            IsMainCoin = newIsMainCoin;
                            updateInitalBalnce(Id, true, Increments, element);
                            //BalanceCancelFuncrtion(element);
                        },
                        إلغاء: function () {
                            Increments = 0;
                            BalanceCancelFuncrtion(element);
                        }
                    }
                });
            }
            else {
                IsMainCoin = newIsMainCoin;
                updateInitalBalnce(Id, true, Increments, element);
                //BalanceCancelFuncrtion(element);
            }
        }
    } else {
        updateInitalBalnce(Id, IsMainCoin, Increments, element);
        //BalanceCancelFuncrtion(element);
    }
}
function checkIfThereMainCoin(row) {
    var table = document.getElementById('BalnceTable');
    var tbody = table.getElementsByTagName('tbody')[0];
    var rows = tbody.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        if (rows[i] == row)
            continue;
        var td = rows[i].getElementsByTagName('td')[3];
        var bool = FlipYesOrNoToBoolean(td.innerText);
        if (bool)
            return rows[i];
    }
    return undefined;
}
function updateInitalBalnce(branchCashId, isMainCoin, difference, element) {
    $.post(
        'UpdateInitialBalnce', {
            branchCashId: branchCashId,
            IsMainCoin: isMainCoin,
            difference: difference,
        }, function (data) {
            BalanceCancelFuncrtion(element);
            fillExhchnage();
        }
    )
    
}

