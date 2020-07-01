// const / global variable
var senderCompanyBalnce;
// normal sender clients
const senderNormalClientVideo = document.getElementById('senderNormalClientVideo');
const select = document.getElementsByName('cameraSource');
let currentStream;
const senderNormalClientCanvas = document.getElementById('senderNormalClientCanvas');
const senderNormalClientImg = document.getElementById('senderNormalClientImg');
$(document).ready(function () {

    $('#clientSelect').select2({
        tags: true,
    });

    $('#reciverClientSelect').select2({
        tags: true,
    });
    $('#clientSenderByCompant').select2({ tags: true, });

    navigator.mediaDevices.enumerateDevices().then(gotDevices);
});

let senderCompanyTotal;
let senderCompanyMaxDebit;

let reciverCompanyMaxCreditor;
let reciverCompanyTotal;


let agentTotal;
let agentMaxCreditor;


let SenderClientMaxDebit;

$('#reciverCompany').change(function () {
    var coinId = $('#CoinId').val();
    $('#reciverCompanyBalance').text('');
    $('#reciverCompanyBalanceStatus').text('');
    $('#reciverCompanyCurrentBalance').text('');
    $('#reciverCompanyCurrentBalanceStatus').text('');
    $.post(
        'GetCompanyMaxAndDeptByCoin', {
            coinId: coinId,
            companyId: $(this).val(),
        }, function (data) {
            console.log("data");
            console.log(data);
            var total = parseFloat(data.Total);
            var status = total > 0 ? "له" : "عليه";
            if (total == 0) {
                status = "";
            }
            reciverCompanyTotal = data.Total;
            reciverCompanyMaxCreditor = data.MaxCreditor;
            total = Math.abs(total);
            $('#reciverCompanyBalance').text(total);
            $('#reciverCompanyBalanceStatus').text(status);
            calcReciverCompanyCurrentBalnce();
        }
    );

});







$('#reciverClientSelect').change(function () {
    var reciverAddress = document.getElementById('reciverAddress');
    var reciverPhone = document.getElementById('reciverPhone');
    if (!isNaN($(this).val())) {
        $.post(
            'GetClientInformation', {
                clientId: $(this).val()
            },
            function (data) {
                reciverPhone.value = data.Phone;
                reciverAddress.value = data.Address;
            }
        )
    } else {
        reciverPhone.value = "";
        reciverAddress.value = "";
    }
});



// form manipulate
$('#transactionAmount').keyup(function () {
    if ($('#sendByCompanySelect').val() == null || $('#sendByCompanySelect').val() == "") {
        $('#senderCompanyCurrentBalance').empty();
        return;
    }
    var companyBlance = parseFloat(deleteCommaFromNumber($('#senderCompanyBlance').text()));
    if ($('#sendetCompanyBlanceStatuse').text() == 'عليه') {
        companyBlance *= -1;
    }
    var newBlance = companyBlance;
    if ($(this).val() != "") {
        newBlance += parseFloat(deleteCommaFromNumber($(this).val()));
    }
    if ($('#companycomission').val() != "") {
        newBlance += parseFloat(deleteCommaFromNumber($('#companycomission').val()));
    }
    SetSenderCompanyCurrentBalance(newBlance)
    //$('#senderCompanyCurrentBalance').text(numberWithCommas());
    calcReciverCompanyCurrentBalnce();
});
$('#comission').keyup(() => {
    calcReciverCompanyCurrentBalnce();
});
$('#sendByCompanySelect').change(function () {
    if (this.value == "") {
        ClearSenderCompanyBalnce();
        $('#reciverCompany').empty();
    } else {
        FillSecoundCompany(this.value);
    }
    var coinId = $('#CoinId').val();
    $.post(
        'GetCompanyBalnce', {
            companyId: this.value,
            coinId: coinId
        },
        function (data) {
            senderCompanyBalnce = data;
            var balance = parseFloat(data);
            var status = balance > 0 ? "له" : "عليه";
            if (balance == 0) {
                status = "";
            }
            balance = Math.abs(balance);
            $('#senderCompanyBlance').text(numberWithCommas(balance));

            $('#senderCompanyCurrentBalance').text(numberWithCommas(balance));
            $('#sendetCompanyBlanceStatuse').text(status);
            $('#senderCompanyCurrentBalanceStatuse').text(status);
        }
    )
    $.post(
        'GetCompanyMaxAndDeptByCoin', {
            coinId: coinId,
            companyId: this.value
        }, function (data) {
            senderCompanyTotal = data.Total;
            senderCompanyMaxDebit = data.MaxDebit;
        }
    )
});

