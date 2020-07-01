var mainRow;
var selectedCoin;
var tbody = document.getElementsByTagName('tbody')[0];
let mainCompanyBlances;
let AllCompanyBalnces;
function CheckCompanyBlance(companyId, coinId, amount) {

    var balnce = AllCompanyBalnces.filter(c => c.CompanyId == companyId && c.CoinId == coinId)[0];
    if (balnce.MaxDebit != null) {
        if ((balnce.Total + amount) > balnce.MaxDebit) {
            return false;
        }
    }
    return true;
}
function CheckMainCompanyBlances(coinId, Amount) {
    var balnce = mainCompanyBlances.filter(c => c.CoinId == coinId)[0];
    if (balnce.MaxCreditor != null) {
        if ((balnce.Total * -1) + Amount > balnce.MaxCreditor) {
            return false;
        }
    }
    return true;
}

$(document).ready(function () {
    var row = tbody.getElementsByTagName('tr')[0];
    mainRow = row.cloneNode(true);
    select2();
});
function select2() {
    $('.normalClientSelect').select2({
        tags: true,
        width:'resolve'
    });
    $('.agentSelect').select2({
        width:'resolve'
    });
}

function changeReciver(element) {
    var tpyeOfPayVal = element.value;
    var typeOfPayCell = element.parentElement;
    senderCill = typeOfPayCell.nextElementSibling;
    var normalAgentDiv = senderCill.getElementsByTagName('div')[0];
    var AgentDiv = senderCill.getElementsByTagName('div')[1];
    var comapnyDiv = senderCill.getElementsByTagName('div')[2];
    if (tpyeOfPayVal == 2) {
        AgentDiv.hidden = false;
        normalAgentDiv.hidden = true;
        comapnyDiv.hidden = true;
    } else if (tpyeOfPayVal == 3) {
        normalAgentDiv.hidden = true;
        AgentDiv.hidden = true;
        comapnyDiv.hidden = false;
    } else {
        normalAgentDiv.hidden = false;
        AgentDiv.hidden = true;
        comapnyDiv.hidden = true;
    }
    $('.normalClientSelect').select2({
        tags: true
    });
}

