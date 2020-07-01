const coinComission = $('#coinComission');
const countryComission = $('#countryComission');
const comissionFrom = $('#comissionFrom');
const comissionFor = $('#comissionFor');
const comissionType = $('#comissionType');
const comissionAmount = $('#comissionAmount');
const addComissionbtn = $('#addComissionbtn');

$(document).ready(function () {
    fillCoinComission();
    FillCountryComission();
});

function fillCoinComission() {
    coinComission.empty();
    $.post(
        '_JSONGetCoin',
        function (data) {
            coinComission.append(new Option('اختر العملة', ""));
            for (var i = 0; i < data.length; i++) {
                coinComission.append(new Option(data[i].Name, data[i].Id));
            }
        }
    )
}
function FillCountryComission() {
    countryComission.empty();
    $.post(
        'GetAllRegions',
        function (data) {
            countryComission.append(new Option("اختر المنطقة", ""));
            for (var i = 0; i < data.length; i++) {
                countryComission.append(new Option(data[i].Name, data[i].Id));
            }
        }
    );
}

coinComission.change(function () {
    // fill branch comission table
});
addComissionbtn.click(function () {

    if (!comissionInputValidate())
        return;
    var coinId = coinComission.val();
    var countryId = countryComission.val();
    var startRange = comissionFrom.val();
    var endRnage = comissionFor.val();

    var cost=null;
    var ratio = null;
    if (comissionType.val() == 1) {
        cost = comissionAmount.val();
    } else {
        ratio = comissionAmount.val();
    }

    $.post(
        'AddComission', {
            coinId: coinComission.val(),
            countryId: countryComission.val(),
            startRange: comissionFrom.val(),
            endRange: comissionFor.val(),
            cost: cost,
            ratio: ratio
        }, function (data) {
            addRowForComissionTable(data);
        }
    )
});

function addRowForComissionTable(data) {
    comissionTalbe.row.add([
        data.StartRange,
        data.EndRange,
        data.Cost,
        data.Ratio,
        data.Date
    ]).draw();
}
function comissionInputValidate() {
    if (coinComission.val() == null || coinComission.val() == "") {
        toastr["error"]("يجب تحديد العملة");
        return false;
    }
    if (countryComission.val() == null || countryComission.val() == "") {
        toastr["error"]("يجب تحديد المدينة");
        return false;
    }
    if (comissionFrom.val() == null || comissionFrom.val() == "") {
        toastr["error"]("يجب تحديد الحد الأدنى");
        return false;
    }
    //if (comissionFor.val() == null || comissionFor.val() == "") {
    //    toastr["error"]("يجب تحديد الحد الأدنى");
    //    return;
    //}
    if (comissionType.val() == null || comissionType.val() == "") {
        toastr["error"]("يجب تحديد نوع العمولة");
        return false;
    }
    if (comissionAmount.val() == null || comissionAmount.val() == "") {
        toastr["error"]("يجب تحديد القيمة");
        return false;
    }
    if (comissionFor.val() != null && comissionFor.val() != "")
        if (comissionFor.val() <= comissionFrom.val()) {
            toastr["error"]("يجب ان تكون القيمة الدنى اصغر من القيمة العليا ");
            return false;
        }
    return true;
}
function fillComissionTable(coinId, countryId) {
    comissionTalbe.clear().draw();
    $.post(
        'GetComission', {
            coinId: coinId,
            countryId: countryId
        },
        function (data) {
            for (var i = 0; i < data.length; i++) {
            addRowForComissionTable(data[i]);
            }
        }
    )
}

coinComission.change(function () {

    if (countryComission.val() == null || countryComission.val() == "" || countryComission.val() == undefined || coinComission.val() == null || coinComission.val() == undefined || coinComission.val() =="") {
        comissionTalbe.clear().draw();
        return;
    }
    fillComissionTable(coinComission.val(), countryComission.val());
});
countryComission.change(function () {
    if (countryComission.val() == null || countryComission.val() == "" || countryComission.val() == undefined || coinComission.val() == null || coinComission.val() == undefined || coinComission.val() == "") {
        comissionTalbe.clear().draw();
        return;
    }
    fillComissionTable(coinComission.val(), countryComission.val());
});