function FillSecoundCompany(companyId) {
    var reciverCompany = document.getElementById('reciverCompany');
    var mainOption = document.createElement('option');
    mainOption.value = "";
    mainOption.innerText = "الرجاء اختيار الشركة";

    $.post(
        '_JSNOCompanyDontHaveId', {
            id: companyId
        }, function (data) {
            reciverCompany.innerHTML = "";
            reciverCompany.appendChild(mainOption);
            for (var i = 0; i < data.length; i++) {
                var option = document.createElement('option');
                option.value = data[i].Id;
                option.innerText = data[i].Name;
                reciverCompany.appendChild(option);
            }
            console.log(reciverCompany);
            if (reciverCompany.value == "") {

                var reciverCompanyObject = $(reciverCompany);
                reciverCompanyObject.change();
            }
        }
    );
}
$('#countryId').change(function () {
    FillCompanySelect();
});
function FillCompanySelect() {
    ClearSenderCompanyBalnce();
    var sendByCompanySelect = document.getElementById('sendByCompanySelect');
    var CoinId = document.getElementById('CoinId');
    var countryId = document.getElementById('countryId');

    sendByCompanySelect.innerHTML = "";

    if (CoinId.value != "") {
        if (countryId.value != "") {
            $.post(
                '_JSONCompanyUseCoinInThisCountry', {
                    countryId: countryId.value,
                    CoinId: CoinId.value
                },
                function (data) {
                    if (data === "null") {
                        var option = document.createElement('option');
                        option.value = "";
                        option.innerText = "لا يوجد اي شركات";
                        sendByCompanySelect.appendChild(option);
                    } else {
                        var mainOption = document.createElement('option');
                        mainOption.value = "";
                        mainOption.innerText = "الرجاء اختيار الشركة";
                        sendByCompanySelect.appendChild(mainOption);
                        for (var i = 0; i < data.length; i++) {
                            var option = document.createElement('option');
                            option.value = data[i].id;
                            option.innerText = data[i].Name;
                            sendByCompanySelect.appendChild(option);
                        }
                    }
                }
            );
        }
    }
}
$('#CoinId').change(function () {
    clearAgentBalance();
    FillCompanySelect();
    GetAgentBalance();
    $('#reciverCompany').change();
    CallcBalanceForClient($('#agentSelect').val(), $(this).val());
});
$('#clientSelect').change(function () {
    if (!isNaN($(this).val())) {
        $.post(
            'GetClientImage', {
                clientId: $(this).val()
            },
            function (data) {
                if (data != null && data != "null") {
                    var senderNormalClientImg = document.getElementById('senderNormalClientImg');
                    senderNormalClientImg.src = data.path;
                    senderNormalClientImg.dataset.target = data.Id;
                    var Attachment = document.getElementById('Attachment');
                    Attachment.value = data.AttachmentId;
                    var sendrPhone = document.getElementById('sendrPhone');
                    sendrPhone.value = data.phone;
                } else {
                    var senderNormalClientImg = document.getElementById('senderNormalClientImg');
                    senderNormalClientImg.src = "";
                    senderNormalClientImg.dataset.target = undefined;
                    var Attachment = document.getElementById('Attachment');
                    Attachment.value = "";
                    var sendrPhone = document.getElementById('sendrPhone');
                    sendrPhone.value = "";
                }
            }
        );
    } else {
        var senderNormalClientImg = document.getElementById('senderNormalClientImg');
        senderNormalClientImg.src = "";
        senderNormalClientImg.dataset.target = undefined;
        var Attachment = document.getElementById('Attachment');
        Attachment.value = "";
        var sendrPhone = document.getElementById('sendrPhone');
        sendrPhone.value = "";
    }
});
$('#TypeOfPay').change(function () {
    clearAgentBalance();
    $('#compayMoney').css('display', 'none');
    hiddAll();
    if (this.value == 1) {
        $('#normalClient').css('display', 'block');
        return;
    }
    if (this.value == 3) {
        $('#companySenderDiv').css('display', 'block');
        $('#clientSenderByCompant').select2({ tags: true, });
        $('#compayMoney').css('display', 'block');
        return;
    }
    $('#AgentClient,#AgentMoney').css('display', 'block');
    $('#agentSelect').select2();
});
function ClearAllElement() {
    $("#countryId").val($("#countryId option:first").val());
    $('#sendrPhone').val('');
    $('#clientSelect').val($("#countryId option:first").val()).trigger('change');
    $('#TypeOfPay').val(1).change();
    $("#comission").val("");
    $("#transactionAmount").val("");
    $("#companycomission").val("");
    $("#CoinId").val($("#CoinId.option:first").val());
    $('#sendByCompanySelect').children().remove();
    $("#TreasuryBlance").val("");
    $("#TreasuryBlance").empty();
    $('#senderCompanyBlance').empty();
    $('#reason').val('');
    $('#note').val('');
    $('#reciverCompany').val('');
    $('#reciverClientSelect').val($('#reciverClientSelect option:first').val()).trigger('change');
    $('#senderNormalClientImg').attr('src', '');
    $('#reciverAddress').val('');
    $('#reciverPhone').val('');
    $('#RecivingAmount').val('');
    $('#AgetComission').val('');
    $('#senderCompanyCurrentBalance').text('');
    $('#agentSelect').val($("#agentSelect option:first").val()).trigger('change');
}
function ClearNormalSenderElement() {
    $('#senderFirstName').val('');
    $('#senderFatherName').val('');
    $('#senderGrandFatherName').val('');
    $('#senderLastName').val('');
}
$('#RecivingAmount').change(function () {

    ///1
    CallcRequierdMoney();
});
$('#AgetComission').change(function () {

    CallcRequierdMoney();
});
function hiddAll() {
    $('#normalClient,#companySenderDiv,#AgentClient,#AgentMoney').css("display", "none");
}
function ClearSenderCompanyBalnce() {
    $('#senderCompanyBlance').empty();
    $('#senderCompanyCurrentBalance').empty();
}
function ClearMoneyInformation() {
    $('#transactionAmount').empty();
    $('#companycomission').empty();
}

