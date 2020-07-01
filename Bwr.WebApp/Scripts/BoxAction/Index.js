let clientBalnae;
let companyBalnce;

function emptyForm() {
    $('#typeOfAction').val(-1).change();
    $('#FirstAcountSelect').val(1).change();
    $('#amout').val("");
    $('#note').val("");
    $('#secoundAcount').val(1).change();
    $('#companies').val("").change();
    $('#Agent').val("").change();
}
$('#typeOfAction').change(function () {

    //var FirstAcountSelect = document.getElementById('FirstAcountSelect');
    //FirstAcountSelect.getElementsByTagName('option')[1].hidden = !FirstAcountSelect.getElementsByTagName('option')[1].hidden;
    showFromAcount($(this).val(), $("#FirstAcountSelect").val());
});
$('#FirstAcountSelect').change(function () {

    showFromAcount($('#typeOfAction').val(), $(this).val());

});
function showFromAcount(typeOfAction, acountId) {

    $('div[name="acountDiv"]').each(function (index) {
        $(this).hide();
    });
    if (acountId == 3) {
        $('#agentDiv').show(0, function () {
            $('#Agent').select2();
        });
        return;
    }
    if (acountId == 4) {
        $('#companyDiv').show(0, function () {
            $('#companies').select2();
        });
        return;
    }
    if (acountId == 1) {
        if ($('#typeOfAction').val() == -1) {
            $('#ExpencesDiv').show();
            return;
        } else {
            $('#incominingDiv').show();
            return;
        }
    }
}


function GetClientBalanceByCoin(clientId, coinId) {
    $.post(
        '/BwClients/GetBlanace',
        {
            clientId: clientId,
            coinId: coinId
        }, function (data) {
            clientBalnae = data;
            var balnce = numberWithCommas(parseFloat(data.Total));
            $('#AgentnewBalnce').text(balnce);
            $('#AgentcurrentBalnce').text(numberWithCommas(balnce));
        }
    );
}
function getCompanyBalnceByCoin(companyId, coinId) {
    $.post(
        '/BwCompanies/GetCompanyBanceById', {
            companyId: companyId,
            coinId: coinId
        }, function (data) {
            companyBalnce = data;
            var balnce = numberWithCommas(parseFloat(data.Total));
            $('#companycurrentBalnce').text(balnce);
            $('#copanynewBalnce').text(balnce);
        }
    )
}
$('#Coins').change(function () {
    if ($('#Agent').val() == "") {
        resetAgentBlance();
    } else {
        GetClientBalanceByCoin($('#Agent').val(), $(this).val());
    }
    if ($('#companies').val() == "") {
        resetCompanyBalnce();
    } else {
        getCompanyBalnceByCoin($('#companies').val(), $(this).val())
    }
    if ($('#Agent').val() != '') {
        ClacAgentCurrentBalcne();
    }
});
$('#companies').change(function () {
    if ($(this).val() == "") {
        resetCompanyBalnce();
        return;
    }
    getCompanyBalnceByCoin($(this).val(), $('#Coins').val());
})
$('#Agent').change(function () {
    if ($(this).val() == "") {
        resetAgentBlance();
        return;
    }
    GetClientBalanceByCoin($(this).val(), $('#Coins').val());
    ClacAgentCurrentBalcne();
});

function resetAgentBlance() {
    $('#AgentcurrentBalnce').empty();
    $('#AgentnewBalnce').empty();
}
function resetCompanyBalnce() {
    $('#companycurrentBalnce').empty();
    $('#copanynewBalnce').empty();
}
$('#submit').click(function () {
    var amount = $('#amout').val();
    if (amount == "" || amount == 0) {
        toastr["error"]("يجب عليك ان تحدد المبلغ", "خطاْ");
        return;
    }
    amount = deleteCommaFromNumber(amount);
    var coinId = $('#Coins').val();
    var note = $('#note').val();


    //0  for pay and 1 for recive   
    var actionType = parseInt($('#typeOfAction').val());

    var firstAcountType = $('#FirstAcountSelect').val();
    //general
    if (firstAcountType == 1) {
        if (actionType == -1) {
            $.post(
                'payExpenciveFromMainBox', {
                    expenciveId: parseInt($('#Expense').val()),
                    coinId: coinId,
                    amount: amount,
                    note: note
                }, function (data) {

                    toastr["success"]("تم");
                    emptyForm();
                }
            )
        }
        else {
            $.post(
                'ReciverIncomeToMainBox', {
                    IncomeId: $('#Income').val(),
                    coinId: coinId,
                    amount: amount,
                    note: note
                }, function (data) {
                    toastr["success"]("تم");
                    emptyForm();
                }
            );
        }
    }
    // client
    else if (firstAcountType == 3) {
        var client = $('#Agent').val();
        if (client == "") {
            toastr["error"]("يجب عليك ان تحدد العميل", "خطاْ");
            return;
        }
        if (actionType == -1) {
            $.post(
                "PayForClientFromMainBox", {
                    clientId: $('#Agent').val(),
                    coinId: coinId,
                    amount: amount,
                    note: note
                }, function (data) {
                    toastr["success"]("تم");
                    emptyForm();
                });
        }
        else if (actionType == 1) {

            $.post(
                'ReciveFromClientToMainBox', {
                    clientId: $('#Agent').val(),
                    coinId: coinId,
                    amount: amount,
                    note: note
                }, function (data) {
                    toastr["success"]("تم");
                    emptyForm();
                });
        }
    }
    else if (firstAcountType == 4) {
        var company = $('#companies').val();
        if (company == "") {
            toastr["error"]("يجب عليك ان تحدد الشركة", "خطاْ");
            return;
        }
        if (actionType == -1) {
            $.post(
                "PayForCompanyFromMainBox", {
                    companyId: $('#companies').val(),
                    coinId: coinId,
                    amount: amount,
                    note: note
                }
            ), function (data) {
                toastr["success"]("تم");
                emptyForm();
            }
        }
        else if (actionType == 1) {

            $.post(
                'ReciveFromCompanyToMainBox', {
                    companyId: $('#companies').val(),
                    coinId: coinId,
                    amount: amount,
                    note: note
                }, function (data) {
                    toastr["success"]("تم");
                    emptyForm();
                }
            );
        }
    }
});
$('#amout').keyup(() => {

    ClacAgentCurrentBalcne();
});
function ClacAgentCurrentBalcne() {
    var amount = parseFloat(deleteCommaFromNumber($('#amout').val()));
    if (isNaN(amount)) {
        amount = 0;
    }
    var typeOfAtionVal = $('#typeOfAction').val();

    if (typeOfAtionVal == 1) {

        $('#AgentnewBalnce').text(numberWithCommas(clientBalnae.Total + amount));
    } else {
        $('#AgentnewBalnce').text(numberWithCommas(clientBalnae.Total - amount));
    }

}
function CalcCompanyCurrentBalnce() {
    var amount = parseFloat(deleteCommaFromNumber($('#amout').val()));
    if (isNaN(amount)) {
        amount = 0;
    }
    var typeOfAtionVal = $('#typeOfAction').val();
    if (typeOfAtionVal == 1) {
        $('#copanynewBalnce').text(numberWithCommas(parseFloat(companyBalance.Total) + amount));
    } else {
        $('#copanynewBalnce').text(numberWithCommas(parseFloat(companyBalance.Total) - amount));
    }
}