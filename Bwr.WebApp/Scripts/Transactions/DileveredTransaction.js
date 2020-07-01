const cmeraSourceSelect = document.getElementsByName('cameraSource');
let currentStream;
const senderNormalClientVideo = document.getElementById('video');
const senderNormalClientCanvas = document.getElementById('Canvas');
const senderNormalClientImg = document.getElementById('photo');
const ClientImages = document.getElementById('ClientImages');

$(document).ready(() => {
    navigator.mediaDevices.enumerateDevices().then(gotDevices);
});
$('#capture').click(() => {
    draw();
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


    cmeraSourceSelect.innerHTML = '';
    var mainOption = document.createElement('option');
    mainOption.innerHTML = "الرجاء اختيار الكميرا";
    mainOption.value = " ";
    cmeraSourceSelect.forEach(element => element.appendChild(mainOption));
    let count = 1;
    mediaDevices.forEach(mediaDevice => {
        if (mediaDevice.kind === 'videoinput') {
            const option = document.createElement('option');
            option.value = mediaDevice.deviceId;
            const label = mediaDevice.label || `Camera ${count++}`;
            const textNode = document.createTextNode(label);
            option.appendChild(textNode);

            cmeraSourceSelect.forEach(s => s.appendChild(option));
        }
    });
}


$('#cameraSource').change(function () {
    if (typeof currentStream !== 'undefined') {
        stopMediaTracks(currentStream);
    }
    const videoConstraints = {};
    if (cmeraSourceSelect.value == "") {
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
    var imgeFile = document.getElementById('photo');

    var file;
    await fetch(imgeFile.src)
        .then(res => res.blob())
        .then(blob => {
            file = new File([blob], 'dot.png', blob);
        });
    return file;
}
async function Save(clientId) {
    ////validation








    console.log(clientId);
    

    var file = await uploadImage();
    var formData = new FormData();
    formData.append('clientId', clientId);
    formData.append('AttachmentId', $('#Attachments').val());
    formData.append("image", file);
    await $.ajax({
        url: "/BwTransactions/AddAttachment",
        type: "post",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            var row = document.createElement('div');
            row.setAttribute('class', 'row');
            ClientImages.appendChild(row);

            var div = document.createElement('div');
            div.setAttribute('class', 'col-lg-4');
            var h4 = document.createElement("h4");
            h4.textContent = $("#Attachments :selected").text();
            div.appendChild(h4);
            row.appendChild(div);

            var div = document.createElement('div');
            div.setAttribute('class', 'col-lg-4');
            var image = document.createElement('img');
            image.src = data.Path;
            image.style = "width:200px;height:200px";
            div.appendChild(image);
            row.appendChild(div);

            var div = document.createElement('div');
            div.setAttribute('class', 'col-lg-4');
            var button = document.createElement('button');
            button.setAttribute('class', 'btn btn-danger');
            button.innerText = 'حذف';
            button.setAttribute('onclick', 'deleteAttachment(this,' + data.Id + ');');
            div.appendChild(button);
            row.appendChild(div);

        }
    });

}
function stopMediaTracks(stream) {
    stream.getTracks().forEach(track => {
        track.stop();
    });
}
//function Give() {
//    $.post(
//        ''
//    )
//}
function deleteAttachment(element, Id) {
    $.post(
        '/BwTransactions/DeleteAddAttachment', {
            id: Id
        }, function () {

            GitDivWithRowClassRow(element).remove();
        }
    )

}