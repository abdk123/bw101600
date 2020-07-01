let exchangeFor = $('#exchangeFor');


function fillExhchnage() {
    
    exchangeTable.clear().draw();
    $.post(
        'MainCoinName', function (data) {
            if (data == "") {
                exchangeFor.text('يجب عليك تحديد العملة الأساسية للقيام ب اعمال الصرفة');
                return;
            } else {
                exchangeFor.text(data);
                $.post(
                    'NotMaincoin',
                    function (data) {
                        for (var i = 0; i < data.length; i++) {

                            exchangeTable.row.add([
                                data[i].Name,
                                numberWithCommas(data[i].ExchangePrice),
                                numberWithCommas(data[i].SellingPrice),
                                numberWithCommas(data[i].PurchasingPrice),
                                UpdateExchange() + UpdateDivFunction(data[i].Id)

                            ]).draw();
                        }
                    }
                )
            }
        }
    )
}
function UpdateExchange() {
    var enabledEditBtn = document.createElement('button');
    enabledEditBtn.innerHTML = "تعديل"
    enabledEditBtn.setAttribute('onclick', 'enableEdit(this)');
    enabledEditBtn.setAttribute('class', 'secondary');
    return enabledEditBtn.outerHTML;
}

function UpdateDivFunction(Id) {
    var div = document.createElement('div');
    div.style.display = "none";
    var saveBtn = document.createElement('button');
    saveBtn.innerHTML = "حفظ";
    saveBtn.setAttribute("class", "btn btn-success");
    saveBtn.setAttribute('onclick', 'saveExchangeFunction(this,' + Id + ')');
    div.appendChild(saveBtn);
    var cancelBtn = document.createElement('button');
    cancelBtn.innerHTML = "إلغاء";
    cancelBtn.setAttribute("class", "btn btn-danger");
    cancelBtn.setAttribute('onclick', 'cancelExchangeUpdate(this)');
    div.appendChild(cancelBtn);
    return div.outerHTML;
}
var price;
var sellingPric;
var PurchasingPrice;
function enableEdit(element) {
    element.style.display = "none";
    var row = getRowFormAnyElement(element);
    var td = row.getElementsByTagName('td');

    var priceText = document.createElement('input');
    priceText.setAttribute('type', 'text');
    priceText.setAttribute('class', 'form-control');

    var sellingText = priceText.cloneNode();
    var purchasingText = priceText.cloneNode();

    price = deleteCommaFromNumber(td[1].innerHTML);
    sellingPric = deleteCommaFromNumber(td[2].innerHTML);
    PurchasingPrice = deleteCommaFromNumber(td[3].innerHTML);
    priceText.value = td[1].innerHTML;
    sellingText.value = td[2].innerHTML;
    purchasingText.value = td[3].innerHTML;
    td[1].innerHTML = "";
    td[2].innerHTML = "";
    td[3].innerHTML = "";
    td[1].appendChild(priceText);
    td[2].appendChild(sellingText);
    td[3].appendChild(purchasingText);
    var div = td[4].getElementsByTagName('div')[0];
    div.style.display = "block";
}
function cancelExchangeUpdate(element) {
    var row = getRowFormAnyElement(element);
    var div = element.parentElement;
    div.style.display = "none";
    var td = row.getElementsByTagName('td');
    td[1].innerHTML = numberWithCommas(price);
    td[2].innerHTML = numberWithCommas(sellingPric);
    td[3].innerHTML = numberWithCommas(PurchasingPrice);
    td[4].getElementsByTagName('button')[0].style.display = "block";

}
function saveExchangeFunction(element, Id) {
    var row = getRowFormAnyElement(element);
    var td = row.getElementsByTagName('td');
    var newprice = deleteCommaFromNumber(td[1].getElementsByTagName('input')[0].value);
    var newsellingPric = deleteCommaFromNumber(td[2].getElementsByTagName('input')[0].value);
    var newPurchasingPrice = deleteCommaFromNumber(td[3].getElementsByTagName('input')[0].value);
    if (price == newprice && sellingPric == newsellingPric && newPurchasingPrice == PurchasingPrice) {
        cancelExchangeUpdate(element);
        return;
    }
    if (newprice == "لايوجد") {
        newprice = null;
    }
    if (newsellingPric == "لايوجد") {
        newsellingPric = null;
    }
    if (newPurchasingPrice == "لايوجد") {
        newPurchasingPrice = null;
    }
    $.post(
        'UpdateExchange', {
            Id: Id,
            price: newprice,
            sellingPric: newsellingPric,
            PurchasingPrice: newPurchasingPrice
        }, function () {
            price = newprice;
            sellingPric = newsellingPric;
            PurchasingPrice = newPurchasingPrice;
            cancelExchangeUpdate(element);
        }
    );
}