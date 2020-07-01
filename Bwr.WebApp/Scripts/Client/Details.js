var ClientBalance = $('#ClientBalance').DataTable({
    "ordering": true,
    "columnDefs": [{
        "orderable": false, targets: "no-sort"
    }],
    "language": {
        "search": "البحث",
        "info": "عرض _START_ إلى _END_ من _كل_ العناصر",
        "emptyTable": "لا يوجد اي عناصر للعرض",
        "infoEmpty": "لا يوجد اي عناصر",
        "zeroRecords": "لا يوجد اي عناصر مطابقة",
        "infoFiltered": "",
    }
});

var ClientCoinTable = $('#ClientCoinTable').DataTable({
    "ordering": true,
    "columnDefs": [{
        "orderable": false, targets: "no-sort"
    }],
    "language": {
        "search": "البحث",
        "info": "عرض _START_ إلى _END_ من _كل_ العناصر",
        "emptyTable": "لا يوجد اي عناصر للعرض",
        "infoEmpty": "لا يوجد اي عناصر",
        "zeroRecords": "لا يوجد اي عناصر مطابقة",
        "infoFiltered": "",
    }
});
var ClientCashFlow = $('#cashFlowTable').DataTable({
    "ordering": true,
    "columnDefs": [{
        "orderable": false, targets: "no-sort"
    }],
    "language": {
        "search": "البحث",
        "info": "عرض _START_ إلى _END_ من _كل_ العناصر",
        "emptyTable": "لا يوجد اي عناصر للعرض",
        "infoEmpty": "لا يوجد اي عناصر",
        "zeroRecords": "لا يوجد اي عناصر مطابقة",
        "infoFiltered": "",
    }
});
var url = window.location.href;
var clientId = url.substr(url.indexOf('?') + 4, url.length - 1);
$(document).ready(function () {
    FillCurrentBalance(clientId);
    FillCoinClientTable(clientId);
});

$('#Coin').change(function () {
    var coinId = $('#Coin').val();
    var from = $('#fromCashFlow').val();
    var to = $('#toCashFlow').val();
    fillCashFlow(clientId, coinId, from, to);
});
$('#fromCashFlow').change(function () {
    var coinId = $('#Coin').val();
    var from = $('#fromCashFlow').val();
    var to = $('#toCashFlow').val();
    fillCashFlow(clientId, coinId, from, to);
});
$('#toCashFlow').change(function () {
    var coinId = $('#Coin').val();
    var from = $('#fromCashFlow').val();
    var to = $('#toCashFlow').val();
    fillCashFlow(clientId, coinId, from, to);
});

function fillCashFlow(clientId, coinId, from, to) {
    console.log("fire");
    ClientCashFlow.clear().draw();
    $.post(
        'GetCashFlow', {
            clientId: clientId,
            coinId: coinId,
            from: from,
            to: to
        },
        function (data) {
            for (var i = 0; i < data.length; i++) {
                var isMatched = "";
                if (data[i].IsMatched) {
                    isMatched = "تمت المطابقة";
                }
                var onHim = "";
                var forHim = "";
                if (data[i].amount > 0) {
                    forHim = numberWithCommas(data[i].amount);
                }
                else if (data[i].amount < 0) {
                    onHim = numberWithCommas(data[i].amount * -1);
                }
                var balnce = parseFloat(data[i].Balnce);
                var status = balnce > 0 ? "/له" : "/عليه";
                if (!balnce) status = "";
                balnce = Math.abs(balnce);
                balnce = numberWithCommas(balnce);
                ClientCashFlow.row.add([
                    isMatched,
                    balnce + status,
                    numberWithCommas(forHim),
                    numberWithCommas(onHim),
                    numberWithCommas(data[i].ourComission),
                    numberWithCommas(data[i].comission),
                    data[i].Date,
                    data[i].Type,
                    data[i].Number,
                    data[i].Matcher,
                    "<a href='" + data[i].Id + "' class='btn btn-priamry'> تفاصيل</a>"
                ]).draw();
            }
        }
    )
}
function FillCurrentBalance(id) {
    ClientBalance.clear().draw();
    $.post(
        '_JsonGetBalance', {
            clientId: id
        },
        function (data) {
            for (var i = 0; i < data.length; i++) {
                ClientBalance.row.add([
                    data[i].coinName,
                    numberWithCommas(data[i].forHim),
                    numberWithCommas(data[i].onHim),
                    numberWithCommas(data[i].MaxCreditor),
                    numberWithCommas(data[i].MaxDebit),
                    "<button class='btn btn-primary'>تفاصيل</button>"
                ]).draw();
            }
        }
    );
}
function FillCoinClientTable(id) {
    $.post(
        '_JSONGetClientCoins', {
            clientId: id
        },
        function (data) {
            for (var i = 0; i < data.length; i++) {
                ClientCoinTable.row.add([
                    data[i].name,
                    numberWithCommas(data[i].bank),
                    numberWithCommas(data[i].MaxCreditor),
                    numberWithCommas(data[i].MaxDebit),
                    "<button class='btn btn-success' name='editbtn' onclick='enabledEdit(this);' >تعديل</button>" + editDiv(data[i].Id),
                ]).draw();
            }
        }
    )
}