function addRowFunction(element) {


    var row = element.parentElement.parentElement;
    if (row.getElementsByTagName('td')[0].style.pointerEvents != 'none') {
        if (!CheckRow(row)) {
            return;
        }
        balanceArbitrage(row);
    }

    $('#Companies').attr("disabled", true);
    var rowTds = row.getElementsByTagName('td');
    for (var i = 0; i < rowTds.length; i++) {
        if (i + 1 == rowTds.length)
            continue;
        rowTds[i].setAttribute("style", "pointer-events:none;background-color:gray");
    }
    var lastCoin = rowTds[0].getElementsByTagName('select')[0].value;
    var newCoinSelect = mainRow.getElementsByTagName('td')[0].getElementsByTagName('select')[0];
    newCoinSelect.value = lastCoin;
    var companies = rowTds[6].getElementsByTagName('div')[2].getElementsByTagName('select')[1].innerHTML;
    mainRow.getElementsByTagName('td')[6].getElementsByTagName('div')[2].getElementsByTagName('select')[1].innerHTML = companies;

    tbody.appendChild(mainRow);
    mainRow = mainRow.cloneNode(true);
    element.style.display = 'none';
    $('#numberOfOuterTransaction').text(parseInt($('#numberOfOuterTransaction').text()) + 1);
    select2();
}
function balanceArbitrage(row) {
    var tds = row.getElementsByTagName('td');
    var coinId = tds[0].getElementsByTagName('select')[0].value;
    var amount = (tds[1].getElementsByTagName('input')[0].value);
    var ratio = tds[2].getElementsByTagName('input')[0].value;
    var comission = tds[3].getElementsByTagName('input')[0].value;
    comission = deleteCommaFromNumber(comission);
    var typeOfPay = tds[5].getElementsByTagName('select')[0].value;
    mainCompanyBlances.filter(c => c.CoinId == coinId)[0].Total -= parseFloat(amount) + parseFloat(comission);
    switch (typeOfPay) {
        case '2': {
        } break;
        case '3': {
            AddAmountTOCompany(tds[6], coinId, amount);
        } break;
    }
}
function CheckRow(row, bool) {
    if (!CheckCompanies()) {
        ErrorMessage("يجب عليك تحديد الشركة");
        return false;
    }
    var tds = row.getElementsByTagName('td');
    var coinId = tds[0].getElementsByTagName('select')[0].value;
    if (coinId == undefined || coinId == "") {
        if (bool == undefined)
            ErrorMessage("يجب عليك تحديد العملة");
        return;
    }

    var amount = (tds[1].getElementsByTagName('input')[0].value);
    if (amount == undefined || amount == "" || amount == 0) {
        if (bool == undefined)
            ErrorMessage("يجب عليك تحديد المبلغ");
        return;
    }
    amount = deleteCommaFromNumber(amount);

    var ratio = tds[2].getElementsByTagName('input')[0].value;
    if (ratio == undefined || ratio == "") {
        if (bool == undefined)
            ErrorMessage("يجب عليك تحديد النسبة ")
        return false;
    }

    var comission = tds[3].getElementsByTagName('input')[0].value;
    if (comission == undefined || comission == "") {
        if (bool == undefined)
            ErrorMessage("يجب عليك تحديد العمولة")
        return false;
    }
    comission = deleteCommaFromNumber(comission);
    if (!checkSendrByrow(row, bool)) {
        return false;
    }

    var typeOfPay = tds[5].getElementsByTagName('select')[0].value;
    if (typeOfPay == undefined || typeOfPay == "") {
        if (bool == undefined)
            ErrorMessage('يجب عليك اختيار نوع الدفع');
        return false;
    }
    switch (typeOfPay) {
        case '1': {

            if (!checkNormalReciver(tds[6], bool))
                return false;
        } break;
        case '2': {
            if (!checkAgent(tds[6], bool))
                return false;
        } break;
        case '3': {
            if (!checkCompany(tds[6], bool, coinId, parseFloat(amount))) {
                return false;
            }
        } break;
        default: {
            if (bool == undefined)
                ErrorMessage("هناك خطاء بنوع الدفع الرجاء إعادة تحميل الصفحة");
            return false;
        }
    }

    if (!CheckMainCompanyBlances(coinId, parseFloat(amount) + parseFloat(comission))) {
        if (bool == undefined) {
            if (HavePrivlege('BreakTheWall')) {
                //if privlege have password;
                var asn = confirm("سوف يتم تخطي الحد المسموح به للشركة " + $("#Companies option:selected").text() + " هل انت متأكد من ذالك ");
                if (!asn) {
                    return false;
                }
            }
            else {
                alert("لا يمكنك تحطي الحد المسوح به للشركة" + $("#Companies option:selected").text());
                return false;
            }
        }
    }
    return true;
}

// check sender Name
function checkSendrByrow(row, bool) {
    var tds = row.getElementsByTagName('td');
    var senderTd = tds[4];
    var inputs = senderTd.getElementsByTagName('select');
    var senderFirstName = inputs[0].value;
    if (senderFirstName == undefined || senderFirstName == "") {
        if (bool == undefined) {
            ErrorMessage("يجب ان تملأ حقل اسم للمرسل");
        }
        return false;
    }
    return true;
}

function ErrorMessage(message) {
    $.confirm({
        title: "خطاء",
        content: message,
        buttons: {
            موافق: {
            }
        }
    });
}


function CheckCompanies() {
    var Companies = document.getElementById('Companies');
    if (Companies.value == "") {
        return false;
    }
    return true;
}

