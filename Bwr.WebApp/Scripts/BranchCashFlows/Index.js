
var getUrlParams = function (url) {
    var params = {};
    (url + '?').split('?')[1].split('&').forEach(
        function (pair) {
            pair = (pair + '=').split('=').map(decodeURIComponent);
            if (pair[0].length) {
                params[pair[0]] = pair[1];
            }
        });

    return params;
};
var params = getUrlParams(window.location.href);
$(document).ready(function () {
    fillCoinSelected();
    $('#toDate').val(params.to);
    $('#formDate').val(params.from);
    FillCashFlowTalbe(params.branchid, params.coinId, params.from, params.to);
    GetActualuBalnce(params.coinId  );
});
function fillCoinSelected() {
    $.post(
        '/System/_JsonGetCoinInBalance', {
            id: params.branchid
        }, function (data) {
            var coinSelect = document.getElementById('coinSelect');
            for (var i = 0; i < data.length; i++) {
                var option = document.createElement('option');
                option.innerText = data[i].CoinName;
                option.value = data[i].CoinId;
                if (data[i].CoinId == params.coinId) {
                    option.selected = true;
                }
                coinSelect.appendChild(option);
            }
        }
    )
}
var cashFlow = $('#cashFlow').DataTable({
    "ordering": true,
    "columnDefs": [{
        "orderable": false, targets: "no-sort"
    }],
    "order": 6,
    "language": {
        "search": "البحث",
        "info": "عرض _START_ إلى _END_ من _كل_ العناصر",
        "emptyTable": "لا يوجد اي عناصر للعرض",
        "infoEmpty": "لا يوجد اي عناصر",
        "zeroRecords": "لا يوجد اي عناصر مطابقة",
        "infoFiltered": "",
    }
});
function FillCashFlowTalbe(branchId, coinId, from, to) {
    $.get(
        'GetCashFlow', {
            branchId: branchId,
            coinId: coinId,
            from: from,
            to: to
        },
        function (data) {
            console.log(data);
            
            cashFlow.clear().draw();
            for (var i = 0; i < data.length; i++) {
                var button = "";
                if (i != 0) {
                    var button = "<a href='GetDetialsById?id=" + data[i].MoneyActionId + "' class='btn btn-priamary'>تفاصيل</a>";
                }
                var Incom = "";
                var outer = "";
                if (data[i].amount > 0)
                    Incom = data[i].amount;
                else if (data[i].amount < 0)
                    outer = parseFloat(data[i].amount) * -1;
                if (!isNaN(Incom) && Incom != "") {
                    Incom = parseFloat(Incom);
                }
                if (!isNaN(outer) && outer != "") {
                    outer = parseFloat(outer);
                }
                cashFlow.row.add([

                    numberWithCommas(parseFloat(data[i].Balnce)),
                    numberWithCommas((Incom)),
                    numberWithCommas((outer)),
                    data[i].Type,
                    data[i].Name,
                    data[i].Number,
                    data[i].Date,
                    data[i].Note,
                    data[i].CreatedBy,
                    button,
                ]).draw();
            }
        }
    );
}
$('#coinSelect').change(function () {
    FillCashFlowTalbe(params.branchid, $(this).val(), $('#formDate').val(), $('#toDate').val());
    GetActualuBalnce($(this).val());
});
$('#formDate').change(function () {
    FillCashFlowTalbe(params.branchid, $('#coinSelect').val(), $(this).val(), $('#toDate').val());
});
$('#toDate').change(function () {
    FillCashFlowTalbe(params.branchid, $('#coinSelect').val(), $('#formDate').val(), $(this).val());

});
function GetActualuBalnce(coinId) {
    $('#TheActualBalance').text('');
    $.get(
        '/BranchCash/GetAuctluBlance?coinId='+coinId,
        function (data) {
            $('#TheActualBalance').text(numberWithCommas(data));
        }
    )

}