var increment = 0;
var initalBalnce;
var maxCreditor;
var maxDebit;
function enabledEdit(element) {
    var row = getRowFormAnyElement(element);

    element.style.display = "none";
    var div = element.nextSibling;
    div.style.display = "block";
    var tds = row.getElementsByTagName('td');
    var initalBalnceTd = tds[1];
    initalBalnce = deleteCommaFromNumber(initalBalnceTd.innerText);
    initalBalnceTd.innerText = "";
    var maxCreditorTd = tds[2];
    if (maxCreditorTd.innerText == "لايوجد")
        maxCreditor = "";
    else
        maxCreditor = deleteCommaFromNumber(maxCreditorTd.innerText);

    maxCreditorTd.innerText = "";
    var maxDebitTd = tds[3];
    if (maxDebitTd.innerText == "لايوجد")
        maxDebit = "";
    else
        maxDebit = deleteCommaFromNumber(maxDebitTd.innerText);
    maxDebitTd.innerText = "";

    var initalBanceText = document.createElement('input');
    initalBanceText.setAttribute("onkeypress", "validation(this,event,true);");
    initalBanceText.setAttribute("onkeydown", "PriventEmptytext(this, event, true)");
    initalBanceText.setAttribute("onkeyup", "FormaittingNumber(this);");
    initalBanceText.value = numberWithCommas(initalBalnce);
    initalBalnceTd.appendChild(initalBanceText);

    var maxCreditortText = document.createElement("input");
    maxCreditortText.setAttribute("onkeypress", "validation(this,event);");
    maxCreditortText.setAttribute("onkeyup", "FormaittingNumber(this);");

    var maxDebitText = maxCreditortText.cloneNode();
    if (maxCreditor !== "")
        maxCreditortText.value = numberWithCommas(maxCreditor);
    if (maxDebit !== "") {
        maxDebitText.value = numberWithCommas(maxDebit);
    }
    maxCreditorTd.appendChild(maxCreditortText);
    maxDebitTd.appendChild(maxDebitText);

    var editBtns = document.getElementsByName("editbtn");

    for (var i = 0; i < editBtns.length; i++) {
        editBtns[i].disabled = true;
    }

}
function editDiv(id) {
    var div = document.createElement("div");
    div.style.display = "none";
    var saveButton = document.createElement("button");
    saveButton.setAttribute("class", "btn btn-primary");
    saveButton.innerText = "حفظ";
    saveButton.setAttribute("onclick", "SaveClientCoin(this," + id + ");");
    div.appendChild(saveButton);
    var cancelBtn = document.createElement("button");
    cancelBtn.setAttribute("onclick", "cancelClientCoin(this);");
    cancelBtn.setAttribute("class", "btn btn-danger");
    cancelBtn.innerText = "إلغاء";
    div.appendChild(cancelBtn);
    return div.outerHTML;
}
function SaveClientCoin(element, id) {
    //var row = getRowFormAnyElement(element);
    //var tds = row.getElementsByTagName('td');
    //var newInital = deleteCommaFromNumber(tds[1].getElementsByTagName('input')[0].value);
    //var newMaxCreditor = deleteCommaFromNumber(tds[2].getElementsByTagName('input')[0].value);

    //var newMaxDebit = deleteCommaFromNumber(tds[3].getElementsByTagName('input')[0].value);
    //if (newInital == initalBalnce && newMaxCreditor == maxCreditor && newMaxDebit == maxDebit) {
    //    CoinCancelFuncrtionForCompanyInitalBalnce(element);
    //    return;
    //}
    //var def = newInital - initalBalnce;
    //maxCreditor = newMaxCreditor;
    //maxDebit = newMaxDebit;
    //initalBalnce = newInital;
    var row = getRowFormAnyElement(element);
    var tds = row.getElementsByTagName('td');
    var newInital = deleteCommaFromNumber(tds[1].getElementsByTagName('input')[0].value);
    var newMaxCreditor = deleteCommaFromNumber(tds[2].getElementsByTagName('input')[0].value);

    var newMaxDebit = deleteCommaFromNumber(tds[3].getElementsByTagName('input')[0].value);
    if (newInital == initalBalnce && newMaxCreditor == maxCreditor && newMaxDebit == maxDebit) {
        cancelClientCoin(element);
        return;
    }
    var def = newInital - initalBalnce;
    maxCreditor = newMaxCreditor;
    maxDebit = newMaxDebit;
    initalBalnce = newInital;
    $.post(
        'updateClientCoin',
        {
            clientCashId: id,
            def: def,
            maxCreditor: maxCreditor,
            maxDeibt: maxDebit,
        }, function (data) {
            FillCurrentBalance(clientId);
            cancelClientCoin(element);
        }
    )
}
function cancelClientCoin(element) {
    var div = element.parentElement.parentElement;
    div.style.display = "none";
    div.previousElementSibling.style.display = "block";
    var CountryViewBtn = document.getElementsByName("CoinEditBtn");
    for (var i = 0; i < CountryViewBtn.length; i++) {
        CountryViewBtn[i].disabled = false;
    }
    var row = getRowFormAnyElement(element);
    var tds = row.getElementsByTagName('td');
    tds[1].innerHTML = "";
    tds[1].innerText = numberWithCommas(initalBalnce);
    tds[2].innerHTML = "";
    if (maxCreditor == "")
        tds[2].innerText = "لايوجد";
    else
        tds[2].innerText = numberWithCommas(maxCreditor);
    tds[3].innerHTML = "";
    if (maxDebit == "")
        tds[3].innerText = "لايوجد";
    else
        tds[3].innerText = numberWithCommas(maxDebit);
}
//$('#addCoinToClient').click(function () {
//    var clientCoinMessage = document.getElementById('ClientCoinMessage');
//    var Selectcoin = document.getElementById('coinSelect');
//    var initialBalance = document.getElementById('initialBalance');
//    var maxCreditor = document.getElementById('maxCreditor');
//    var maxDebit = document.getElementById('maxDebit');
//    if (Selectcoin.value == "") {
//        clientCoinMessage.style.color = "red";
//        clientCoinMessage.innerText = "يجب تحديد العملة";
//        return;
//    }
//    clientCoinMessage .innerText = "";
//    $.post(
//        '_AjaxAddCoinForClient', {
//            clientId: clientId,
//            coinId: Selectcoin.value,
//            initialBalance: deleteCommaFromNumber(initialBalance.value),
//            maxCreditor: deleteCommaFromNumber(maxCreditor.value),
//            maxDebit: deleteCommaFromNumber(maxDebit.value),
//        },
//        function (data) {
//            if (data != "null") {
//                ClientCoinTable.row.add([
//                    data.name,
//                    numberWithCommas(data.bank),
//                    numberWithCommas(data.MaxCreditor),
//                    numberWithCommas(data.MaxDebit),
//                    FlipBoolToYesOrNo(data.Enabled),
//                    's'
//                ]).draw();
//                ClientBalance.clear().draw();
//                FillCurrentBalance(clientId);
//                Selectcoin.remove(Selectcoin.selectedIndex);
//                Selectcoin.value = "";
//                initialBalance.value = "";
//                maxCreditor.value = "";
//                maxDebit.value = "";
//            } else {
//                $.confirm({
//                    title: "خطاء",
//                    content: "هناك خطاء قد حدث الرجاء إعادة تحميل الصفحة و المحاولة مجدداً :(",
//                    buttons: {
//                        موافق: function () {
//                        }
//                    }
//                });
//            }
//        }
//    )

//});
function cancelClientCoin(element) {
    var div = element.parentElement;
    div.style.display = "none";
    div.previousSibling.style.display = "block";

    var row = getRowFormAnyElement(element);
    var tds = row.getElementsByTagName('td');
    tds[1].innerHTML = "";
    tds[1].innerText = numberWithCommas(initalBalnce);
    tds[2].innerHTML = "";
    if (maxCreditor == "")
        tds[2].innerText = "لايوجد";
    else
        tds[2].innerText = numberWithCommas(maxCreditor);
    tds[3].innerHTML = "";
    if (maxDebit == "")
        tds[3].innerText = "لايوجد";
    else
        tds[3].innerText = numberWithCommas(maxDebit);

    var editBtns = document.getElementsByName("editbtn");
    for (var i = 0; i < editBtns.length; i++) {
        editBtns[i].disabled = false;
    }
}