// cehcker function
function checkSender(typeOfPay) {

    if (typeOfPay == 1) {
        return CheckNormalClient();
    }
    if (typeOfPay == 3) {
        return checkCompanyReciver();
    }
    if (typeOfPay == 2) {
        return CheckAgentSender();
    }

    return false;
}
function checkCompanyReciver() {
    var reciverCompany = document.getElementById('reciverCompany');
    if (reciverCompany.value == "") {
        toastr["error"]("يجب عليك تحديد اسم الشركة", "خطاْ");
        return false;
    }

    if (reciverCompanyMaxCreditor != null && reciverCompanyMaxCreditor != "" &&reciverCompanyMaxCreditor != undefined) {
        var allFuckingAmount = parseFloat(deleteCommaFromNumber($('#transactionAmount').val())) + parseFloat(deleteCommaFromNumber($('#comission').val()));
        if (((reciverCompanyTotal * -1) + allFuckingAmount) > reciverCompanyMaxCreditor) {
            if (HavePrivlege(priveleges.breakTheWall)) {
                var ans = confirm(" سوف يتم تجاوز الحد المسموح به للديون للشركة " + reciverCompany.options[reciverCompany.selectedIndex].text);
                if (!ans) return false;
            }
            else {
                alert('لا يمكنك تخطي ديون الشركة ');
                return false;
            }
        }
    }
    //if ($('#senderNameByCompany').val() == "") {
    //    toastr["error"]("يجب عليك تحديد اسم المرسل", "خطاْ");
    //    return false;
    //}
    if ($('#clientSenderByCompant').val() == "") {
        toastr["error"]("يجب عليك تحديد اسم المرسل", "خطاْ");
        return false;
    }
    //if ($('#senderPhoneByCompany').val() == "") {
    //    toastr["error"]("يجب عليك تحديد رقم المرسل", "خطاْ");
    //    return false;
    //}
    return true;
}
function CheckNormalClient() {

    if ($('#clientSelect').val() == "") {
        toastr["error"]("يجب عليك ادخال اسم المرسل", "خطاْ");
        return false;
    }
    return true;
}
function CeheckReciverClient() {
    if ($('#reciverClientSelect').val() == "") {
        toastr["error"]("يجب عليك ادخال اسم المستقبل", "خطاْ");
        return false;
    }

    if ($('#reciverAddress').val() == "") {
        toastr["error"]("يجب عليك ادخال عنوان المستقبل", "خطاْ");
        return false;
    }
    if ($('#reciverPhone').val() == "") {
        toastr["error"]("يجب عليك ادخال رقم المستقبل", "خطاْ");
        return false;
    }
    return true;
}
function CehckMoeny(typeOfPayId) {
    var transactionAmount = document.getElementById('transactionAmount');
    if (transactionAmount.value == "") {
        toastr["error"]("يجب عليك إدخال المبلغ", "خطأ")
        return false;
    }
    var comission = document.getElementById('comission');
    if (comission.value == "") {
        toastr["error"]("يجب عليك إدخال العمولة", "خطأ")
        return false;
    }
    var companycomission = document.getElementById('companycomission');
    if (companycomission.value == "") {
        toastr["error"]("يجب عليك إدخال عمولة الشركة", "خطأ")
        return false;
    }
    return true;
}
function CallcRequierdMoney() {
    var TypeOfPayId = document.getElementById('TypeOfPay');
    var transactionAmount = document.getElementById('transactionAmount');
    var comission = document.getElementById('comission');
    var requerdMoney = document.getElementById('requerdMoney');
    var money = 0;
    if (transactionAmount.value != "") {
        money += parseFloat(deleteCommaFromNumber(transactionAmount.value));
    }

    if (comission.value != "") {
        money += parseFloat(deleteCommaFromNumber(comission.value));
    }
    if (TypeOfPayId.value == 1) {
        requerdMoney.innerText = numberWithCommas(money);
    }
    else if (TypeOfPayId.value == 2) {
        var aegnetBlace = parseFloat(deleteCommaFromNumber($('#agentBalnce').text()));
        if ($('#agentBalnceStatus').text() == "عليه") {
            aegnetBlace *= -1;
        }
        var aegnetNewBalcne = aegnetBlace - money;
        
        if ($('#RecivingAmount').val() != "") {
            var recivingAmount = parseFloat(deleteCommaFromNumber($('#RecivingAmount').val()));
            aegnetNewBalcne += recivingAmount;
            money -= recivingAmount;
        }
        if ($('#AgetComission').val() != "") {
            var agentCommission = parseFloat(deleteCommaFromNumber($('#AgetComission').val()));
            aegnetNewBalcne += agentCommission;
            money -= agentCommission;
        }

        var status = aegnetNewBalcne > 0 ? "له" : "عليه";
        if (!aegnetNewBalcne) status = "";
        aegnetNewBalcne = Math.abs(aegnetNewBalcne);
        $('#agentCurrentBalance').text(numberWithCommas((aegnetNewBalcne)));
        $('#agentCurrentBalanceStatus').text(status);
        requerdMoney.innerText = numberWithCommas(money);
    }

}
function checkSendByCompany() {
    var sendByCompanySelect = document.getElementById('sendByCompanySelect');
    if (sendByCompanySelect.value == "") {
        if (sendByCompanySelect.getElementsByTagName('option').length == 1) {
            toastr["error"]("لا يوجد شركات", "خطاْ");
        } else {
            toastr["error"]("يجب عليك تحديد الشركة", "خطاْ");
        }
        return false;
    }
    if (reciverCompanyMaxCreditor != null) {
        var allFuckingAmount = parseFloat(deleteCommaFromNumber($('#transactionAmount').val())) + parseFloat(deleteCommaFromNumber($('#companycomission').val()));
        if ((allFuckingAmount + senderCompanyTotal) > senderCompanyMaxDebit) {
            if (HavePrivlege(priveleges.breakTheWall)) {
                var ans = confirm(" سوف يتم تجاوز الحد المسموح به للديون للشركة " + sendByCompanySelect.options[sendByCompanySelect.selectedIndex].text);
                if (!ans) return false;
            } else {
                alert('لا يمكنك تخطي ديون الشركة');
                return false;
            }
        }
    }
    return true;
}
function CheckAgentSender() {
    var seldnerId = document.getElementById('agentSelect').value;
    if (seldnerId == undefined || seldnerId == "") {
        toastr["error"]("يجب تحديد العميل");
        return false;
    }
    var allAmount = parseFloat(deleteCommaFromNumber($('#transactionAmount').val())) + parseFloat(deleteCommaFromNumber($('#comission').val()));
    allAmount -= parseFloat(deleteCommaFromNumber($('#RecivingAmount').val()));
    allAmount -= parseFloat(deleteCommaFromNumber($('#AgetComission').val()));
    if ((agentTotal * -1) + allAmount > agentMaxCreditor) {
        if (HavePrivlege(priveleges.breakTheWall)) {
            var ans = confirm("سوف يتم تجاوز الحد المسوح به للعميل");

            return ans;
        } else {
            alert('لا يمكنك تخطي الحد المسموح به للعميل');
            return false;
        }
    }

    return true;
}