function checkNormalReciver(td, bool) {
    var div = td.getElementsByTagName('div')[0];
    var select = div.getElementsByTagName('select')[0];
    if (select.value == "") {
        if (bool == undefined) {
            ErrorMessage("يجب ان تملأ حقل الأسم للمستقبل");

        }
        return false;
    }
    var reciverAddress = div.getElementsByTagName('input')[0].value;
    if (reciverAddress == undefined || reciverAddress == "") {
        if (bool == undefined)
            ErrorMessage("يجب عليك ان تملأ حقل العنوان للمستقبل");
        return false;
    }
    var phone = div.getElementsByTagName('input')[1].value;
    if (phone == undefined || phone == "") {
        if (bool == undefined)
            ErrorMessage("يجب عليك ان تملأ حقل رقم الهاتف للمستقبل");
        return false;
    }
    return true;
}
function checkAgent(td, bool) {
    var div = td.getElementsByTagName('div')[1];
    var Agent = div.getElementsByTagName('select')[0].value;
    if (Agent == undefined || Agent == "") {
        if (bool == undefined)
            ErrorMessage("يجب عليك تحديد العميل");
        return false;
    }
    return true;
}
function AddAmountTOCompany(td, coinId, amoun) {
    var div = td.getElementsByTagName('div')[2];
    var company = div.getElementsByTagName('select')[1];
    var companyComission = parseFloat(deleteCommaFromNumber(div.getElementsByTagName('input')[2].value));

    if (isNaN(companyComission)) {
        companyComission = 0;
    }

    var companyCoinBlance = AllCompanyBalnces.filter(c => c.CompanyId == company.value && c.CoinId == coinId)[0];

    companyCoinBlance.Total += amoun - companyComission;

}
function checkCompany(td, bool, coinId, amount) {
    var div = td.getElementsByTagName('div')[2];
    var company = div.getElementsByTagName('select')[1];

    if (company.value == undefined || company.value == "") {
        if (bool == undefined)
            ErrorMessage("يجب عليك اختيار الشركة المستقبلة");
        return false;
    }
    var clientSelect = div.getElementsByTagName('select')[0];
    if (clientSelect.value == "") {
        if (bool == undefined) {
            ErrorMessage("يجب عليك تحديد اسم المستقبل");
        }
        return false;
    }
    if (bool == undefined) {
        var commission = parseFloat(deleteCommaFromNumber(div.getElementsByTagName('input')[2].value));
        if (isNaN(commission)) {
            commission = 0;
        }
        amount -= commission;
        if (!CheckCompanyBlance(company.value, coinId, amount)) {
            if (HavePrivlege('BreakTheWall')) {
                var asn = confirm("سوف يتم تخطي الحد المسموح به للشركة " + company.options[company.selectedIndex].text + " هل انت متأكد من ذالك ");
                if (!asn) {
                    return false;
                }
            }
        }
    }
    return true;
}
function checkRevicverCompany(td) {
    var select = td.getElementsByTagName('select').value;
    if (select == undefined || select == "") {
        if (bool == undefined)
            ErrorMessage("يجب عليك تحديد الشركة");
        return false;
    }
    return true;
}
$('#Companies').change(function () {
    //get companyBalnces
    $.post(
        'GetCompanyBalances', {
            companyId: $(this).val()
        }, function (data) {
            mainCompanyBlances = data;
        });
    $.post(
        'GetOtherCompanyBalnces', {
            companyId: $(this).val()
        },
        function (data) {
            AllCompanyBalnces = data;

        }
    );
    //and get other company 
    // and recalc all fucking thing 
    var IncomeTransactionTable = document.getElementById('IncomeTransactionTable');
    var tbody = IncomeTransactionTable.getElementsByTagName('tbody')[0];
    var rows = tbody.getElementsByTagName('tr');
    var companySelect = document.getElementsByName('companySelect');
    for (var i = 0; i < companySelect.length; i++) {
        companySelect[i].innerHTML = "";
        var mainOption = document.createElement('option');
        mainOption.innerText = "اختر الشركة";
        mainOption.value = "";
        companySelect[i].appendChild(mainOption);
    }
    if (companySelect.value != "") {
        for (var i = 0; i < companySelect.length; i++) {
            FillcompanySelect(companySelect[i], $(this).val());
            if (rows.length > 1) {
                var row = companySelect[i].parentElement.parentElement.parentElement;
                if (row.getElementsByTagName('td')[5].getElementsByTagName('select')[0].value == 3) {
                    if (!CheckRow(row, true)) {
                        row.style.backgroundColor = "red";
                    }
                }
            }
        }
    }
});
function FillcompanySelect(select, id) {
    $.post(
        '_JSNOCompanyDontHaveId', {
            id: id,
        },
        function (data) {
            for (var i = 0; i < data.length; i++) {
                var option = document.createElement('option');
                option.innerText = data[i].Name;
                option.value = data[i].Id;
                select.appendChild(option);
            }
        }
    );
}

