function FillCoinTable() {
    $.post(
        '_JSONGetCoin',
        function (data) {
            for (var i = 0; i < data.length; i++) {
                CoinTable.row.add([
                    data[i].Name,
                    data[i].Code,
                    data[i].ISOCode,
                    FlipBoolToYesOrNo(data[i].IsEnabled),
                    CreateCoinChoicFunction(data[i].Id) + CreateCoinUpdateDiv(data[i].Id)
                ]).draw();
            }
        }
    );
}
$('#coinNameText').keyup(function () {
    var coinMessagelable = document.getElementById('coinMessagelable');
    if (this.value === "" && coinMessagelable.innerText === "يجب ملئ حلقل اسم العملة")
        return;
    if (this.value === "") {
        coinMessagelable.innerText = "";
        coinMessagelable.style.color = "black";
        return;
    }
    $.post(
        '_JSONGetSiimealrCoin', {
            name: this.value
        },
        function (data) {
            if (data === 'null') {
                coinMessagelable.innerText = "";
            } else {
                coinMessagelable.innerText = "هناك عملة مشابهة و هي " + data.Name;
            }
        }
    );

})
$("#addCoinBtn").click(function () {
    var CoinName = document.getElementById("coinNameText");
    var coinMessagelable = document.getElementById('coinMessagelable');
    if (CoinName.value === "") {
        coinMessagelable.style.color = 'red';
        coinMessagelable.innerText = "يجب ملئ حلقل اسم العملة";
        return;
    }
    var coinNameText = document.getElementById('coinNameText');
    coinName = coinNameText.value;
    var coinCodeText = document.getElementById('coinCode');
    coinCode = coinCodeText.value;
    var coinIsoCodeText = document.getElementById('coinIsoCode');
    coinIsoCode = coinIsoCodeText.value;
    $.post(
        '_AjaxAddCoin', {
            coinName: coinName,
            code: coinCode,
            isoCode: coinIsoCode,
        },
        function (data) {
            if (data === 'false') {
                alert('لم يتم إضافة العملة الرجاء إعادة المحاولة');
            } else {
                CoinTable.row.add([
                    data.Name,
                    data.Code,
                    data.ISOCode,
                    FlipBoolToYesOrNo(data.IsEnabled),
                    CreateCoinChoicFunction(data.Id) + CreateCoinUpdateDiv(data.Id)
                ]).draw();
                coinNameText.value = "";
                coinCodeText.value = "";
                coinIsoCodeText.value = "";
                FillBlanceTable();
                FilltrasuryCoinSelectInModel();
            }
        }
    );
});