$('#submit').click(async function () {
    var CountryId = document.getElementById('countryId');
    if (CountryId.value == "") {
        toastr["error"]("يجب ان تحدد الوجهة", "خطاْ");
        return;
    }
    var CoinId = document.getElementById('CoinId');
    if (CoinId.value == "") {
        toastr["error"]("يجب ان تحدد العملة ", "خطاْ");
    }
    var asnC1 = checkSendByCompany();
    if (!asnC1) {
        return;
    }
    var transactionAmount = document.getElementById('transactionAmount');
    var comission = document.getElementById('comission');
    var companycomission = document.getElementById('companycomission');



    var TypeOfPayId = document.getElementById('TypeOfPay');
    var asnC2 = checkSender(TypeOfPayId.value);
    if (!asnC2) {
        return;
    }
    if (!CeheckReciverClient()) {
        return;
    }

    if (!CehckMoeny(TypeOfPayId)) {
        return;
    }
    var ReciverID;
    //var reciverName = document.getElementById('reciverName');
    var reciverAddress = document.getElementById('reciverAddress');
    var reciverPhone = document.getElementById('reciverPhone');


    if (TypeOfPayId.value == 1) {
        var senderNameSelect = document.getElementById('clientSelect');
        var reciverName = document.getElementById('reciverName');
        var reciverAddress = document.getElementById('reciverAddress');
        var reciverPhone = document.getElementById('reciverPhone');
        var senderPhone = document.getElementById('sendrPhone');
        var senderClientId;

        //for add image and client
        if (isNaN(senderNameSelect.value)) {
            var Attachment = document.getElementById('Attachment');
            //if (Attachment.value == "") {
            //    toastr["error"]("يجب تحديد نوع المرفق");
            //    return;
            //}
            if (Attachment.value == "") {
                formData.append("umageType", -1);
            }
            var formData = new FormData();
            var imgeFile = document.getElementById('senderNormalClientImg');
            if (imgeFile.src != "") {
                var file;
                await fetch(imgeFile.src)
                    .then(res => res.blob())
                    .then(blob => {
                        file = new File([blob], 'dot.png', blob);
                    });
                formData.append("image", file);
                formData.append("imageType", Attachment.value);
            }
            formData.append('fullName', senderNameSelect.value);
            formData.append('Phone', senderPhone.value);
            await $.ajax({
                url: "/BwTransactions/AddNewClient",
                type: "post",
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data == "null") {
                        alert('حدث حطاء ما الرجاء إعادة تحميل الصفحة ');
                        return;
                    }
                    senderClientId = data;
                },
                error: function (request, status, error) {
                    alert('حدث حطاء ما الرجاء إعادة تحميل الصفحة ');
                    return;
                }
            });
        }
        // for update image 
        else {
            senderClientId = senderNameSelect.value;
            var imgeFile = document.getElementById('senderNormalClientImg');
            if (imgeFile.dataset.target == 'undefined') {
                var Attachment = document.getElementById('Attachment');
                //if (Attachment.value == "") {
                //    toastr["error"]("يجب تحديد نوع المرفق");
                //    return;
                //}
                var formData = new FormData();
                var imgeFile = document.getElementById('senderNormalClientImg');
                if (imgeFile.src != "") {
                    var file;
                    await fetch(imgeFile.src)
                        .then(res => res.blob())
                        .then(blob => {
                            file = new File([blob], 'dot.png', blob);
                        });
                    formData.append("image", file);
                    formData.append("imageType", Attachment.value);
                    formData.append("clientId", senderClientId);
                    $.ajax({
                        url: "UpdateOldClientImage",
                        type: "post",
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (data) {
                        },
                        error: function (request, status, error) {
                        }
                    });
                }
            }
            $.post(
                'CheckNumberForSender', {
                    clientId: senderClientId,
                    phone: senderPhone.value
                }
            );
        }
        var reciverClientSelect = document.getElementById('reciverClientSelect');
        if (isNaN(reciverClientSelect.value)) {
            var formData = new FormData();
            formData.append('fullName', reciverClientSelect.value);
            formData.append('Phone', reciverPhone.value);
            formData.append('address', reciverAddress.value);
            await $.ajax({
                url: "AddNewClient",
                method: "post",
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    ReciverID = data;
                },
                error: function (xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    //alert(err.Message);
                    alert('حدث خطاء ما الرجاء إعادة تحميل الصفحة');
                    alert('530');
                    return;
                }
            });
        }
        else {
            ReciverID = reciverClientSelect.value;
            $.post(
                'CheckAddressAndNumberForReciver', {
                    clientId: ReciverID,
                    phone: reciverPhone.value,
                    address: reciverAddress.value
                });
        }
        $.post(
            'OuterClientTransaction', {
                countryId: CountryId.value,
                coinId: CoinId.value,
                companyId: sendByCompanySelect.value,
                amount: deleteCommaFromNumber(transactionAmount.value),
                comission: deleteCommaFromNumber(comission.value),
                comapnyComission: deleteCommaFromNumber(companycomission.value),
                reason: $('#reason').val(),
                note: $('#note').val(),
                senderId: senderClientId,
                reciverId: ReciverID,
            },
            function (data) {
                if (data == "True") {
                    ClearAllElement();
                    toastr["success"]("تم");
                } else {
                    toastr["error"]("حدث خطاء ما الرجاء إعادة تحميل الصفحة  و إعادة المحاولة");
                    alert('563');
                }
            }
        )
    }





    //////////////////////////////////////////////////////////////////////////////
    else if (TypeOfPayId.value == 2) {
        var seldnerId = document.getElementById('agentSelect').value;
        if (seldnerId == undefined || seldnerId == "")
            return;
        var reciveingAmount = document.getElementById('RecivingAmount').value;
        var AgetComission = document.getElementById('AgetComission').value;





        var reciverClientSelect = document.getElementById('reciverClientSelect');
        if (isNaN(reciverClientSelect.value)) {
            var formData = new FormData();
            formData.append('fullName', reciverClientSelect.value);
            formData.append('Phone', reciverPhone.value);
            formData.append('address', reciverAddress.value);
            await $.ajax({
                url: "AddNewClient",
                method: "post",
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    ReciverID = data;
                },
                error: function (data) {
                    alert('حدث خطاء ما الرجاء إعادة تحميل الصفحة');
                }
            });
        }
        else {
            ReciverID = reciverClientSelect.value;
            $.post(
                'CheckAddressAndNumberForReciver', {
                    clientId: ReciverID,
                    phone: reciverPhone.value,
                    address: reciverAddress.value
                });
        }

        ////////////////heeer
        $.post(
            'OuterAgentTransaction', {
                countryId: CountryId.value,
                coinId: CoinId.value,
                companyId: sendByCompanySelect.value,
                amount: deleteCommaFromNumber(transactionAmount.value),
                comission: deleteCommaFromNumber(comission.value),
                comapnyComission: deleteCommaFromNumber(companycomission.value),
                reason: $('#reason').val(),
                note: $('#note').val(),
                senderId: seldnerId,
                reciverId: ReciverID,
                reciveingAmount: reciveingAmount,
                senderCommission: AgetComission,
            },
            function (data) {
                if (data == "True") {
                    ClearAllElement();
                    toastr["success"]("تم");
                } else {
                    toastr["error"]("حدث خطاء ما الرجاء إعادة تحميل الصفحة  و إعادة المحاولة");
                }

            }
        )
    }




















    /////////////////////////////////////////////////////////////////////////////////////////
    else if (TypeOfPayId.value == 3) {
        var senderId;
        if (isNaN($('#clientSenderByCompant').val())) {
            var formData = new FormData();
            formData.append("fullName", $('#clientSenderByCompant').val());
            formData.append("Phone", $('#senderPhoneByCompany').val());
            await $.ajax({
                url: "AddNewClient",
                method: "post",
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    senderId = data;
                },
                error: function (xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    //alert(err.Message);
                    alert('حدث خطاء ما الرجاء إعادة تحميل الصفحة');
                    alert('530');
                    return;
                }
            });
        } else {
            senderId = $('#clientSenderByCompant').val();
        }
        var reciverClientSelect = document.getElementById('reciverClientSelect');
        if (isNaN(reciverClientSelect.value)) {
            var formData = new FormData();
            formData.append('fullName', reciverClientSelect.value);
            formData.append('Phone', reciverPhone.value);
            formData.append('address', reciverAddress.value);
            await $.ajax({
                url: "AddNewClient",
                method: "post",
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    ReciverID = data;
                },
                error: function (xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    //alert(err.Message);
                    alert('حدث خطاء ما الرجاء إعادة تحميل الصفحة');
                    alert('530');
                    return;
                }
            });
        }
        else {
            ReciverID = reciverClientSelect.value;
            $.post(
                'CheckAddressAndNumberForReciver', {
                    clientId: ReciverID,
                    phone: reciverPhone.value,
                    address: reciverAddress.value
                });
        }
        var secounCompanyCommission = $('#secoundCompanyCommission').val();
        if (secounCompanyCommission == "") {
            secounCompanyCommission = 0;
        }

        $.post(
            'OuterCompanyTranasction', {
                coinID: CoinId.value,
                countryId: $('#countryId').val(),
                sendByCompanyId: sendByCompanySelect.value,
                amount: deleteCommaFromNumber(transactionAmount.value),
                comission: deleteCommaFromNumber(comission.value),
                companyComission: deleteCommaFromNumber(companycomission.value),
                reciverdByCompanyCommission: deleteCommaFromNumber(secounCompanyCommission),
                reason: $('#reason').val(),
                note: $('#note').val(),
                reciveByCompanyId: $('#reciverCompany').val(),
                reciverId: ReciverID,
                senderID: senderId
            }, function (data) {
                if (data == "true") {
                    ClearAllElement();
                    toastr["success"]("تم");
                }
            }

        )


        //$.post(
        //    'AddClient', {
        //        FullName: reciverName.value,
        //        address: reciverAddress.value,
        //        Phone: reciverPhone.value
        //    },
        //    function (data) {
        //        ReciverID = data;
        //        $.post(
        //            'AddClient', {
        //                FullName: $('#senderNameByCompany').val(),
        //                Phone: $('#senderPhoneByCompany').val(),
        //            },
        //            function (data) {
        //                var senderId = data;
        //                var countryId = $('#countryId').val();
        //                var companyComission = $('#companycomission').val();
        //                $.post(
        //                    'OuterCompanyTranasction', {
        //                        coinID: CoinId.value,
        //                        countryId: $('#countryId').val(),
        //                        sendByCompanyId: sendByCompanySelect.value,
        //                        amount: deleteCommaFromNumber(transactionAmount.value),
        //                        comission: deleteCommaFromNumber(comission.value),
        //                        companyComission: deleteCommaFromNumber(companyComission),
        //                        reason: $('#reason').val(),
        //                        note: $('#note').val(),
        //                        reciveByCompanyId: $('#reciverCompany').val(),
        //                        reciverId: ReciverID,
        //                        senderID: senderId
        //                    }, function (data) {
        //                        console.log(data);
        //                    }

        //                )
        //            })
        //    }
        //);
    }

});


