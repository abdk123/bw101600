const url = window.location.href;
const companyId = url.substr(url.indexOf('?') + 4, url.length - 1);

var companyBalance = $('#companyBalance').DataTable({
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
function FillCashFlowCompany(companyId, coinId, from, to) {
    $.get(
        'GetCashFlow', {
            companyId: companyId,
            coinId: coinId,
            from: from,
            to: to
        },
        function (data) {
            cashFlowTable.clear().draw();
            for (var i = 0; i < data.length; i++) {
                var Incom = "";
                var outer = "";
                if (data[i].amount > 0)
                    Incom = data[i].amount;
                else if (data[i].amount < 0)
                    outer = data[i].amount;
                var status = data[i].Balnce > 0 ? "/له" : "/عليه";
                if (data[i].Balnce == 0) {
                    status = "";
                }
                cashFlowTable.row.add([
                    '',
                    numberWithCommas(data[i].Balnce) + status,
                    numberWithCommas(Incom),
                    numberWithCommas(outer),
                    data[i].comission,
                    data[i].secoundComission,
                    data[i].Date,
                    data[i].recvicerName,
                    data[i].senderName,
                    data[i].country,
                    data[i].Type,
                    data[i].Number,
                    data[i].Note,
                    data[i].Id
                ]).draw();

            }
        }
    );
}
var cashFlowTable = $('#cashFlowTable').DataTable({
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

$('#coinCashFlow').change(function () {
    if ($(this).val() == "") {
        cashFlowTable.clear().draw();
        return;
    }
    var from = $('#fromCashFlow').val();
    var to = $('#toCashFlow').val();
    FillCashFlowCompany(companyId, $(this).val(), from, to);

});
var CompanyCoinTable = $('#CompanyCoinTable').DataTable({
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
var countryCompanyTable = $('#countryCompanyTable').DataTable({
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
    },

});
var comissionTable = $('#comissionTable').DataTable({
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
    },

});
function fillComissionTable() {
    comissionTable.clear().draw();
    if ($('#Coins').val() == "")
        return;
    if ($('#countrySelectForComission').val() == "")
        return;
    $.post(
        'GetComissionForCompany', {
            coinId: $('#Coins').val(),
            comanyCountryId: $('#countrySelectForComission').val()
        },
        function (data) {

            for (var i = 0; i < data.length; i++) {
                comissionTable.row.add([
                    numberWithCommas(data[i].StartRange, true),
                    numberWithCommas(data[i].EndRange, true),
                    new Date(getDateFromAspNetFormat(data[i].Created)).toLocaleDateString(),
                    numberWithCommas(data[i].Cost, true),
                    numberWithCommas(data[i].Ratio, true)
                ]).draw();
            }
        }
    )
}
$(document).ready(function () {
    console.log(companyId);
    FillCurrentBalance(companyId);
    FillCountrySelect(companyId);
    FillCoinCompanyTable(companyId);
    FillCountryTable(companyId);
    FillCoinCashFlowSelct();
    FillCountrySelectForComission(companyId);
});

function FillCoinCompanyTable(id) {
    $.post(
        '_JSONGetCompanyCoins', {
            companyId: id
        },
        function (data) {
            for (var i = 0; i < data.length; i++) {

                CompanyCoinTable.row.add([
                    data[i].name,
                    numberWithCommas(data[i].bank, true),
                    numberWithCommas(data[i].MaxCreditor, true),
                    numberWithCommas(data[i].MaxDebit, true),
                    CreateCoinChoicFunctionForCompanyInitalBalnce(data[i].Id) + CreateCoinUpdateDivForCompanyInitalBalnce(data[i].Id),
                ]).draw();
            }
        }
    )
}
function FillCoinCashFlowSelct() {
    var coinCashFlow = document.getElementById('coinCashFlow');
    $.post(
        'Coins',
        function (data) {
            var mainOption = document.createElement('option');
            mainOption.innerHTML = "اختر العملة";
            mainOption.value = "";
            coinCashFlow.appendChild(mainOption);
            for (var i = 0; i < data.length; i++) {
                var option = document.createElement('option');
                option.innerHTML = data[i].Name;
                option.value = data[i].Id;
                coinCashFlow.appendChild(option);
            }
        });

}
$('#addCoinToCompany').click(function () {
    var companyCoinMessage = document.getElementById('companyCoinMessage');
    var Selectcoin = document.getElementById('coinSelect');
    var initialBalance = document.getElementById('initialBalance');
    var maxCreditor = document.getElementById('maxCreditor');
    var maxDebit = document.getElementById('maxDebit');
    if (Selectcoin.value == "") {
        companyCoinMessage.style.color = "red";
        companyCoinMessage.innerText = "يجب تحديد العملة";
        return;
    }
    companyCoinMessage.innerText = "";
    $.post(
        '_AjaxAddCoinForCompany', {
            companyId: companyId,
            coinId: Selectcoin.value,
            initialBalance: deleteCommaFromNumber(initialBalance.value),
            maxCreditor: deleteCommaFromNumber(maxCreditor.value),
            maxDebit: deleteCommaFromNumber(maxDebit.value),
        },
        function (data) {
            console.log(data);
            if (data != "null") {
                CompanyCoinTable.row.add([
                    data.name,
                    numberWithCommas(data.bank),
                    numberWithCommas(data.MaxCreditor),
                    numberWithCommas(data.MaxDebit),
                    FlipBoolToYesOrNo(data.Enabled),
                    's'
                ]).draw();
                companyBalance.clear().draw();
                FillCurrentBalance(companyId);
                Selectcoin.remove(Selectcoin.selectedIndex);
                Selectcoin.value = "";
                initialBalance.value = "";
                maxCreditor.value = "";
                maxDebit.value = "";
            } else {
                $.confirm({
                    title: "خطاء",
                    content: "هناك خطاء قد حدث الرجاء إعادة تحميل الصفحة و المحاولة مجدداً :(",
                    buttons: {
                        موافق: function () {
                        }
                    }
                });
            }
        }
    )

});
function FillCountryTable(companyId) {

    $.post(
        'GetCountry', {
            id: companyId
        },
        function (data) {
            for (var i = 0; i < data.length; i++) {
                countryCompanyTable.row.add([
                    data[i].CountryName,
                    FlipBoolToYesOrNo(data[i].IsEnabled),
                    's'
                ]).draw();
            }
        }
    );
}
function FillCountrySelectForComission(companyId) {
    var select = document.getElementById('countrySelectForComission');
    select.innerHTML = "";
    var mainOption = document.createElement('option');
    mainOption.value = "";
    mainOption.innerText = "الرجاء اختيار المنطقة";
    select.appendChild(mainOption);
    $.post(
        'GetCountry', {
            id: companyId
        },
        function (data) {
            for (var i = 0; i < data.length; i++) {
                var option = document.createElement('option');
                option.value = data[i].Id;
                option.innerText = data[i].CountryName;
                select.appendChild(option);
            }
        }
    );
}


function FillCountrySelect(companyId) {
    var countrySelect = document.getElementById('countrySelect');
    countrySelect.innerHTML = "";
    var mainOption = document.createElement('option');
    mainOption.innerHTML = "اختر المدينة";
    mainOption.value = "";
    countrySelect.appendChild(mainOption);
    $.post(
        'GetCountryNotinCompany', {
            id: companyId
        },
        function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].IsEnabled) {
                    var option = document.createElement('option');
                    option.value = data[i].Id;
                    option.innerText = data[i].Name;
                    countrySelect.appendChild(option);
                }
            }
        }
    )
}
function FillCurrentBalance(id) {
    $.post(
        '_JsonGetBalance', {
            companyId: id
        },
        function (data) {
            for (var i = 0; i < data.length; i++) {
                var onHim = parseFloat(data[i].onHim);
                if (onHim < 0) {
                    onHim *= -1;
                }
                companyBalance.row.add([
                    data[i].coinName,
                    numberWithCommas(data[i].forHim, true),
                    numberWithCommas(onHim, true),
                    numberWithCommas(data[i].MaxCreditor, true),
                    numberWithCommas(data[i].MaxDebit, true),
                    "<button class='btn btn-primary'>تفاصيل</button>"
                ]).draw();
            }
        }
    );
}
$('#addCountryToCompany').click(function () {
    var countrySelect = document.getElementById('countrySelect');
    if (countrySelect.value == "") {
        alert('يجب عليك تحديد المنطقة');
        return;
    }
    $.post(
        'AddCountry', {
            companyId: companyId,
            countryId: countrySelect.value,
        },
        function (data) {
            countryCompanyTable.row.add([
                data.CountryName,
                FlipBoolToYesOrNo(data.IsEnabled),
                's'
            ]).draw();
            $('#countrySelect').find('option:selected').remove().end();
            FillCountrySelectForComission(companyId);
        }
    );

});
function fillCompanyCashFlowTable() {
    var fromCashFlow = document.getElementById('fromCashFlow');
    if (fromCashFlow.value == "") {
        return;
    }
}
function CreateCoinChoicFunctionForCompanyInitalBalnce(id) {
    var button = document.createElement("button");
    button.setAttribute("class", "btn btn-success");
    button.innerText = "تعديل";
    button.setAttribute("onclick", "CoinEditFuncrtionForCompanyInitalBalnce(this);");
    button.setAttribute("name", "CoinEditBtn");
    return button.outerHTML;
}
var increment = 0;
var initalBalnce;
var maxCreditor;
var maxDebit;
function CreateCoinUpdateDivForCompanyInitalBalnce(id) {
    var updateDiv = document.createElement('div');
    updateDiv.style.display = "none";

    var SaveDiv = document.createElement("div");
    SaveDiv.setAttribute("class", "col-lg-3");
    var CancelDiv = SaveDiv.cloneNode();

    updateDiv.appendChild(SaveDiv);
    updateDiv.appendChild(CancelDiv);

    var savebtn = document.createElement("button");
    SaveDiv.appendChild(savebtn);
    savebtn.setAttribute("class", "btn btn-success");
    savebtn.setAttribute("onclick", "CoinSaveFuncrtionForCompanyInitalBalnce(this," + id + ");");
    savebtn.style.width = "100px";
    savebtn.style.marginLeft = 10;
    savebtn.innerText = "حفظ";

    var cancelBtn = document.createElement('button');
    CancelDiv.appendChild(cancelBtn);
    cancelBtn.setAttribute("class", "btn btn-danger");
    cancelBtn.setAttribute('onclick', 'CoinCancelFuncrtionForCompanyInitalBalnce(this,' + id + ');');
    cancelBtn.innerText = "إلغاء";
    cancelBtn.style.width = "100px";
    CancelDiv.appendChild(cancelBtn);

    return updateDiv.outerHTML;
}
function CoinEditFuncrtionForCompanyInitalBalnce(element) {
    //var ChoicDive = element.parentElement.parentElement;
    //ChoicDive.style.display = "none";
    var UpdateDiv = element.nextSibling;
    UpdateDiv.style.display = "block";
    element.style.display = "none";

    //var row = ChoicDive.parentElement.parentElement;
    var row = getRowFormAnyElement(element);
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

    var CountryEditBtn = document.getElementsByName("CoinEditBtn");
    for (var i = 0; i < CountryEditBtn.length; i++) {
        CountryEditBtn[i].disabled = true;
    }
}
function CoinCancelFuncrtionForCompanyInitalBalnce(element, Id) {
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
function CoinSaveFuncrtionForCompanyInitalBalnce(element, Id) {



    var row = getRowFormAnyElement(element);
    var tds = row.getElementsByTagName('td');
    var newInital = deleteCommaFromNumber(tds[1].getElementsByTagName('input')[0].value);
    var newMaxCreditor = deleteCommaFromNumber(tds[2].getElementsByTagName('input')[0].value);

    var newMaxDebit = deleteCommaFromNumber(tds[3].getElementsByTagName('input')[0].value);
    if (newInital == initalBalnce && newMaxCreditor == maxCreditor && newMaxDebit == maxDebit) {
        CoinCancelFuncrtionForCompanyInitalBalnce(element);
        return;
    }
    var def;

    if (isNaN(initalBalnce)) {
        def = newInital;
    } else {
        def = newInital - initalBalnce;
    }
    maxCreditor = newMaxCreditor;
    maxDebit = newMaxDebit;
    initalBalnce = newInital;

    $.post(
        'updateCompanyCoin',
        {
            companyCahsid: Id,
            def: def,
            maxCreditor: maxCreditor,
            maxDeibt: maxDebit,
        }, function (data) {
            CoinCancelFuncrtionForCompanyInitalBalnce(element);
            companyBalance.clear().draw();
            FillCurrentBalance(companyId);
        }
    )
}
$('#addComission').click(function () {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    if ($('#Coins').val() == "") {
        toastr["error"]("يجب ان تحدد العملة ", "خطاْ");
        return;
    }
    if ($('#countrySelectForComission').val() == "") {
        toastr["error"]("يجب ان تحدد الوجهة", "خطاْ");
        return;
    }
    if ($('#startRange').val() == "") {
        toastr["error"]("يجب ان تحدد مجال البداية ", "خطاْ");
        return;
    }
    //if ($('#endRange').val() == "") {
    //    toastr["error"]("يجب ان تحدد مجال الناية", "خطاْ");
    //    return;
    //}
    if ($('#type').val() == "") {
        toastr["error"]("يجب ان تحدد نوع العمولة ", "خطاْ");
        return;
    }
    if ($('#value').val() == "") {
        toastr["error"]("يجب ان تحدد قيمة العمولة", "خطاْ");
        return;
    }
    var cost = null;
    var ratio = null;
    if ($('#type').val() == 1) {
        cost = $('#value').val();
    } else {
        ratio = $('#value').val();
    }
    $.post(
        'AddComission', {
            companyCouutryId: $('#countrySelectForComission').val(),
            coinId: $('#Coins').val(),
            startRange: $('#startRange').val(),
            endRange: $('#endRange').val(),
            cost: cost,
            ratio: ratio
        }, function (data) {
            if (data == "true") {
                fillComissionTable();
            }
        }
    )
});