function ChangeRowColor(element) {
    if (checkCompany(element.parentElement.parentElement)) {
        element.parentElement.parentElement.parentElement.style.backgroundColor = null;
    }
}
function validateRowAfterAnyEvent(element) {
    var row = getRowFormAnyElement(element);
    if (row == undefined)
        return;
    if (CheckRow(row, true)) {
        row.style.backgroundColor = null;
    }
}
function getRowFormAnyElement(elemet) {
    if (elemet == undefined || elemet == null)
        return undefined;
    if (elemet.tagName == "TR") {
        return elemet;
    }
    return getRowFormAnyElement(elemet.parentElement);
}
function RemoveRow(element) {
    var IncomeTransactionTable = document.getElementById('IncomeTransactionTable');
    var tbody = IncomeTransactionTable.getElementsByTagName('tbody')[0];
    var rows = tbody.getElementsByTagName('tr');
    if (rows.length <= 1)
        return;
    //if (rows.length == 2) {
    //    rows[0].getElementsByTagName('td')[7].getElementsByTagName('button')[0].style.display = 'block';
    //}


    var row = getRowFormAnyElement(element);
    var rowIndex = 0;
    for (var i = 0; i < rows.length; i++) {
        if (rows[i] == row) {
            rowIndex = i;
            break;
        }
    }

    if (rowIndex != 0)
        rows[rowIndex - 1].getElementsByTagName('td')[7].getElementsByTagName('button')[0].style.display = 'block';
    RetriveMoney(row);
    row.remove();
    //not the last row
    //if (rows[rows.length - 1] != row) {
    //    RetriveMoney(row);
    //}
    //element.parentElement.parentElement.remove();
    $('#numberOfOuterTransaction').text(parseInt($('#numberOfOuterTransaction').text()) - 1);
}
function RetriveMoney(row) {
    var tds = row.getElementsByTagName('td');
    var coinId = tds[0].getElementsByTagName('select')[0].value;
    var amount = parseFloat(deleteCommaFromNumber(tds[1].getElementsByTagName('input')[0].value));
    var myCommission = parseFloat(deleteCommaFromNumber(tds[2].getElementsByTagName('input')[0].value));

    mainCompanyBlances.filter(c => c.CoinId == coinId)[0].Total += (amount) + (myCommission);
    var typeOfPay = tds[5].getElementsByTagName('select')[0].value;
    switch (typeOfPay) {
        case '2': {
        } break;
        case '3': {
            ReriveCompanyMoney(tds[6], coinId, amount);
        } break;
    }
}
function ReriveCompanyMoney(td, coinId, amout) {
    var div = td.getElementsByTagName('div')[2];
    var company = div.getElementsByTagName('select')[1];

    var companyComission = parseFloat(deleteCommaFromNumber(div.getElementsByTagName('input')[2].value));
    if (isNaN(companyComission)) {
        companyComission = 0;
    }
    var companyCoinBlance = AllCompanyBalnces.filter(c => c.CompanyId == company.value && c.CoinId == coinId)[0];
    companyCoinBlance.Total -= amout + companyComission;
}






function clacComission(element) {
    var row = getRowFormAnyElement(element);
    var amountTd = row.getElementsByTagName('td')[1];
    var amount = deleteCommaFromNumber(amountTd.getElementsByTagName('input')[0].value);
    var ratioTd = row.getElementsByTagName('td')[2];
    var ratio = deleteCommaFromNumber(ratioTd.getElementsByTagName('input')[0].value);

    var comissionTd = row.getElementsByTagName('td')[3];
    var comissionInput = comissionTd.getElementsByTagName('input')[0];
    comissionInput.value = numberWithCommas((parseFloat(amount) * parseFloat(ratio)) / 100) ? numberWithCommas((parseFloat(amount) * parseFloat(ratio)) / 100) : '0';
}
function calcRatio(element) {
    var row = getRowFormAnyElement(element);
    var amountTd = row.getElementsByTagName('td')[1];
    var amount = parseFloat(deleteCommaFromNumber(amountTd.getElementsByTagName('input')[0].value));
    var ratioTd = row.getElementsByTagName('td')[2];
    var comissionTd = row.getElementsByTagName('td')[3];
    var comissionInput = comissionTd.getElementsByTagName('input')[0];
    var comission = parseFloat(deleteCommaFromNumber(comissionInput.value));
    var ratioInput = ratioTd.getElementsByTagName('input')[0];
    if ((comission * 100 / amount) == 0) {
        ratioInput.value = 0;
        return;
    }
    ratioInput.value = numberWithCommas(comission * 100 / amount);
}






