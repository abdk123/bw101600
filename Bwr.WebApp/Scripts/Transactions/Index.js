
$('#viewTransaction').on('show.bs.modal', function (e) {

    var ahref = $(e.relatedTarget);
    var tranactionId = ahref.data('tranaction-Id');

    var senderName = ahref.data('sender-name');
    var senderClientComission = ahref.data('sender-comission');
    var recsiverClient = ahref.data('recivcer-name');

    var coinName = ahref.data('coin-name');
    var createdDate = ahref.data('created-date');
    var typeOfpay = ahref.data('typeof-pay');


    var model = $(e.currentTarget);
    model.find('#modelTitle').text('تفاصيل الحوالة رقم ' + tranactionId);


    model.find('#senderClientComission').val(senderClientComission);
    model.find('#senderName').val(senderName);
    model.find('#recsiverClient').val(recsiverClient);


    model.find('#coinName').val(coinName);
    model.find('#createdDate').val(createdDate);
    model.find('#typOfPay').val(typeOfpay);
});