$('#Coins').change(async function () {

    $('#AllCoins').val('').change();
    $('#AllCoins option').each(function () {
        $(this).prop('disabled', false);
    });
    var coinId = $(this).val();
    if (coinId == "") {
        $('#FirstCoinExchange').text("");
        $('#PurchasingPriceDiv').show();
        return;
    }
    var isMainCoin = await IsMainCoin(coinId);
    if (!(isMainCoin == "True")) {
        var exchangePric = await GetCoinExchange(coinId);
        $('#PurchasingPriceDiv').show();
        $('#FirstCoinExchange').text(exchangePric.PurchasingPrice ? exchangePric.PurchasingPrice : "لم يعرف");
    } else {
        $('#PurchasingPriceDiv').hide();
    }
    $('#AllCoins option[value=' + $(this).val() + ']').prop('disabled', true);
});

$('#AllCoins').change(async function () {
    var coinId = $(this).val();
    if (coinId == "") {
        $('#secoundCoinExchangePrice').text('');
        $('#SellingPriceDiv').show();
        return;
    }
    var isMainCoin = await IsMainCoin($(this).val());
    if (!(isMainCoin == "True")) {
        var exchangePric = await GetCoinExchange(coinId);
        $('#SellingPriceDiv').show();

        $('#secoundCoinExchangePrice').text(exchangePric.SellingPrice ? exchangePric.SellingPrice : "لم يعرف");
    } else {
        $('#SellingPriceDiv').hide();
    }
});
async function IsMainCoin(coinId) {
    var d;
    return $.post(
        '/BwCoins/IsMainCoin', {
            coinId: coinId
        },
        function (data) {

            return data;
        }
    );
}
async function GetCoinExchange(coinId) {
    return $.post(
        'GetCoinExchange', {
            coinId: coinId
        },
        function (data) {
            return data;
        }
    )
}
$(document).ready(function () {
    $('#clientSelect').select2({
        tags: true
    });
});
$('#TypeOfPay').change(function () {
    hideAllReciverDivs();
    var typeOfPay = $(this).val();
    if (typeOfPay == 1) {
        $('#normalClient').show();
    } else if (typeOfPay == 2) {
        $('#AgentClient').show();
    } else {
        $('#CompanyDiv').show();
    }
});
function hideAllReciverDivs() {
    $('#normalClient').hide();
    $('#AgentClient').hide();
    $('#CompanyDiv').hide();
}
$('#firstCoinAmout').keyup(function () {

    CalcCommission();
});
function CalcCommission() {
    var firtCoin = $('#Coins').val();

    var secoundCoin = $('#AllCoins').val();
    if (firtCoin == "" || secoundCoin == "") {
        $('#secounCoinAmout').val("");
        return;
    }
    $.post(
        'CalcForFirstCoin', {
            SellingCoinId: firtCoin,
            PurchasingCoinId: secoundCoin,
            amountFromFirstCoin: $('#firstCoinAmout').val()
        },
        function (data) {
            $('#secounCoinAmout').val(data);
        }
    )
}

$('#submit').click(async function () {
    
    //var validate = validation();
    //if (validate == false) {
    //    return;
    //}

    var clientId = await clientValidation();
    if (clientId == false) {
        return;
    }
    $.post(
        'ExchangeForNormalClient', {
            clientId: clientId,
            sellingCoinId: $('#Coins').val(),
            purchasingCoinId: $('#AllCoins').val(),
            FirstAmount: $('#firstCoinAmout').val(),
        }, function (data) {
            if (data == "true") {
                toastr["success"]("تم");
                emptyForm();
            }
        }
    )
});

function emptyForm() {
    $('#Coins').val('').change();
    $('#TypeOfPay').val('1').change();
    $('#clientSelect').val('').change();
    $('#firstCoinAmout').val('');
    $('#secounCoinAmout').val('');
}
function validation() {

    var firtCoin = $('#Coins').val();
    if (firtCoin == "") {
        toastr["error"]("يجب تحديد العملة الأولى");
        return false;
    }
    var secoundCoin = $('#AllCoins').val();
    if (secoundCoin == "") {
        toastr["error"]("يجب تحديد العملة الثانية");
        return false;
    }


    var firstAmount = $('#firstCoinAmout').val();
    if (firstAmount == "") {
        toastr["error"]("يجب كتابة القيمة من العملة");
        return false;
    }
    var firstAmount = $('#firstCoinAmout').val();

}
async function clientValidation() {
    var clientVal = $('#clientSelect').val();
    if (clientVal == "") {
        toastr["error"]("يجب اختيار الزبون");
        return false;
    }
    if (isNaN(clientVal)) {
        await $.post(
            '/BwClients/AddClientWithJustName', {
                FullName: clientVal,
            },
            function (data) {
                clientVal = data;
            }
        )
    }
    return clientVal;
}