function test() {
    var x = JSON.parse('{"Transactions":[{"CoinId":"1039","Amount":100,"OurComission":12,"TypeOfPay":"1","Sender":{"Name":"مرسل 1"},"ReciverClinet":{"Name":"مستقبل 1","address":"عنوان مستقبل 1","Phone":"32423"}},{"CoinId":"1039","Amount":130,"OurComission":13,"TypeOfPay":"2","Sender":{"Name":"مرسل 2"},"AgentId":"6198","AgentCommission":"3"},{"CoinId":"1039","Amount":300,"OurComission":30,"TypeOfPay":"3","Sender":{"Name":"مرسل 1"},"ReciverCompany":{"CompanyId":"6039","CompanyCommission":10,"ReciverClinet":{"Name":"مستقبل 1 شركة 2","address":"عنوان","Phone":"2121"}}}],"MainCompanyId":"6038","Note":"ملاحظات"}');
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: "{Incometransacrions:" + JSON.stringify(x) + "}",
        url: "/BwTransactions/IncomeTransaction",
        success: function (data) {
            if (data == "true") {
                alert('تم');
                location.reload();
            }
            else {
                alert('حدث خطأ ما يجب إعادة المحاولة');

            }
        },
        error: function (eee) {
            alert('errro');
            console.log(eee);
        }
    }
    );
}