function ShowUpdateCoinDiv(element) {
    var elementDiv = element.parentElement.parentElement;
    var row = elementDiv.parentElement.parentElement;
    var tdCoinName = row.getElementsByTagName("td")[0];
    var tdCoinCode = row.getElementsByTagName("td")[1];
    var tdCoinIsoCode = row.getElementsByTagName("td")[2];
    var tdCoinEnabled = row.getElementsByTagName("td")[3];

    var UpdateDiv = elementDiv.nextSibling;
    elementDiv.style.display = "none";
    UpdateDiv.style.display = "block";
    var viewBtns = document.getElementsByName("coinViewBtn");
    var editBtns = document.getElementsByName("coinEditBtn");
    var deletebtns = document.getElementsByName("coinDeleteBtn");
    for (var i = 0; i < viewBtns.length; i++) {
        viewBtns[i].disabled = editBtns[i].disabled = deletebtns[i].disabled = true;
    }
    var coinNameText = document.createElement("input");
    coinNameText.setAttribute("type", "text");
    coinNameText.setAttribute("class", "form-control");
    var coinCodeText = coinNameText.cloneNode();
    var coinIsoCodeText = coinNameText.cloneNode();
    var coinEnabledChekcBox = document.createElement("input");
    coinEnabledChekcBox.setAttribute("type", "checkbox");

    coinEnabledChekcBox.checked = coinEnabled = FlipYesOrNoToBoolean(tdCoinEnabled.innerText);
    coinNameText.value = coinName = tdCoinName.innerText;
    coinCodeText.value = coinCode = tdCoinCode.innerText;
    coinIsoCodeText.value = coinIsoCode = tdCoinIsoCode.innerText;

    tdCoinName.innerHTML = "";
    tdCoinCode.innerHTML = "";
    tdCoinIsoCode.innerHTML = "";
    tdCoinEnabled.innerHTML = "";


    tdCoinName.appendChild(coinNameText);
    tdCoinCode.appendChild(coinCodeText);
    tdCoinIsoCode.appendChild(coinIsoCodeText);
    tdCoinEnabled.appendChild(coinEnabledChekcBox);


}
function CoinSaveFuncrtion(element, id) {
    var elementDiv = element.parentElement.parentElement;
    var row = elementDiv.parentElement.parentElement;
    var tdCoinName = row.getElementsByTagName("td")[0].getElementsByTagName("input")[0].value;
    var tdCoinCode = row.getElementsByTagName("td")[1].getElementsByTagName("input")[0].value;
    var tdCoinIsoCode = row.getElementsByTagName("td")[2].getElementsByTagName("input")[0].value;
    var tdCoinEnabled = row.getElementsByTagName("td")[3].getElementsByTagName("input")[0].checked;
    if (tdCoinName == "") {
        $.confirm({
            title: 'تنبيه!',
            content: 'لا يمكن ان يكون حقل الأسم فارغ',
            buttons: {
                موافق: function () {
                }
            }
        }
        );
        return;
    }
    if (tdCoinName == coinName && tdCoinCode == coinCode && tdCoinIsoCode == coinIsoCode && tdCoinEnabled == coinEnabled) {
        CoinCancelUpdate(element);
        return;
    }
    $.post(
        '_JSONGetSiimealrCoin',
        {
            name: tdCoinName,
            id: id,
        },
        function (data) {
            if (data != "null") {
                $.confirm({
                    title: "تأكيد!",
                    content: "هناك عملة موجودة مسبقاً تحمل نفس الأسم هل انت متأكد من التعديل",
                    buttons: {
                        تأكيد: function () {
                            $.post(
                                '_AjaxUpdateCoin', {
                                    id: id,
                                    name: tdCoinName,
                                    code: tdCoinCode,
                                    isocCode: tdCoinIsoCode,
                                    enabled: tdCoinEnabled
                                },
                                function (data) {
                                    if (data != "True") {
                                        $.confirm({
                                            title: "خطاء!",
                                            content: "حدث خطاء يرجى إعادة المحاولة",
                                            buttons: {
                                                موافق: function () { }
                                            }
                                        });
                                    }
                                    else {
                                        coinName = tdCoinName;
                                        coinCode = tdCoinCode;
                                        coinISoCode = tdCoinIsoCode;
                                        coinStatus = tdCoinEnabled;
                                        CoinCancelFuncrtion(element);
                                    }
                                }
                            )
                        },
                        إلغاء: function () {
                            CoinCancelFuncrtion(element);
                        }

                    }

                });
            } else {
                $.post(

                    '_AjaxUpdateCoin', {
                        id: id,
                        name: tdCoinName,
                        code: tdCoinCode,
                        isocCode: tdCoinIsoCode,
                        enabled: tdCoinEnabled
                    },
                    function (data) {
                        if (data != "True") {
                            $.confirm({
                                title: "خطاء!",
                                content: "حدث خطاء يرجى إعادة المحاولة",
                                buttons: {
                                    موافق: function () { }
                                }
                            });
                        } else {
                            coinName = tdCoinName;
                            coinCode = tdCoinCode;
                            coinISoCode = tdCoinIsoCode;
                            coinStatus = tdCoinEnabled;
                            CoinCancelFuncrtion(element);
                        }

                    }
                )

            }
        }
    )

}
function deleteCoin(element, id) {
    $.confirm({
        title: "تأكيد الحذف",
        content: "ملاحظة لا تستطيع حذف عملة مرتبطة مع شيئ آخر",
        buttons: {
            تأكيد: function () {
                $.post(
                    '_AjaxDelteCoin', {
                        id: id
                    }, function (data) {
                        if (data != "True") {
                            $.confirm({
                                title: "خطاء",
                                content: "ربما يوجد ما هو مرتبط بها :(",
                                buttons: {
                                    موافق: function () {
                                    }
                                }
                            })

                        }
                        else {
                            element.parentElement.parentElement.parentElement.parentElement.remove();
                        }
                    })
            },
            إلغاء: function () {
            }
        }
    }
    );
}

