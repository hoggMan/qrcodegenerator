const qrcode = new QRCode("qrcode");

const makeCode = () => {
    const val = document.getElementById("text");
    const qr = document.getElementById("qrcode");

    if (!val.value) {
        alert("Yo! You gotta give me something to work with.");
        val.focus();
        return;
    }

    qrcode.makeCode(val.value);
    qr.style.display = "block";
    downloadQR();
    val.value = '';
}

const downloadQR = () => {
    setTimeout(() => {
        const image = document.getElementsByTagName("img");
        const source = image[0].getAttribute("src");

        document.querySelector('#download').innerHTML = `<a class="btn btn-primary" href="${source}" download="qrcode.png" style="margin-top: 2%;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-arrow-down-fill" viewBox="0 0 16 16">
        <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5z"/ style="margin-right: 2%">
      </svg> Download QR Code</a>`
    }, 1000);
}