function GetClientInfo(element) {
    var value = element.value;
    var div = GetDiveFromAbyElement(element);
    var input = div.getElementsByTagName('input');
    var addressText = input[0];
    var phoneText = input[1];
    addressText.value = "";
    phoneText.value = "";
    if (isNaN(value) || value == "") {
        return;
    }
    $.post(
        'GetClientInformation', {
            clientId: value,
        },
        function (data) {
            addressText.value = data.Address;
            phoneText.value = data.Phone;
        }
    )
}
function Save() {
    var IncomeTransacrion = new IncomeTransactionTableDTO($('#Companies').val(), $('#note').val());
    var tbody = IncomeTransactionTable.getElementsByTagName('tbody')[0];
    var rows = tbody.getElementsByTagName('tr');
    var IsValidate = true;
    // added without testing
    var lastRow = rows[rows.length - 1];
    
    if (lastRow.getElementsByTagName('td')[0].style.pointerEvents == 'none') {
        if (!CheckRow(lastRow)) {
            return ;
        }
    }
    for (var i = 0; i < rows.length; i++) {
        if (!CheckRow(rows[i], true)) {
            rows[i].style.backgroundColor = "red";
            IsValidate = false;
        }
        else {
            var tds = rows[i].getElementsByTagName('td');
            var coinId = tds[0].getElementsByTagName('select')[0].value;
            var amount = parseFloat(deleteCommaFromNumber(tds[1].getElementsByTagName('input')[0].value));
            var ourComission = parseFloat(deleteCommaFromNumber(tds[3].getElementsByTagName('input')[0].value));
            var senderId;
            var senderName;
            var senderSelectValue = tds[4].getElementsByTagName('select')[0].value;
            if (isNaN(senderSelectValue)) {
                senderName = senderSelectValue;
            } else {
                senderId = senderSelectValue;
            }
            var sender = new ClientDTO(senderId, senderName);
            var typeOfPay = tds[5].getElementsByTagName('select')[0].value;
            var transacrtion = new IncomeTransacrionRow(coinId, amount, ourComission, sender, typeOfPay);

            switch (typeOfPay) {
                case "1": {
                    var div = tds[6].getElementsByTagName('div')[0];
                    var reciverClientSelectValue = div.getElementsByTagName('select')[0].value;
                    var clientId;
                    var clientName;
                    if (isNaN(reciverClientSelectValue)) {
                        clientName = reciverClientSelectValue;
                    } else {
                        clientId = reciverClientSelectValue;
                    }
                    var address = div.getElementsByTagName('input')[0].value;
                    var phone = div.getElementsByTagName('input')[1].value;
                    var reciverClientDTO = new ClientDTO(clientId, clientName, address, phone);
                    transacrtion.ReciverClinet = reciverClientDTO;
                } break;
                case "2": {
                    var div = tds[6].getElementsByTagName('div')[1];
                    var agnetId = div.getElementsByTagName('select')[0];
                    var agentCommissionText = div.getElementsByTagName('input')[0];
                    var agnetCommission = deleteCommaFromNumber(agentCommissionText.value)
                    transacrtion.AgentId = agnetId.value;
                    transacrtion.AgentCommission = agnetCommission;
                } break;
                case "3": {
                    var div = tds[6].getElementsByTagName('div')[2];

                    var companyId = div.getElementsByTagName('select')[1].value;
                    var companyComission = deleteCommaFromNumber(div.getElementsByTagName('input')[2].value);
                    companyComission = parseFloat(companyComission || 0);

                    var clientId;
                    var clientName;
                    var clientSelect = div.getElementsByTagName('select')[0];
                    if (isNaN(clientSelect.value)) {
                        clientName = clientSelect.value;
                    } else {
                        clientId = clientSelect.value;
                    }

                    var clientAddress = div.getElementsByTagName('input')[0].value;
                    var clientPhone = div.getElementsByTagName('input')[1].value;
                    var ReciverClient = new ClientDTO(clientId, clientName, clientAddress, clientPhone);

                    var reciverCompany = new ReciverCompanyDTO(companyId, companyComission, ReciverClient);
                    transacrtion.ReciverCompany = reciverCompany;
                } break;
            }

            IncomeTransacrion.Transactions.push(transacrtion);
        }
    }
    if (IsValidate) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: "{Incometransacrions:" + JSON.stringify(IncomeTransacrion) + "}",
            url: "/BwTransactions/IncomeTransaction",
            success: function (data) {
                if (data == "true") {
                    alert('تم');
                    location.reload();
                }
                else {
                    alert('حدث خطأ ما يجب إعادة المحاولة');
                    location.reload();
                }
            },
            error: function (eee) {
                alert('حدث خطأ ما يجب إعادة المحاولة');
                location.reload();
            }
        }
        );
    } else {
        alert('يجب تكامل البيانات');
        //location.reload();
        return;
    }
}