$('#companycomission').keyup(function () {
    if ($('#sendByCompanySelect').val() == null || $('#sendByCompanySelect').val() == "") {
        $('#senderCompanyCurrentBalance').empty();
        return;
    }
    var companyBlance = parseFloat(deleteCommaFromNumber($('#senderCompanyBlance').text()));
    if ($('#sendetCompanyBlanceStatuse').text() == "عليه") {
        companyBlance *= -1;
    }
    var newBlance = companyBlance;
    if ($(this).val() != "") {
        newBlance += parseFloat(deleteCommaFromNumber($(this).val()));
    }
    if ($('#transactionAmount').val() != "") {
        newBlance += parseFloat(deleteCommaFromNumber($('#transactionAmount ').val()));
    }
    //2
    SetSenderCompanyCurrentBalance(newBlance)
    //$('#senderCompanyCurrentBalance').text(numberWithCommas(newBlance));
});
function GetAgentBalance() {
    var coinId = $('#CoinId').val();
    var agentId = $('#agentSelect').val();
    if (agentId == null || agentId == undefined || coinId == null || coinId == undefined || agentId == '') {
        agentTotal = null;
        agentMaxCreditor = null;
        return;
    }
    $.post(
        'GetClientBlance', {
            clientId: agentId,
            coinId: coinId
        },
        function (data) {
            agentTotal = data.Total;
            agentMaxCreditor = data.MaxCreditor;

        }
    )
}
$('#agentSelect').change(function () {
    if ($(this).val() == "") {
        clearAgentBalance();
        return;
    }
    var coinId = $('#CoinId').val();
    //
    CallcBalanceForClient($(this).val(), coinId);
    GetAgentBalance();
});
function clearAgentBalance() {
    $('#agentBalnce').empty();
    $('#agentClientBalnce').empty();
    $('#agentCurrentBalance').empty();
}
function CalcComission(amount) {
    amount = parseFloat(deleteCommaFromNumber(amount));
    var countryId = $('#countryId').val();
    var coinId = $('#CoinId').val();
    var companyId = $('#sendByCompanySelect').val();
    if (amount == "" || countryId == "" || coinId == "" || companyId == "") {
        $('#companycomission').val('');
        return;
    }
    $.post(
        'CalcComission', {
            companyId: companyId,
            countryId: countryId,
            coinId: coinId,
            amount: amount,
        }, function (data) {

            if (data == 0) {

            }
            $('#companycomission').val(numberWithCommas(parseFloat(data)));
            CallcRequierdMoney();
        }
    );
    $.post(
        'CalcMyComission', {
            countryId: countryId,
            coinId: coinId,
            amount: amount,
        },
        function (data) {
            $("#comission").val(numberWithCommas(data));
        }
    )
}
function CallcBalanceForClient(clientId, coinId) {
    $.post(
        '/BwClients/GetBlanace', {
            clientId: clientId,
            coinId: coinId
        },
        function (data) {
            
            var balance = parseFloat(data.Total);
            var status = balance > 0 ? "له" : "عليه";
            if (!balance) {
                status = "";
            }
            balance = Math.abs(balance);
            balance = numberWithCommas(balance);
            $('#agentBalnce').text(balance);
            $('#agentBalnceStatus').text(status);
            $('#agentCurrentBalance').text(balance);
            $('#agentCurrentBalanceStatus').text(status);
        }
    );
}
function calcReciverCompanyCurrentBalnce() {
    
    var amount = deleteCommaFromNumber($('#transactionAmount').val());
    amount = parseFloat(amount);
    if (isNaN(amount)) {
        amount = 0;
    }
    var commission = deleteCommaFromNumber($('#comission').val());
    commission = parseFloat(commission);
    if (isNaN(commission)) {
        commission = 0;
    }
    var companyCommission =  $('#secoundCompanyCommission').val();
    if (companyCommission == "") {
        companyCommission = 0;
    } else {
        companyCommission = parseFloat(deleteCommaFromNumber(companyCommission));
    }
    var currentBalcne = parseFloat(reciverCompanyTotal) - (commission + amount) + companyCommission;

    var status = currentBalcne > 0 ? "له" : "عليه";
    currentBalcne = Math.abs(currentBalcne);

    if (!currentBalcne) status = "";
    $('#reciverCompanyCurrentBalance').text(numberWithCommas(currentBalcne));
    $('#reciverCompanyCurrentBalanceStatus').text(status);
}

