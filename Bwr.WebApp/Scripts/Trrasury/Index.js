let cashFlowTable = document.getElementById('cashFlowTable');
let cashFlowTableBody = cashFlowTable.getElementsByTagName('tbody')[0];
var url = window.location.href;
var treastyId = parseInt(url.substr(url.indexOf('?') + 11, url.length - 1));
function FillBlanceTable(coinId, from, to) {
    cashFlowTableBody.innerHTML = "";
    $.post(
        '/Treasury/GetTreasryBalnce', {
            treaseryId: treastyId,
            coinId: coinId,
            from: from,
            to: to
        },
        function (data) {
            if (data === "null") {
                return;
            }

            for (var i = 0; i < data.length; i++) {
                var onHim = "";
                var forhim = "";

                if (data[i].Amount > 0) {
                    onHim = data[i].Amount;

                } else {
                    forhim = data[i].Amount * -1;
                }
                onHim = parseFloat(onHim);
                forhim = parseFloat(forhim);
                if (isNaN(forhim)) {
                    forhim = "";
                } else {
                    forhim = numberWithCommas(forhim);
                }

                if (isNaN(onHim)) {
                    onHim = "";
                } else {
                    onHim = numberWithCommas(onHim);
                }

                var row = document.createElement('tr');
                var totalTd = document.createElement('td');
                totalTd.innerHTML = numberWithCommas(parseFloat(data[i].Total));
                row.appendChild(totalTd);
                var forHimTd = document.createElement('td');
                forHimTd.innerHTML = forhim;
                row.appendChild(forHimTd);
                var onHimTd = document.createElement('td');
                onHimTd.innerHTML = onHim;
                row.appendChild(onHimTd);
                var dateTd = document.createElement('td');
                dateTd.innerHTML = data[i].Created;
                row.appendChild(dateTd);
                cashFlowTableBody.appendChild(row);
            }
        }
    );
}
$('#Coins').change(function () {

    FillBlanceTable($(this).val(), $('#fromCashFlow').val(), $('#toCashFlow').val());
});
$('#fromCashFlow').change(function () {
    if ($('#Coins').val() != null) {
        FillBlanceTable($('#Coins').val(), $(this).val(), $('#toCashFlow').val());
    }
});
$('#toCashFlow').change(function () {
    if ($('#Coins').val() != null) {
        FillBlanceTable($('#Coins').val(), $('#fromCashFlow').val(), $(this).val());
    }
});
$('#moenyActionBtn').click(function () {
    if ($('#Coins').val() == "") {
        toastr["error"]("يجب تحديد العملة", "خطاْ");
        return;
    }
    if ($('#typeOfAction').val() == "") {
        toastr["error"]("يجب تحديد نوع الحركة", "خطاْ");
        return;
    }
    if ($('#amount').val() == "") {
        toastr["error"]("يجب تعبئة المبلغ", "خطاْ");
        return;
    }
    if ($('#typeOfAction').val() == 2) {
        $.post('/Treasury/GiveMoney', {
            treasryId: treastyId,
            coinId: $('#Coins').val(),
            amount: $('#amount').val()
        }, function (data) {
            if (data == true) {
                $('#typeOfAction').val("");
                $('#amount').val("");
                FillBlanceTable($('#Coins').val(), $('#fromCashFlow').val(), $('#toCashFlow').val());
                toastr["success"]("تم");
                window.location.reload();
            }
        }
        );
    }
    else {
        $.post('/Treasury/GetMoney', {
            treasryId: treastyId,
            coinId: $('#Coins').val(),
            amount: $('#amount').val()
        }, function (data) {
            if (data == true) {
                $('#typeOfAction').val("");
                $('#amount').val("");
                FillBlanceTable($('#Coins').val(), $('#fromCashFlow').val(), $('#toCashFlow').val());
                toastr["success"]("تم");
                window.location.reload();
            } else if (data === "null") {
                $('#typeOfAction').val("");
                $('#amount').val("");
                FillBlanceTable($('#Coins').val(), $('#fromCashFlow').val(), $('#toCashFlow').val());
                toastr["error"]("لا يمكنك اخ النقود منه لأن رصيده بها اقل من المأخوذ");

            }
        }
        );
    }
});
var ActionsTable = $('#ActionsTable').DataTable({
    "language": {
        "search": "البحث",
        "info": "عرض _START_ إلى _END_ من _كل_ العناصر",
        "emptyTable": "لا يوجد اي عناصر للعرض",
        "infoEmpty": "لا يوجد اي عناصر",
        "zeroRecords": "لا يوجد اي عناصر مطابقة",
        "infoFiltered": "",
        "processing": "<div class='overlay custom-loader-background'><i class='fa fa-cog fa-spin custom-loader-color'></i></div>",
    },
});

function GetCashFlow(treasryId, coinId, from, to) {
    $.post(
        rootPath + 'Treasury/TreasuryCashFlwo',
        {
            "treasryId": treasryId,
            "coinId": coinId,
            "form": from,
            "to": to
        },
        function (data) {
            for (var i = 0; i < data.length; i++) {
                console.log(data[i]);
                //ActionsTable.row.add([
                
                //]);
            }
        }
    )
}