//async function Save() {
//    var IncomeTransactionTable = document.getElementById('IncomeTransactionTable');
//    var tbody = IncomeTransactionTable.getElementsByTagName('tbody')[0];
//    var rows = tbody.getElementsByTagName('tr');
//    var IsValidate = true;
//    for (var i = 0; i < rows.length; ) {
//        if (!CheckRow(rows[i], true)) {
//            rows[i].style.backgroundColor = "red";
//            IsValidate = false;
//        }
//    }
//    if (IsValidate) {
//        var rows = tbody.getElementsByTagName('tr');
//        for (var i = 0; i < rows.length; i++) {
//            var tds = rows[i].getElementsByTagName('td');
//            var coinId = tds[0].getElementsByTagName('select')[0].value;
//            var amount = tds[1].getElementsByTagName('input')[0].value;
//            amount = deleteCommaFromNumber(amount);
//            var comission = tds[3].getElementsByTagName('input')[0].value;
//            comission = deleteCommaFromNumber(comission);
//            var senderInputs = tds[4].getElementsByTagName('input');
//            var senderFullName = senderInputs[0].value;
//            var typOfPay = tds[5].getElementsByTagName('select')[0].value;
//            var Companies = document.getElementById('Companies');
//            var note = document.getElementById('note').value;
//            var companyId = Companies.value;
//            if (typOfPay == 1) {
//                var nomalAgent = tds[6].getElementsByTagName('div')[0];
//                var reciverInputs = nomalAgent.getElementsByTagName('input');
//                var reciverFullName = reciverInputs[0].value;
//                var address = reciverInputs[1].value;
//                var phone = reciverInputs[2].value;
//                var senderId;
//                await $.post('AddClient', {
//                    FullName: senderFullName,
//                }, function (data) {
//                    senderId = parseInt(data);
//                }
//                );
//                var reciverId;
//                await $.post('AddClient', {
//                    FullName: reciverFullName,
//                    address: address,
//                    phone: phone
//                },
//                    function (data) {
//                        reciverId = parseInt(data);
//                    }
//                );
//                await $.post(
//                    'IncomeTransactionForNormalAgent', {
//                        senderId: senderId,
//                        RecivcerId: reciverId,
//                        coinId: coinId,
//                        companyId: companyId,
//                        amount: amount,
//                        comission: comission,
//                        note: note,
//                    },
//                    function (data) {
//                        if (data == "True") {
//                            rows[i].setAttribute("class", "true");
//                        } else {
//                            rows[i].setAttribute("class", "false");
//                        }
//                    }
//                );
//            }
//            else if (typOfPay == 2) {
//                var AgentClient = tds[6].getElementsByTagName('div')[1];
//                var agentId = AgentClient.getElementsByTagName('select')[0].value;
//                var clientCommission = AgentClient.getElementsByTagName('input')[0].value;
//                var senderId;
//                await $.post('AddClient', {
//                    FullName: senderFullName,
//                }, function (data) {
//                    senderId = parseInt(data);
//                }
//                );
//                $.post(
//                    'IncomeTransactionForAgent', {
//                        senderId: senderId,
//                        agentId: agentId,
//                        clientCommission: clientCommission,
//                        coinId: coinId,
//                        companyId: companyId,
//                        amount: amount,
//                        comission: comission,
//                        note: note
//                    }, function (data) {
//                        if (data == "True") {
//                            rows[i].setAttribute("class", "true");
//                        } else {
//                            rows[i].setAttribute("class", "false");
//                        }
//                    }
//                );
//            }
//            else if (typOfPay == 3) {

//            }
//            i++;
//        }
//        for (var i = 0; i < rows.length; i++) {
//            if (rows[i].getAttribute("class") == "true") {
//                rows[i].remove();
//            }
//        }
//    }
//}














//function oooo(y, rows, tbody) {
//    if (y >= rows.length) {
//        tbody.innerHTML = "";
//        tbody.appendChild(mainRow);
//        mainRow = mainRow.cloneNode(true);
//    }
//    var tds = rows[y].getElementsByTagName('td');
//    var coinId = tds[0].getElementsByTagName('select')[0].value;
//    var amount = tds[1].getElementsByTagName('input')[0].value;
//    amount = deleteCommaFromNumber(amount);
//    var comission = tds[3].getElementsByTagName('input')[0].value;
//    comission = deleteCommaFromNumber(comission);
//    var senderInputs = tds[4].getElementsByTagName('input');
//    var senderFirstName = senderInputs[0].value;
//    var senderFatherName = senderInputs[1].value;
//    var senderGrandFatherName = senderInputs[2].value;
//    var senderLastName = senderInputs[3].value;
//    var typOfPay = tds[5].getElementsByTagName('select')[0].value;
//    if (typOfPay == 1) {
//        var nomalAgent = tds[6].getElementsByTagName('div')[0];
//        var reciverInputs = nomalAgent.getElementsByTagName('input');
//        var reciverFirstName = reciverInputs[0].value;
//        var reciverFatherName = reciverInputs[1].value;
//        var reciverGrandFatherName = reciverInputs[2].value;
//        var reciverlastName = reciverInputs[3].value;
//        var address = reciverInputs[4].value;
//        var phone = reciverInputs[5].value;
//        var Companies = document.getElementById('Companies');
//        var note = document.getElementById('note').value;
//        var companyId = Companies.value;
//        $.post('AddClient', {
//            firsName: senderFirstName,
//            fatherName: senderFatherName,
//            grandName: senderGrandFatherName,
//            lastName: senderLastName,
//        },
//            function (senderId) {
//                var senderId = senderId;
//                $.post('AddClientWithPhone', {
//                    firsName: reciverFirstName,
//                    fatherName: reciverFatherName,
//                    grandName: reciverGrandFatherName,
//                    lastName: reciverlastName,
//                    address: address,
//                    phone: phone
//                },
//                    function (reciverId) {
//                        var reciverId = reciverId;
//                        $.post(
//                            'IncomeTransactionForNormalAgent', {
//                                senderId: senderId,
//                                RecivcerId: reciverId,
//                                coinId: coinId,
//                                companyId: companyId,
//                                amount: amount,
//                                comission: comission,
//                                note: note,
//                            },
//                            function (data) {
//                                if (y < rows.length) {
//                                    oooo(y + 1, rows, tbody);
//                                } else {
//                                    tbody.innerHTML = "";
//                                    tbody.appendChild(mainRow);
//                                    mainRow = mainRow.cloneNode(true);
//                                }
//                            }
//                        );
//                    }
//                );
//            }
//        );
//    }
//}