$('#secoundCompanyCommission').keyup(function () {
    calcReciverCompanyCurrentBalnce();
})




// camera form sormal client
$('#caputerSenderNormalClient').click(function () {
    var Attachment = document.getElementById('Attachment');
    if (Attachment.value == "") {
        toastr["error"]("يجب تحديد نوع المرفق");
    }
    draw();
});
$('#senderNormalClientModelClose').click(function () {
    senderNormalClientImg.src = "";
    var Attachment = document.getElementById('Attachment');
    Attachment.value = "";
    $('#clientSelect').val($('#clientSelect').val()).change();
});

function draw() {
    senderNormalClientCanvas.width = senderNormalClientVideo.videoWidth;
    senderNormalClientCanvas.height = senderNormalClientVideo.videoHeight;
    senderNormalClientCanvas.getContext('2d').drawImage(senderNormalClientVideo, 0, 0);
    // Other browsers will fall back to image/png
    senderNormalClientImg.src = senderNormalClientCanvas.toDataURL('image/webp');
    senderNormalClientImg.dataset.target = undefined;
}

function gotDevices(mediaDevices) {
    select.innerHTML = '';
    var mainOption = document.createElement('option');
    mainOption.innerHTML = "الرجاء اختيار الكميرا";
    mainOption.value = " ";
    select.forEach(element => element.appendChild(mainOption));
    let count = 1;
    mediaDevices.forEach(mediaDevice => {
        if (mediaDevice.kind === 'videoinput') {
            const option = document.createElement('option');
            option.value = mediaDevice.deviceId;
            const label = mediaDevice.label || `Camera ${count++}`;
            const textNode = document.createTextNode(label);
            option.appendChild(textNode);
            //select.appendChild(option);
            select.forEach(s => s.appendChild(option));
        }
    });
}
$('#normalClientCmeraSource').change(function () {
    if (typeof currentStream !== 'undefined') {
        stopMediaTracks(currentStream);
    }
    const videoConstraints = {};
    if (select.value == "") {
        videoConstraints.facingMode = 'environment';
    } else {

        videoConstraints.deviceId = { exact: $(this).val() };
    }
    const constraints = {
        video: videoConstraints,
        audio: false
    };

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
            currentStream = stream;
            senderNormalClientVideo.srcObject = stream;
            return navigator.mediaDevices.enumerateDevices();
        })
        .catch(error => {
            console.error(error);
        });
        
});
async function uploadImage() {
    var formData = new FormData();
    var imgeFile = document.getElementById('senderNormalClientImg');

    var file;
    await fetch(imgeFile.src)
        .then(res => res.blob())
        .then(blob => {
            file = new File([blob], 'dot.png', blob);
        });
}
function stopMediaTracks(stream) {
    stream.getTracks().forEach(track => {
        track.stop();
    });
}
function SetSenderCompanyCurrentBalance(balance) {
    var status = balance > 0 ? "له" : "عليه";
    balance = Math.abs(balance);
    if (balance == 0) {
        status = "";
    }
    balance = numberWithCommas(balance);
    $('#senderCompanyCurrentBalance').text(balance);
    $('#senderCompanyCurrentBalanceStatuse').text(status);
}