function CoinDeleteFuncrtion(element, id) {

    $.confirm({
        title: "تأكيد الحذف",
        content: "ملاحظة لا تستطيع حذف عملة مرتبطة مع شيئ آخر",
        buttons: {
            تأكيد: function () {
                $.post(
                    '_AjaxDelteCoin', {
                        id: id
                    }, function (data) {
                        if (data != "True") {
                            $.confirm({
                                title: "خطاء",
                                content: "ربما يوجد ما هو مرتبط بها :(",
                                buttons: {
                                    موافق: function () {
                                    }
                                }
                            })

                        }
                        else {
                            var row = element.parentElement.parentElement.parentElement.parentElement;
                            CoinTable.row(row).remove().draw();
                        }
                    })
            },
            إلغاء: function () {
            }
        }
    }
    );
}
function CreateCoinChoicFunction(id) {
    var choiceDIv = document.createElement("div");
    var viewDiv = document.createElement("div");
    viewDiv.setAttribute("class", "col-lg-4");
    var editDiv = viewDiv.cloneNode();
    var DeleteDiv = viewDiv.cloneNode();

    choiceDIv.appendChild(viewDiv);
    choiceDIv.appendChild(editDiv);
    choiceDIv.appendChild(DeleteDiv);

    var viewButton = document.createElement("button");
    viewDiv.appendChild(viewButton);
    viewButton.setAttribute("class", "btn btn-primary");
    viewButton.setAttribute("name", "CoinViewBtn");
    viewButton.innerText = "عرض";

    var editBtn = document.createElement("button");
    editDiv.appendChild(editBtn);
    editBtn.setAttribute("class", "btn btn-secondary");
    editBtn.setAttribute("name", "CoinEditBtn");
    editBtn.setAttribute("onclick", "CoinEditFuncrtion(this);");
    editBtn.innerText = "تعديل";

    var deleteBtn = document.createElement("button");
    DeleteDiv.appendChild(deleteBtn);
    deleteBtn.setAttribute("class", "btn btn-danger");
    deleteBtn.setAttribute("name", "CoinDeleteBtn");
    deleteBtn.setAttribute("onclick", "CoinDeleteFuncrtion(this," + id + ");");
    deleteBtn.innerText = "حذف";
    return choiceDIv.outerHTML;
}
function CreateCoinUpdateDiv(id) {
    var updateDiv = document.createElement('div');
    updateDiv.style.display = "none";

    var SaveDiv = document.createElement("div");
    SaveDiv.setAttribute("class", "col-lg-6");
    var CancelDiv = SaveDiv.cloneNode();

    updateDiv.appendChild(SaveDiv);
    updateDiv.appendChild(CancelDiv);

    var savebtn = document.createElement("button");
    SaveDiv.appendChild(savebtn);
    savebtn.setAttribute("class", "btn btn-success");
    savebtn.setAttribute("onclick", "CoinSaveFuncrtion(this," + id + ");");
    savebtn.style.width = "100px";
    savebtn.innerText = "حفظ";

    var cancelBtn = document.createElement('button');
    CancelDiv.appendChild(cancelBtn);
    cancelBtn.setAttribute("class", "btn btn-danger");
    cancelBtn.setAttribute('onclick', 'CoinCancelFuncrtion(this,' + id + ');');
    cancelBtn.innerText = "إلغاء";
    cancelBtn.style.width = "100px";
    CancelDiv.appendChild(cancelBtn);

    return updateDiv.outerHTML;
}
var coinName;
var coinCode;
var coinISoCode;
var coinStatus;
function CoinEditFuncrtion(element) {
    var ChoicDive = element.parentElement.parentElement;
    ChoicDive.style.display = "none";
    var UpdateDiv = ChoicDive.nextSibling;
    UpdateDiv.style.display = "block";
    var row = ChoicDive.parentElement.parentElement;

    var nameTd = row.getElementsByTagName('td')[0];
    coinName = nameTd.innerText;
    var codeTd = row.getElementsByTagName("td")[1];
    coinCode = codeTd.innerText;
    

    var IsoCodeTd = row.getElementsByTagName("td")[2];
    coinISoCode = IsoCodeTd.innerText;

    var enabledTd = row.getElementsByTagName("td")[3];
    coinStatus = FlipYesOrNoToBoolean(enabledTd.innerText);


    var nameText = document.createElement("input");
    nameText.setAttribute("type", "text");
    nameText.setAttribute("class", "form-control");

    var codeText = nameText.cloneNode();
    var ISoCodeText = nameText.cloneNode();

    nameTd.innerText = "";
    nameText.value = coinName;
    nameTd.appendChild(nameText);

    codeTd.innerText = "";
    codeText.value = coinCode;
    codeTd.appendChild(codeText);

    ISoCodeText.value = coinISoCode;
    IsoCodeTd.innerText = "";
    IsoCodeTd.appendChild(ISoCodeText);

    var checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.checked = coinStatus;


    enabledTd.innerText = "";
    enabledTd.appendChild(checkBox);

    var CountryEditBtn = document.getElementsByName("CoinViewBtn");
    var CountryViewBtn = document.getElementsByName("CoinEditBtn");
    var CountryeDeleteBtn = document.getElementsByName("CoinDeleteBtn");
    for (var i = 0; i < CountryeDeleteBtn.length; i++) {
        CountryEditBtn[i].disabled = CountryViewBtn[i].disabled = CountryeDeleteBtn[i].disabled = true;
    }
}
function CoinCancelFuncrtion(element) {
    var UpdateDiv = element.parentElement.parentElement;
    UpdateDiv.style.display = "none";
    var ChoicDiv = UpdateDiv.previousElementSibling;
    ChoicDiv.style.display = "block";
    var CountryEditBtn = document.getElementsByName("CoinViewBtn");
    var CountryViewBtn = document.getElementsByName("CoinEditBtn");
    var CountryeDeleteBtn = document.getElementsByName("CoinDeleteBtn");
    for (var i = 0; i < CountryeDeleteBtn.length; i++) {
        CountryEditBtn[i].disabled = CountryViewBtn[i].disabled = CountryeDeleteBtn[i].disabled = false;
    }

    var row = ChoicDiv.parentElement.parentElement;
    var nameTd = row.getElementsByTagName("td")[0];
    nameTd.inneHtml = "";   
    nameTd.innerText = coinName;

    var coinCodeTd = row.getElementsByTagName("td")[1];
    coinCodeTd.innerHTML = "";
    coinCodeTd.innerText = coinCode;

    var coinIsoCodeTd = row.getElementsByTagName("td")[2];
    coinIsoCodeTd.innerHTML = "";
    coinIsoCodeTd.innerText = coinISoCode;


    var enabledTd = row.getElementsByTagName("td")[3];
    enabledTd.inneHtml = "";
    enabledTd.innerText = FlipBoolToYesOrNo(coinStatus);
    coinName = undefined;
    coinCode = undefined;
    coinISoCode = undefined;
    coinStatus = undefined;
}