//oooo(0, rows, tbody);
        //tbody.innerHTML = "";
        //tbody.appendChild(mainRow);
        //mainRow = mainRow.cloneNode(true);
        //for (var i = 0; i < rows.length; i++) {
        //    var tds = rows[i].getElementsByTagName('td');
        //    var coinId = tds[0].getElementsByTagName('select')[0].value;
        //    var amount = tds[1].getElementsByTagName('input')[0].value;
        //    amount = deleteCommaFromNumber(amount);
        //    var comission = tds[3].getElementsByTagName('input')[0].value;
        //    comission = deleteCommaFromNumber(comission);
        //    var senderInputs = tds[4].getElementsByTagName('input');
        //    var senderFirstName = senderInputs[0].value;
        //    var senderFatherName = senderInputs[1].value;
        //    var senderGrandFatherName = senderInputs[2].value;
        //    var senderLastName = senderInputs[3].value;
        //    var typOfPay = tds[5].getElementsByTagName('select')[0].value;
        //    if (typOfPay == 1) {
        //        var nomalAgent = tds[6].getElementsByTagName('div')[0];
        //        var reciverInputs = nomalAgent.getElementsByTagName('input');
        //        var reciverFirstName = reciverInputs[0].value;
        //        var reciverFatherName = reciverInputs[1].value;
        //        var reciverGrandFatherName = reciverInputs[2].value;
        //        var reciverlastName = reciverInputs[3].value;
        //        var address = reciverInputs[4].value;
        //        var phone = reciverInputs[5].value;
        //        var Companies = document.getElementById('Companies');
        //        var note = document.getElementById('note').value;
        //        var companyId = Companies.value;
        //        $.post('AddClient', {
        //            firsName: senderFirstName,
        //            fatherName: senderFatherName,
        //            grandName: senderGrandFatherName,
        //            lastName: senderLastName,
        //        },
        //            function (senderId) {
        //                var senderId = senderId;
        //                $.post('AddClientWithPhone', {
        //                    firsName: reciverFirstName,
        //                    fatherName: reciverFatherName,
        //                    grandName: reciverGrandFatherName,
        //                    lastName: reciverlastName,
        //                    address: address,
        //                    phone: phone
        //                },
        //                    function (reciverId) {
        //                        var reciverId = reciverId;
        //                        $.post(
        //                            'IncomeTransactionForNormalAgent', {
        //                                senderId: senderId,
        //                                RecivcerId: reciverId,
        //                                coinId: coinId,
        //                                companyId: companyId,
        //                                amount: amount,
        //                                comission: comission,
        //                                note: note,
        //                            },
        //                            function (data) {
        //                                if (data == "True") {
        //                                    i++;
        //                                }
        //                            }
        //                        );
        //                    }
        //                );
        //                tbody.innerHTML = "";
        //                tbody.appendChild(mainRow);
        //                mainRow = mainRow.cloneNode(true);
        //            }
        //        );
        //    }
        //    if (typOfPay == 2) {

        //    }
        //    if (typOfPay == 3) {

        //    }
        //}